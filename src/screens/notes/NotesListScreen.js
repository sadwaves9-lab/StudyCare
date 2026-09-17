import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import colors from '../../theme/colors';

export default function NotesListScreen() {
  const dispatch = useDispatch();
  const { notes, refreshing } = useSelector((s) => s.content);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Notes 📖</Text>
        <Text style={s.sub}>{notes.length} notes available</Text>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchContent({ force: true }))} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="book-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>Abhi koi notes nahi</Text>
            <Text style={s.emptyHint}>Termux: studycare an</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.tagRow}>
              <Text style={s.tag}>{item.subject}</Text>
              <Text style={s.tagAlt}>{item.chapter}</Text>
            </View>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardBody} numberOfLines={3}>{item.body}</Text>
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
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { color: colors.primary, fontSize: 11, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  tagAlt: { color: colors.accent, fontSize: 11, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardBody: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  empty: { alignItems: 'center', padding: 40 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14 },
  emptyHint: { color: colors.textDim, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
