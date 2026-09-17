import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmarkNote } from '../../store/slices/bookmarksSlice';
import { shareNote, copyNote } from '../../utils/shareContent';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

function renderRich(text = '') {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    if (line.trim().startsWith('## ')) {
      return <Text key={li} style={s.h2}>{line.replace('## ', '').trim()}</Text>;
    }
    if (line.trim().startsWith('# ')) {
      return <Text key={li} style={s.h1}>{line.replace('# ', '').trim()}</Text>;
    }

    const parts = [];
    let rest = line;
    while (rest.length > 0) {
      const bStart = rest.indexOf('**');
      const kStart = rest.indexOf('__');
      let next = -1;
      let type = null;
      if (bStart !== -1 && (kStart === -1 || bStart < kStart)) {
        next = bStart;
        type = 'bold';
      } else if (kStart !== -1) {
        next = kStart;
        type = 'key';
      }

      if (next === -1) { parts.push({ text: rest }); break; }
      if (next > 0) parts.push({ text: rest.slice(0, next) });
      const marker = type === 'bold' ? '**' : '__';
      const close = rest.indexOf(marker, next + 2);
      if (close === -1) { parts.push({ text: rest.slice(next) }); break; }
      parts.push({ text: rest.slice(next + 2, close), type });
      rest = rest.slice(close + 2);
    }

    return (
      <Text key={li} style={s.bodyLine}>
        {parts.map((p, pi) =>
          p.type === 'bold' ? (
            <Text key={pi} style={s.bold}>{p.text}</Text>
          ) : p.type === 'key' ? (
            <Text key={pi} style={s.key}>{p.text}</Text>
          ) : (
            <Text key={pi}>{p.text}</Text>
          )
        )}
      </Text>
    );
  });
}

export default function NotesDetailScreen({ route, navigation }) {
  const { note } = route.params || {};
  const dispatch = useDispatch();
  const bookmarks = useSelector((s) => s.bookmarks.notes);
  const isBookmarked = note ? bookmarks.includes(note.id) : false;

  if (!note) return null;

  const onShare = async () => {
    haptics.tap();
    await shareNote(note);
  };

  const onCopy = async () => {
    haptics.tap();
    await copyNote(note);
    Alert.alert('Copied ✅', 'Note copy ho gaya');
  };

  const onBookmark = () => {
    haptics.selection();
    dispatch(toggleBookmarkNote(note.id));
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headTitle} numberOfLines={1}>{note.title}</Text>
        <TouchableOpacity onPress={onShare} style={s.back}>
          <Ionicons name="share-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onBookmark}
          style={[s.back, isBookmarked && { borderColor: colors.warning, backgroundColor: colors.warning + '15' }]}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? colors.warning : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradAccent} style={s.hero}>
          <Text style={s.heroSub}>{note.subject}{note.class ? ` • Class ${note.class}` : ''}</Text>
          <Text style={s.heroTitle}>{note.title}</Text>
          {note.chapter ? <Text style={s.heroChapter}>📖 {note.chapter}</Text> : null}
        </LinearGradient>

        {note.keyTerms && note.keyTerms.length > 0 && (
          <View style={s.keysBox}>
            <Text style={s.keysTitle}>🎯 Key Terms</Text>
            <View style={s.keysRow}>
              {note.keyTerms.map((k, i) => (
                <View key={i} style={s.keyChip}>
                  <Text style={s.keyChipTxt}>{k}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.body}>{renderRich(note.body || '')}</View>

        <View style={s.actionRow}>
          <TouchableOpacity style={s.actionBtn} onPress={onCopy}>
            <Ionicons name="copy-outline" size={18} color={colors.primary} />
            <Text style={s.actionTxt}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} onPress={onShare}>
            <Ionicons name="share-outline" size={18} color={colors.primary} />
            <Text style={s.actionTxt}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 10, gap: 8 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  scroll: { padding: 20 },
  hero: { borderRadius: 20, padding: 22, marginBottom: 16 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  heroChapter: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  keysBox: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.warning + '40' },
  keysTitle: { color: colors.warning, fontSize: 12, fontWeight: '800', marginBottom: 10 },
  keysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  keyChip: { backgroundColor: colors.warning + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  keyChipTxt: { color: colors.warning, fontSize: 11, fontWeight: '700' },
  body: { backgroundColor: colors.surface, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: colors.border },
  h1: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 14, marginBottom: 8 },
  h2: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  bodyLine: { color: colors.text, fontSize: 14, lineHeight: 22 },
  bold: { color: colors.warning, fontWeight: '800' },
  key: { color: colors.accent, fontWeight: '700', fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.primary + '40', backgroundColor: colors.primary + '10' },
  actionTxt: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
