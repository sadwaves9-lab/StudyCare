import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeIn, ScaleIn } from '../animations';
import colors from '../../theme/colors';

export default function EmptyState({
  icon = 'document-outline',
  title = 'Kuch nahi mila',
  subtitle = '',
  hint = '',
  gradient = colors.gradPrimary,
}) {
  return (
    <View style={s.wrap}>
      <ScaleIn delay={100}>
        <LinearGradient
          colors={[gradient[0] + '35', gradient[1] + '10']}
          style={s.circle}
        >
          <LinearGradient
            colors={gradient}
            style={s.innerCircle}
          >
            <Ionicons name={icon} size={44} color="#fff" />
          </LinearGradient>
        </LinearGradient>
      </ScaleIn>

      <FadeIn delay={300}>
        <Text style={s.title}>{title}</Text>
      </FadeIn>

      {subtitle ? (
        <FadeIn delay={400}>
          <Text style={s.subtitle}>{subtitle}</Text>
        </FadeIn>
      ) : null}

      {hint ? (
        <FadeIn delay={500}>
          <View style={s.hintBox}>
            <Ionicons name="bulb-outline" size={14} color={colors.warning} />
            <Text style={s.hint}>{hint}</Text>
          </View>
        </FadeIn>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  circle: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 22,
  },
  innerCircle: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    color: '#fff', fontSize: 18, fontWeight: '800',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted, fontSize: 13,
    textAlign: 'center', lineHeight: 20, marginBottom: 14,
  },
  hintBox: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, borderColor: colors.warning + '30',
  },
  hint: { color: colors.warning, fontSize: 11, fontStyle: 'italic', fontWeight: '600' },
});
