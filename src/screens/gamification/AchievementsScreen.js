import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ACHIEVEMENTS, CATEGORIES } from '../../data/achievements';
import { FadeIn, SlideIn, AnimatedCounter } from '../../components/animations';
import colors from '../../theme/colors';

export default function AchievementsScreen({ navigation }) {
  const { unlocked, progress } = useSelector((s) => s.achievements);
  const total = ACHIEVEMENTS.length;
  const done = unlocked.length;
  const pct = Math.round((done / total) * 100);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Achievements 🏆</Text>
        <View style={{ width: 40 }} />
      </View>

      <FadeIn>
        <View style={s.summary}>
          <View style={s.progressRing}>
            <Text style={s.pct}>{pct}%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.summaryTitle}>{done} / {total} unlocked</Text>
            <Text style={s.summarySub}>Padho, khelo, badges jeeto!</Text>
            <View style={s.progressBg}>
              <View style={[s.progressFg, { width: `${pct}%` }]} />
            </View>
          </View>
        </View>
      </FadeIn>

      <FlatList
        data={ACHIEVEMENTS}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item, index }) => {
          const isUnlocked = unlocked.includes(item.id);
          const cur = progress[item.id] || 0;
          const progressPct = Math.min(100, (cur / item.target) * 100);
          return (
            <SlideIn delay={index * 40} from="bottom">
              <View style={[s.card, isUnlocked && { borderColor: item.color + '88', backgroundColor: item.color + '12' }]}>
                <View style={[s.iconBox, { backgroundColor: item.color + (isUnlocked ? '30' : '15') }]}>
                  <Ionicons
                    name={item.icon}
                    size={28}
                    color={isUnlocked ? item.color : colors.textDim}
                  />
                  {!isUnlocked && (
                    <View style={s.lock}>
                      <Ionicons name="lock-closed" size={12} color={colors.textDim} />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.titleRow}>
                    <Text style={[s.cardTitle, isUnlocked && { color: item.color }]}>
                      {item.title}
                    </Text>
                    <Text style={s.reward}>🪙 {item.reward}</Text>
                  </View>
                  <Text style={s.cardDesc}>{item.desc}</Text>
                  {!isUnlocked && (
                    <View style={s.progressWrap}>
                      <View style={s.progressBg2}>
                        <View style={[s.progressFg2, { width: `${progressPct}%`, backgroundColor: item.color }]} />
                      </View>
                      <Text style={s.progressTxt}>{cur} / {item.target}</Text>
                    </View>
                  )}
                  {isUnlocked && (
                    <View style={s.unlockedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                      <Text style={s.unlockedTxt}>Unlocked</Text>
                    </View>
                  )}
                </View>
              </View>
            </SlideIn>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  summary: { flexDirection: 'row', gap: 16, alignItems: 'center', marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  progressRing: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.primary + '25', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.primary },
  pct: { color: '#fff', fontSize: 18, fontWeight: '900' },
  summaryTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  summarySub: { color: colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 8 },
  progressBg: { height: 6, backgroundColor: colors.bgAlt, borderRadius: 3, overflow: 'hidden' },
  progressFg: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lock: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
  reward: { color: colors.warning, fontSize: 12, fontWeight: '700' },
  cardDesc: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  progressWrap: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  progressBg2: { flex: 1, height: 4, backgroundColor: colors.bgAlt, borderRadius: 2, overflow: 'hidden' },
  progressFg2: { height: 4, borderRadius: 2 },
  progressTxt: { color: colors.textDim, fontSize: 10, fontWeight: '700' },
  unlockedBadge: { flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 6 },
  unlockedTxt: { color: colors.success, fontSize: 11, fontWeight: '700' },
});
