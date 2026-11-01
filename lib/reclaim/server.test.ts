import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createSession, getStatus, readSession, receiveCallback, sessionForOwner, verifiedCommit } from './server.ts';
import { providerId, providerVersion } from './config.ts';

const realFetch = globalThis.fetch;
const owner = 'a'.repeat(43);
let directory: string;
let id: string;
let remoteStatus: string;

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'reclaim-demo-test-'));
  process.env.RECLAIM_STORAGE_DIR = directory;
  process.env.RECLAIM_ORG_SECRET = 'test-only-org-secret';
  id = randomUUID();
  remoteStatus = 'pending';
  globalThis.fetch = async () => Response.json({
    id, status: remoteStatus, verificationUrl: `https://build.reclaimprotocol.org/share/portals?sessionId=${id}&api=2`,
    expiresAt: new Date(Date.now() + 600000).toISOString(),
  });
});

afterEach(async () => {
  globalThis.fetch = realFetch;
  delete process.env.RECLAIM_STORAGE_DIR;
  delete process.env.RECLAIM_ORG_SECRET;
  await rm(directory, { recursive: true, force: true });
});

test('session creation pins the provider and keeps browser ownership private', async () => {
  let requestBody: Record<string, unknown> | undefined;
  const fetchSession = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    requestBody = JSON.parse(String(init?.body));
    return fetchSession(input, init);
  };
  const state = await createSession(owner);
  assert.deepEqual(requestBody?.providers, [{ providerId, version: providerVersion }]);
  assert.equal('ownerHash' in state, false);
  assert.equal(await sessionForOwner(id, 'another-browser'), null);
  assert.equal(await sessionForOwner(id, undefined), null);
  assert.ok(await sessionForOwner(id, owner));
  assert.equal(await readSession('../secrets'), null);
});

test('an upstream success waits for a verified callback instead of trusting status', async () => {
  await createSession(owner);
  remoteStatus = 'success';
  const state = await getStatus(id, owner);
  assert.equal(state?.status, 'verifying');
  assert.equal(state?.data, undefined);
});

test('a completed session with no verifiable callback stops waiting', async () => {
  await createSession(owner);
  const record = await readSession(id);
  await writeFile(path.join(directory, `${id}.json`), JSON.stringify({ ...record, checkingSince: Date.now() - 61000 }));
  remoteStatus = 'success';
  assert.equal((await getStatus(id, owner))?.status, 'failed');
});

test('an unsigned cancellation cannot cancel a still-pending session', async () => {
  await createSession(owner);
  const status = await receiveCallback({ sessionId: id, event: 'verification_cancelled', data: '' });
  assert.equal(status, 200);
  assert.equal((await readSession(id))?.status, 'waiting');
  remoteStatus = 'cancelled';
  assert.equal((await getStatus(id, owner))?.status, 'cancelled');
});

test('expired sessions return an actionable terminal state', async () => {
  await createSession(owner);
  remoteStatus = 'expired';
  const state = await getStatus(id, owner);
  assert.equal(state?.status, 'expired');
  assert.match(state?.message ?? '', /start again/i);
});

test('only verified proof fields from the expected provider are exposed', () => {
  const result = {
    payload: { extracted_parameters: { commit_message: 'untrusted outer value' } },
    proofs: [{ providerId, proofValid: true, data: {
      context: {}, extractedParameters: { commit_message: 'Actual commit', commit_date: '2026-10-30T12:00:00Z', extra: 'private' },
    } }],
  };
  assert.deepEqual(verifiedCommit(result, providerId), { commit_message: 'Actual commit', commit_date: '2026-10-30T12:00:00Z' });
  assert.throws(() => verifiedCommit(result, 'another-provider'), /unexpected-provider/);
  assert.throws(() => verifiedCommit({ ...result, proofs: [{ ...result.proofs[0], proofValid: false }] }, providerId));
  assert.throws(() => verifiedCommit({ payload: {} }, providerId));
});

test('a forged signed result cannot establish success', async () => {
  await createSession(owner);
  const payload = Buffer.from(JSON.stringify({ iss: 'https://attacker.invalid', reclaimSessionId: id })).toString('base64url');
  const status = await receiveCallback({ sessionId: id, event: 'verification_success', data: JSON.stringify({ payload, signatures: [] }) });
  assert.equal(status, 200);
  const record = await readSession(id);
  assert.equal(record?.status, 'failed');
  assert.equal(record?.data, undefined);
});

test('duplicate callbacks cannot downgrade an already verified session', async () => {
  await createSession(owner);
  const record = await readSession(id);
  await writeFile(path.join(directory, `${id}.json`), JSON.stringify({ ...record, status: 'verified', data: { commit_message: 'Verified', commit_date: '2026-10-30T12:00:00Z' } }));
  assert.equal(await receiveCallback({ sessionId: id, event: 'verification_cancelled', data: '' }), 200);
  assert.equal((await getStatus(id, owner))?.status, 'verified');
});
