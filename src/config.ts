import Constants from 'expo-constants';

export function getTargetLanguage(): string {
  const envLang = (Constants.expoConfig?.extra as any)?.targetLang || process.env.EXPO_PUBLIC_TARGET_LANG;
  return (envLang || 'en').toLowerCase();
}



