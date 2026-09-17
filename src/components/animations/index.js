import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, Easing } from 'react-native';

// ─────────────────────────────────────────────
//  FadeIn — opacity 0 → 1
// ─────────────────────────────────────────────
export function FadeIn({ children, duration = 350, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1, duration, delay, useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

// ─────────────────────────────────────────────
//  SlideIn — from bottom/top/left/right
// ─────────────────────────────────────────────
export function SlideIn({
  children, from = 'bottom', distance = 30,
  duration = 400, delay = 0, style,
}) {
  const anim = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 0, duration, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const translateY = from === 'bottom' ? anim : from === 'top' ? Animated.multiply(anim, -1) : 0;
  const translateX = from === 'right' ? anim : from === 'left' ? Animated.multiply(anim, -1) : 0;

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }, { translateX }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
//  ScaleIn — spring scale 0.7 → 1
// ─────────────────────────────────────────────
export function ScaleIn({ children, duration = 400, delay = 0, style }) {
  const scale = useRef(new Animated.Value(0.75)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, friction: 6, tension: 40, delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration, delay, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
//  AnimatedCounter — 0 → value
// ─────────────────────────────────────────────
export function AnimatedCounter({
  value = 0, duration = 1200, style,
  prefix = '', suffix = '',
}) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animRef.setValue(0);
    const listener = animRef.addListener(({ value: v }) => {
      setDisplay(Math.floor(v));
    });
    Animated.timing(animRef, {
      toValue: value, duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setDisplay(value));
    return () => animRef.removeListener(listener);
  }, [value]);

  return <Text style={style}>{prefix}{display}{suffix}</Text>;
}

// ─────────────────────────────────────────────
//  Pulse — infinite scale animation
// ─────────────────────────────────────────────
export function Pulse({ children, min = 0.95, max = 1.05, duration = 900, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: max, duration: duration / 2, useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: min, duration: duration / 2, useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>;
}

// ─────────────────────────────────────────────
//  Stagger — children ek-ek karke aaye
// ─────────────────────────────────────────────
export function Stagger({ children, delay = 80, from = 'bottom' }) {
  return React.Children.map(children, (child, i) => (
    <SlideIn delay={i * delay} from={from}>{child}</SlideIn>
  ));
}
