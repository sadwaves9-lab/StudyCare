import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { CLASSES, getClassLabel } from '../../config/curriculum';
import colors from '../../theme/colors';

// Dummy per-class leaderboard data
const CLASS_LEADERBOARDS = {
  '1':  [{ id: '1', name: 'Aarav',    score: 245, streak: 12 }],
  '2':  [{ id: '2', name: 'Diya',     score: 310, streak: 15 }],
  '3':  [{ id: '3', name: 'Kabir',    score: 380, streak: 20 }],
  '4':  [{ id: '4', name: 'Ananya',   score: 420, streak: 22 }],
  '5':  [{ id: '5', name: 'Vivaan',   score: 510, streak: 28 }],
  '6':  [{ id: '6', name: 'Ishaan',   score: 620, streak: 30 }],
  '7':  [{ id: '7', name: 'Saanvi',   score: 750, streak: 33 }],
  '8':  [{ id: '8', name: 'Reyansh',  score: 890, streak: 35 }],
  '9':  [{ id: '9', name: 'Anaya',    score: 1100, streak: 40 }],
  '10': [{ id: '10', name: 'Aryan',   score: 1450, streak: 45 }],
  '11': [{ id: '11', name: 'Myra',    score: 1820, streak: 50 }],
  '12': [{ id: '12', name: 'Aditya',  score: 2210, streak: 55 }],
  'bsc':  [{ id: 'b1', name: 'Sneha',  score: 3200, streak: 60 }],
  'bcom': [{ id: 'b2', name: 'Rohan',  score: 2800, streak: 58 }],
  'ba':   [{ id: 'b3', name: 'Priya',  score: 2600, streak: 55 }],
};

export default function LeaderboardScreen({ navigation }) {
  const { user } = useAuth();
  const prefs = useSelector((s) => s.userPrefs);
  const { results } = useSelector((s) => s.testHistory);

  const myScore = results
    .filter((r) => String(r.class) === String(prefs.classId))
    .reduce((a, r) => a + r.correct * 10, 0);

  const classList = CLASS_LEADERBOARDS[String(prefs.classId)] || [];

  const fullList = useMemo(() => {
    return [...classList, {
      id: 'me',
      name: user?.name || 'You',
      score: myScore,
      streak: 0,
      isMe: true,
    }].sort((a, b) => b.score - a.score);
  }, [classList, myScore, user?.name]);

  const myRank = fullList.findIndex((p) => p.isMe) + 1;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>{getClassLabel(prefs.classId)} 🏆</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={fullList}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListHeaderComponent={
          <>
            <LinearGradient colors={colors.gradPrimary} style={s.myCard}>
              <View style={s.myLeft}>
                <View style={s.myAvatar}>
                  <Text style={s.myAvatarTxt}>{(user?.name || 'Y')[0].toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={s.myName}>{user?.name || 'You'}</Text>
                  <Text style={s.mySub}>Rank #{myRank} • {myScore} pts</Text>
                </View>
              </View>
              <Ionicons name="trophy" size={40} color="rgba(255,255,255,0.4)" />
            </LinearGradient>
            <Text style={s.sectionTitle}>Top Students — {getClassLabel(prefs.classId)}</Text>
          </>
        }
        renderItem={({ item, index }) => {
          const isMe = item.isMe;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
          return (
            <View style={[s.row, isMe && s.rowMe]}>
              <View style={[s.rank, index < 3 && { backgroundColor: colors.warning + '22' }]}>
                {medal ? <Text style={s.medal}>{medal}</Text> : <Text style={s.rankTxt}>{index + 1}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.name, isMe && { color: colors.primary }]}>
                  {item.name}{isMe ? ' (You)' : ''}
                </Text>
                <Text style={s.meta}>🔥 {item.streak} day streak</Text>
              </View>
              <Text style={s.score}>{item.score}</Text>
            </View>
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
  myCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  myLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myAvatar: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  myAvatarTxt: { color: '#fff', fontSize: 22, fontWeight: '900' },
  myName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  mySub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  rowMe: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  rank: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center' },
  rankTxt: { color: colors.textMuted, fontSize: 15, fontWeight: '800' },
  medal: { fontSize: 22 },
  name: { color: '#fff', fontSize: 14, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  score: { color: colors.accent, fontSize: 16, fontWeight: '900' },
});
