import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/global';

interface Props {
  appName?: string;
  version?: string;
  copyrightYear?: string;
}

export const HeaderInfo: React.FC<Props> = ({ 
  appName = 'AI Translator',
  version = '1.0.0',
  copyrightYear = '2025'
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {appName} v{version} © {copyrightYear}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'center'
  },
  text: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500'
  }
});