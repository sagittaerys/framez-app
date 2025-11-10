import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'bold' | 'semibold';
}

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'bold' && styles.bold,
        type === 'semibold' && styles.semibold,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontFamily: 'Sora_700Bold',
    fontSize: 32,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    color: '#666',
  },
  bold: {
    fontFamily: 'Sora_700Bold',
  },
  semibold: {
    fontFamily: 'Sora_600SemiBold',
  },
});