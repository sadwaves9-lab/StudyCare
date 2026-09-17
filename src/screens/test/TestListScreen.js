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

export default function TestListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tests, refreshing, loading } = useFilteredContent();
  const historyCount = useSelector((s) => s.testHistory.results.length);

  if (loading && tests.length === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.header}>
          <Text style={s.title}>Tests 📝</Text>
          <Text style={s.sub}>Loading...</Text>
        </View>
        <SkeletonList count={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <FadeIn>
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Tests 📝</Text>
            <Text style={s.sub}>{tests.length} scheduled</Text>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => { haptics.tap(); navigation.navigate('TestHistory'); }}>
            <Ionicons name="bar-chart" size={20} color="#fff" />
            {historyCount > 0 && (
              <View style={s.badge}><Text style={s.badgeTxt}>{historyCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </FadeIn>

      <FlatList
        data={tests}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchContent({ force: true }))} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            title="Koi test nahi"
            subtitle="Tumhare class ke tests schedule nahi hue"
            hint="Termux: studycare at"
          />
        }
        renderItem={({ item, index }) => (
          <SlideIn delay={index * 70} from="bottom">
            <TouchableOpacity
              style={s.card}
              onPress={() => { haptics.tap(); navigation.navigate('TestIntro', { test: item }); }}
              activeOpacity={0.7}
            >
              <View style={s.icon}>
                <Ionicons name="clipboard" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.cardMeta}>{item.subject}{item.class ? ` • C${item.class}` : ''}{item.set ? `-${item.set}` : ''}</Text>
                <View style={s.badges}>
                  <Text style={s.badge2}>📅 {item.date}</Text>
                  <Text style={s.badge2}>⏰ {item.time}</Text>
                  <Text style={s.badge2}>⏱ {item.duration}m</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
            </TouchableOpacity>
          </SlideIn>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  iconBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  card: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  badge2: { color: colors.textMuted, fontSize: 11, backgroundColor: colors.bgAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
});
