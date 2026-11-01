import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CallbackBody, VerifyResultFullOutcome } from '@reclaimprotocol/client';
import { builderOrigin, orgId, providerId, providerVersion } from './config.ts';
import type { VerificationState } from './types.ts';

interface StoredSession extends VerificationState {
  ownerHash: string;
  providerId: string;
  orgId: string;
  checkingSince?: number;
  failureReason?: string;
}

type RemoteSession = { id: string; verificationUrl: string; expiresAt: string; status: string };
const globalStore = globalThis as typeof globalThis & { reclaimWrites?: Map<string, Promise<unknown>> };
const writes = globalStore.reclaimWrites ??= new Map();
const validId = (id: string) => /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
const ownerHash = (owner: string) => createHash('sha256').update(owner).digest('hex');
const sessionPath = (id: string) => path.join(process.env.RECLAIM_STORAGE_DIR ?? path.join(process.cwd(), '.data/reclaim'), `${id}.json`);

function secret() {
  if (!process.env.RECLAIM_ORG_SECRET) throw new Error('RECLAIM_ORG_SECRET is not configured');
  return process.env.RECLAIM_ORG_SECRET;
}

async function builderRequest<T>(pathname: string, body?: unknown): Promise<T> {
  const response = await fetch(`${builderOrigin}${pathname}`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${secret()}`, 'content-type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Builder request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export async function readSession(id: string): Promise<StoredSession | null> {
  if (!validId(id)) return null;
  try {
    return JSON.parse(await readFile(sessionPath(id), 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function saveSession(record: StoredSession) {
  const filename = sessionPath(record.id);
  await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  const temporary = `${filename}.${randomBytes(8).toString('hex')}.tmp`;
  await writeFile(temporary, JSON.stringify(record), { mode: 0o600 });
  await rename(temporary, filename);
}

async function updateSession(id: string, update: (record: StoredSession) => StoredSession) {
  const operation = (writes.get(id) ?? Promise.resolve()).catch(() => {}).then(async () => {
    const record = await readSession(id);
    if (!record) return null;
    const next = update(record);
    await saveSession(next);
    return next;
  });
  writes.set(id, operation);
  try { return await operation; }
  finally { if (writes.get(id) === operation) writes.delete(id); }
}

export function publicState(record: StoredSession): VerificationState {
  const { id, verificationUrl, status, expiresAt, message, data } = record;
  return { id, verificationUrl, status, expiresAt, message, data };
}

export async function createSession(owner: string) {
  const input = {
    providers: [{ providerId, version: providerVersion }],
    context: { purpose: 'github-latest-commit-demo' },
  };
  let session: RemoteSession;
  if (process.env.RECLAIM_ORG_ETH_PRIVATE_KEY) {
    const { ReclaimVerification } = await import('@reclaimprotocol/client');
    session = await ReclaimVerification.create({ orgSecret: secret() }).sessions.create({ ...input, orgEthPrivateKey: process.env.RECLAIM_ORG_ETH_PRIVATE_KEY });
  } else {
    session = await builderRequest<RemoteSession>('/verifications/sessions', input);
  }
  if (!validId(session.id) || !session.verificationUrl.startsWith(`${builderOrigin}/`)) {
    throw new Error('Builder returned an invalid session');
  }
  const record: StoredSession = {
    id: session.id, verificationUrl: session.verificationUrl, expiresAt: session.expiresAt,
    status: 'waiting', ownerHash: ownerHash(owner), providerId, orgId,
  };
  await saveSession(record);
  return publicState(record);
}

export async function sessionForOwner(id: string, owner: string | undefined) {
  const record = await readSession(id);
  return record && owner && record.ownerHash === ownerHash(owner) ? record : null;
}

async function refreshSession(id: string) {
  const remote = await builderRequest<RemoteSession>(`/verifications/sessions/${id}`);
  return updateSession(id, record => {
    // Only the cryptographically verified callback can establish success.
    if (record.status === 'verified' || record.status === 'failed') return record;
    if (remote.status === 'success') {
      const checkingSince = record.checkingSince ?? Date.now();
      return Date.now() - checkingSince > 60000
        ? { ...record, status: 'failed', message: 'Your verification finished, but the result could not be confirmed. Please try again.' }
        : { ...record, status: 'verifying', checkingSince };
    }
    if (remote.status === 'cancelled') return { ...record, status: 'cancelled', message: 'Verification was cancelled. You can try again.' };
    if (remote.status === 'expired' || Date.parse(record.expiresAt) < Date.now()) {
      return { ...record, status: 'expired', message: 'This verification expired. Please start again.' };
    }
    if (remote.status === 'rejected' || remote.status === 'error') {
      return { ...record, status: 'failed', message: 'GitHub verification could not be completed. Please try again.' };
    }
    return record;
  });
}

export async function getStatus(id: string, owner: string | undefined) {
  let record = await sessionForOwner(id, owner);
  if (!record) return null;
  if (record.status === 'waiting' || record.status === 'verifying') record = await refreshSession(id);
  return record ? publicState(record) : null;
}

export function verifiedCommit(result: VerifyResultFullOutcome, expectedProviderId: string) {
  const proofs = result.proofs ?? [];
  if (proofs.length !== 1 || !proofs[0].proofValid || proofs[0].providerId !== expectedProviderId) {
    throw new Error('unexpected-provider-or-proof');
  }
  const fields = proofs[0].data?.extractedParameters;
  if (!fields?.commit_message || !fields.commit_date || !Number.isFinite(Date.parse(fields.commit_date))) {
    throw new Error('missing-commit-fields');
  }
  return { commit_message: fields.commit_message, commit_date: fields.commit_date };
}

export async function receiveCallback(body: unknown): Promise<number> {
  if (!body || typeof body !== 'object' || !('sessionId' in body) || typeof body.sessionId !== 'string') return 400;
  const record = await readSession(body.sessionId);
  // The organization may deliver events for its other applications too.
  if (!record || record.status === 'verified') return 200;
  const { ReclaimVerification, ResultVerificationError } = await import('@reclaimprotocol/client');
  const reclaim = ReclaimVerification.create({ orgSecret: secret() });
  try {
    const delivery = await reclaim.results.receive(body as CallbackBody, {
      reclaimSessionId: record.id,
      expectedAud: record.orgId,
      orgEthPrivateKey: process.env.RECLAIM_ORG_ETH_PRIVATE_KEY || undefined,
    });
    if (delivery.kind === 'event') {
      // Progress/cancellation envelopes are unsigned. Confirm via authenticated API.
      await refreshSession(record.id);
      return 200;
    }
    const status = (delivery.result.payload.verification_session as { status?: string } | undefined)?.status;
    if (status !== 'success') {
      await updateSession(record.id, current => current.status === 'verified' ? current : {
        ...current, status: status === 'cancelled' ? 'cancelled' : 'failed',
        message: status === 'cancelled' ? 'Verification was cancelled. You can try again.' : 'GitHub verification could not be completed. Please try again.',
        failureReason: status ?? 'missing-result-status',
      });
      console.warn('Reclaim verification ended without success', record.id, status);
      return 200;
    }
    let data;
    try { data = verifiedCommit(delivery.result, record.providerId); }
    catch (error) {
      const reason = (error as Error).message;
      await updateSession(record.id, current => current.status === 'verified' ? current : {
        ...current, status: 'failed', failureReason: reason,
        message: 'The result did not contain the expected verified commit. Please try again.',
      });
      console.warn('Reclaim result did not match this demo', record.id, reason);
      return 200;
    }
    await updateSession(record.id, current => ({ ...current, status: 'verified', data, message: undefined, failureReason: undefined }));
    return 200;
  } catch (error) {
    if (!(error instanceof ResultVerificationError)) throw error;
    const reasons = (error.outcome.proofs ?? []).filter(proof => !proof.proofValid).map(proof => proof.reason);
    console.warn('Reclaim result verification failed', record.id, error.reason, reasons);
    if (error.retryable) return 503;
    await updateSession(record.id, current => current.status === 'verified' ? current : {
      ...current, status: 'failed', failureReason: [error.reason, ...reasons].join(', '),
      message: 'The verification result could not be validated. Please try again.',
    });
    return 200;
  }
}
