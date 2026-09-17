import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PREMIUM } from '../../config/premium';
import colors from '../../theme/colors';

export default function PaywallScreen({ navigation }) {
  const [selected, setSelected] = useState('yearly');

  const onSubscribe = () => {
    Alert.alert(
      'Coming soon 🚀',
      'Payment gateway jald aa raha hai. Tab tak free features use karo!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.close}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>

        <LinearGradient colors={colors.gradPrimary} style={s.hero}>
          <View style={s.crown}>
            <Ionicons name="diamond" size={40} color="#fff" />
          </View>
          <Text style={s.heroTitle}>StudyCare Premium</Text>
          <Text style={s.heroSub}>Unlimited padhai, zero limits</Text>
        </LinearGradient>

        <View style={s.features}>
          {[
            { icon: 'help-circle', txt: 'Unlimited questions' },
            { icon: 'book', txt: 'All premium notes' },
            { icon: 'clipboard', txt: 'Unlimited tests' },
            { icon: 'cloud-download', txt: 'Offline download' },
            { icon: 'notifications', txt: 'Priority support' },
            { icon: 'shield-checkmark', txt: 'Ad-free experience' },
          ].map((f, i) => (
            <View key={i} style={s.feat}>
              <View style={s.featIcon}>
                <Ionicons name={f.icon} size={18} color={colors.primary} />
              </View>
              <Text style={s.featTxt}>{f.txt}</Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
          ))}
        </View>

        <Text style={s.plansTitle}>Choose your plan</Text>
        <View style={s.plans}>
          {PREMIUM.plans.map((p) => {
            const active = selected === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[s.plan, active && s.planActive]}
                onPress={() => setSelected(p.id)}
                activeOpacity={0.85}
              >
                {p.popular && (
                  <View style={s.popular}>
                    <Text style={s.popularTxt}>POPULAR</Text>
                  </View>
                )}
                <View style={[s.radio, active && s.radioActive]}>
                  {active && <View style={s.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.planLabel}>{p.label}</Text>
                  <Text style={s.planPrice}>{p.price}<Text style={s.planPeriod}>{p.period}</Text></Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity onPress={onSubscribe} activeOpacity={0.9}>
          <LinearGradient colors={colors.gradAccent} style={s.cta}>
            <Text style={s.ctaTxt}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={s.footNote}>Cancel anytime • No hidden charges</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 20 },
  close: { position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  hero: { borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 24 },
  crown: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  features: { backgroundColor: colors.surface, borderRadius: 18, padding: 6, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  feat: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  featIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  featTxt: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },
  plansTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 12 },
  plans: { gap: 12 },
  plan: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: colors.border, position: 'relative' },
  planActive: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  planLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  planPrice: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 2 },
  planPeriod: { color: colors.textMuted, fontSize: 12, fontWeight: '400' },
  popular: { position: 'absolute', top: -8, right: 16, backgroundColor: colors.accentAlt, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  popularTxt: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt },
  cta: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  footNote: { color: colors.textDim, fontSize: 11, textAlign: 'center', marginTop: 10 },
});
