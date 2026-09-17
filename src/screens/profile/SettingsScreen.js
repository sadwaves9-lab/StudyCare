import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  toggleNotification,
  updateStudy,
  updateNotification,
} from '../../store/slices/settingsSlice';

import {
  setClass, setSet,
} from '../../store/slices/userPrefsSlice';

import { changeLanguage } from '../../store/slices/languageSlice';

import colors from '../../theme/colors';
import { CLASSES, STREAMS, SCIENCE_GROUPS } from '../../config/curriculum';
import { SUPPORTED_LANGS } from '../../i18n/translations';
import * as haptics from '../../utils/haptics';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();

  const { notifications, study } = useSelector((s) => s.settings);
  const prefs = useSelector((s) => s.userPrefs);
  const langCode = useSelector((s) => s.language.code);

  const classLabel = CLASSES.find((c) => String(c.id) === String(prefs.classId))?.label || '—';
  const streamLabel = STREAMS.find((st) => st.id === prefs.stream)?.label || null;
  const groupLabel = SCIENCE_GROUPS.find((g) => g.id === prefs.scienceGroup)?.label || null;
  const subjectCount = prefs.subjects?.length || 0;
  const langLabel = prefs.languages?.length ? prefs.languages.join(', ') : '—';

  const T = (path, label, sub) => {
    let ref = notifications;
    for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
    const val = ref[path[path.length - 1]];
    return (
      <Toggle
        label={label}
        sub={sub}
        value={!!val}
        onChange={() => { haptics.selection(); dispatch(toggleNotification(path)); }}
      />
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* LANGUAGE */}
        <Section title="Language" icon="language-outline" color={colors.info}>
          <Row
            label="App Language"
            right={
              <View style={s.chipRow}>
                {SUPPORTED_LANGS.map((l) => (
                  <TouchableOpacity
                    key={l.code}
                    onPress={() => { haptics.selection(); dispatch(changeLanguage(l.code)); }}
                    style={[s.chip, langCode === l.code && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, langCode === l.code && { color: '#fff' }]}>
                      {l.flag} {l.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
        </Section>

        {/* ACADEMICS */}
        <Section title="Academics" icon="school-outline" color={colors.success}>
          <View style={s.acadSummary}>
            <View style={s.acadItem}>
              <Text style={s.acadLabel}>Class</Text>
              <Text style={s.acadValue}>{classLabel}</Text>
            </View>
            {streamLabel && (
              <View style={s.acadItem}>
                <Text style={s.acadLabel}>Stream</Text>
                <Text style={s.acadValue}>{streamLabel}{groupLabel ? ` • ${groupLabel}` : ''}</Text>
              </View>
            )}
            <View style={s.acadItem}>
              <Text style={s.acadLabel}>Subjects</Text>
              <Text style={s.acadValue}>{subjectCount > 0 ? `${subjectCount} selected` : 'Not set'}</Text>
            </View>
            <View style={s.acadItem}>
              <Text style={s.acadLabel}>Languages</Text>
              <Text style={s.acadValue}>{langLabel}</Text>
            </View>
            <View style={s.acadItem}>
              <Text style={s.acadLabel}>Set</Text>
              <Text style={s.acadValue}>Set {prefs.set || 'A'}</Text>
            </View>
          </View>

          <Row
            label="Change class"
            right={
              <View style={s.chipRow}>
                {CLASSES.slice(0, 8).map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => { haptics.selection(); dispatch(setClass(String(c.id))); }}
                    style={[s.chip, String(prefs.classId) === String(c.id) && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, String(prefs.classId) === String(c.id) && { color: '#fff' }]}>
                      {c.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />

          <Row
            label="Change set"
            right={
              <View style={s.chipRow}>
                {['A', 'B', 'C', 'D'].map((L) => (
                  <TouchableOpacity
                    key={L}
                    onPress={() => { haptics.selection(); dispatch(setSet(L)); }}
                    style={[s.chip, prefs.set === L && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, prefs.set === L && { color: '#fff' }]}>{L}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />

          <TouchableOpacity
            onPress={() => { haptics.tap(); navigation.navigate('ClassSetup', { edit: true }); }}
            style={s.editBtn}
            activeOpacity={0.8}
          >
            <View style={s.editIcon}>
              <Ionicons name="create-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.editTitle}>Edit full setup</Text>
              <Text style={s.editSub}>Stream, science group, subjects, languages</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications" icon="notifications-outline" color={colors.primary}>
          {T(['master'], 'All Notifications', 'Global on/off')}

          {notifications.master && (
            <>
              <SubSection title="Tests" icon="clipboard-outline">
                {T(['tests', 'enabled'], 'Test Reminders', 'Scheduled test alerts')}
                {notifications.tests.enabled && (
                  <>
                    {T(['tests', 'sound'], 'Sound', 'Play notification sound')}
                    {T(['tests', 'vibrate'], 'Vibrate', 'Device vibration')}
                    <Row
                      label="Remind before"
                      right={
                        <View style={s.chipRow}>
                          {[15, 30, 60, 120].map((m) => (
                            <TouchableOpacity
                              key={m}
                              onPress={() => { haptics.selection(); dispatch(updateNotification({ path: ['tests', 'reminderBefore'], value: m })); }}
                              style={[s.chip, notifications.tests.reminderBefore === m && s.chipActive]}
                            >
                              <Text style={[s.chipTxt, notifications.tests.reminderBefore === m && { color: '#fff' }]}>{m}m</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      }
                    />
                  </>
                )}
              </SubSection>

              <SubSection title="Notes" icon="book-outline">
                {T(['notes', 'enabled'], 'Note Alerts', 'New notes aane par notify')}
                {notifications.notes.enabled && (
                  <>
                    {T(['notes', 'dailyDigest'], 'Daily Digest', 'Ek summary roz')}
                    {notifications.notes.dailyDigest && (
                      <Row
                        label="Digest time"
                        right={
                          <View style={s.chipRow}>
                            {['08:00', '14:00', '20:00', '22:00'].map((time) => (
                              <TouchableOpacity
                                key={time}
                                onPress={() => { haptics.selection(); dispatch(updateNotification({ path: ['notes', 'digestTime'], value: time })); }}
                                style={[s.chip, notifications.notes.digestTime === time && s.chipActive]}
                              >
                                <Text style={[s.chipTxt, notifications.notes.digestTime === time && { color: '#fff' }]}>{time}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        }
                      />
                    )}
                  </>
                )}
              </SubSection>

              <SubSection title="Social" icon="chatbubbles-outline">
                {T(['social', 'enabled'], 'Social Alerts', 'Community updates')}
                {notifications.social.enabled && (
                  <>
                    {T(['social', 'discussions'], 'Discussions')}
                    {T(['social', 'doubts'], 'Doubts')}
                    {T(['social', 'announcements'], 'Announcements')}
                  </>
                )}
              </SubSection>
            </>
          )}
        </Section>

        {/* STUDY */}
        <Section title="Study" icon="book-outline" color={colors.accent}>
          <Row
            label="Daily goal"
            right={
              <View style={s.chipRow}>
                {[60, 90, 120, 180].map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    onPress={() => { haptics.selection(); dispatch(updateStudy({ dailyGoalMinutes: minutes })); }}
                    style={[s.chip, study.dailyGoalMinutes === minutes && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, study.dailyGoalMinutes === minutes && { color: '#fff' }]}>{minutes}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <Toggle label="Auto play next" sub="Next question khud aaye" value={study.autoPlayNext} onChange={(v) => { haptics.selection(); dispatch(updateStudy({ autoPlayNext: v })); }} />
          <Toggle label="Show hints" sub="Practice me hints dikhaye" value={study.showHints} onChange={(v) => { haptics.selection(); dispatch(updateStudy({ showHints: v })); }} />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, icon, color = colors.primary, children }) => (
  <View style={s.section}>
    <View style={s.sectionHead}>
      <View style={[s.sectionIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    <View style={s.sectionBody}>{children}</View>
  </View>
);

const SubSection = ({ title, icon, children }) => (
  <View style={s.sub}>
    <View style={s.subHead}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={s.subTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Toggle = ({ label, sub, value, onChange }) => (
  <View style={s.toggleRow}>
    <View style={{ flex: 1 }}>
      <Text style={s.toggleLabel}>{label}</Text>
      {sub && <Text style={s.toggleSub}>{sub}</Text>}
    </View>
    <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.surfaceAlt, true: colors.primary }} thumbColor="#fff" />
  </View>
);

const Row = ({ label, right }) => (
  <View style={s.toggleRow}>
    <Text style={[s.toggleLabel, { flex: 1 }]}>{label}</Text>
    {right}
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 10 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  scroll: { padding: 20, paddingTop: 10 },
  section: { marginBottom: 22 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionBody: { backgroundColor: colors.surface, borderRadius: 18, padding: 6, borderWidth: 1, borderColor: colors.border },
  sub: { marginTop: 6, padding: 10, backgroundColor: colors.bgAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginHorizontal: 4 },
  subHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, paddingHorizontal: 6 },
  subTitle: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, flexWrap: 'wrap' },
  toggleLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  toggleSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.bgAlt, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  acadSummary: { backgroundColor: colors.bgAlt, borderRadius: 14, padding: 12, margin: 4, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  acadItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border + '60' },
  acadLabel: { color: colors.textMuted, fontSize: 12 },
  acadValue: { color: '#fff', fontSize: 13, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginHorizontal: 4, marginTop: 4, backgroundColor: colors.primary + '15', borderRadius: 14, borderWidth: 1, borderColor: colors.primary + '40' },
  editIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primary + '25', alignItems: 'center', justifyContent: 'center' },
  editTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  editSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
