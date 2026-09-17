import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  questions: '@sc_cache_questions',
  notes: '@sc_cache_notes',
  tests: '@sc_cache_tests',
  lastSync: '@sc_cache_last_sync',
  version: '@sc_cache_version',
};

export const offlineCache = {
  async saveContent({ questions, notes, tests }) {
    try {
      await AsyncStorage.multiSet([
        [KEYS.questions, JSON.stringify(questions || [])],
        [KEYS.notes, JSON.stringify(notes || [])],
        [KEYS.tests, JSON.stringify(tests || [])],
        [KEYS.lastSync, new Date().toISOString()],
      ]);
      return true;
    } catch (e) {
      console.warn('cache save failed:', e);
      return false;
    }
  },

  async loadContent() {
    try {
      const [[, q], [, n], [, t], [, s]] = await AsyncStorage.multiGet([
        KEYS.questions, KEYS.notes, KEYS.tests, KEYS.lastSync,
      ]);
      return {
        questions: q ? JSON.parse(q) : [],
        notes: n ? JSON.parse(n) : [],
        tests: t ? JSON.parse(t) : [],
        lastSync: s || null,
      };
    } catch {
      return { questions: [], notes: [], tests: [], lastSync: null };
    }
  },

  async getLastSync() {
    try {
      return await AsyncStorage.getItem(KEYS.lastSync);
    } catch {
      return null;
    }
  },

  async clear() {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
      return true;
    } catch {
      return false;
    }
  },

  async getSize() {
    try {
      const [[, q], [, n], [, t]] = await AsyncStorage.multiGet([
        KEYS.questions, KEYS.notes, KEYS.tests,
      ]);
      const size = (q?.length || 0) + (n?.length || 0) + (t?.length || 0);
      return { bytes: size, kb: Math.round(size / 1024), mb: (size / 1024 / 1024).toFixed(2) };
    } catch {
      return { bytes: 0, kb: 0, mb: '0.00' };
    }
  },
};

export default offlineCache;
