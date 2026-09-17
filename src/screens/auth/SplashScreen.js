import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function AnimatedSplash({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(24)).current;
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0.7)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(ringScale, {
            toValue: 1.5, duration: 1600, useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 0.5, duration: 0, useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1, duration: 700, delay: 400, useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0, duration: 700, delay: 400, useNativeDriver: true,
      }),
      Animated.timing(barWidth, {
        toValue: 1, duration: 1800, delay: 300,
        useNativeDriver: false,
      }),
    ]).start();

    const t = setTimeout(() => onFinish?.(), 2400);
    return () => clearTimeout(t);
  }, []);

  const barW = barWidth.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  return (
    <View style={s.root}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      <View style={[s.blob, { backgroundColor: colors.primary, top: -90, left: -110 }]} />
      <View style={[s.blob, { backgroundColor: colors.accent, bottom: -130, right: -110 }]} />

      <View style={s.center}>
        <Animated.View style={[
          s.ring,
          { opacity: Animated.multiply(ringOpacity, logoOpacity), transform: [{ scale: ringScale }] },
        ]} />

        <Animated.View style={[s.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <LinearGradient colors={colors.gradPrimary} style={s.logo}>
            <Ionicons name="book" size={52} color="#fff" />
          </LinearGradient>
        </Animated.View>

        <Animated.Text style={[
          s.brand,
          { opacity: textOpacity, transform: [{ translateY: textY }] },
        ]}>
          StudyCare
        </Animated.Text>

        <Animated.Text style={[s.tag, { opacity: textOpacity }]}>
          Padho • Badho • Jeeto
        </Animated.Text>
      </View>

      <View style={s.barWrap}>
        <View style={s.barBg}>
          <Animated.View style={[s.barFg, { width: barW }]} />
        </View>
        <Animated.Text style={[s.loading, { opacity: textOpacity }]}>
          Loading...
        </Animated.Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 340, height: 340, borderRadius: 170, opacity: 0.2 },
  center: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute', width: 190, height: 190, borderRadius: 95,
    borderWidth: 2, borderColor: colors.primary,
  },
  logoWrap: { marginBottom: 26 },
  logo: {
    width: 120, height: 120, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.6,
    shadowRadius: 26, shadowOffset: { width: 0, height: 14 }, elevation: 16,
  },
  brand: { color: '#fff', fontSize: 40, fontWeight: '900', letterSpacing: 1.5 },
  tag: {
    color: colors.textMuted, fontSize: 13,
    marginTop: 8, letterSpacing: 3, fontWeight: '600',
  },
  barWrap: { position: 'absolute', bottom: 70, width: '60%', alignItems: 'center' },
  barBg: {
    width: '100%', height: 4, backgroundColor: colors.surfaceAlt,
    borderRadius: 2, overflow: 'hidden',
  },
  barFg: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  loading: {
    color: colors.textDim, fontSize: 11, marginTop: 12,
    letterSpacing: 2, fontWeight: '600',
  },
});
