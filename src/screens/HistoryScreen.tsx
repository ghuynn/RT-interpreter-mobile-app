import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getTranslationHistory } from '../api';
import { TranslationHistory } from '../components/TranslationHistory';
import { HeaderInfo } from '../components/HeaderInfo';
import { TranslationHistory as TranslationHistoryType } from '../types/translation.types';
import { globalStyles, colors } from '../styles/global';
import * as Speech from 'expo-speech';
import { APP_INFO } from '../config/appInfo';

export default function HistoryScreen() {
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTranslationHistory();
  }, []);

  async function loadTranslationHistory() {
    try {
      setIsRefreshing(true);
      const response = await getTranslationHistory('anonymous', 50, 1);
      
      if (response.success === false || !response.data) {
        console.log('Historical data is unavailable.');
        setTranslationHistory([]);
        return;
      }
      
      setTranslationHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
      setTranslationHistory([]);
    } finally {
      setIsRefreshing(false);
    }
  }

  const handleSpeakFromHistory = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderInfo 
        appName={APP_INFO.name} 
        version={APP_INFO.version} 
        copyrightYear={APP_INFO.copyrightYear} 
      />
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={loadTranslationHistory} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialIcons name="history" size={28} color={colors.primary} />
            <Text style={styles.headerTitle}>History</Text>
          </View>
          
          <TranslationHistory
            history={translationHistory}
            onSpeak={handleSpeakFromHistory}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text
  }
});