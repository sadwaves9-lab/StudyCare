import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addCoins } from '../../store/slices/rewardsSlice';
import { updateProgress, unlock } from '../../store/slices/achievementsSlice';
import { FadeIn, ScaleIn, Pulse } from '../../components/animations';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

const MODES = [
  { id: 'focus',  label: 'Focus',       min: 25, color: '#6C5CE7' },
  { id: 'short',  label: 'Short Break', min: 5,  color: '#00D2D3' },
  { id: 'long',   label: 'Long Break',  min: 15, color: '#00B894' },
];

export default function StudyTimerScreen({ navigation }) {
  const dispatch = useDispatch();
  const focusProgress = useSelector((s) => s.achievements.progress.focus_1 || 0);

  const [mode, setMode] = useState(MODES[0]);
  const [remaining, setRemaining] = useState(MODES[0].min * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            onComplete();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const onComplete = () => {
    haptics.success();
    setRunning(false);
    if (mode.id === 'focus') {
      const newCompleted = completed + 1;
      setCompleted(newCompleted);
      dispatch(addCoins(20));
      dispatch(updateProgress({ id: 'focus_1', value: newCompleted }));
      dispatch(updateProgress({ id: 'focus_10', value: newCompleted }));
      dispatch(updateProgress({ id: 'focus_50', value: newCompleted }));
      if (newCompleted >= 1) dispatch(unlock('focus_1'));
      if (newCompleted >= 10) dispatch(unlock('focus_10'));
      if (newCompleted >= 50) dispatch(unlock('focus_50'));
      Alert.alert('Shabash! 🎉', `25 min focus complete. +20 coins earned!`);
    } else {
      Alert.alert('Break over', 'Chalo wapas padhai pe!');
    }
    setRemaining(mode.min * 60);
  };

  const toggle = () => {
    haptics.tap();
    setRunning((r) => !r);
  };

  const reset = () => {
    haptics.medium();
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(mode.min * 60);
  };

  const changeMode = (m) => {
    haptics.selection();
    clearInterval(intervalRef.current);
    setRunning(false);
    setMode(m);
    setRemaining(m.min * 60);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = 1 - remaining / (mode.min * 60);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      <View style={s.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Study Timer ⏱</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.modes}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => changeMode(m)}
            style={[s.modeBtn, mode.id === m.id && { backgroundColor: m.color + '25', borderColor: m.color }]}
          >
            <Text style={[s.modeTxt, mode.id === m.id && { color: m.color }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.center}>
        <ScaleIn key={mode.id}>
          <View style={s.timerCircle}>
            <LinearGradient
              colors={[mode.color + '35', mode.color + '10']}
              style={s.circleInner}
            >
              {running ? (
                <Pulse duration={2000}>
                  <Text style={s.time}>{mm}:{ss}</Text>
                </Pulse>
              ) : (
                <Text style={s.time}>{mm}:{ss}</Text>
              )}
              <Text style={s.modeLabel}>{mode.label}</Text>
            </LinearGradient>
          </View>
        </ScaleIn>

        <View style={s.controls}>
          <TouchableOpacity onPress={reset} style={s.smallBtn}>
            <Ionicons name="refresh" size={24} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggle} activeOpacity={0.85}>
            <LinearGradient colors={[mode.color, mode.color + 'AA']} style={s.playBtn}>
              <Ionicons name={running ? 'pause' : 'play'} size={36} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => changeMode(mode)} style={s.smallBtn}>
            <Ionicons name="checkmark" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <FadeIn delay={400}>
          <View style={s.stats}>
            <View style={s.statItem}>
              <Text style={s.statVal}>{completed}</Text>
              <Text style={s.statLbl}>Completed</Text>
            </View>
            <View style={s.divider} />
            <View style={s.statItem}>
              <Text style={s.statVal}>{completed * 25}</Text>
              <Text style={s.statLbl}>Minutes</Text>
            </View>
            <View style={s.divider} />
            <View style={s.statItem}>
              <Text style={[s.statVal, { color: colors.warning }]}>🪙 {completed * 20}</Text>
              <Text style={s.statLbl}>Coins</Text>
            </View>
          </View>
        </FadeIn>
      </View>

      <View style={s.tip}>
        <Ionicons name="bulb-outline" size={16} color={colors.warning} />
        <Text style={s.tipTxt}>
          25 min focus, 5 min break — best study method (Pomodoro)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  modes: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginTop: 8 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  modeTxt: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  timerCircle: { width: 260, height: 260, borderRadius: 130, padding: 10 },
  circleInner: { flex: 1, borderRadius: 120, alignItems: 'center', justifyContent: 'center' },
  time: { color: '#fff', fontSize: 64, fontWeight: '900', letterSpacing: 2 },
  modeLabel: { color: colors.textMuted, fontSize: 13, marginTop: 6, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 40 },
  smallBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  playBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 40, borderWidth: 1, borderColor: colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '900' },
  statLbl: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  divider: { width: 1, backgroundColor: colors.border },
  tip: { flexDirection: 'row', gap: 8, margin: 20, padding: 14, backgroundColor: colors.warning + '15', borderRadius: 12, borderWidth: 1, borderColor: colors.warning + '40' },
  tipTxt: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
});
