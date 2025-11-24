import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TranslationHistory } from '../types/translation.types';
import { globalStyles } from '../styles/global';

interface Props {
  item: TranslationHistory;
  onSpeak: (text: string) => void;
}

export const HistoryItem: React.FC<Props> = ({ item, onSpeak }) => {
  return (
    <View style={globalStyles.historyItem}>
      <View style={globalStyles.historyMeta}>
        <Text style={globalStyles.historyMethod}>
          {item.translationMethod === 'manual' ? 'Manual' : 'Voice'} • {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <View style={globalStyles.badgeContainer}>
          <View style={globalStyles.badge}>
            <Text style={globalStyles.badgeText}>
              {(item.sourceLanguage || 'AUTO').toUpperCase()}
            </Text>
          </View>
          <Text style={globalStyles.badgeArrow}>→</Text>
          <View style={globalStyles.badge}>
            <Text style={globalStyles.badgeText}>
              {item.targetLanguage.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={globalStyles.historyOriginal}>{item.originalText}</Text>
      <Text style={globalStyles.historyTranslated}>{item.translatedText}</Text>
      <TouchableOpacity
        style={globalStyles.speakButton}
        onPress={() => onSpeak(item.translatedText)}
      >
        <MaterialIcons name="volume-up" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};