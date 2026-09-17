import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  streak: '@sc_streak',
  achievements: '@sc_achievements',
  rewards: '@sc_rewards',
};

export async function loadGamification() {
  try {
    const [[, s], [, a], [, r]] = await AsyncStorage.multiGet([
      KEYS.streak, KEYS.achievements, KEYS.rewards,
    ]);
    return {
      streak: s ? JSON.parse(s) : null,
      achievements: a ? JSON.parse(a) : null,
      rewards: r ? JSON.parse(r) : null,
    };
  } catch {
    return { streak: null, achievements: null, rewards: null };
  }
}

export async function saveStreak(streak) {
  try {
    await AsyncStorage.setItem(KEYS.streak, JSON.stringify(streak));
  } catch {}
}

export async function saveAchievements(ach) {
  try {
    await AsyncStorage.setItem(KEYS.achievements, JSON.stringify(ach));
  } catch {}
}

export async function saveRewards(rew) {
  try {
    await AsyncStorage.setItem(KEYS.rewards, JSON.stringify(rewards));
  } catch {}
}

export function isSameDay(d1, d2) {
  return new Date(d1).toDateString() === new Date(d2).toDateString();
}

export function formatStreak(n) {
  if (n === 0) return 'Start today!';
  if (n === 1) return '1 day';
  return `${n} days`;
}
