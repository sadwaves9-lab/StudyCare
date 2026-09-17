import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmarkNote } from '../../store/slices/bookmarksSlice';
import colors from '../../theme/colors';

export default function BookmarksScreen({ navigation }) {
  const dispatch = useDispatch();
  const { notes: noteIds } = useSelector((s) => s.bookmarks);
  const allNotes = useSelector((s) => s.content.notes);

  const bookmarked = useMemo(
    () => allNotes.filter((n) => noteIds.includes(n.id)),
    [allNotes, noteIds]
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Bookmarks 🔖</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={bookmarked}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="bookmark-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>Abhi koi bookmark nahi</Text>
            <Text style={s.emptyHint}>
              Notes detail me bookmark icon dabao
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('NotesDetail', { note: item })}
            >
              <View style={s.tagRow}>
                <Text style={s.tag}>{item.subject}</Text>
                {item.chapter ? <Text style={s.tagAlt}>{item.chapter}</Text> : null}
              </View>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardBody} numberOfLines={2}>{item.body}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.removeBtn}
              onPress={() => dispatch(toggleBookmarkNote(item.id))}
            >
              <Ionicons name="bookmark" size={20} color={colors.warning} />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tag: { color: colors.primary, fontSize: 10, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  tagAlt: { color: colors.accent, fontSize: 10, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  cardBody: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  removeBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warning + '15' },
  empty: { alignItems: 'center', padding: 50 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14 },
  emptyHint: { color: colors.textDim, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
