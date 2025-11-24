import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TranslationHistory as TranslationHistoryType } from '../types/translation.types';
import { HistoryItem } from './HistoryItem';
import { globalStyles } from '../styles/global';

interface Props {
  history: TranslationHistoryType[];
  onSpeak: (text: string) => void;
}

export const TranslationHistory: React.FC<Props> = ({ history, onSpeak }) => {
  if (history.length === 0) {
    return (
      <View style={globalStyles.emptyState}>
        <MaterialIcons name="history" size={40} color="#64748b" />
        <Text style={globalStyles.emptyStateText}>No translation history</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      renderItem={({ item }) => <HistoryItem item={item} onSpeak={onSpeak} />}
      keyExtractor={(item) => item._id}
      scrollEnabled={true}
      nestedScrollEnabled={false}
      style={styles.historyList}
      contentContainerStyle={styles.historyListContent}
    />
  );
};

const styles = StyleSheet.create({
  historyList: {
    maxHeight: 500
  },
  historyListContent: {
    paddingBottom: 10
  }
});