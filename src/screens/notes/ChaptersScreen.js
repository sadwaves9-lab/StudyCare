import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getChapters } from '../../config/ncertChapters';
import colors from '../../theme/colors';

export default function ChaptersScreen({ route, navigation }) {
  const { subject } = route.params || {};
  const prefs = useSelector((s) => s.userPrefs);
  const notes = useSelector((s) => s.content.notes);

  const chapters = useMemo(
    () => getChapters(subject, prefs.classId),
    [subject, prefs.classId]
  );

  const countFor = (ch) =>
    notes.filter((n) => n.subject === subject && n.chapter === ch).length;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>{subject || 'Chapters'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={chapters}
        keyExtractor={(it, i) => `${i}-${it}`}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="list-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>Is subject ke chapters nahi mile</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const c = countFor(item);
          return (
            <TouchableOpacity
              style={s.card}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('NotesList', { filterChapter: item })
              }
            >
              <View style={s.num}>
                <Text style={s.numTxt}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{item}</Text>
                <Text style={s.cardMeta}>
                  {c > 0 ? `${c} note${c > 1 ? 's' : ''}` : 'No notes yet'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12, gap: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center', textTransform: 'capitalize' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  num: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  numTxt: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  empty: { alignItems: 'center', padding: 40 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14, textAlign: 'center' },
});
