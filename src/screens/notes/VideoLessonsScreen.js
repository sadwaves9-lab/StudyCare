import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { VIDEO_LESSONS, getVideosFor, getYouTubeThumbnail, getYouTubeUrl } from '../../data/videoLessons';
import EmptyState from '../../components/common/EmptyState';
import { FadeIn, SlideIn } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function VideoLessonsScreen({ navigation, route }) {
  const prefs = useSelector((s) => s.userPrefs);
  const { subject, chapter } = route.params || {};

  const videos = useMemo(() => {
    if (subject || chapter) return getVideosFor(prefs.classId, subject, chapter);
    // Show videos for user's subjects
    return VIDEO_LESSONS.filter(
      (v) => String(v.class) === String(prefs.classId) ||
      (prefs.subjects || []).some((s) => s.toLowerCase() === String(v.subject).toLowerCase())
    );
  }, [prefs, subject, chapter]);

  const openVideo = async (video) => {
    haptics.tap();
    const url = getYouTubeUrl(video.ytId);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'YouTube app install nahi hai');
      }
    } catch (e) {
      Alert.alert('Error', 'Video open nahi ho paya');
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => { haptics.tap(); navigation.goBack(); }} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Video Lessons 🎬</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={videos}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={
          <EmptyState
            icon="videocam-outline"
            title="Koi video nahi"
            subtitle="Is class/subject ke videos add nahi hue"
            hint="Termux: src/data/videoLessons.js update karo"
            gradient={['#00D2D3', '#6C5CE7']}
          />
        }
        renderItem={({ item, index }) => (
          <SlideIn delay={index * 70} from="bottom">
            <TouchableOpacity
              style={s.card}
              onPress={() => openVideo(item)}
              activeOpacity={0.85}
            >
              <View style={s.thumbWrap}>
                <Image source={{ uri: getYouTubeThumbnail(item.ytId) }} style={s.thumb} />
                <View style={s.playOverlay}>
                  <View style={s.playBtn}>
                    <Ionicons name="play" size={22} color="#fff" />
                  </View>
                </View>
                {item.duration ? (
                  <View style={s.duration}><Text style={s.durationTxt}>{item.duration}</Text></View>
                ) : null}
              </View>
              <View style={s.body}>
                <Text style={s.videoTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={s.channel}>
                  {item.channel}{item.chapter ? ` • ${item.chapter}` : ''}
                </Text>
                <View style={s.tagRow}>
                  {item.subject ? <Text style={s.tag}>{item.subject}</Text> : null}
                  {item.class ? <Text style={s.tagAlt}>C{item.class}</Text> : null}
                </View>
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
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12, gap: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  thumbWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.bgAlt, position: 'relative' },
  thumb: { width: '100%', height: '100%' },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
  playBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(108,92,231,0.95)', alignItems: 'center', justifyContent: 'center' },
  duration: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  durationTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  body: { padding: 14 },
  videoTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  channel: { color: colors.textMuted, fontSize: 12, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { color: colors.primary, fontSize: 10, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden', textTransform: 'capitalize' },
  tagAlt: { color: colors.accentAlt, fontSize: 10, fontWeight: '700', backgroundColor: colors.accentAlt + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
});
