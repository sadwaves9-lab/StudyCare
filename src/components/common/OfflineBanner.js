import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn } from '../animations';
import colors from '../../theme/colors';

export default function OfflineBanner({ lastSync }) {
  const ago = lastSync ? timeAgo(lastSync) : null;

  return (
    <FadeIn>
      <View style={s.wrap}>
        <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
        <Text style={s.txt}>
          Offline mode {ago ? `• Last sync ${ago}` : ''}
        </Text>
      </View>
    </FadeIn>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.warning + '30',
  },
  txt: { flex: 1, color: colors.warning, fontSize: 12, fontWeight: '600' },
});
