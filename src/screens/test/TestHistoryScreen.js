import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { clearHistory } from '../../store/slices/testHistorySlice';
import colors from '../../theme/colors';

export default function TestHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results } = useSelector((s) => s.testHistory);

  const avg = results.length
    ? Math.round(results.reduce((a, r) => a + (r.correct / Math.max(r.total, 1)) * 100, 0) / results.length)
    : 0;

  const onClear = () => Alert.alert('Clear history?', 'Sab results delete ho jayenge.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearHistory()) },
  ]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>History 📊</Text>
        {results.length > 0 ? (
          <TouchableOpacity onPress={onClear} style={s.back}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      {results.length > 0 && (
        <View style={s.statsCard}>
          <View style={s.stat}>
            <Text style={s.statVal}>{results.length}</Text>
            <Text style={s.statLbl}>Tests</Text>
          </View>
          <View style={s.divider} />
          <View style={s.stat}>
            <Text style={[s.statVal, { color: avg >= 60 ? colors.success : colors.warning }]}>
              {avg}%
            </Text>
            <Text style={s.statLbl}>Avg Score</Text>
          </View>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="bar-chart-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>Abhi koi test nahi diya</Text>
            <Text style={s.emptyHint}>Tests tab se test do</Text>
          </View>
        }
        renderItem={({ item }) => {
          const pct = Math.round((item.correct / Math.max(item.total, 1)) * 100);
          const color = pct >= 80 ? colors.success : pct >= 60 ? colors.accent : pct >= 40 ? colors.warning : colors.danger;
          return (
            <View style={s.card}>
              <View style={[s.scoreDot, { backgroundColor: color }]}>
                <Text style={s.scoreTxt}>{pct}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle} numberOfLines={1}>{item.testName || 'Practice'}</Text>
                <Text style={s.cardMeta}>
                  {item.subject ? `${item.subject} • ` : ''}
                  {item.correct}/{item.total} sahi
                  {item.timeTaken ? ` • ${Math.floor(item.timeTaken/60)}m ${item.timeTaken%60}s` : ''}
                </Text>
                <Text style={s.cardDate}>
                  {new Date(item.when).toLocaleString()}
                </Text>
              </View>
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
  statsCard: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { color: colors.primary, fontSize: 26, fontWeight: '900' },
  statLbl: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  divider: { width: 1, backgroundColor: colors.border, marginVertical: 6 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  scoreDot: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scoreTxt: { color: '#fff', fontSize: 14, fontWeight: '900' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  cardDate: { color: colors.textDim, fontSize: 10, marginTop: 4 },
  empty: { alignItems: 'center', padding: 50 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14 },
  emptyHint: { color: colors.textDim, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
