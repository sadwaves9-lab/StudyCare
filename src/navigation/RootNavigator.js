import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { hydratePrefs } from '../store/slices/userPrefsSlice';
import { hydrateStreak } from '../store/slices/streakSlice';
import { hydrateAchievements } from '../store/slices/achievementsSlice';
import { hydrateRewards } from '../store/slices/rewardsSlice';
import { changeLanguage } from '../store/slices/languageSlice';
import { STORAGE_KEYS } from '../config/constants';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ClassSetupScreen from '../screens/setup/ClassSetupScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthed, loading } = useAuth();
  const dispatch = useDispatch();
  const prefs = useSelector((s) => s.userPrefs);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.userPrefs);
        if (raw) dispatch(hydratePrefs(JSON.parse(raw)));

        const streak = await AsyncStorage.getItem('@sc_streak');
        if (streak) dispatch(hydrateStreak(JSON.parse(streak)));

        const ach = await AsyncStorage.getItem('@sc_achievements');
        if (ach) dispatch(hydrateAchievements(JSON.parse(ach)));

        const rew = await AsyncStorage.getItem('@sc_rewards');
        if (rew) dispatch(hydrateRewards(JSON.parse(rew)));

        const lang = await AsyncStorage.getItem('@sc_lang');
        if (lang) dispatch(changeLanguage(lang));
      } catch {}
      setHydrated(true);
    })();
  }, [dispatch]);

  // Persist on change
  const streak = useSelector((s) => s.streak);
  const achievements = useSelector((s) => s.achievements);
  const rewards = useSelector((s) => s.rewards);
  const lang = useSelector((s) => s.language.code);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem('@sc_streak', JSON.stringify(streak)).catch(() => {});
    AsyncStorage.setItem('@sc_achievements', JSON.stringify(achievements)).catch(() => {});
    AsyncStorage.setItem('@sc_rewards', JSON.stringify(rewards)).catch(() => {});
    AsyncStorage.setItem('@sc_lang', lang).catch(() => {});
  }, [streak, achievements, rewards, lang, hydrated]);

  if (loading || !hydrated) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const needsSetup = isAuthed && !prefs.classId;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthed ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : needsSetup ? (
        <Stack.Screen name="ClassSetup" component={ClassSetupScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
}

const s = StyleSheet.create({
  loader: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
