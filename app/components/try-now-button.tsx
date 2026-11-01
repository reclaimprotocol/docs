'use client';

import { useEffect, useRef, useState } from 'react';
import type { VerificationState } from '@/lib/reclaim/types';

const storageKey = 'reclaim-github-demo-session';
const buttonClass = 'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400';

export function TryNowButton() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<VerificationState | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [takingLonger, setTakingLonger] = useState(false);
  const startingRef = useRef(false);

  useEffect(() => {
    try { setSessionId(sessionStorage.getItem(storageKey)); } catch { /* Storage may be disabled. */ }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;
    const controller = new AbortController();
    const slowTimer = setTimeout(() => setTakingLonger(true), 30000);
    async function poll() {
      try {
        const response = await fetch(`/api/reclaim/sessions/${sessionId}`, {
          cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]),
        });
        const state = await response.json();
        if (stopped) return;
        if (!response.ok) throw new Error(state.error || 'Could not check verification. Please try again.');
        failures = 0;
        setSession(state);
        if (state.status !== 'waiting' && state.status !== 'verifying') {
          clearTimeout(slowTimer);
          try { sessionStorage.removeItem(storageKey); } catch { /* Optional persistence. */ }
          return;
        }
      } catch (cause) {
        if (stopped) return;
        if (++failures >= 3) {
          setError(cause instanceof Error ? cause.message : 'Could not check verification. Please try again.');
          clearTimeout(slowTimer);
          return;
        }
      }
      timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => { stopped = true; controller.abort(); clearTimeout(timer); clearTimeout(slowTimer); };
  }, [sessionId]);

  async function startVerification() {
    if (startingRef.current) return;
    startingRef.current = true;
    // Open synchronously so browsers allow the new tab from the user's click.
    const tab = window.open('about:blank', '_blank');
    if (tab) tab.opener = null;
    setStarting(true);
    setError(null);
    setTakingLonger(false);
    setSessionId(null);
    setSession(null);
    try {
      sessionStorage.removeItem(storageKey);
    } catch { /* The flow also works without browser storage. */ }
    try {
      const response = await fetch('/api/reclaim/sessions', { method: 'POST', signal: AbortSignal.timeout(20000) });
      const state = await response.json();
      if (!response.ok) throw new Error(state.error || 'Verification could not be started. Please try again.');
      setSession(state);
      setSessionId(state.id);
      try { sessionStorage.setItem(storageKey, state.id); } catch { /* Optional persistence. */ }
      if (tab) tab.location.replace(state.verificationUrl);
    } catch (cause) {
      tab?.close();
      setError(cause instanceof Error ? cause.message : 'Verification could not be started. Please try again.');
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  }

  const pending = !!sessionId && (!session || session.status === 'waiting' || session.status === 'verifying');
  const failed = error || session?.status === 'failed' || session?.status === 'cancelled' || session?.status === 'expired';

  return (
    <div className="not-prose my-6 space-y-3">
      <button type="button" onClick={startVerification} disabled={starting || (pending && !error && !takingLonger)} className={buttonClass}>
        {starting ? 'Starting verification…' : pending && !error && !takingLonger ? 'Verification in progress…' : error || session ? 'Try again' : 'Try Now!'}
      </button>
      {!session && !starting && !error && <p className="text-sm text-muted-foreground">Try the end to end flow by proving your last github commit</p>}
      {starting && <p role="status" className="text-sm">Preparing your GitHub verification…</p>}
      {pending && !error && !starting && (
        <div role="status" className="space-y-2 text-sm">
          <p>{session?.status === 'verifying' ? 'Checking your result…' : 'Finish verifying your latest GitHub commit in the new tab, then return here.'}</p>
          {session?.verificationUrl && <a href={session.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">Open verification</a>}
          {takingLonger && <p>This is taking a little longer. Continue in the verification tab, or choose Try again to start a new session.</p>}
        </div>
      )}
      {failed && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error || session?.message}</p>}
      {session?.status === 'verified' && session.data && !error && (
        <div role="status" className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-950/30">
          <p className="font-semibold">GitHub commit verified</p>
          <dl className="mt-3 space-y-3">
            <div><dt className="font-medium">Commit message</dt><dd className="mt-1 break-words">{session.data.commit_message}</dd></div>
            <div><dt className="font-medium">Date</dt><dd className="mt-1"><time dateTime={session.data.commit_date}>{new Date(session.data.commit_date).toLocaleString()}</time></dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}
