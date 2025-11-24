import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onTranslate: () => void;
  onSpeak: () => void;
  onStop: () => void;
  isTranslating: boolean;
  hasTranslation: boolean;
  autoSpeak: boolean;
  onAutoSpeakChange: (value: boolean) => void;
}

export const TranslationInput: React.FC<Props> = ({
  value,
  onChangeText,
  onTranslate,
  onSpeak,
  onStop,
  isTranslating,
  hasTranslation,
  autoSpeak,
  onAutoSpeakChange
}) => {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.inputLabel}>Enter text to translate</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter text here..."
        placeholderTextColor="#94a3b8"
        multiline
        style={globalStyles.input}
      />
      <View style={globalStyles.buttonGroup}>
        <TouchableOpacity
          onPress={onTranslate}
          disabled={isTranslating || !value.trim()}
          style={[
            globalStyles.iconBtn,
            (isTranslating || !value.trim()) && globalStyles.iconBtnDisabled
          ]}
        >
          <MaterialIcons name="translate" size={24} color="#334155" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSpeak}
          disabled={!hasTranslation}
          style={[
            globalStyles.iconBtn,
            !hasTranslation && globalStyles.iconBtnDisabled
          ]}
        >
          <MaterialIcons name="volume-up" size={24} color="#334155" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStop}
          style={[globalStyles.iconBtn, globalStyles.stopBtn]}
        >
          <MaterialIcons name="stop-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={globalStyles.toggleContainer}>
        <Switch
          value={autoSpeak}
          onValueChange={onAutoSpeakChange}
          trackColor={{ false: '#cbd5e1', true: '#10b981' }}
          thumbColor={autoSpeak ? '#ffffff' : '#f1f5f9'}
        />
        <Text style={globalStyles.toggleText}>Automatically read the translated output.</Text>
      </View>
    </View>
  );
};