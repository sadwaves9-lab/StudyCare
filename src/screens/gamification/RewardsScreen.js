import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { claimDaily } from '../../store/slices/rewardsSlice';
import { FadeIn, ScaleIn, AnimatedCounter } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function RewardsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { coins, totalEarned, todayClaimed } = useSelector((s) => s.rewards);

  const claim = () => {
    if (todayClaimed) {
      haptics.warning();
      Alert.alert('Kal aana!', 'Aaj ka reward le liya. Kal phir aao.');
      return;
    }
    haptics.success();
    dispatch(claimDaily());
    Alert.alert('Mubarak! 🎉', '+50 coins mile!');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Rewards 🪙</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <ScaleIn>
          <LinearGradient colors={['#FDCB6E', '#FD79A8']} style={s.hero}>
            <Text style={s.coinIcon}>🪙</Text>
            <AnimatedCounter value={coins} duration={1200} style={s.coinsBig} />
            <Text style={s.coinLbl}>Coins</Text>
            <Text style={s.coinSub}>Padhai karke coins kamao</Text>
          </LinearGradient>
        </ScaleIn>

        <FadeIn delay={200}>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statVal}>{totalEarned}</Text>
              <Text style={s.statLbl}>Total Earned</Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={400}>
          <Text style={s.section}>Daily Reward</Text>
          <TouchableOpacity onPress={claim} activeOpacity={0.85}>
            <LinearGradient
              colors={todayClaimed ? [colors.surfaceAlt, colors.surface] : ['#00B894', '#00D2D3']}
              style={s.claimCard}
            >
              <View style={s.claimLeft}>
                <Ionicons
                  name={todayClaimed ? 'checkmark-circle' : 'gift'}
                  size={36}
                  color={todayClaimed ? colors.textMuted : '#fff'}
                />
                <View>
                  <Text style={s.claimTitle}>
                    {todayClaimed ? 'Claimed Today ✅' : 'Claim 50 Coins'}
                  </Text>
                  <Text style={s.claimSub}>
                    {todayClaimed ? 'Kal phir aao' : 'Ek tap me le lo'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={todayClaimed ? colors.textDim : '#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        </FadeIn>

        <FadeIn delay={600}>
          <Text style={s.section}>Ways to Earn</Text>
          {[
            { icon: 'flame', color: '#FD79A8', title: 'Daily Streak', sub: 'Har din +10 coins' },
            { icon: 'checkmark-circle', color: '#00B894', title: 'Correct Answer', sub: 'Har sahi pe +2' },
            { icon: 'timer', color: '#00D2D3', title: 'Focus Session', sub: '25 min focus pe +20' },
            { icon: 'trophy', color: '#FDCB6E', title: 'Test Complete', sub: '80%+ pe +100' },
            { icon: 'people', color: '#6C5CE7', title: 'Refer Friend', sub: 'Har friend pe +200' },
          ].map((it, i) => (
            <View key={i} style={s.earnCard}>
              <View style={[s.earnIcon, { backgroundColor: it.color + '25' }]}>
                <Ionicons name={it.icon} size={20} color={it.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.earnTitle}>{it.title}</Text>
                <Text style={s.earnSub}>{it.sub}</Text>
              </View>
            </View>
          ))}
        </FadeIn>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { padding: 20, paddingTop: 0 },
  hero: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20 },
  coinIcon: { fontSize: 56 },
  coinsBig: { color: '#fff', fontSize: 56, fontWeight: '900', marginTop: 6 },
  coinLbl: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  coinSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statVal: { color: colors.warning, fontSize: 22, fontWeight: '900' },
  statLbl: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  claimCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 18, padding: 18 },
  claimLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  claimTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  claimSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  earnCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  earnIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  earnTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  earnSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
