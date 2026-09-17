import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { questions, notes, tests, refreshing } = useSelector((s) => s.content);

  const refresh = () => dispatch(fetchContent({ force: true }));

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View>
            <Text style={s.hi}>Hi, {user?.name || 'Student'} 👋</Text>
            <Text style={s.sub}>Aaj kya padhna hai?</Text>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <LinearGradient colors={colors.gradPrimary} style={s.hero}>
          <Text style={s.heroTitle}>Aaj ka target</Text>
          <Text style={s.heroBig}>2 hours</Text>
          <Text style={s.heroSub}>Consistency hi success hai 🚀</Text>
          <View style={s.heroBg}>
            <Ionicons name="trophy" size={130} color="rgba(255,255,255,0.12)" />
          </View>
        </LinearGradient>

        <View style={s.statsRow}>
          <Stat label="Questions" value={questions.length} icon="help-circle" color={colors.primary} />
          <Stat label="Notes" value={notes.length} icon="book" color={colors.accent} />
          <Stat label="Tests" value={tests.length} icon="clipboard" color={colors.accentAlt} />
        </View>

        <Text style={s.section}>Quick Actions</Text>
        <View style={s.actionsGrid}>
          <Action icon="play-circle" label="Practice" color={colors.primary}
            onPress={() => navigation.navigate('TestTab')} />
          <Action icon="book" label="Notes" color={colors.accent}
            onPress={() => navigation.navigate('NotesTab')} />
          <Action icon="trophy" label="Leaderboard" color={colors.accentAlt}
            onPress={() => {}} />
          <Action icon="chatbubbles" label="Doubts" color={colors.info}
            onPress={() => {}} />
        </View>

        <Text style={s.section}>Upcoming Tests</Text>
        {tests.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={32} color={colors.textDim} />
            <Text style={s.emptyTxt}>Abhi koi test scheduled nahi</Text>
            <Text style={s.emptyHint}>Termux se: studycare at</Text>
          </View>
        ) : (
          tests.slice(0, 3).map((t) => (
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
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ label, value, icon, color }) => (
  <View style={s.stat}>
    <View style={[s.statIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={s.statVal}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const Action = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={s.action} onPress={onPress} activeOpacity={0.7}>
    <View style={[s.actionIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={s.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  hi: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  hero: { borderRadius: 22, padding: 22, marginBottom: 20, overflow: 'hidden' },
  heroTitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  heroBig: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 },
  heroBg: { position: 'absolute', right: -20, bottom: -30 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  action: { width: '47%', backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  actionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  empty: { backgroundColor: colors.surface, borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  emptyTxt: { color: colors.textMuted, fontSize: 13, marginTop: 10 },
  emptyHint: { color: colors.textDim, fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  testCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  testIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  testName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  testMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
