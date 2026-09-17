import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../../theme/colors';

export default function TestScreen({ route, navigation }) {
  const { test } = route.params || {};
  const allQuestions = useSelector((s) => s.content.questions);

  const questions = useMemo(() => {
    const filtered = allQuestions.filter((q) => !test?.subject || q.subject === test.subject);
    return (filtered.length ? filtered : allQuestions).slice(0, 10);
  }, [allQuestions, test]);

  const total = questions.length;
  const totalSec = (test?.duration || 60) * 60;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(totalSec);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    if (remaining <= 0) { doSubmit(); return; }
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining, submitted]);

  const onSelect = (i) => { if (!submitted) setAnswers((a) => ({ ...a, [idx]: i })); };

  const onSubmit = () => {
    const ansCount = Object.keys(answers).length;
    if (ansCount < total) {
      Alert.alert('Submit?', `${total - ansCount} questions baaki hain. Submit karein?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: doSubmit },
      ]);
      return;
    }
    doSubmit();
  };

  const doSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    let correct = 0;
    questions.forEach((q, i) => {
      const correctIdx = q.options.findIndex((_, j) => 'ABCD'[j] === q.answer);
      if (answers[i] === correctIdx) correct++;
    });
    navigation.replace('TestResult', {
      test, questions, answers, correct, total,
      timeTaken: totalSec - remaining,
    });
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const danger = remaining < 60;

  if (total === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.empty}>
          <Ionicons name="alert-circle-outline" size={50} color={colors.textDim} />
          <Text style={s.emptyTxt}>Abhi koi questions nahi</Text>
          <Text style={s.emptyHint}>Termux: studycare aq</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.emptyBtn}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Wapas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const q = questions[idx];
  const selected = answers[idx];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={s.hTitle} numberOfLines={1}>{test?.name || 'Practice'}</Text>
          <Text style={s.hSub}>Q {idx + 1} / {total}</Text>
        </View>
        <View style={[s.timer, danger && s.timerDanger]}>
          <Ionicons name="time" size={16} color={danger ? colors.danger : '#fff'} />
          <Text style={[s.timerTxt, danger && { color: colors.danger }]}>{mm}:{ss}</Text>
        </View>
      </View>

      <View style={s.progressBg}>
        <View style={[s.progressFg, { width: `${((idx + 1) / total) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.qCard}>
          <View style={s.qTagRow}>
            <Text style={s.qTag}>{q.subject}</Text>
            {q.chapter ? <Text style={s.qTagAlt}>{q.chapter}</Text> : null}
          </View>
          <Text style={s.qText}>{q.question}</Text>
        </View>

        {q.options.map((opt, i) => {
          const active = selected === i;
          return (
            <TouchableOpacity key={i} style={[s.opt, active && s.optActive]} onPress={() => onSelect(i)} activeOpacity={0.7}>
              <View style={[s.optBadge, active && s.optBadgeActive]}>
                <Text style={[s.optBadgeTxt, active && { color: '#fff' }]}>{'ABCD'[i]}</Text>
              </View>
              <Text style={[s.optTxt, active && { color: '#fff' }]}>{opt}</Text>
              {active && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={s.nav}>
        <TouchableOpacity style={[s.navBtn, idx === 0 && s.navDisabled]} onPress={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0}>
          <Ionicons name="chevron-back" size={22} color={idx === 0 ? colors.textDim : '#fff'} />
        </TouchableOpacity>

        {idx === total - 1 ? (
          <TouchableOpacity style={s.submit} onPress={onSubmit} activeOpacity={0.85}>
            <Text style={s.submitTxt}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.next} onPress={() => setIdx(idx + 1)} activeOpacity={0.85}>
            <Text style={s.nextTxt}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10, gap: 12 },
  hTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  timerDanger: { backgroundColor: colors.danger + '22', borderColor: colors.danger },
  timerTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  progressBg: { height: 4, backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressFg: { height: 4, backgroundColor: colors.primary },
  scroll: { padding: 20 },
  qCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  qTagRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  qTag: { color: colors.primary, fontSize: 11, fontWeight: '700', backgroundColor: colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  qTagAlt: { color: colors.accent, fontSize: 11, fontWeight: '700', backgroundColor: colors.accent + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  qText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 24 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  optActive: { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
  optBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center' },
  optBadgeActive: { backgroundColor: colors.primary },
  optBadgeTxt: { color: colors.textMuted, fontWeight: '700' },
  optTxt: { flex: 1, color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  nav: { flexDirection: 'row', gap: 10, padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt },
  navBtn: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  navDisabled: { opacity: 0.4 },
  next: { flex: 1, height: 54, borderRadius: 14, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  nextTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  submit: { flex: 1, height: 54, borderRadius: 14, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  submitTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyTxt: { color: colors.textMuted, fontSize: 15, marginTop: 14 },
  emptyHint: { color: colors.textDim, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  emptyBtn: { marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
});
