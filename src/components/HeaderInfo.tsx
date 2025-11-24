import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/global';
import { APP_INFO } from '../config/appInfo';

interface Props {
  appName?: string;
  version?: string;
  copyrightYear?: string;
}

export const HeaderInfo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {APP_INFO.name} v{APP_INFO.version} © {APP_INFO.copyrightYear} by {APP_INFO.author}
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