import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, Keyboard, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initErrorLogging } from './setupErrorLogging';
import { getTargetLanguage } from './config';
import { saveTranslation, getTranslationHistory, TranslationHistory, pingBackend } from './api';
import * as Speech from 'expo-speech';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  constructor(props: any) {
    super(props);
    this.state = { error: undefined };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Đã có lỗi xảy ra</Text>
          <Text selectable>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children as any;
  }
}


export default function App() {
  useEffect(() => {
    initErrorLogging();
  }, []);

  // Danh sách ngôn ngữ đầy đủ
  const languages = [
    { code: 'auto', name: 'Auto detect', flag: '🌐' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sr', name: 'Српски', flag: '🇷🇸' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
    { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'eu', name: 'Euskera', flag: '🇪🇸' },
    { code: 'ca', name: 'Català', flag: '🇪🇸' },
    { code: 'gl', name: 'Galego', flag: '🇪🇸' },
    { code: 'cy', name: 'Cymraeg', flag: '🇬🇧' },
    { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
    { code: 'mt', name: 'Malti', flag: '🇲🇹' },
    { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'et', name: 'Eesti', flag: '🇪🇪' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
    { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
    { code: 'me', name: 'Crnogorski', flag: '🇲🇪' }
  ];

  const defaultTarget = getTargetLanguage();
  const [targetLang, setTargetLang] = useState(defaultTarget);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [sourceLang, setSourceLang] = useState<'auto' | string>('auto');
  const [translated, setTranslated] = useState('');
  const [manualText, setManualText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);


  async function translateManual() {
    if (!manualText.trim()) return;
    
    // Ẩn bàn phím khi bắt đầu dịch
    Keyboard.dismiss();
    
    setIsTranslating(true);
    
    // Timeout sau 30 giây
    const timeoutId = setTimeout(() => {
      if (isTranslating) {
        setIsTranslating(false);
      }
    }, 30000);
    
    try {
      let out = '';
      try {
        // Sử dụng OpenAI-compatible API trực tiếp
        const OPENAI_API_KEY = 'sk-6aHrjvR1nsJE0E1yOEeiDyIa1wZOmCIGF8zVrFZVAz6KGUqR';
        const OPENAI_BASE_URL = 'https://gpt1.shupremium.com/v1';
        
        const sourceLanguage = sourceLang === 'auto' ? 'vi' : sourceLang;
        const targetLanguage = targetLang;
        
        const messages = [
          { role: "system", content: `You are a helpful assistant that translates text. Translate from ${sourceLanguage} to ${targetLanguage}.` },
          { role: "user", content: manualText.trim() }
        ];

        const controller = new AbortController();
        const timeoutId2 = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
          const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: messages,
              temperature: 0.7,
              max_tokens: 150,
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
        await speak();
      }
      
      // Lưu vào lịch sử
      try {
        const result = await saveTranslation({
          originalText: manualText.trim(),
          translatedText: out,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          translationMethod: 'manual'
        });
      } catch (error) {
        // Silent fail for history saving
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  }

  async function speak() {
    if (!translated) return;
    try {
      // Pick a voice matching targetLang if available
      const voices = (await Speech.getAvailableVoicesAsync()) || [];
      const langLower = targetLang.toLowerCase();
      const match = voices.find(v => (v.language || '').toLowerCase().startsWith(langLower));

      Speech.stop();
      Speech.speak(translated, {
        language: match?.language || targetLang,
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


  function forceStopTranslation() {
    setIsTranslating(false);
    // Clear any pending timeouts
    const timeouts = setTimeout(() => {}, 0);
    clearTimeout(timeouts);
  }

  async function loadTranslationHistory() {
    try {
      const response = await getTranslationHistory();
      setTranslationHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  function toggleHistory() {
    if (!showHistory) {
      loadTranslationHistory();
    }
    setShowHistory(!showHistory);
  }

  const languageRow = (
    <View style={[styles.row, { alignItems: 'center' }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>From language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSourceLang(lang.code)}
              style={[
                styles.languageButton,
                sourceLang === lang.code && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageButtonText,
                sourceLang === lang.code && styles.languageButtonTextActive
              ]}>
                {lang.flag} {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const targetLanguageRow = (
    <View style={[styles.row, { alignItems: 'center' }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>to language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
          {languages.filter(lang => lang.code !== 'auto').map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setTargetLang(lang.code)}
              style={[
                styles.languageButton,
                targetLang === lang.code && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageButtonText,
                targetLang === lang.code && styles.languageButtonTextActive
              ]}>
                {lang.flag} {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const settingsRow = (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Switch value={autoSpeak} onValueChange={setAutoSpeak} />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Auto read results</Text>
      </View>
    </View>
  );

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>Interpreting</Text>
        {languageRow}
        {targetLanguageRow}
        {settingsRow}

        <View style={styles.box}>
          <Text style={styles.heading}>Input text for translation</Text>
          <TextInput
            value={manualText}
            onChangeText={setManualText}
            placeholder="Type in text..."
            multiline
            style={styles.input}
          />
          <View style={{ marginTop: 16, flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={translateManual}
              disabled={isTranslating}
              style={[
                styles.actionButton,
                isTranslating && styles.actionButtonDisabled,
                { backgroundColor: isTranslating ? '#94a3b8' : '#3b82f6' }
              ]}
            >
              <Text style={styles.actionButtonText}>
                {isTranslating ? 'Translating...' : 'Translate'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={speak}
              disabled={!translated}
              style={[
                styles.actionButton,
                !translated && styles.actionButtonDisabled,
                { backgroundColor: !translated ? '#94a3b8' : '#10b981' }
              ]}
            >
              <Text style={styles.actionButtonText}>🔊 Read aloud</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={stopSpeak}
              style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
            >
              <Text style={styles.actionButtonText}>⏹️ Stop</Text>
            </TouchableOpacity>
          </View>
          
          {isTranslating && (
            <View style={{ marginTop: 8 }}>
              <Button title="Force Stop Translation" onPress={forceStopTranslation} color="red" />
            </View>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={toggleHistory}
            style={[styles.historyButton, { backgroundColor: showHistory ? '#ef4444' : '#8b5cf6' }]}
          >
            <Text style={styles.historyButtonText}>
              {showHistory ? '📚 Hide history' : '📚 Show history'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.box}>
          <Text style={styles.heading}>Translation results ({languages.find(l => l.code === targetLang)?.name || targetLang.toUpperCase()})</Text>
          <Text style={styles.translatedText}>{translated || 'Translation output is not yet available...'}</Text>
        </ScrollView>
        {showHistory && (
          <ScrollView style={styles.box}>
            <Text style={styles.heading}>Translation History</Text>
            {translationHistory.length === 0 ? (
              <Text>No translations yet</Text>
            ) : (
              translationHistory.map((item) => (
                <View key={item._id} style={styles.historyItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={styles.historyMethod}>
                      ✍️ Manual - {new Date(item.timestamp).toLocaleString()}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Text style={styles.badge}>{(item.sourceLanguage || 'auto').toUpperCase()}</Text>
                      <Text style={styles.badge}>{item.targetLanguage.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.historyOriginal}>{item.originalText}</Text>
                  <Text style={styles.historyTranslated}>{item.translatedText}</Text>
                  <View style={{ marginTop: 6 }}>
                    <Button title="🔈 Speak" onPress={() => {
                      setTranslated(item.translatedText);
                      speak();
                    }} />
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        <StatusBar style="auto" />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 24, 
    textAlign: 'center',
    color: '#1e293b',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  row: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 20 
  },
  box: { 
    backgroundColor: '#ffffff',
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  heading: { 
    fontWeight: '700', 
    marginBottom: 12, 
    fontSize: 16,
    color: '#374151'
  },
  input: { 
    minHeight: 80, 
    borderWidth: 2, 
    borderColor: '#e2e8f0', 
    borderRadius: 12, 
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top'
  },
  langInput: { 
    height: 48, 
    borderWidth: 2, 
    borderColor: '#e2e8f0', 
    borderRadius: 12, 
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc'
  },
  pillRow: { flexDirection: 'row', gap: 12 },
  historyItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  historyMethod: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500'
  },
  historyOriginal: {
    fontSize: 15,
    marginBottom: 8,
    fontStyle: 'italic',
    color: '#475569',
    lineHeight: 20
  },
  historyTranslated: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 20
  },
  badge: {
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600'
  },
  languageScroll: {
    marginTop: 12
  },
  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  languageButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  languageButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center'
  },
  languageButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700'
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  actionButtonDisabled: {
    opacity: 0.6
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  },
  historyButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  }
});
