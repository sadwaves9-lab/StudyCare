import { GITHUB_RAW_BASE, CACHE_TTL_MS } from '../config/constants';
import offlineCache from './offlineCache';

async function fetchJson(path) {
  const url = `${GITHUB_RAW_BASE}/${path}?t=${Date.now()}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally { clearTimeout(t); }
}

export async function loadAllContent({ force = false } = {}) {
  const cached = await offlineCache.loadContent();
  const lastSync = cached.lastSync ? new Date(cached.lastSync).getTime() : 0;
  const stale = Date.now() - lastSync > CACHE_TTL_MS;
  const hasCache = cached.questions.length + cached.notes.length + cached.tests.length > 0;

  if (!force && !stale && hasCache) {
    return { ...cached, fromCache: true };
  }

  try {
    const [q, n, t] = await Promise.all([
      fetchJson('questions.json'),
      fetchJson('notes.json'),
      fetchJson('tests.json'),
    ]);

    const out = {
      questions: q.questions || [],
      notes: n.notes || [],
      tests: t.tests || [],
      fromCache: false,
      error: null,
    };

    await offlineCache.saveContent(out);
    return out;
  } catch (err) {
    // Fall back to cache
    return {
      ...cached,
      fromCache: true,
      error: err.message,
      isOffline: true,
    };
  }
}

export async function getUpcomingTests(tests = []) {
  const now = new Date();
  return tests
    .map((t) => ({ ...t, when: new Date(`${t.date}T${t.time}:00`) }))
    .filter((t) => t.when >= now)
    .sort((a, b) => a.when - b.when);
}

export async function getTodaysTests(tests = []) {
  const upcoming = await getUpcomingTests(tests);
  const today = new Date().toISOString().slice(0, 10);
  return upcoming.filter((t) => t.date === today);
}
