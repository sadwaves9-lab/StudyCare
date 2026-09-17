import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors';

export function Skeleton({ width = '100%', height = 20, radius = 8, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1, duration: 1300, useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  return (
    <View style={[s.base, { width, height, borderRadius: radius }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.10)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View style={s.card}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <Skeleton width={60} height={14} radius={6} />
        <Skeleton width={70} height={14} radius={6} />
      </View>
      <Skeleton width="75%" height={18} radius={6} style={{ marginBottom: 10 }} />
      <Skeleton width="100%" height={12} radius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="92%" height={12} radius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="60%" height={12} radius={4} />
    </View>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <View style={{ padding: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  base: { backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  card: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: colors.border,
  },
});

export default Skeleton;
