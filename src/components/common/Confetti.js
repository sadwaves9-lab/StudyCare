import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const COLORS = ['#6C5CE7', '#00D2D3', '#FD79A8', '#FDCB6E', '#00B894', '#FF6B6B', '#A29BFE'];
const COUNT = 50;

function Particle({ delay, duration, startX, size, color, shape }) {
  const y = useRef(new Animated.Value(-30)).current;
  const x = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 200, delay, useNativeDriver: true,
      }),
      Animated.timing(y, {
        toValue: H + 60, duration, delay, useNativeDriver: true,
      }),
      Animated.timing(x, {
        toValue: (Math.random() - 0.5) * 120,
        duration, delay, useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1, duration: 1200 + Math.random() * 800,
          useNativeDriver: true,
        })
      ),
    ]).start();

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0, duration: 500, useNativeDriver: true,
      }).start();
    }, duration + delay - 500);
  }, []);

  const rotateInterp = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View style={{
      position: 'absolute', top: 0, left: startX,
      width: size, height: shape === 'circle' ? size : size * 1.6,
      backgroundColor: color,
      borderRadius: shape === 'circle' ? size / 2 : 2,
      opacity,
      transform: [
        { translateY: y },
        { translateX: x },
        { rotate: rotateInterp },
      ],
    }} />
  );
}

export default function Confetti({ onDone }) {
  const particles = useRef(
    Array.from({ length: COUNT }).map((_, i) => ({
      key: i,
      delay: Math.random() * 600,
      duration: 2200 + Math.random() * 1500,
      startX: Math.random() * W,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))
  ).current;

  useEffect(() => {
    if (onDone) {
      const t = setTimeout(onDone, 4000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p) => <Particle key={p.key} {...p} />)}
    </View>
  );
}
