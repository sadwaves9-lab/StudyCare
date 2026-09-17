import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const onLogout = () => Alert.alert('Logout?', 'Pakka logout karna hai?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: logout },
  ]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradPrimary} style={s.card}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{user?.name || 'Student'}</Text>
          <Text style={s.email}>{user?.email}</Text>
        </LinearGradient>

        <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
          <Text style={s.rowTxt}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[s.rowTxt, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  card: { borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { color: '#fff', fontSize: 30, fontWeight: '800' },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  rowTxt: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
});
