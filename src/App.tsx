import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  Vibration,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { CircleX } from 'lucide-react-native';
import { initErrorLogging } from './setupErrorLogging';
import { getTargetLanguage } from './config';
import { saveTranslation, getTranslationHistory } from './api';
import * as Speech from 'expo-speech';

// Import components
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationInput } from './components/TranslationInput';
import { TranslationResult } from './components/TranslationResult';
import { TranslationHistory } from './components/TranslationHistory';

// Import types
import { Language, TranslationHistory as TranslationHistoryType } from './types/translation.types';

// Import global styles
import { globalStyles, colors } from './styles/global';

// Language code mapping for proper speech pronunciation
const LANGUAGE_CODES: { [key: string]: string } = {
  'en': 'en-US',
  'vi': 'vi-VN',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'th': 'th-TH',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'es': 'es-ES',
  'it': 'it-IT',
  'pt': 'pt-PT',
  'ru': 'ru-RU',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'id': 'id-ID',
  'fi': 'fi-FI',
  'sv': 'sv-SE',
  'no': 'no-NO',
  'da': 'da-DK',
  'tr': 'tr-TR',
  'pl': 'pl-PL',
  'nl': 'nl-NL',
  'cs': 'cs-CZ',
  'sk': 'sk-SK',
  'ms': 'ms-MY',
  'tl': 'tl-PH',
};

export default function App() {
  useEffect(() => {
    initErrorLogging();
  }, []);

  // Reordered languages: Vietnamese, English, Nordic, then others by region
  const languages = [
    { code: 'auto', name: 'Auto detect', flag: '🌐' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    // Nordic countries
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    // Western Europe
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    // Eastern Europe
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    // Middle East & Turkey
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    // East Asia
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    // South/Southeast Asia
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' }
  ];

  const defaultTarget = getTargetLanguage();
  const [targetLang, setTargetLang] = useState(defaultTarget);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [sourceLang, setSourceLang] = useState<'auto' | string>('auto');
  const [translated, setTranslated] = useState('');
  const [manualText, setManualText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  async function translateManual() {
    if (!manualText.trim()) return;

    Keyboard.dismiss();
    setIsTranslating(true);
    
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }

    const timeoutId = setTimeout(() => {
      if (isTranslating) {
        setIsTranslating(false);
      }
    }, 30000);

    try {
      let out = '';
      try {
        const OPENAI_API_KEY = 'sk-6aHrjvR1nsJE0E1yOEeiDyIa1wZOmCIGF8zVrFZVAz6KGUqR';
        const OPENAI_BASE_URL = 'https://gpt1.shupremium.com/v1';

        const sourceLanguage = sourceLang === 'auto' ? 'vi' : sourceLang;
        const targetLanguage = targetLang;

        const messages = [
          {
            role: 'system',
            content: `You are a helpful assistant that translates text. Translate from ${sourceLanguage} to ${targetLanguage}.`
          },
          { role: 'user', content: manualText.trim() }
        ];

        const controller = new AbortController();
        const timeoutId2 = setTimeout(() => controller.abort(), 15000);

        try {
          const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: messages,
              temperature: 0.7,
              max_tokens: 150
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId2);

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Translation failed: ${res.status} - ${errorText}`);
          }

          const data = await res.json();
          out = data?.choices?.[0]?.message?.content?.trim() || '';
        } catch (error: any) {
          clearTimeout(timeoutId2);
          if (error.name === 'AbortError') {
            throw new Error('Translation timeout after 15 seconds');
          }
          throw error;
        }
      } catch (te) {
        throw te;
      }
      clearTimeout(timeoutId);

      setTranslated(out);

      if (autoSpeak) {
        await speak(out);
      }

      try {
        await saveTranslation({
          originalText: manualText.trim(),
          translatedText: out,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          translationMethod: 'manual',
          userId: 'anonymous'
        });
        
        if (showHistory) {
          loadTranslationHistory();
        }
      } catch (error) {
        console.error('Failed to save translation:', error);
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.error(e);
      // Changed error message format - removed emoji, added CircleX icon in component
      setTranslated('Translation error. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }

  async function speak(textToSpeak?: string) {
    const text = textToSpeak || translated;
    if (!text) return;
    
    // Don't speak error messages
    if (text.includes('error') || text.includes('Error') || text.includes('failed')) {
      console.log('Skipping speech for error message');
      return;
    }
    
    try {
      const speechLang = LANGUAGE_CODES[targetLang] || targetLang;
      
      const voices = (await Speech.getAvailableVoicesAsync()) || [];
      const match = voices.find((v) =>
        (v.language || '').toLowerCase().startsWith(speechLang.toLowerCase())
      );

      Speech.stop();
      Speech.speak(text, {
        language: match?.language || speechLang,
        voice: match?.identifier,
        rate: 1.0,
        pitch: 1.0,
        onDone: () => {},
        onStopped: () => {},
        onError: (e) => {
          console.error('Speak error', e);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function stopSpeak() {
    try {
      Speech.stop();
    } catch (e) {
      console.error('Stop speak error:', e);
    }
  }

  async function loadTranslationHistory() {
    try {
      const response = await getTranslationHistory('anonymous', 50, 1);
      setTranslationHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
      setTranslationHistory([]);
    }
  }

  function toggleHistory() {
    if (!showHistory) {
      loadTranslationHistory();
    }
    setShowHistory(!showHistory);
  }

  const handleSpeakFromHistory = (text: string) => {
    setTranslated(text);
    speak(text);
  };

  // Check if result contains error
  const isError = translated.includes('error') || translated.includes('Error') || translated.includes('failed');

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <Text style={globalStyles.title}>Text Translator</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          <LanguageSelector
            title="From Language"
            languages={languages}
            selectedLanguage={sourceLang}
            onLanguageSelect={setSourceLang}
          />

          <LanguageSelector
            title="To Language"
            languages={languages}
            selectedLanguage={targetLang}
            onLanguageSelect={setTargetLang}
            excludeAuto={true}
          />

          <TranslationInput
            value={manualText}
            onChangeText={setManualText}
            onTranslate={translateManual}
            onSpeak={() => speak()}
            onStop={stopSpeak}
            isTranslating={isTranslating}
            hasTranslation={!!translated && !isError}
            autoSpeak={autoSpeak}
            onAutoSpeakChange={setAutoSpeak}
          />

          {/* Only show result when there's a translation */}
          {translated && (
            <View style={[globalStyles.resultCard, isError && styles.errorCard]}>
              {isError && (
                <View style={styles.errorIcon}>
                  <CircleX color={colors.error} size={20} />
                </View>
              )}
              <Text style={globalStyles.resultLabel}>
                Translation Result ({languages.find((l) => l.code === targetLang)?.name || targetLang.toUpperCase()})
              </Text>
              <Text style={globalStyles.resultText}>{translated}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={toggleHistory}
            style={[styles.historyToggle, showHistory && styles.historyToggleActive]}
          >
            <MaterialIcons name="history" size={20} color="#374151" />
            <Text style={styles.historyToggleText}>{showHistory ? 'Hide History' : 'Show History'}</Text>
          </TouchableOpacity>

          {showHistory && (
            <View style={globalStyles.cardLarge}>
              <Text style={styles.historySectionTitle}>Translation History</Text>
              <TranslationHistory
                history={translationHistory}
                onSpeak={handleSpeakFromHistory}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  historyToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8
  },
  historyToggleActive: {
    backgroundColor: '#f3f4f6'
  },
  historyToggleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderLeftColor: colors.error
  },
  errorIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  }
});