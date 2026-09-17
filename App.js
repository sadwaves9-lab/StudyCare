import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './src/store';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import AnimatedSplash from './src/screens/auth/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import colors from './src/theme/colors';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.bgAlt,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  const [stage, setStage] = useState('splash'); // splash | onboarding | app

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem('@sc_onboarding_done');
      // We'll check onboarding after splash finishes
      global.__onboardingDone = done === 'true';
    })();
  }, []);

  const onSplashFinish = () => {
    if (global.__onboardingDone) {
      setStage('app');
    } else {
      setStage('onboarding');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AuthProvider>
            {stage === 'splash' && <AnimatedSplash onFinish={onSplashFinish} />}

            {stage === 'onboarding' && (
              <OnboardingScreen onDone={() => setStage('app')} />
            )}

            {stage === 'app' && (
              <NavigationContainer theme={navTheme}>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            )}
          </AuthProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
