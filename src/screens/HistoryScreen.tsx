import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2, Download, MoreVertical } from 'lucide-react-native';
import { getTranslationHistory, deleteTranslation } from '../api';
import { HeaderInfo } from '../components/HeaderInfo';
import { globalStyles, colors } from '../styles/global';
import * as Speech from 'expo-speech';
import { APP_INFO } from '../config/appInfo';

interface HistoryItem {
  _id?: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
  saveMode?: 'online' | 'local';
}

export default function HistoryScreen() {
  const [translationHistory, setTranslationHistory] = useState<HistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadTranslationHistory();
  }, []);

  async function loadTranslationHistory() {
    try {
      setIsRefreshing(true);
      const combinedHistory: HistoryItem[] = [];

      try {
        const localData = await AsyncStorage.getItem('translationHistory');
        if (localData) {
          const localHistory = JSON.parse(localData);
          combinedHistory.push(
            ...localHistory.map((item: any) => ({
              ...item,
              saveMode: item.saveMode || 'local',
              _id: item._id || `local_${item.timestamp}`,
            }))
          );
        }
      } catch (error) {
        console.error('Error loading local history:', error);
      }

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 8000)
        );

        const response = await Promise.race([
          getTranslationHistory('anonymous', 50, 1),
          timeoutPromise
        ]) as any;

        if (response && response.success !== false && response.data && Array.isArray(response.data)) {
          response.data.forEach((item: any) => {
            combinedHistory.push({
              originalText: item.originalText || '',
              translatedText: item.translatedText || '',
              sourceLanguage: item.sourceLanguage || '',
              targetLanguage: item.targetLanguage || '',
              timestamp: item.timestamp || new Date().toISOString(),
              _id: item._id,
              saveMode: 'online',
            });
          });
        }
      } catch (error) {
        console.warn('Could not load online history, showing local only:', error);
      }

      combinedHistory.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setTranslationHistory(combinedHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
      setTranslationHistory([]);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }

  const handleSpeakFromHistory = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.0
    });
  };

  const handleExportSingleChat = async (item: HistoryItem, format: 'txt' | 'csv') => {
    setExporting(true);
    try {
      let content = '';

      if (format === 'csv') {
        content = 'Original Text,Translated Text,Source Language,Target Language,Date/Time\n';
        const date = new Date(item.timestamp).toLocaleString();
        const escapedOriginal = `"${item.originalText.replace(/"/g, '""')}"`;
        const escapedTranslated = `"${item.translatedText.replace(/"/g, '""')}"`;
        content += `${escapedOriginal},${escapedTranslated},${item.sourceLanguage},${item.targetLanguage},"${date}"\n`;
      } else {
        const date = new Date(item.timestamp).toLocaleString();
        content = `=== TRANSLATION ===\n\n`;
        content += `Date: ${date}\n`;
        content += `From: ${item.sourceLanguage.toUpperCase()}\n`;
        content += `To: ${item.targetLanguage.toUpperCase()}\n\n`;
        content += `Original:\n${item.originalText}\n\n`;
        content += `Translation:\n${item.translatedText}\n`;
      }

      const filename = `translation_${new Date().toISOString().split('T')[0]}.${format}`;

      await Share.share({
        message: content,
        title: `Export Translation as ${format.toUpperCase()}`,
        filename: filename,
      });

      Alert.alert('Success', 'Translation exported successfully');
    } catch (error) {
      console.error('Error exporting:', error);
      Alert.alert('Error', 'Failed to export translation');
    } finally {
      setExporting(false);
      setMenuOpen(null);
    }
  };

  const handleExportAllHistory = async (format: 'txt' | 'csv') => {
    setExporting(true);
    try {
      if (translationHistory.length === 0) {
        Alert.alert('No History', 'No translations to export');
        setExporting(false);
        return;
      }

      let content = '';

      if (format === 'csv') {
        content = 'Original Text,Translated Text,Source Language,Target Language,Date/Time\n';
        translationHistory.forEach((item: any) => {
          const escapedOriginal = `"${item.originalText.replace(/"/g, '""')}"`;
          const escapedTranslated = `"${item.translatedText.replace(/"/g, '""')}"`;
          const date = new Date(item.timestamp).toLocaleString();
          content += `${escapedOriginal},${escapedTranslated},${item.sourceLanguage},${item.targetLanguage},"${date}"\n`;
        });
      } else {
        content = '=== TRANSLATION HISTORY ===\n\n';
        translationHistory.forEach((item: any, index: number) => {
          const date = new Date(item.timestamp).toLocaleString();
          content += `[${index + 1}] ${date}\n`;
          content += `From: ${item.sourceLanguage.toUpperCase()}\n`;
          content += `To: ${item.targetLanguage.toUpperCase()}\n`;
          content += `Original: ${item.originalText}\n`;
          content += `Translation: ${item.translatedText}\n`;
          content += '---\n\n';
        });
      }

      const filename = `translations_all_${new Date().toISOString().split('T')[0]}.${format}`;

      await Share.share({
        message: content,
        title: `Export All History as ${format.toUpperCase()}`,
        filename: filename,
      });

      Alert.alert('Success', 'History exported successfully');
    } catch (error) {
      console.error('Error exporting history:', error);
      Alert.alert('Error', 'Failed to export history');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteItem = (index: number, item: HistoryItem) => {
    Alert.alert(
      'Delete Translation',
      'Are you sure you want to delete this translation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(item._id || `local_${item.timestamp}`);
            try {
              const localData = await AsyncStorage.getItem('translationHistory');
              if (localData) {
                let localHistory = JSON.parse(localData);
                localHistory = localHistory.filter(
                  (h: any) => h.timestamp !== item.timestamp
                );
                await AsyncStorage.setItem(
                  'translationHistory',
                  JSON.stringify(localHistory)
                );
              }

              if (item._id && item.saveMode === 'online') {
                try {
                  const timeoutId = setTimeout(() => {
                    console.warn('Online delete timed out');
                  }, 10000);

                  await Promise.race([
                    deleteTranslation(item._id),
                    new Promise((_, reject) =>
                      setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                  ]);
                  clearTimeout(timeoutId);
                } catch (error) {
                  console.error('Error deleting from online DB:', error);
                }
              }

              const updatedHistory = translationHistory.filter((_, i) => i !== index);
              setTranslationHistory(updatedHistory);

              Alert.alert('Success', 'Translation deleted');
            } catch (error) {
              console.error('Error deleting translation:', error);
              Alert.alert('Error', 'Failed to delete translation');
            } finally {
              setDeleting(null);
              setMenuOpen(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <HeaderInfo
          appName={APP_INFO.name}
          version={APP_INFO.version}
          copyrightYear={APP_INFO.copyrightYear}
        />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderInfo
        appName={APP_INFO.name}
        version={APP_INFO.version}
        copyrightYear={APP_INFO.copyrightYear}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={loadTranslationHistory} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="history" size={28} color={colors.primary} />
              <Text style={styles.headerTitle}>History</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.historyCount}>
                {translationHistory.length}
              </Text>
              {translationHistory.length > 0 && (
                <TouchableOpacity
                  style={styles.exportAllButton}
                  onPress={() => {
                    Alert.alert(
                      'Export All History',
                      'Choose export format',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'CSV',
                          onPress: () => handleExportAllHistory('csv'),
                        },
                        {
                          text: 'TXT',
                          onPress: () => handleExportAllHistory('txt'),
                        },
                      ]
                    );
                  }}
                  disabled={exporting}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#1995AD" />
                  ) : (
                    <Download size={20} color="#1995AD" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {translationHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No translations yet</Text>
              <Text style={styles.emptySubtext}>
                Your translations will appear here
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {translationHistory.map((item, index) => (
                <View key={item._id || index} style={styles.historyCard}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardLanguages}>
                        {item.sourceLanguage.toUpperCase()} → {item.targetLanguage.toUpperCase()}
                      </Text>
                      <View style={styles.badgesRow}>
                        {item.saveMode && (
                          <View
                            style={[
                              styles.saveBadge,
                              item.saveMode === 'online'
                                ? styles.onlineBadge
                                : styles.localBadge,
                            ]}
                          >
                            <Text style={styles.badgeText}>
                              {item.saveMode === 'online' ? 'Online' : 'Local'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={styles.originalText} numberOfLines={2}>
                      {item.originalText}
                    </Text>
                    <Text style={styles.translatedText} numberOfLines={2}>
                      {item.translatedText}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={() => handleSpeakFromHistory(item.translatedText)}
                      style={styles.actionButton}
                    >
                      <Feather name="volume-2" size={18} color={colors.primary} />
                    </TouchableOpacity>

                    <View style={styles.menuWrapper}>
                      <TouchableOpacity
                        onPress={() => setMenuOpen(menuOpen === (item._id || `local_${item.timestamp}`) ? null : (item._id || `local_${item.timestamp}`))}
                        style={styles.actionButton}
                      >
                        <MoreVertical size={18} color={colors.primary} />
                      </TouchableOpacity>

                      {menuOpen === (item._id || `local_${item.timestamp}`) && (
                        <>
                          <TouchableOpacity
                            style={styles.menuBackdrop}
                            activeOpacity={1}
                            onPress={() => setMenuOpen(null)}
                          />
                          <View style={styles.actionMenu}>
                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={() => handleExportSingleChat(item, 'csv')}
                            >
                              <Download size={16} color="#1995AD" />
                              <Text style={styles.menuItemText}>CSV</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={() => handleExportSingleChat(item, 'txt')}
                            >
                              <Download size={16} color="#1995AD" />
                              <Text style={styles.menuItemText}>TXT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.menuItem, styles.menuItemLast]}
                              onPress={() => handleDeleteItem(index, item)}
                              disabled={deleting === (item._id || `local_${item.timestamp}`)}
                            >
                              {deleting === (item._id || `local_${item.timestamp}`) ? (
                                <ActivityIndicator size="small" color="#EF4444" />
                              ) : (
                                <Trash2 size={16} color="#EF4444" />
                              )}
                              <Text style={styles.menuItemTextDanger}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  historyCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: '#A1D6E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exportAllButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 104, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'visible',
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLanguages: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  onlineBadge: {
    backgroundColor: 'rgba(33, 128, 141, 0.1)',
    borderColor: '#2180D5',
  },
  localBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  originalText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  translatedText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 104, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuWrapper: {
    position: 'relative',
  },
  menuBackdrop: {
    position: 'absolute',
    top: -500,
    left: -500,
    width: 1000,
    height: 1000,
    zIndex: 40,
  },
  actionMenu: {
    position: 'absolute',
    right: 44,
    top: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: 130,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  menuItemTextDanger: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});
