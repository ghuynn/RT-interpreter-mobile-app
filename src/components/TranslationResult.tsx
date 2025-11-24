import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

interface Props {
  translatedText: string;
  targetLanguageName: string;
}

export const TranslationResult: React.FC<Props> = ({
  translatedText,
  targetLanguageName
}) => {
  return (
    <View style={globalStyles.resultCard}>
      <Text style={globalStyles.resultLabel}>
        Translation results ({targetLanguageName})
      </Text>
      <Text style={globalStyles.resultText}>
        {translatedText || 'Chưa có kết quả dịch...'}
      </Text>
    </View>
  );
};