export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationHistory {
  _id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translationMethod: 'voice' | 'manual';
  timestamp: string;
  userId: string;
}

export interface TranslationRequest {
  originalText: string;
  translatedText: string;
  sourceLanguage?: string;
  targetLanguage: string;
  translationMethod: 'voice' | 'manual';
  userId?: string;
}