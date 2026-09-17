import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shake = useRef(new Animated.Value(0)).current;

  const shakeIt = () => Animated.sequence([
    Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const onSubmit = async () => {
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Valid email daalo'); shakeIt(); return; }
    if (password.length < 6) { setError('Password 6+ characters'); shakeIt(); return; }
    setLoading(true);
    try { await login(email, password); }
    catch (e) { setError(e.message); shakeIt(); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradDark} style={StyleSheet.absoluteFill} />
      <View style={[s.blob, { backgroundColor: colors.primary, top: -80, left: -100 }]} />
      <View style={[s.blob, { backgroundColor: colors.accent, bottom: -120, right: -100 }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.logoWrap}>
            <LinearGradient colors={colors.gradPrimary} style={s.logo}>
              <Ionicons name="book" size={34} color="#fff" />
            </LinearGradient>
            <Text style={s.brand}>StudyCare</Text>
            <Text style={s.tag}>Padho. Badho. Jeeto.</Text>
          </View>

          <Animated.View style={[s.card, { transform: [{ translateX: shake }] }]}>
            <Text style={s.title}>Welcome back 👋</Text>
            <Text style={s.sub}>Login karo aur padhai continue karo</Text>

            <Field icon="mail-outline" placeholder="Email" value={email}
              onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Field icon="lock-closed-outline" placeholder="Password" value={password}
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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: 18 }}>
              <Text style={s.link}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSubmit} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={colors.gradPrimary} style={s.btn}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Login</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={s.bottom}>
              <Text style={s.bottomTxt}>Naya user? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={s.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 60 },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 160, opacity: 0.22 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  brand: { color: '#fff', fontSize: 30, fontWeight: '800' },
  tag: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  card: { backgroundColor: colors.glass, borderRadius: 26, padding: 24, borderWidth: 1, borderColor: colors.glassBorder },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4, marginBottom: 22 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14, height: 54 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,107,107,0.12)', borderRadius: 10, padding: 10, marginBottom: 12 },
  errTxt: { color: colors.danger, fontSize: 13, flex: 1 },
  btn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: colors.primaryLight, fontSize: 13, fontWeight: '600' },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  bottomTxt: { color: colors.textMuted, fontSize: 13 },
});
