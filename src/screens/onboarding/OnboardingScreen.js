import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FadeIn, ScaleIn } from '../../components/animations';
import { STORAGE_KEYS } from '../../config/constants';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'school',
    gradient: ['#6C5CE7', '#A29BFE'],
    title: 'Class 1 se B.Sc. tak',
    subtitle: 'Har class ka apna content — question, notes, tests, sab kuch.',
  },
  {
    id: '2',
    icon: 'book',
    gradient: ['#00D2D3', '#6C5CE7'],
    title: 'Chapter-wise Notes',
    subtitle: 'NCERT chapters, highlights, key terms — sab ek jagah.',
  },
  {
    id: '3',
    icon: 'trophy',
    gradient: ['#FD79A8', '#FDCB6E'],
    title: 'Test do, Rank pao',
    subtitle: 'Har class ka alag leaderboard. Padho, aage badho.',
  },
  {
    id: '4',
    icon: 'rocket',
    gradient: ['#00B894', '#00D2D3'],
    title: 'Chalo shuru karein!',
    subtitle: 'Class select karo aur padhai shuru karo — turant!',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const next = () => {
    haptics.tap();
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    haptics.success();
    await AsyncStorage.setItem('@sc_onboarding_done', 'true');
    onDone?.();
  };

  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== index) {
      setIndex(i);
      haptics.selection();
    }
  };

  const slide = SLIDES[index];

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      {/* Skip */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={finish} style={s.skipBtn}>
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={s.slide}>
            <ScaleIn>
              <LinearGradient
                colors={[item.gradient[0] + '40', item.gradient[1] + '15']}
                style={s.iconCircle}
              >
                <LinearGradient colors={item.gradient} style={s.iconInner}>
                  <Ionicons name={item.icon} size={56} color="#fff" />
                </LinearGradient>
              </LinearGradient>
            </ScaleIn>
            <FadeIn delay={300}>
              <Text style={s.title}>{item.title}</Text>
            </FadeIn>
            <FadeIn delay={450}>
              <Text style={s.subtitle}>{item.subtitle}</Text>
            </FadeIn>
          </View>
        )}
      />

      <View style={s.footer}>
        {/* Dots */}
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i === index && s.dotActive,
                i === index && { backgroundColor: slide.gradient[0] },
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity onPress={next} activeOpacity={0.85} style={{ width: '100%' }}>
          <LinearGradient colors={slide.gradient} style={s.cta}>
            <Text style={s.ctaTxt}>
              {index === SLIDES.length - 1 ? "Let's Go 🚀" : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 10 },
  skipBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  skipTxt: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  slide: {
    width: W, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, paddingBottom: 40,
  },
  iconCircle: {
    width: 200, height: 200, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40,
  },
  iconInner: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 12,
  },
  title: {
    color: '#fff', fontSize: 28, fontWeight: '900',
    textAlign: 'center', marginBottom: 14, letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.textMuted, fontSize: 15,
    textAlign: 'center', lineHeight: 22, paddingHorizontal: 10,
  },
  footer: { paddingHorizontal: 30, paddingBottom: 30, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 26 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt },
  dotActive: { width: 28 },
  cta: {
    height: 56, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.4 },
});
