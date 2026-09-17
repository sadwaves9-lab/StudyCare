import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import { useFilteredContent } from '../../hooks/useFilteredContent';
import { SkeletonList } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { FadeIn, SlideIn } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function NotesListScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { notes, refreshing, loading } = useFilteredContent();
  const prefs = useSelector((s) => s.userPrefs);
  const bookmarkCount = useSelector((s) => s.bookmarks.notes.length);

  const filterChapter = route?.params?.filterChapter;
  const list = filterChapter ? notes.filter((n) => n.chapter === filterChapter) : notes;
  const subjects = Array.from(new Set(notes.map((n) => n.subject).filter(Boolean)));

  const go = (screen, params) => { haptics.tap(); navigation.navigate(screen, params); };

  if (loading && list.length === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Notes 📖</Text>
            <Text style={s.sub}>Loading...</Text>
          </View>
        </View>
        <SkeletonList count={4} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <FadeIn>
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Notes 📖</Text>
            <Text style={s.sub} numberOfLines={1}>
              {list.length} notes{filterChapter ? ` • ${filterChapter}` : ''}
            </Text>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => go('Search')}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={() => go('VideoLessons')}>
            <Ionicons name="videocam" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={() => go('Bookmarks')}>
            <Ionicons name="bookmark" size={20} color="#fff" />
            {bookmarkCount > 0 && (
              <View style={s.badge}><Text style={s.badgeTxt}>{bookmarkCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </FadeIn>

      {filterChapter && (
        <TouchableOpacity
          style={s.clearFilter}
          onPress={() => navigation.setParams({ filterChapter: null })}
        >
          <Ionicons name="close-circle" size={16} color={colors.primary} />
          <Text style={s.clearTxt}>Clear chapter filter</Text>
        </TouchableOpacity>
      )}

      <View style={s.chaptersRow}>
        <Text style={s.chaptersLbl}>Browse by chapter →</Text>
      </View>
      <FlatList
        horizontal
        data={subjects}
        keyExtractor={(it) => it}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.chipSubject} onPress={() => go('Chapters', { subject: item })}>
            <Ionicons name="list" size={14} color={colors.primary} />
            <Text style={s.chipSubjectTxt}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchContent({ force: true }))} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="Koi notes nahi"
            subtitle="Tumhare class/subject ke notes add nahi hue"
            hint="Termux: studycare an"
          />
        }
        renderItem={({ item, index }) => (
          <SlideIn delay={index * 60} from="bottom">
            <TouchableOpacity
              style={s.card}
              onPress={() => go('NotesDetail', { note: item })}
              activeOpacity={0.7}
            >
              <View style={s.tagRow}>
                <Text style={s.tag}>{item.subject}</Text>
                {item.chapter ? <Text style={s.tagAlt}>{item.chapter}</Text> : null}
                {item.class ? <Text style={s.tagClass}>C{item.class}</Text> : null}
              </View>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardBody} numberOfLines={3}>{item.body}</Text>
              <View style={s.readMore}>
                <Text style={s.readMoreTxt}>Read more</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </SlideIn>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 20, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  iconBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  clearFilter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 20, marginBottom: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.primary + '15', borderRadius: 10, alignSelf: 'flex-start' },
  clearTxt: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  chaptersRow: { paddingHorizontal: 20, paddingBottom: 6 },
  chaptersLbl: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
  chipRow: { paddingHorizontal: 20, paddingVertical: 6, gap: 8 },
  chipSubject: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.primary + '18', borderWidth: 1, borderColor: colors.primary + '40', height: 34 },
  chipSubjectTxt: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  tag: { color: colors.primary, fontSize: 11, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  tagAlt: { color: colors.accent, fontSize: 11, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  tagClass: { color: colors.accentAlt, fontSize: 11, fontWeight: '700', backgroundColor: colors.accentAlt + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardBody: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  readMoreTxt: { color: colors.primary, fontSize: 12, fontWeight: '700' },
});
