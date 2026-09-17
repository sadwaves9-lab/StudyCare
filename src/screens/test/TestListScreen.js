import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import colors from '../../theme/colors';

export default function TestListScreen() {
  const dispatch = useDispatch();
  const { tests, refreshing } = useSelector((s) => s.content);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Tests 📝</Text>
        <Text style={s.sub}>{tests.length} tests scheduled</Text>
      </View>
      <FlatList
        data={tests}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchContent({ force: true }))} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="clipboard-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>Koi test nahi</Text>
            <Text style={s.emptyHint}>Termux: studycare at</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.icon}>
              <Ionicons name="clipboard" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{item.name}</Text>
              <Text style={s.cardMeta}>{item.subject}</Text>
              <View style={s.badges}>
                <Text style={s.badge}>📅 {item.date}</Text>
                <Text style={s.badge}>⏰ {item.time}</Text>
                <Text style={s.badge}>⏱ {item.duration}m</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  badge: { color: colors.textMuted, fontSize: 11, backgroundColor: colors.bgAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  empty: { alignItems: 'center', padding: 40 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14 },
  emptyHint: { color: colors.textDim, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
