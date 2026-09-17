import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { FadeIn, ScaleIn, AnimatedCounter } from '../../components/animations';
import colors from '../../theme/colors';

export default function StreakScreen({ navigation }) {
  const { current, longest, totalDays, calendar } = useSelector((s) => s.streak);

  const today = new Date().toISOString().slice(0, 10);
  const activeDates = new Set(calendar.map((c) => c.date));

  // Build last 30 days grid
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: d.getDate(),
      active: activeDates.has(d.toISOString().slice(0, 10)),
      today: d.toISOString().slice(0, 10) === today,
    });
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Streak 🔥</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <ScaleIn>
          <LinearGradient colors={['#FD79A8', '#FDCB6E']} style={s.hero}>
            <View style={s.flameCircle}>
              <Ionicons name="flame" size={64} color="#fff" />
            </View>
            <AnimatedCounter value={current} duration={1200} style={s.currentBig} />
            <Text style={s.currentLbl}>Day Streak</Text>
            <Text style={s.sub}>
              {current === 0 ? 'Aaj se shuru karo!' :
               current < 3 ? 'Keep going! 🚀' :
               current < 7 ? 'Great progress! 🔥' :
               current < 30 ? 'You are on fire! 💪' :
               'Legendary! 🏆'}
            </Text>
          </LinearGradient>
        </ScaleIn>

        <FadeIn delay={200}>
          <View style={s.statsRow}>
            <Stat icon="flame" color="#FD79A8" value={current} label="Current" />
            <Stat icon="trophy" color="#FDCB6E" value={longest} label="Longest" />
            <Stat icon="calendar" color="#00D2D3" value={totalDays} label="Total Days" />
          </View>
        </FadeIn>

        <FadeIn delay={400}>
          <Text style={s.section}>Last 30 Days</Text>
          <View style={s.calendar}>
            {days.map((d) => (
              <View
                key={d.iso}
                style={[
                  s.day,
                  d.active && s.dayActive,
                  d.today && s.dayToday,
                ]}
              >
                <Text style={[s.dayTxt, d.active && { color: '#fff', fontWeight: '800' }]}>
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={600}>
          <View style={s.tip}>
            <Ionicons name="information-circle-outline" size={16} color={colors.info} />
            <Text style={s.tipTxt}>
              Roz padhai karo aur streak banaye rakho. Miss karne pe streak reset ho jayega.
            </Text>
          </View>
        </FadeIn>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ icon, color, value, label }) => (
  <View style={s.stat}>
    <View style={[s.statIcon, { backgroundColor: color + '25' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <AnimatedCounter value={value} style={s.statVal} duration={900} />
    <Text style={s.statLbl}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { padding: 20, paddingTop: 0 },
  hero: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20 },
  flameCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  currentBig: { color: '#fff', fontSize: 60, fontWeight: '900' },
  currentLbl: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 8, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statLbl: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, backgroundColor: colors.surface, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  day: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center' },
  dayActive: { backgroundColor: '#FD79A8' },
  dayToday: { borderWidth: 2, borderColor: colors.warning },
  dayTxt: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  tip: { flexDirection: 'row', gap: 8, marginTop: 24, padding: 12, backgroundColor: colors.info + '15', borderRadius: 12, borderWidth: 1, borderColor: colors.info + '40' },
  tipTxt: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
});
