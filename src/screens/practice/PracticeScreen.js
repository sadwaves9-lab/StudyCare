import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { fetchContent } from '../../store/slices/contentSlice';
import { useFilteredContent } from '../../hooks/useFilteredContent';
import { FadeIn, ScaleIn } from '../../components/animations';
import EmptyState from '../../components/common/EmptyState';
import Confetti from '../../components/common/Confetti';
import * as haptics from '../../utils/haptics';
import colors from '../../theme/colors';

export default function PracticeScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { questions, refreshing } = useFilteredContent();
  const initialSubject = route.params?.subject;

  const subjects = useMemo(() => {
    const set = new Set(questions.map((q) => q.subject).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [questions]);

  const [subject, setSubject] = useState(initialSubject || 'All');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [celebrate, setCelebrate] = useState(false);

  const list = useMemo(() => {
    return subject === 'All' ? questions : questions.filter((q) => q.subject === subject);
  }, [questions, subject]);

  const q = list[idx];
  const correctIdx = q ? q.options.findIndex((_, j) => 'ABCD'[j] === q.answer) : -1;

  const onSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === correctIdx) {
      haptics.success();
      setScore((s) => {
        const next = { ...s, right: s.right + 1 };
        if (next.right > 0 && next.right % 5 === 0) {
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 3500);
        }
        return next;
      });
    } else {
      haptics.error();
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
  };

  const next = () => {
    haptics.tap();
    setSelected(null);
    setRevealed(false);
    setIdx((i) => (i + 1) % list.length);
  };

  const changeSubject = (s) => {
    haptics.selection();
    setSubject(s);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
  };

  if (!list.length) {
    return (
      <SafeAreaView style={st.root} edges={['top']}>
        <View style={st.head}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={st.headTitle}>Practice</Text>
          <View style={{ width: 40 }} />
        </View>
        <EmptyState
          icon="help-circle-outline"
          title="Koi questions nahi"
          subtitle="Tumhare class/subject ke questions add nahi hue"
          hint="Termux: studycare aq"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={st.root} edges={['top']}>
      {celebrate && <Confetti onDone={() => setCelebrate(false)} />}

      <View style={st.head}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.back} onPressIn={haptics.tap}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={st.headTitle}>Practice</Text>
        <View style={st.score}>
          <Text style={st.scoreTxt}>✓ {score.right}  ✗ {score.wrong}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
        {subjects.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => changeSubject(s)}
            style={[st.chip, subject === s && st.chipActive]}
          >
            <Text style={[st.chipTxt, subject === s && { color: '#fff' }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={st.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchContent({ force: true }))} tintColor={colors.primary} />
        }
      >
        <ScaleIn key={idx}>
          <LinearGradient colors={colors.gradPrimary} style={st.qCard}>
            <View style={st.tagRow}>
              <Text style={st.tag}>{q.subject}</Text>
              {q.chapter ? <Text style={st.tagAlt}>{q.chapter}</Text> : null}
              {q.class ? <Text style={st.tagAlt}>C{q.class}</Text> : null}
            </View>
            <Text style={st.qText}>{q.question}</Text>
          </LinearGradient>
        </ScaleIn>

        {q.options.map((opt, i) => {
          const isCorrect = revealed && i === correctIdx;
          const isWrong = revealed && i === selected && i !== correctIdx;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onSelect(i)}
              activeOpacity={0.7}
              disabled={revealed}
              style={[st.opt, isCorrect && st.optCorrect, isWrong && st.optWrong]}
            >
              <View style={[st.optBadge, isCorrect && { backgroundColor: colors.success }, isWrong && { backgroundColor: colors.danger }]}>
                <Text style={[st.optBadgeTxt, (isCorrect || isWrong) && { color: '#fff' }]}>{'ABCD'[i]}</Text>
              </View>
              <Text style={[st.optTxt, isCorrect && { color: colors.success, fontWeight: '700' }, isWrong && { color: colors.danger }]}>{opt}</Text>
              {isCorrect && <Ionicons name="checkmark-circle" size={22} color={colors.success} />}
              {isWrong && <Ionicons name="close-circle" size={22} color={colors.danger} />}
            </TouchableOpacity>
          );
        })}

        {revealed && q.explanation ? (
          <FadeIn>
            <View style={st.exp}>
              <Ionicons name="bulb" size={18} color={colors.warning} />
              <Text style={st.expTxt}>{q.explanation}</Text>
            </View>
          </FadeIn>
        ) : null}

        {revealed && (
          <FadeIn>
            <TouchableOpacity style={st.nextBtn} onPress={next} activeOpacity={0.85}>
              <LinearGradient colors={colors.gradAccent} style={st.nextGrad}>
                <Text style={st.nextTxt}>Next Question</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </FadeIn>
        )}

        <Text style={st.counter}>Question {idx + 1} of {list.length}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 10, gap: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headTitle: { flex: 1, color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  score: { backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  scoreTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  chips: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, height: 34, justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  scroll: { padding: 20 },
  qCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  tag: { color: '#fff', fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  tagAlt: { color: '#fff', fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  qText: { color: '#fff', fontSize: 17, fontWeight: '700', lineHeight: 25 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  optCorrect: { borderColor: colors.success, backgroundColor: colors.success + '18' },
  optWrong: { borderColor: colors.danger, backgroundColor: colors.danger + '18' },
  optBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center' },
  optBadgeTxt: { color: colors.textMuted, fontWeight: '700' },
  optTxt: { flex: 1, color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  exp: { flexDirection: 'row', gap: 10, backgroundColor: colors.warning + '15', borderRadius: 12, padding: 12, marginTop: 4, borderWidth: 1, borderColor: colors.warning + '40' },
  expTxt: { flex: 1, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  nextBtn: { marginTop: 16 },
  nextGrad: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  counter: { color: colors.textDim, fontSize: 12, textAlign: 'center', marginTop: 14 },
});
