import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get(key, fallback = null) {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  async set(key, value) {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  async remove(key) {
    try { await AsyncStorage.removeItem(key); return true; }
    catch { return false; }
  },
  async clear() {
    try { await AsyncStorage.clear(); return true; }
    catch { return false; }
  },
};

export default storage;
