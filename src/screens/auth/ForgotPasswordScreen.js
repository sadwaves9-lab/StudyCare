import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const next = async () => {
    setError('');
    if (step === 1) {
      if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Valid email');
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      setLoading(false);
      setStep(2);
      return;
    }
    if (step === 2) {
      if (otp.length !== 6) return setError('6-digit OTP');
      setStep(3);
      return;
    }
    if (newPass.length < 6) return setError('Password 6+ chars');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    Alert.alert('Ho gaya ✅', 'Password reset successful');
    navigation.replace('Login');
  };

  const titles = ['Forgot password?', 'Verify OTP', 'Set new password'];
  const subs = ['Email daalo, hum OTP bhejenge', `Code bheja ${email} pe`, 'Naya password set karo'];

  return (
    <View style={s.root}>
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <LinearGradient colors={colors.gradAccent} style={s.icon}>
            <Ionicons name="key" size={30} color="#fff" />
          </LinearGradient>

          <Text style={s.title}>{titles[step - 1]}</Text>
          <Text style={s.sub}>{subs[step - 1]}</Text>

          {step === 1 && <Field icon="mail-outline" placeholder="Email" value={email}
            onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />}
          {step === 2 && <Field icon="shield-checkmark-outline" placeholder="6-digit OTP"
            value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} />}
          {step === 3 && <Field icon="lock-closed-outline" placeholder="New password"
            value={newPass} onChangeText={setNewPass} secureTextEntry />}

          {error ? (
            <View style={s.errBox}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={s.errTxt}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity onPress={next} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={colors.gradPrimary} style={s.btn}>
              {loading ? <ActivityIndicator color="#fff" /> :
                <Text style={s.btnTxt}>{step === 3 ? 'Reset password' : 'Continue'}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ icon, ...p }) {
  return (
    <View style={s.field}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <TextInput style={s.input} placeholderTextColor={colors.textDim} {...p} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingTop: 60 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 30, borderWidth: 1, borderColor: colors.border },
  icon: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 6, marginBottom: 26 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14, height: 54 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,107,107,0.12)', borderRadius: 10, padding: 10, marginBottom: 12 },
  errTxt: { color: colors.danger, fontSize: 13, flex: 1 },
  btn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
