import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import { checkIn } from '../../store/slices/streakSlice';
import { resetDailyClaim } from '../../store/slices/rewardsSlice';
import { useAuth } from '../../context/AuthContext';
import { useTestReminders } from '../../hooks/useTestReminders';
import { useFilteredContent } from '../../hooks/useFilteredContent';
import { CLASSES } from '../../config/curriculum';
import { FadeIn, SlideIn, AnimatedCounter, Stagger, Pulse } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { questions, notes, tests, refreshing } = useFilteredContent();
  const prefs = useSelector((s) => s.userPrefs);
  const streak = useSelector((s) => s.streak.current);
  const coins = useSelector((s) => s.rewards.coins);

  useTestReminders();

  useEffect(() => {
    dispatch(checkIn());
    dispatch(resetDailyClaim());
  }, []);

  const refresh = () => {
    haptics.tap();
    dispatch(fetchContent({ force: true }));
  };
  const classLabel = CLASSES.find((c) => String(c.id) === String(prefs?.classId))?.label;

  const go = (screen) => { haptics.tap(); navigation.navigate(screen); };
  const goTab = (tab, params) => { haptics.tap(); navigation.getParent()?.navigate(tab, params); };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <SlideIn from="top">
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.hi}>Hi, {user?.name || 'Student'} 👋</Text>
              <Text style={s.sub}>
                {classLabel ? `${classLabel} • Set ${prefs?.set || 'A'}` : 'Aaj kya padhna hai?'}
              </Text>
            </View>
            <TouchableOpacity style={s.iconBtn} onPress={() => go('Settings')}>
              <Ionicons name="settings-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </SlideIn>

        {/* Streak + Coins Row */}
        <SlideIn from="bottom" delay={80}>
          <View style={s.gamifyRow}>
            <TouchableOpacity style={s.gamifyCard} onPress={() => go('Streak')}>
              <LinearGradient colors={['#FD79A8', '#FDCB6E']} style={s.gamifyGrad}>
                <Text style={s.gamifyEmoji}>🔥</Text>
                <AnimatedCounter value={streak} style={s.gamifyVal} />
                <Text style={s.gamifyLbl}>Day Streak</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={s.gamifyCard} onPress={() => go('Rewards')}>
              <LinearGradient colors={['#FDCB6E', '#00D2D3']} style={s.gamifyGrad}>
                <Text style={s.gamifyEmoji}>🪙</Text>
                <AnimatedCounter value={coins} style={s.gamifyVal} />
                <Text style={s.gamifyLbl}>Coins</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SlideIn>

        <SlideIn from="bottom" delay={150}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => go('Paywall')}>
            <LinearGradient colors={colors.gradPrimary} style={s.hero}>
              <Text style={s.heroTitle}>Go Premium ✨</Text>
              <Text style={s.heroBig}>Unlimited</Text>
              <Text style={s.heroSub}>Questions • Notes • Tests</Text>
              <Pulse style={s.heroBg}>
                <Ionicons name="diamond" size={130} color="rgba(255,255,255,0.12)" />
              </Pulse>
            </LinearGradient>
          </TouchableOpacity>
        </SlideIn>

        <Stagger delay={120}>
          <View style={s.statsRow}>
            <Stat label="Questions" value={questions.length} icon="help-circle" color={colors.primary} delay={200} />
            <Stat label="Notes" value={notes.length} icon="book" color={colors.accent} delay={300} />
            <Stat label="Tests" value={tests.length} icon="clipboard" color={colors.accentAlt} delay={400} />
          </View>
        </Stagger>

        <FadeIn delay={400}>
          <Text style={s.section}>Quick Actions</Text>
        </FadeIn>

        <Stagger delay={80}>
          <View style={s.actionsGrid}>
            <Action icon="play-circle" label="Practice" color={colors.primary} onPress={() => go('Practice')} />
            <Action icon="timer" label="Focus" color={colors.info} onPress={() => go('StudyTimer')} />
            <Action icon="trophy" label="Badges" color={colors.warning} onPress={() => go('Achievements')} />
            <Action icon="search" label="Search" color={colors.info} onPress={() => goTab('NotesTab', { screen: 'Search' })} />
            <Action icon="bookmark" label="Saved" color={colors.warning} onPress={() => go('Bookmarks')} />
            <Action icon="bar-chart" label="History" color={colors.success} onPress={() => go('TestHistory')} />
            <Action icon="ribbon" label="Rank" color={colors.accentAlt} onPress={() => go('Leaderboard')} />
            <Action icon="chatbubbles" label="Doubts" color={colors.accent} onPress={() => go('Doubts')} />
            <Action icon="videocam" label="Videos" color={colors.danger} onPress={() => go('VideoLessons')} />
          </View>
        </Stagger>

        <FadeIn delay={600}>
          <Text style={s.section}>Upcoming Tests</Text>
        </FadeIn>

        {tests.length === 0 ? (
          <FadeIn delay={700}>
            <View style={s.empty}>
              <Ionicons name="calendar-outline" size={32} color={colors.textDim} />
              <Text style={s.emptyTxt}>Abhi koi test scheduled nahi</Text>
            </View>
          </FadeIn>
        ) : (
          <Stagger delay={100}>
            {tests.slice(0, 3).map((t) => (
              <View key={t.id} style={s.testCard}>
                <View style={s.testIcon}>
                  <Ionicons name="clipboard" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.testName}>{t.name}</Text>
                  <Text style={s.testMeta}>{t.date} • {t.time} • {t.duration} min</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
              </View>
            ))}
          </Stagger>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ label, value, icon, color, delay }) => (
  <FadeIn delay={delay}>
    <View style={s.stat}>
      <View style={[s.statIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <AnimatedCounter value={value} style={s.statVal} duration={1000} />
      <Text style={s.statLabel}>{label}</Text>
    </View>
  </FadeIn>
);

const Action = ({ icon, label, color, onPress }) => (
  <TouchableOpacity
    style={s.action}
    onPress={onPress}
    activeOpacity={0.7}
    android_ripple={{ color: color + '30' }}
  >
    <View style={[s.actionIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={s.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  hi: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  gamifyRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  gamifyCard: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  gamifyGrad: { padding: 14, borderRadius: 18, alignItems: 'center' },
  gamifyEmoji: { fontSize: 28 },
  gamifyVal: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 4 },
  gamifyLbl: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700', marginTop: 2 },
  hero: { borderRadius: 22, padding: 22, marginBottom: 20, overflow: 'hidden' },
  heroTitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 },
  heroBg: { position: 'absolute', right: -20, bottom: -30 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  action: { width: '30.5%', backgroundColor: colors.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', overflow: 'hidden' },
  actionIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { color: '#fff', fontSize: 10, fontWeight: '600' },
  empty: { backgroundColor: colors.surface, borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  emptyTxt: { color: colors.textMuted, fontSize: 13, marginTop: 10 },
  testCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  testIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  testName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  testMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
