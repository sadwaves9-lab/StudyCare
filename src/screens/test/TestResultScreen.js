import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addResult } from '../../store/slices/testHistorySlice';
import { FadeIn, ScaleIn, SlideIn, AnimatedCounter } from '../../components/animations';
import Confetti from '../../components/common/Confetti';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function TestResultScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const prefs = useSelector((s) => s.userPrefs);
  const { test, questions, answers, correct, total, timeTaken } = route.params || {};
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const mm = Math.floor((timeTaken || 0) / 60);
  const ss = (timeTaken || 0) % 60;
  const grade = pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
  const gradeColor = pct >= 80 ? colors.success : pct >= 60 ? colors.accent : pct >= 40 ? colors.warning : colors.danger;

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    dispatch(addResult({
      id: 'r_' + Date.now(),
      testName: test?.name || 'Practice',
      subject: test?.subject || '',
      class: prefs.classId || test?.class,
      set: prefs.set,
      correct: correct || 0,
      total: total || 0,
      timeTaken: timeTaken || 0,
      when: new Date().toISOString(),
    }));

    // Celebration
    if (pct >= 80) {
      haptics.success();
      setTimeout(() => setShowConfetti(true), 400);
    } else if (pct >= 60) {
      haptics.medium();
    } else {
      haptics.warning();
    }
  }, []);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <Text style={s.headTitle}>Test Complete 🎉</Text>
          <Text style={s.headSub}>{test?.name || 'Practice'}</Text>
        </FadeIn>

        <ScaleIn delay={200}>
          <LinearGradient colors={[gradeColor + 'CC', gradeColor]} style={s.scoreCard}>
            <AnimatedCounter value={pct} suffix="%" duration={1500} style={s.scoreBig} />
            <Text style={s.scoreLbl}>Grade {grade}</Text>
            <View style={s.scoreRow}>
              <Text style={s.scoreMeta}>✓ {correct} sahi</Text>
              <Text style={s.scoreMeta}>✗ {total - correct} galat</Text>
              <Text style={s.scoreMeta}>⏱ {mm}m {ss}s</Text>
            </View>
          </LinearGradient>
        </ScaleIn>

        <FadeIn delay={400}>
          <Text style={s.section}>Review Answers</Text>
        </FadeIn>

        {(questions || []).map((q, i) => {
          const correctIdx = q.options.findIndex((_, j) => 'ABCD'[j] === q.answer);
          const userIdx = answers?.[i];
          const isRight = userIdx === correctIdx;
          const skipped = userIdx === undefined;
          return (
            <SlideIn key={i} delay={i * 80} from="bottom">
              <View style={[s.revCard, { borderColor: skipped ? colors.border : isRight ? colors.success + '55' : colors.danger + '55' }]}>
                <View style={s.revHead}>
                  <Text style={s.revNum}>Q{i + 1}</Text>
                  <View style={[s.revBadge, { backgroundColor: (skipped ? colors.textDim : isRight ? colors.success : colors.danger) + '22' }]}>
                    <Text style={[s.revBadgeTxt, { color: skipped ? colors.textDim : isRight ? colors.success : colors.danger }]}>
                      {skipped ? 'Skip' : isRight ? 'Sahi' : 'Galat'}
                    </Text>
                  </View>
                </View>
                <Text style={s.revQ}>{q.question}</Text>
                {q.options.map((opt, j) => {
                  const isCorrect = j === correctIdx;
                  const isUser = j === userIdx;
                  return (
                    <View key={j} style={[s.revOpt, isCorrect && s.revOptCorrect, isUser && !isCorrect && s.revOptWrong]}>
                      <Text style={[s.revOptTxt, isCorrect && { color: colors.success, fontWeight: '700' }, isUser && !isCorrect && { color: colors.danger }]}>
                        {'ABCD'[j]}. {opt}
                      </Text>
                    </View>
                  );
                })}
                {q.explanation ? (
                  <View style={s.expBox}>
                    <Ionicons name="bulb-outline" size={14} color={colors.warning} />
                    <Text style={s.expTxt}>{q.explanation}</Text>
                  </View>
                ) : null}
              </View>
            </SlideIn>
          );
        })}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.done}
          onPress={() => { haptics.tap(); navigation.popToTop(); }}
          activeOpacity={0.85}
        >
          <Text style={s.doneTxt}>Ho gaya</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  headTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headSub: { color: colors.textMuted, fontSize: 13, marginTop: 4, marginBottom: 20 },
  scoreCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24 },
  scoreBig: { color: '#fff', fontSize: 56, fontWeight: '900' },
  scoreLbl: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700', marginTop: 4 },
  scoreRow: { flexDirection: 'row', gap: 14, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  scoreMeta: { color: '#fff', fontSize: 12, fontWeight: '600' },
  section: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  revCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1 },
  revHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  revNum: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  revBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  revBadgeTxt: { fontSize: 11, fontWeight: '700' },
  revQ: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 10, lineHeight: 20 },
  revOpt: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginBottom: 4, backgroundColor: colors.bgAlt },
  revOptCorrect: { backgroundColor: colors.success + '18' },
  revOptWrong: { backgroundColor: colors.danger + '18' },
  revOptTxt: { color: colors.textMuted, fontSize: 13 },
  expBox: { flexDirection: 'row', gap: 8, marginTop: 10, padding: 10, backgroundColor: colors.warning + '15', borderRadius: 10 },
  expTxt: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt },
  done: { height: 54, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  doneTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
