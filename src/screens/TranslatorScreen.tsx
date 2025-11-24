import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Vibration,
  Keyboard
} from 'react-native';
import { CircleX } from 'lucide-react-native';
import { saveTranslation } from '../api';
import * as Speech from 'expo-speech';
import { ENV } from '../config/env';

import { LanguageSelector } from '../components/LanguageSelector';
import { TranslationInput } from '../components/TranslationInput';
import { HeaderInfo } from '../components/HeaderInfo';
import { globalStyles, colors } from '../styles/global';
import { getTargetLanguage } from '../config';
import { APP_INFO } from '../config/appInfo';

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

export default function TranslatorScreen() {
  const languages = [
    { code: 'auto', name: 'Auto detect', flag: '🌐' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
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
  const [isRecording, setIsRecording] = useState(false);

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

      try {
        await saveTranslation({
          originalText: manualText.trim(),
          translatedText: out,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          translationMethod: 'manual',
          userId: 'anonymous'
        });
      } catch (error) {
        console.error('Unable to save translation:', error);
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