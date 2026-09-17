import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CLASSES, STREAMS, SCIENCE_GROUPS, LANGUAGES,
  getSubjectsFor, needsStream, needsScienceGroup,
} from '../../config/curriculum';
import {
  setClass, setStream, setScienceGroup,
  setSubjects, toggleSubject,
  setLanguages, toggleLanguage,
  setSet, hydratePrefs,
} from '../../store/slices/userPrefsSlice';
import { STORAGE_KEYS } from '../../config/constants';
import colors from '../../theme/colors';

export default function ClassSetupScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const prefs = useSelector((s) => s.userPrefs);
  const isEdit = route?.params?.edit;

  const [step, setStep] = useState(1);
  const [classId, setLocalClass] = useState(prefs.classId);
  const [stream, setLocalStream] = useState(prefs.stream);
  const [scienceGroup, setLocalSciGrp] = useState(prefs.scienceGroup);
  const [subjects, setLocalSubjects] = useState(prefs.subjects || []);
  const [languages, setLocalLangs] = useState(prefs.languages?.length ? prefs.languages : ['english']);
  const [setLetter, setLocalSet] = useState(prefs.set || 'A');

  const showStream   = needsStream(classId);
  const showSciGrp   = showStream && needsScienceGroup(stream);

  const availableSubjects = useMemo(
    () => getSubjectsFor(classId, stream, scienceGroup),
    [classId, stream, scienceGroup]
  );

  const totalSteps = useMemo(() => {
    let n = 3; // class + subjects + set
    if (showStream) n++;
    if (showSciGrp) n++;
    return n;
  }, [showStream, showSciGrp]);

  // Step resolver — converts logical step number to actual screen
  const stepLabels = useMemo(() => {
    const arr = ['Class'];
    if (showStream) arr.push('Stream');
    if (showSciGrp) arr.push('Science Group');
    arr.push('Subjects');
    arr.push('Set');
    return arr;
  }, [showStream, showSciGrp]);

  const currentLabel = stepLabels[step - 1] || 'Setup';

  const toggleSub = (id) => {
    setLocalSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleLang = (id) => {
    setLocalLangs((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // min 1 language
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const next = async () => {
    // VALIDATION per step (based on label)
    if (currentLabel === 'Class' && !classId) return;
    if (currentLabel === 'Stream' && !stream) return;
    if (currentLabel === 'Science Group' && !scienceGroup) return;
    if (currentLabel === 'Subjects' && subjects.length === 0) return;
    // Set always has default 'A'

    // Last step? save & exit
    if (step === totalSteps) {
      const payload = {
        classId, stream, scienceGroup,
        subjects, languages, set: setLetter,
      };
      dispatch(hydratePrefs(payload));
      await AsyncStorage.setItem(STORAGE_KEYS.userPrefs, JSON.stringify(payload));

      if (isEdit) navigation.goBack();
      // else: RootNavigator auto-switches to Main
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 1) {
      if (isEdit) navigation.goBack();
      return;
    }
    setStep(step - 1);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />

      {/* Progress dots */}
      <View style={s.progressRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              s.progressDot,
              i + 1 <= step && s.progressDotActive,
              i + 1 < step && s.progressDotDone,
            ]}
          />
        ))}
      </View>

      <Text style={s.stepIndicator}>
        Step {step} of {totalSteps} — {currentLabel}
      </Text>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ============ STEP: CLASS ============ */}
        {currentLabel === 'Class' && (
          <View>
            <Text style={s.title}>Apni class chuno 🎓</Text>
            <Text style={s.sub}>Tumhare class ka content dikhega</Text>

            <View style={s.classGrid}>
              {CLASSES.map((c) => {
                const active = classId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => {
                      setLocalClass(c.id);
                      // Reset downstream
                      if (c.id === '9' || c.id === '10') {
                        setLocalStream(null);
                        setLocalSciGrp(null);
                      }
                      setLocalSubjects([]);
                    }}
                    style={[s.classCard, active && { borderColor: c.color, backgroundColor: c.color + '15' }]}
                    activeOpacity={0.8}
                  >
                    <View style={[s.classIcon, { backgroundColor: c.color + '25' }]}>
                      <Ionicons name="school" size={26} color={c.color} />
                    </View>
                    <Text style={[s.classLabel, active && { color: c.color }]}>{c.label}</Text>
                    {active && (
                      <View style={[s.check, { backgroundColor: c.color }]}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ============ STEP: STREAM ============ */}
        {currentLabel === 'Stream' && (
          <View>
            <Text style={s.title}>Stream chuno 📚</Text>
            <Text style={s.sub}>Class {classId} ke liye stream select karo</Text>

            <View style={s.streamList}>
              {STREAMS.map((st) => {
                const active = stream === st.id;
                return (
                  <TouchableOpacity
                    key={st.id}
                    onPress={() => {
                      setLocalStream(st.id);
                      if (st.id !== 'science') setLocalSciGrp(null);
                      setLocalSubjects([]);
                    }}
                    style={[s.streamCard, active && { borderColor: st.color, backgroundColor: st.color + '12' }]}
                    activeOpacity={0.8}
                  >
                    <View style={[s.streamIcon, active && { backgroundColor: st.color + '25' }]}>
                      <Ionicons name={st.icon} size={24} color={active ? st.color : colors.textMuted} />
                    </View>
                    <Text style={[s.streamLabel, active && { color: st.color }]}>{st.label}</Text>
                    <View style={[s.radio, active && { borderColor: st.color }]}>
                      {active && <View style={[s.radioDot, { backgroundColor: st.color }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ============ STEP: SCIENCE GROUP ============ */}
        {currentLabel === 'Science Group' && (
          <View>
            <Text style={s.title}>Science group chuno 🔬</Text>
            <Text style={s.sub}>Career ke hisaab se group select karo</Text>

            <View style={s.streamList}>
              {SCIENCE_GROUPS.map((g) => {
                const active = scienceGroup === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => {
                      setLocalSciGrp(g.id);
                      setLocalSubjects([]);
                    }}
                    style={[s.streamCard, active && s.streamCardActive]}
                    activeOpacity={0.8}
                  >
                    <View style={[s.streamIcon, active && { backgroundColor: colors.primary + '30' }]}>
                      <Ionicons name="flask" size={22} color={active ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.streamLabel, active && { color: '#fff' }]}>{g.label}</Text>
                      <Text style={s.groupDesc}>{g.desc}</Text>
                      <Text style={s.groupCareer}>🎯 {g.forCareer}</Text>
                    </View>
                    <View style={[s.radio, active && s.radioActive]}>
                      {active && <View style={s.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ============ STEP: SUBJECTS ============ */}
        {currentLabel === 'Subjects' && (
          <View>
            <Text style={s.title}>Subjects chuno 📖</Text>
            <Text style={s.sub}>Compulsory + optional select karo (min 3)</Text>

            {/* Compulsory subjects */}
            <Text style={s.groupHeader}>📌 Available Subjects</Text>
            <View style={s.chipsWrap}>
              {availableSubjects.map((sub) => {
                const active = subjects.includes(sub.id);
                return (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() => toggleSub(sub.id)}
                    style={[s.subjectCard, active && s.subjectCardActive]}
                    activeOpacity={0.8}
                  >
                    <View style={s.subjRow}>
                      {active && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
                      <Text style={[s.subjectName, active && { color: '#fff' }]}>
                        {sub.name}
                      </Text>
                    </View>
                    <Text style={s.subjectMarks}>
                      {sub.theory} + {sub.practical} = {sub.total}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Languages */}
            <View style={s.divider} />
            <Text style={s.groupHeader}>🌐 Languages (min 1)</Text>
            <View style={s.chipsWrap}>
              {LANGUAGES.map((lang) => {
                const active = languages.includes(lang.id);
                return (
                  <TouchableOpacity
                    key={lang.id}
                    onPress={() => toggleLang(lang.id)}
                    style={[s.subjectCard, active && s.subjectCardActive]}
                    activeOpacity={0.8}
                  >
                    <View style={s.subjRow}>
                      {active && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
                      <Text style={[s.subjectName, active && { color: '#fff' }]}>
                        {lang.name}
                      </Text>
                    </View>
                    <Text style={s.subjectMarks}>
                      {lang.theory} + {lang.practical} = {lang.total}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.infoBox}>
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text style={s.infoTxt}>
                Selected: {subjects.length} subject(s) + {languages.length} language(s)
              </Text>
            </View>
          </View>
        )}

        {/* ============ STEP: SET ============ */}
        {currentLabel === 'Set' && (
          <View>
            <Text style={s.title}>Set chuno 🎯</Text>
            <Text style={s.sub}>Tumhara batch / section</Text>

            <View style={s.setRow}>
              {['A', 'B', 'C', 'D'].map((L) => {
                const active = setLetter === L;
                return (
                  <TouchableOpacity
                    key={L}
                    onPress={() => setLocalSet(L)}
                    style={[s.setBtn, active && s.setBtnActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.setTxt, active && { color: '#fff' }]}>Set {L}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.summary}>
              <Text style={s.summaryTitle}>Summary</Text>
              <SummaryRow label="Class" value={CLASSES.find((c) => c.id === classId)?.label} />
              {stream && <SummaryRow label="Stream" value={STREAMS.find((s2) => s2.id === stream)?.label} />}
              {scienceGroup && <SummaryRow label="Group" value={scienceGroup.toUpperCase()} />}
              <SummaryRow label="Subjects" value={subjects.length + ' selected'} />
              <SummaryRow label="Languages" value={languages.join(', ')} />
              <SummaryRow label="Set" value={setLetter} />
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Footer nav */}
      <View style={s.footer}>
        <TouchableOpacity style={s.backBtn} onPress={back}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={next} activeOpacity={0.85}>
          <LinearGradient colors={colors.gradPrimary} style={s.nextBtn}>
            <Text style={s.nextTxt}>
              {step === totalSteps ? (isEdit ? 'Save' : 'Ho gaya! 🎉') : 'Aage'}
            </Text>
            <Ionicons name={step === totalSteps ? 'checkmark' : 'arrow-forward'} size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const SummaryRow = ({ label, value }) => (
  <View style={s.sumRow}>
    <Text style={s.sumLabel}>{label}</Text>
    <Text style={s.sumValue}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  progressRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 18, paddingBottom: 6 },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: colors.surfaceAlt },
  progressDotActive: { backgroundColor: colors.primary },
  progressDotDone: { backgroundColor: colors.success },
  stepIndicator: { color: colors.textDim, fontSize: 11, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  scroll: { padding: 24 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 6, marginBottom: 24 },

  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  classCard: { width: '47%', backgroundColor: colors.surface, borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: colors.border, position: 'relative' },
  classIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  classLabel: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  check: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },

  streamList: { gap: 12 },
  streamCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: colors.border },
  streamCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  streamIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.bgAlt, alignItems: 'center', justifyContent: 'center' },
  streamLabel: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  groupDesc: { color: colors.textDim, fontSize: 11, marginTop: 4 },
  groupCareer: { color: colors.accent, fontSize: 11, marginTop: 4, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },

  groupHeader: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginTop: 4 },
  chipsWrap: { gap: 10 },
  subjectCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 2, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subjectCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  subjRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  subjectName: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  subjectMarks: { color: colors.textDim, fontSize: 11, fontWeight: '600', backgroundColor: colors.bgAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 22 },
  infoBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.info + '15', borderRadius: 10, padding: 12, marginTop: 16, borderWidth: 1, borderColor: colors.info + '40' },
  infoTxt: { flex: 1, color: colors.textMuted, fontSize: 12 },

  setRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  setBtn: { width: '47%', height: 80, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  setBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  setTxt: { color: colors.textMuted, fontSize: 16, fontWeight: '800' },

  summary: { marginTop: 24, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sumLabel: { color: colors.textMuted, fontSize: 13 },
  sumValue: { color: '#fff', fontSize: 13, fontWeight: '700' },

  footer: { flexDirection: 'row', gap: 10, padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt },
  backBtn: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  nextBtn: { height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
