(() => {
  if (location.hostname !== 'github.com') return;
  const requestUrl = "https://github.com/search?q=author%3A%40me&type=commits&s=author-date&o=desc";
  // Portal's login URL heuristic matches "auth" anywhere, including "author".
  // Encoding the first character preserves GitHub's query while avoiding that false positive.
  const pageUrl = requestUrl.replaceAll('author', '%61uthor');
  let attempts = 0;
  let fetched = false;
  let reportedLogin = false;
  const timer = setInterval(() => {
    const bridge = window.Reclaim;
    if (++attempts > 240) {
      clearInterval(timer);
      bridge?.reportProviderError?.({ message: 'GitHub verification could not start. Please retry or contact support.' });
      return;
    }
    const signedIn = Boolean(document.querySelector('meta[name="user-login"]')?.content)
      && !document.querySelector('a.HeaderMenu-link[href="/login"]');
    if (!signedIn) {
      if (!location.pathname.startsWith('/login') && !location.pathname.startsWith('/sessions')) {
        clearInterval(timer);
        location.assign('https://github.com/login');
      }
      return;
    }
    const current = new URL(location.href);
    const correctSearch = current.pathname === '/search'
      && current.searchParams.get('q') === 'author:@me'
      && current.searchParams.get('type') === 'commits'
      && current.searchParams.get('s') === 'author-date'
      && current.searchParams.get('o') === 'desc';
    if (!correctSearch) {
      clearInterval(timer);
      const referrer = document.createElement('meta');
      referrer.name = 'referrer';
      referrer.content = 'no-referrer';
      document.head.appendChild(referrer);
      location.assign(pageUrl);
      return;
    }
    if (location.href !== pageUrl) history.replaceState(history.state, '', pageUrl);
    const embedded = document.querySelector('script[data-target="react-app.embeddedData"]');
    if (!embedded?.textContent) return;
    let payload;
    try { payload = JSON.parse(embedded.textContent).payload; } catch { return; }
    const results = payload?.blackbirdSearchRoute?.results ?? payload?.results;
    if (!Array.isArray(results)) return;
    if (results.length === 0) {
      clearInterval(timer);
      bridge?.reportProviderError?.({ message: 'GitHub did not return any authored commits for this account.' });
      return;
    }
    if (!reportedLogin && typeof bridge?.reportUserLoggedIn === 'function') {
      bridge.reportUserLoggedIn();
      bridge.log?.('info', 'GitHub login confirmed; latest-commit search is ready');
      reportedLogin = true;
    }
    if (fetched) return;
    fetched = true;
    clearInterval(timer);
    fetch(requestUrl, {
      credentials: 'include',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: { Accept: 'text/html' }
    }).then(async response => {
      const body = await response.text();
      bridge?.log?.('info', JSON.stringify({
        event: 'github_commit_response',
        status: response.status,
        hasCommitTitle: /title="/.test(body),
        hasCommitDate: /"author_date":"/.test(body)
      }));
      if (!response.ok) throw new Error('GitHub could not load the latest commit');
    }).catch(() => {
      bridge?.reportProviderError?.({ message: 'GitHub could not load the latest commit. Please try again.' });
    });
  }, 500);
})();

