import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthed, loading } = useAuth();
  if (loading) return (
    <View style={st.c}><ActivityIndicator size="large" color={colors.primary} /></View>
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed
        ? <Stack.Screen name="Main" component={MainNavigator} />
        : <Stack.Screen name="Auth" component={AuthNavigator} />}
    </Stack.Navigator>
  );
}
const st = StyleSheet.create({ c: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' } });
