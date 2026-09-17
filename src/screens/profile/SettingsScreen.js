import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNotification, updateStudy, updateNotification } from '../../store/slices/settingsSlice';
import colors from '../../theme/colors';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { notifications, study } = useSelector((s) => s.settings);

  const T = (path, label, sub) => {
    let ref = notifications;
    for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
    const val = ref[path[path.length - 1]];
    return (
      <Toggle
        label={label}
        sub={sub}
        value={!!val}
        onChange={() => dispatch(toggleNotification(path))}
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

        {/* NOTIFICATIONS SECTION */}
        <Section title="Notifications" icon="notifications-outline" color={colors.primary}>
          {T(['master'], 'All Notifications', 'Global on/off')}

          {notifications.master && (
            <>
              {/* TESTS NESTED */}
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
                              onPress={() => dispatch(updateNotification({
                                path: ['tests', 'reminderBefore'], value: m,
                              }))}
                              style={[s.chip, notifications.tests.reminderBefore === m && s.chipActive]}
                            >
                              <Text style={[s.chipTxt, notifications.tests.reminderBefore === m && { color: '#fff' }]}>
                                {m}m
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      }
                    />
                  </>
                )}
              </SubSection>

              {/* NOTES NESTED */}
              <SubSection title="Notes" icon="book-outline">
                {T(['notes', 'enabled'], 'Note Alerts', 'New notes aa to notify')}
                {notifications.notes.enabled && (
                  <>
                    {T(['notes', 'dailyDigest'], 'Daily Digest', 'Ek summary roz')}
                    {notifications.notes.dailyDigest && (
                      <Row
                        label="Digest time"
                        right={
                          <View style={s.chipRow}>
                            {['08:00', '14:00', '20:00', '22:00'].map((t) => (
                              <TouchableOpacity
                                key={t}
                                onPress={() => dispatch(updateNotification({
                                  path: ['notes', 'digestTime'], value: t,
                                }))}
                                style={[s.chip, notifications.notes.digestTime === t && s.chipActive]}
                              >
                                <Text style={[s.chipTxt, notifications.notes.digestTime === t && { color: '#fff' }]}>
                                  {t}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        }
                      />
                    )}
                  </>
                )}
              </SubSection>

              {/* SOCIAL NESTED */}
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

        {/* STUDY SECTION */}
        <Section title="Study" icon="school-outline" color={colors.accent}>
          <Row
            label="Daily goal"
            right={
              <View style={s.chipRow}>
                {[60, 90, 120, 180].map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => dispatch(updateStudy({ dailyGoalMinutes: m }))}
                    style={[s.chip, study.dailyGoalMinutes === m && s.chipActive]}
                  >
                    <Text style={[s.chipTxt, study.dailyGoalMinutes === m && { color: '#fff' }]}>
                      {m}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <Toggle
            label="Auto play next"
            sub="Next question khud aaye"
            value={study.autoPlayNext}
            onChange={(v) => dispatch(updateStudy({ autoPlayNext: v }))}
          />
          <Toggle
            label="Show hints"
            sub="Practice me hints dikhaye"
            value={study.showHints}
            onChange={(v) => dispatch(updateStudy({ showHints: v }))}
          />
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
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
      thumbColor="#fff"
    />
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

  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  toggleLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  toggleSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },

  chipRow: { flexDirection: 'row', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.bgAlt, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
});
