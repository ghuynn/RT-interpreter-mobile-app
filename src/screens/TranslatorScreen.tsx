import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Vibration,
  Keyboard,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { CircleX, ArrowLeftRight, Settings } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTranslation } from '../api';
import * as Speech from 'expo-speech';
import { ENV } from '../config/env';

import { LanguageSelector } from '../components/LanguageSelector';
import { TranslationInput } from '../components/TranslationInput';
import { HeaderInfo } from '../components/HeaderInfo';
import SettingsScreen, { AppSettings } from './SettingsScreen';
import { globalStyles, colors } from '../styles/global';
import { getTargetLanguage } from '../config';
import { APP_INFO } from '../config/appInfo';

const LANGUAGE_CODES: { [key: string]: string } = {
  'en': 'en-US', 'vi': 'vi-VN', 'fi': 'fi-FI', 'sv': 'sv-SE', 'no': 'no-NO',
  'da': 'da-DK', 'is': 'is-IS', 'de': 'de-DE', 'fr': 'fr-FR', 'es': 'es-ES',
  'it': 'it-IT', 'pt': 'pt-PT', 'nl': 'nl-NL', 'pl': 'pl-PL', 'cs': 'cs-CZ',
  'sk': 'sk-SK', 'ru': 'ru-RU', 'uk': 'uk-UA', 'bg': 'bg-BG', 'ro': 'ro-RO',
  'hu': 'hu-HU', 'hr': 'hr-HR', 'sr': 'sr-RS', 'sl': 'sl-SI', 'lt': 'lt-LT',
  'lv': 'lv-LV', 'et': 'et-EE', 'tr': 'tr-TR', 'el': 'el-GR', 'ca': 'ca-ES',
  'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR', 'th': 'th-TH', 'id': 'id-ID',
  'ms': 'ms-MY', 'tl': 'tl-PH', 'hi': 'hi-IN', 'bn': 'bn-BD', 'ur': 'ur-PK',
  'ta': 'ta-IN', 'te': 'te-IN', 'ar': 'ar-SA', 'he': 'he-IL', 'fa': 'fa-IR',
  'af': 'af-ZA', 'sw': 'sw-KE', 'zu': 'zu-ZA', 'am': 'am-ET',
};

export default function TranslatorScreen() {
  const languages = [
    { code: 'auto', name: 'Auto detect', flag: '🌐' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sr', name: 'Српски', flag: '🇷🇸' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
    { code: 'et', name: 'Eesti', flag: '🇪🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'ca', name: 'Català', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  ];

  const defaultTarget = getTargetLanguage();
  const [targetLang, setTargetLang] = useState(defaultTarget);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [sourceLang, setSourceLang] = useState<'auto' | string>('auto');
  const [translated, setTranslated] = useState('');
  const [manualText, setManualText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').width));
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
        setAutoSpeak(JSON.parse(saved).autoSpeak);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setAutoSpeak(newSettings.autoSpeak);
  };

  const openSettings = () => {
    setShowSettings(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSettings(false);
    });
  };

  function handleSwapLanguages() {
    if (sourceLang === 'auto') {
      return;
    }

    const tempSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempSource);

    if (translated && manualText) {
      const tempText = manualText;
      setManualText(translated);
      setTranslated(tempText);
    }

    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  }

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
        const sourceLanguage = sourceLang === 'auto' ? 'vi' : sourceLang;
        const targetLanguage = targetLang;

        const messages = [
          {
            role: 'system',
            content: `You are a helpful assistant that translates text. Translate the text from ${sourceLanguage} to ${targetLanguage}.
            Maintain accuracy, tone, politeness, nuance, and coherence.
            Make the translation sound natural to a native speaker.
            Return only the translated text.`
          },
          { role: 'user', content: manualText.trim() }
        ];

        const controller = new AbortController();
        const timeoutId2 = setTimeout(() => controller.abort(), 15000);

        try {
          const res = await fetch(`${ENV.OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ENV.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: messages,
              temperature: 0.7,
              max_tokens: 150
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId2);

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Unable to complete translation: ${res.status} - ${errorText}`);
          }

          const data = await res.json();
          out = data?.choices?.[0]?.message?.content?.trim() || '';
        } catch (error: any) {
          clearTimeout(timeoutId2);
          if (error.name === 'AbortError') {
            throw new Error('Translation request timed out after 15 seconds.');
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

      // ============================================
      // FIXED: Save based on settings (ONLY ONE)
      // ============================================
      if (settings?.historySaveMode !== 'none') {
        const translation = {
          originalText: manualText.trim(),
          translatedText: out,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          translationMethod: 'manual',
          userId: 'anonymous',
          timestamp: new Date().toISOString(),
          saveMode: settings?.historySaveMode || 'online',
        };

        if (settings?.historySaveMode === 'local') {
          // Save ONLY to local storage
          try {
            const existingHistory = await AsyncStorage.getItem('translationHistory');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.push(translation);
            await AsyncStorage.setItem('translationHistory', JSON.stringify(history));
            console.log('Saved to LOCAL storage only');
          } catch (error) {
            console.error('Error saving to local:', error);
          }
        }
        else if (settings?.historySaveMode === 'online') {
          // Save ONLY to online DB
          try {
            await saveTranslation({
              originalText: manualText.trim(),
              translatedText: out,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
              translationMethod: 'manual',
              userId: 'anonymous'
            });
            console.log('Saved to ONLINE database only');
          } catch (error) {
            console.error('Error saving to online:', error);
          }
        }
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.error(e);
      setTranslated('An error occured during translation. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }

  async function speak(textToSpeak?: string) {
    const text = textToSpeak || translated;
    if (!text) return;

    if (text.includes('error') || text.includes('Error') || text.includes('failed')) {
      console.log('Skipping speech output due to an error.');
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
          console.error('Speech output error:', e);
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
      console.error('Error stopping speech output:', e);
    }
  }

  function onVoiceInputStart() {
    console.log('Voice capture initiated.');
    setIsRecording(true);
  }

  function onVoiceInputStop() {
    console.log('Stopped listening.');
    setIsRecording(false);
  }

  const isError = translated.includes('error') || translated.includes('Error') || translated.includes('failed');

  return (
    <View style={{ flex: 1 }}>
      <HeaderInfo
        appName={APP_INFO.name}
        version={APP_INFO.version}
        copyrightYear={APP_INFO.copyrightYear}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View>
          <View style={styles.languageRow}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleSwapLanguages}
                style={[
                  styles.swapButton,
                  sourceLang === 'auto' && styles.swapButtonDisabled
                ]}
                disabled={sourceLang === 'auto'}
                activeOpacity={0.7}
              >
                <ArrowLeftRight
                  size={16}
                  color={sourceLang === 'auto' ? '#999' : '#1995AD'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={openSettings}
              >
                <Settings size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <LanguageSelector
            title="From Language"
            languages={languages}
            selectedLanguage={sourceLang}
            onLanguageSelect={setSourceLang}
          />
        </View>

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
          onVoiceInputStart={onVoiceInputStart}
          onVoiceInputStop={onVoiceInputStop}
          isRecording={isRecording}
        />

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
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="none"
        onRequestClose={closeSettings}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={closeSettings}
          />
          <Animated.View
            style={[
              styles.settingsPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <SettingsScreen
              onClose={closeSettings}
              onSettingsChange={handleSettingsChange}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  swapButton: {
    width: 32,
    height: 32,
    padding: 6,
    backgroundColor: '#A1D6E2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  swapButtonDisabled: {
    backgroundColor: '#F1F1F2',
    opacity: 0.5,
  },
  menuButton: {
    width: 32,
    height: 32,
    padding: 6,
    backgroundColor: '#F1F1F2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouch: {
    flex: 1,
  },
  settingsPanel: {
    flex: 1,
    width: '75%',
    backgroundColor: colors.background,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});