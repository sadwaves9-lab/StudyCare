import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { AnimatedCounter } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { questions, notes, tests } = useSelector((s) => s.content);
  const streak = useSelector((s) => s.streak.current);
  const coins = useSelector((s) => s.rewards.coins);
  const unlocked = useSelector((s) => s.achievements.unlocked.length);

  const go = (screen) => { haptics.tap(); navigation.navigate(screen); };

  const onLogout = () => Alert.alert('Logout?', 'Pakka logout karna hai?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: logout },
  ]);

  const items = [
    { icon: 'flame', label: 'Streak', color: '#FD79A8', onPress: () => go('Streak'), badge: `${streak}d` },
    { icon: 'trophy', label: 'Achievements', color: colors.warning, onPress: () => go('Achievements'), badge: `${unlocked}` },
    { icon: 'gift', label: 'Rewards & Coins', color: colors.accent, onPress: () => go('Rewards'), badge: `🪙 ${coins}` },
    { icon: 'timer', label: 'Study Timer', color: colors.info, onPress: () => go('StudyTimer') },
    { icon: 'diamond', label: 'Go Premium', color: colors.accentAlt, onPress: () => go('Paywall') },
    { icon: 'ribbon', label: 'Leaderboard', color: colors.success, onPress: () => go('Leaderboard') },
    { icon: 'share-social', label: 'Refer & Earn', color: colors.accent, onPress: () => Alert.alert('Coming soon!') },
    { icon: 'settings-outline', label: 'Settings', color: colors.primary, onPress: () => go('Settings') },
    { icon: 'help-circle-outline', label: 'Help & Support', color: colors.info, onPress: () => Alert.alert('Coming soon!') },
  ];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradPrimary} style={s.card}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{user?.name || 'Student'}</Text>
          <Text style={s.email}>{user?.email || ''}</Text>
          <View style={s.tags}>
            <View style={s.tagItem}>
              <Text style={s.tagEmoji}>🔥</Text>
              <Text style={s.tagTxt}>{streak}d streak</Text>
            </View>
            <View style={s.tagItem}>
              <Text style={s.tagEmoji}>🪙</Text>
              <Text style={s.tagTxt}>{coins} coins</Text>
            </View>
            <View style={s.tagItem}>
              <Text style={s.tagEmoji}>🏆</Text>
              <Text style={s.tagTxt}>{unlocked} badges</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={s.statsRow}>
          <Stat icon="help-circle" label="Questions" value={questions.length} color={colors.primary} />
          <Stat icon="book" label="Notes" value={notes.length} color={colors.accent} />
          <Stat icon="clipboard" label="Tests" value={tests.length} color={colors.accentAlt} />
        </View>

        <View style={s.list}>
          {items.map((it, i) => (
            <TouchableOpacity key={i} style={s.row} onPress={it.onPress} activeOpacity={0.7}>
              <View style={[s.rowIcon, { backgroundColor: it.color + '22' }]}>
                <Ionicons name={it.icon} size={18} color={it.color} />
              </View>
              <Text style={s.rowTxt}>{it.label}</Text>
              {it.badge ? (
                <View style={[s.badge, { backgroundColor: it.color + '22' }]}>
                  <Text style={[s.badgeTxt, { color: it.color }]}>{it.badge}</Text>
                </View>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[s.row, s.logout]} onPress={onLogout}>
          <View style={[s.rowIcon, { backgroundColor: colors.danger + '22' }]}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          </View>
          <Text style={[s.rowTxt, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ icon, label, value, color }) => (
  <View style={s.stat}>
    <View style={[s.statIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <AnimatedCounter value={value} style={s.statVal} duration={900} />
    <Text style={s.statLbl}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  card: { borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { color: '#fff', fontSize: 30, fontWeight: '800' },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  tags: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  tagItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  tagEmoji: { fontSize: 12 },
  tagTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLbl: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  list: { backgroundColor: colors.surface, borderRadius: 18, padding: 6, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTxt: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeTxt: { fontSize: 11, fontWeight: '800' },
  logout: { backgroundColor: colors.surface, borderRadius: 18, padding: 6, borderWidth: 1, borderColor: colors.danger + '40' },
});
