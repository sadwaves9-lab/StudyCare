import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

const LIST = [
  { id: '1', title: 'Newton laws summary', desc: 'Teen laws ka easy explanation', replies: 12, tag: 'Physics' },
  { id: '2', title: 'Integration tricks', desc: 'Shortcut methods for JEE', replies: 25, tag: 'Maths' },
  { id: '3', title: 'Periodic table memory', desc: 'Groups yaad karne ka tarika', replies: 18, tag: 'Chemistry' },
  { id: '4', title: 'Cell biology basics', desc: 'Nucleus, mitochondria, etc.', replies: 8, tag: 'Biology' },
];

export default function DiscussionsScreen({ navigation }) {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Discussions 💬</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={LIST}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} activeOpacity={0.7}>
            <View style={s.iconBox}>
              <Ionicons name="chatbubbles" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.tagRow}>
                <Text style={s.tag}>{item.tag}</Text>
              </View>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardDesc} numberOfLines={2}>{item.desc}</Text>
              <View style={s.metaRow}>
                <Ionicons name="chatbubble-outline" size={12} color={colors.textDim} />
                <Text style={s.meta}>{item.replies} replies</Text>
              </View>
            </View>
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
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accent + '22', alignItems: 'center', justifyContent: 'center' },
  tagRow: { flexDirection: 'row', marginBottom: 6 },
  tag: { color: colors.accent, fontSize: 10, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cardDesc: { color: colors.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 },
  metaRow: { flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 8 },
  meta: { color: colors.textDim, fontSize: 11 },
});
