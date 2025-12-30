import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Trash2, Settings } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, globalStyles } from '../styles/global';
import { deleteAllHistory } from '../api';

interface SettingsScreenProps {
  onClose: () => void;
  onSettingsChange: (settings: AppSettings) => void;
}

export interface AppSettings {
  historySaveMode: 'online' | 'local' | 'none';
  autoSpeak: boolean;
  defaultSourceLang: string;
  defaultTargetLang: string;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  historySaveMode: 'online',
  autoSpeak: true,
  defaultSourceLang: 'auto',
  defaultTargetLang: 'en',
  theme: 'light',
};

export default function SettingsScreen({ onClose, onSettingsChange }: SettingsScreenProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      onSettingsChange(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleHistorySaveModeChange = (mode: 'online' | 'local' | 'none') => {
    const newSettings = { ...settings, historySaveMode: mode };
    saveSettings(newSettings);
  };

  const handleAutoSpeakChange = (value: boolean) => {
    const newSettings = { ...settings, autoSpeak: value };
    saveSettings(newSettings);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all saved translations from both online database and local storage. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              const result = await deleteAllHistory('anonymous');

              if (result.success) {
                Alert.alert(
                  'Success',
                  `Deleted ${result.deletedOnline} online and ${result.deletedLocal} local translations`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Partial Success',
                  result.message,
                  [{ text: 'OK' }]
                );
              }
            } catch (error: any) {
              console.error('Error clearing all data:', error);
              Alert.alert(
                'Error',
                error.message || 'Failed to clear data'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header - With Settings Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Settings size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        {/* History Storage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History Storage</Text>
          <Text style={styles.sectionDescription}>
            Choose how to save your translations
          </Text>

          {/* Online */}
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => handleHistorySaveModeChange('online')}
          >
            <View style={styles.radioCircle}>
              {settings.historySaveMode === 'online' && (
                <View style={styles.radioFilled} />
              )}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>Save to Online Database</Text>
              <Text style={styles.radioDescription}>Cloud backup, accessible anywhere</Text>
            </View>
          </TouchableOpacity>

          {/* Local */}
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => handleHistorySaveModeChange('local')}
          >
            <View style={styles.radioCircle}>
              {settings.historySaveMode === 'local' && (
                <View style={styles.radioFilled} />
              )}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>Save Locally Only</Text>
              <Text style={styles.radioDescription}>On this device only</Text>
            </View>
          </TouchableOpacity>

          {/* None */}
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => handleHistorySaveModeChange('none')}
          >
            <View style={styles.radioCircle}>
              {settings.historySaveMode === 'none' && (
                <View style={styles.radioFilled} />
              )}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>Don't Save</Text>
              <Text style={styles.radioDescription}>No history recorded</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* General Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          {/* Auto-speak */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto-speak Translation</Text>
              <Text style={styles.settingDescription}>Automatically read translated output</Text>
            </View>
            <Switch
              value={settings.autoSpeak}
              onValueChange={handleAutoSpeakChange}
              trackColor={{ false: '#767577', true: '#A1D6E2' }}
              thumbColor={settings.autoSpeak ? '#1995AD' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Trash2 size={18} color="#EF4444" />
                <Text style={styles.dangerButtonText}>Clear All Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    marginVertical: 4,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1995AD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1995AD',
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  radioDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dangerSection: {
    marginBottom: 0,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    gap: 12,
  },
  dangerButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});