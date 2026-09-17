import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

export default function TestIntroScreen({ route, navigation }) {
  const { test } = route.params || {};

  if (!test) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.head}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#fff', padding: 20 }}>Test nahi mila</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headTitle}>Test Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradPrimary} style={s.hero}>
          <View style={s.heroIcon}>
            <Ionicons name="clipboard" size={36} color="#fff" />
          </View>
          <Text style={s.heroTitle}>{test.name}</Text>
          <Text style={s.heroSub}>{test.subject}</Text>
        </LinearGradient>

        <View style={s.grid}>
          <Info icon="calendar" label="Date" value={test.date} color={colors.primary} />
          <Info icon="time" label="Time" value={test.time} color={colors.accent} />
          <Info icon="hourglass" label="Duration" value={`${test.duration} min`} color={colors.accentAlt} />
          <Info icon="help-circle" label="Questions" value="Auto" color={colors.info} />
        </View>

        <View style={s.note}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={s.noteTxt}>
            Test start hone pe timer chalu ho jayega. Ek baar start karne ke baad pause nahi hoga.
          </Text>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TestScreen', { test })}
        >
          <LinearGradient colors={colors.gradAccent} style={s.btn}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={s.btnTxt}>Start Test</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Info = ({ icon, label, value, color }) => (
  <View style={s.info}>
    <View style={[s.infoIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoVal}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 10 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20 },
  hero: { borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 20 },
  heroIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  info: { width: '47%', backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  infoIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  infoLabel: { color: colors.textMuted, fontSize: 11 },
  infoVal: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 },
  note: { flexDirection: 'row', gap: 10, backgroundColor: colors.info + '15', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.info + '40' },
  noteTxt: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt },
  btn: { height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
