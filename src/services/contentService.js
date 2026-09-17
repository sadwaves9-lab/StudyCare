import AsyncStorage from '@react-native-async-storage/async-storage';
import { GITHUB_RAW_BASE, CACHE_TTL_MS, STORAGE_KEYS } from '../config/constants';

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

async function readCache(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

async function writeCache(key, value) {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export async function loadAllContent({ force = false } = {}) {
  const meta = await readCache(STORAGE_KEYS.contentMeta, { lastFetch: 0 });
  const stale = Date.now() - (meta.lastFetch || 0) > CACHE_TTL_MS;

  if (!force && !stale) {
    return {
      questions: await readCache(STORAGE_KEYS.contentQuestions, []),
      notes: await readCache(STORAGE_KEYS.contentNotes, []),
      tests: await readCache(STORAGE_KEYS.contentTests, []),
      fromCache: true,
    };
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
    };
    await writeCache(STORAGE_KEYS.contentQuestions, out.questions);
    await writeCache(STORAGE_KEYS.contentNotes, out.notes);
    await writeCache(STORAGE_KEYS.contentTests, out.tests);
    await writeCache(STORAGE_KEYS.contentMeta, { lastFetch: Date.now() });
    return out;
  } catch (err) {
    return {
      questions: await readCache(STORAGE_KEYS.contentQuestions, []),
      notes: await readCache(STORAGE_KEYS.contentNotes, []),
      tests: await readCache(STORAGE_KEYS.contentTests, []),
      fromCache: true,
      error: err.message,
    };
  }
}
