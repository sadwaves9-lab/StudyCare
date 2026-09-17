import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../../theme/colors';

export default function SearchScreen({ navigation }) {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('notes');
  const { notes, questions } = useSelector((s) => s.content);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    if (tab === 'notes') {
      return notes.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(query) ||
          (n.body || '').toLowerCase().includes(query) ||
          (n.subject || '').toLowerCase().includes(query) ||
          (n.chapter || '').toLowerCase().includes(query)
      );
    }
    return questions.filter(
      (qq) =>
        (qq.question || '').toLowerCase().includes(query) ||
        (qq.subject || '').toLowerCase().includes(query) ||
        (qq.chapter || '').toLowerCase().includes(query)
    );
  }, [q, tab, notes, questions]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Search 🔍</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={s.input}
          placeholder="Search notes, questions..."
          placeholderTextColor={colors.textDim}
          value={q}
          onChangeText={setQ}
          autoFocus
        />
        {q ? (
          <TouchableOpacity onPress={() => setQ('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'notes' && s.tabActive]}
          onPress={() => setTab('notes')}
        >
          <Text style={[s.tabTxt, tab === 'notes' && { color: '#fff' }]}>
            Notes ({notes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'questions' && s.tabActive]}
          onPress={() => setTab('questions')}
        >
          <Text style={[s.tabTxt, tab === 'questions' && { color: '#fff' }]}>
            Questions ({questions.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="search-outline" size={40} color={colors.textDim} />
            <Text style={s.emptyTxt}>
              {q ? 'Kuch nahi mila' : 'Type karke search karo'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            activeOpacity={0.7}
            onPress={() => {
              if (tab === 'notes') {
                navigation.navigate('NotesDetail', { note: item });
              }
            }}
          >
            <View style={s.tagRow}>
              <Text style={s.tag}>{item.subject}</Text>
              {item.chapter ? <Text style={s.tagAlt}>{item.chapter}</Text> : null}
            </View>
            <Text style={s.cardTitle} numberOfLines={1}>
              {tab === 'notes' ? item.title : item.question}
            </Text>
            {tab === 'notes' ? (
              <Text style={s.cardBody} numberOfLines={2}>
                {item.body}
              </Text>
            ) : (
              <Text style={s.cardBody} numberOfLines={1}>
                Answer: {item.answer}
              </Text>
            )}
          </TouchableOpacity>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, marginHorizontal: 20, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  tabs: { flexDirection: 'row', marginTop: 14, marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  tabBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabTxt: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { color: colors.primary, fontSize: 10, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  tagAlt: { color: colors.accent, fontSize: 10, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  cardBody: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  empty: { alignItems: 'center', padding: 50 },
  emptyTxt: { color: colors.textMuted, marginTop: 12, fontSize: 14 },
});
