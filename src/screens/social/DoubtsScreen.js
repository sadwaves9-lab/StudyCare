import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

const DUMMY = [
  { id: 'd1', user: 'Rohit', text: 'Newton ka second law kaise derive karte hain?', answers: 3, time: '2h ago' },
  { id: 'd2', user: 'Priya', text: 'Integration by parts kab use karein?', answers: 5, time: '5h ago' },
  { id: 'd3', user: 'Aman', text: 'Mole concept me Avogadro number kaise yaad rakhein?', answers: 2, time: '1d ago' },
];

export default function DoubtsScreen({ navigation }) {
  const { user } = useAuth();
  const [list, setList] = useState(DUMMY);
  const [text, setText] = useState('');

  const post = () => {
    if (!text.trim()) return;
    const d = {
      id: 'd_' + Date.now(),
      user: user?.name || 'You',
      text: text.trim(),
      answers: 0,
      time: 'now',
    };
    setList([d, ...list]);
    setText('');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.head}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.title}>Doubts 💭</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={list}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 20, paddingTop: 0 }}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.row}>
                <View style={s.avatar}>
                  <Text style={s.avatarTxt}>{(item.user || 'U')[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.user}>{item.user}</Text>
                  <Text style={s.time}>{item.time}</Text>
                </View>
                <View style={s.badge}>
                  <Ionicons name="chatbubble-outline" size={12} color={colors.accent} />
                  <Text style={s.badgeTxt}>{item.answers}</Text>
                </View>
              </View>
              <Text style={s.body}>{item.text}</Text>
            </View>
          )}
        />

        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder="Apna doubt pucho..."
            placeholderTextColor={colors.textDim}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity onPress={post} style={s.sendBtn} disabled={!text.trim()}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: colors.primary, fontWeight: '800' },
  user: { color: '#fff', fontSize: 14, fontWeight: '700' },
  time: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  badge: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: colors.accent + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  inputBar: { flexDirection: 'row', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgAlt, alignItems: 'flex-end' },
  input: { flex: 1, color: '#fff', backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100, borderWidth: 1, borderColor: colors.border, fontSize: 14 },
  sendBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
