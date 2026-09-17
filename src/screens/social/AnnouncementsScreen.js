import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

const LIST = [
  { id: '1', title: 'New Physics notes uploaded', desc: 'Chapter 5 - Laws of Motion ke complete notes add kiye gaye hain.', time: '2h ago', type: 'info' },
  { id: '2', title: 'Weekly test schedule', desc: 'Is hafte ka test Sunday ko hoga. Taiyari karo!', time: '1d ago', type: 'warning' },
  { id: '3', title: 'Premium offer 50% off', desc: 'Sirf aaj ke liye yearly plan pe 50% discount.', time: '2d ago', type: 'success' },
];

export default function AnnouncementsScreen({ navigation }) {
  const colorsMap = { info: colors.info, warning: colors.warning, success: colors.success };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Announcements 📣</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={LIST}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item }) => {
          const c = colorsMap[item.type] || colors.primary;
          return (
            <View style={[s.card, { borderLeftColor: c, borderLeftWidth: 3 }]}>
              <View style={s.row}>
                <View style={[s.iconBox, { backgroundColor: c + '22' }]}>
                  <Ionicons name="megaphone" size={18} color={c} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.time}>{item.time}</Text>
                </View>
              </View>
              <Text style={s.cardDesc}>{item.desc}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  time: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  cardDesc: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
