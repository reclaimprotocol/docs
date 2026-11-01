import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

const script = await readFile(new URL('../../reclaim/github-latest-commit.js', import.meta.url), 'utf8');
const proofUrl = 'https://github.com/search?q=author%3A%40me&type=commits&s=author-date&o=desc';

function browser(startUrl: string, signedIn = true, results: unknown[] = [{}]) {
  let href = startUrl;
  let tick = () => {};
  let logins = 0;
  let consumed = false;
  const requests: { url: string; options: RequestInit }[] = [];
  const errors: string[] = [];
  const location = {
    get href() { return href; },
    get hostname() { return new URL(href).hostname; },
    get pathname() { return new URL(href).pathname; },
    get search() { return new URL(href).search; },
    assign(url: string) { href = url; },
  };
  const context = vm.createContext({
    URL, location,
    history: { state: null, replaceState(_state: unknown, _title: string, url: string) { href = url; } },
    document: {
      head: { appendChild() {} }, createElement() { return {}; },
      querySelector(selector: string) {
        if (selector.startsWith('meta')) return { content: signedIn ? 'test-user' : '' };
        if (selector.startsWith('script')) return { textContent: JSON.stringify({ payload: { blackbirdSearchRoute: { results } } }) };
        return null;
      },
    },
    window: { Reclaim: {
      reportUserLoggedIn() { logins++; }, log() {},
      reportProviderError(error: { message: string }) { errors.push(error.message); },
    } },
    setInterval(callback: () => void) { tick = callback; return 1; }, clearInterval() {},
    fetch: async (url: string, options: RequestInit) => {
      requests.push({ url, options });
      return { ok: true, status: 200, async text() { consumed = true; return 'title="Example commit" "author_date":"2026-10-30"'; } };
    },
  });
  vm.runInContext(script, context);
  return { tick: () => tick(), location, requests, errors, logins: () => logins, consumed: () => consumed };
}

test('signed-in navigation avoids the portal auth substring false positive without changing the query', () => {
  const page = browser('https://github.com/');
  page.tick();
  assert.doesNotMatch(page.location.href, /auth/i);
  const parsed = new URL(page.location.href);
  assert.equal(parsed.searchParams.get('q'), 'author:@me');
  assert.equal(parsed.searchParams.get('s'), 'author-date');
  assert.equal(parsed.searchParams.get('o'), 'desc');
  assert.equal(parsed.searchParams.get('type'), 'commits');
});

test('the proof request keeps its canonical URL and cookies and consumes the response once', async () => {
  const page = browser(proofUrl);
  page.tick();
  page.tick();
  await new Promise(resolve => setImmediate(resolve));
  assert.doesNotMatch(page.location.href, /auth/i);
  assert.equal(page.logins(), 1);
  assert.equal(page.requests.length, 1);
  assert.equal(page.requests[0].url, proofUrl);
  assert.equal(page.requests[0].options.credentials, 'include');
  assert.equal(page.requests[0].options.referrerPolicy, 'no-referrer');
  assert.equal(page.consumed(), true);
});

test('signed-out users stay at login without requesting a proof', () => {
  const page = browser('https://github.com/login', false);
  page.tick();
  assert.equal(page.location.href, 'https://github.com/login');
  assert.equal(page.logins(), 0);
  assert.equal(page.requests.length, 0);
});

test('an account without indexed commits receives a clear error', () => {
  const page = browser(proofUrl, true, []);
  page.tick();
  assert.equal(page.requests.length, 0);
  assert.match(page.errors[0], /did not return any authored commits/);
});
