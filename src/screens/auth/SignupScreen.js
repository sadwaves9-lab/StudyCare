import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!name.trim()) return setError('Naam daalo');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Valid email');
    if (!dob) return setError('Date of birth select karo');
    if (password.length < 6) return setError('Password 6+ chars');
    setLoading(true);
    try { await signup({ name, email, password, dob }); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />
      <View style={[s.blob, { backgroundColor: colors.accent, top: -60, right: -80 }]} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.title}>Create account ✨</Text>
          <Text style={s.sub}>Aaj se apni padhai smart banao</Text>

          <Field icon="person-outline" placeholder="Full name" value={name} onChangeText={setName} />
          <Field icon="mail-outline" placeholder="Email" value={email}
            onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <TouchableOpacity style={s.field} onPress={() => setPickerOpen(true)}>
            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
            <Text style={[s.input, { lineHeight: 52, color: dob ? '#fff' : colors.textDim }]}>
              {dob ? dob.toDateString() : 'Date of birth'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <Field icon="lock-closed-outline" placeholder="Password (6+)" value={password}
            onChangeText={setPassword} secureTextEntry={!showPass}
            right={
              <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            } />

          {error ? (
            <View style={s.errBox}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={s.errTxt}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity onPress={onSubmit} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={colors.gradPrimary} style={s.btn}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Sign up</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={s.bottom}>
            <Text style={s.bottomTxt}>Pehle se account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DobPicker open={pickerOpen} onClose={() => setPickerOpen(false)}
        onPick={(d) => { setDob(d); setPickerOpen(false); }} />
    </View>
  );
}

function Field({ icon, right, ...p }) {
  return (
    <View style={s.field}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <TextInput style={s.input} placeholderTextColor={colors.textDim} {...p} />
      {right}
    </View>
  );
}

function DobPicker({ open, onClose, onPick }) {
  const [y, setY] = useState(2005);
  const [m, setM] = useState(1);
  const [d, setD] = useState(1);
  const years = Array.from({ length: 30 }, (_, i) => 2015 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalRoot}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>Select Date of Birth</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Col label="Day" data={days} value={d} onChange={setD} />
            <Col label="Month" data={months} value={m} onChange={setM} />
            <Col label="Year" data={years} value={y} onChange={setY} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <TouchableOpacity style={[s.modalBtn, { backgroundColor: colors.surface }]} onPress={onClose}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPick(new Date(y, m - 1, d))} style={{ flex: 1 }}>
              <LinearGradient colors={colors.gradPrimary} style={s.modalBtn}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Col({ label, data, value, onChange }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={s.colLabel}>{label}</Text>
      <ScrollView style={s.colScroll} showsVerticalScrollIndicator={false}>
        {data.map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)}
            style={[s.colItem, value === n && s.colItemActive]}>
            <Text style={{ color: value === n ? '#fff' : colors.textMuted, fontWeight: value === n ? '700' : '400' }}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.2 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 6, marginBottom: 26 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14, height: 54 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,107,107,0.12)', borderRadius: 10, padding: 10, marginBottom: 12 },
  errTxt: { color: colors.danger, fontSize: 13, flex: 1 },
  btn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: colors.primaryLight, fontSize: 13, fontWeight: '600' },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  bottomTxt: { color: colors.textMuted, fontSize: 13 },
  modalRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.bgAlt, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, borderTopWidth: 1, borderColor: colors.border },
  modalTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  modalBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  colLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 6, textAlign: 'center' },
  colScroll: { height: 160, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  colItem: { paddingVertical: 10, alignItems: 'center' },
  colItemActive: { backgroundColor: colors.primary },
});
