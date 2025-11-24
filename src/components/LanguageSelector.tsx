import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/global';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Props {
  title: string;
  languages: Language[];
  selectedLanguage: string;
  onLanguageSelect: (code: string) => void;
  excludeAuto?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({
  title,
  languages,
  selectedLanguage,
  onLanguageSelect,
  excludeAuto = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const displayLanguages = excludeAuto
    ? languages.filter((lang) => lang.code !== 'auto')
    : languages;

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  const selectLanguage = (code: string) => {
    onLanguageSelect(code);
    closeModal();
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedLanguage;
    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.languageItemSelected]}
        onPress={() => selectLanguage(item.code)}
      >
        <Text style={styles.languageItemFlag}>{item.flag}</Text>
        <Text style={styles.languageItemText}>{item.name}</Text>
        {isSelected && (
          <MaterialIcons name="check" size={24} color={colors.primary} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity style={styles.selector} onPress={openModal}>
        <View style={styles.selectedLanguage}>
          <Text style={styles.flag}>{selectedLang?.flag}</Text>
          <Text style={styles.languageName}>{selectedLang?.name}</Text>
        </View>
        <MaterialIcons name="arrow-drop-down" size={24} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {/* Modern Header with Close Button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={closeModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={displayLanguages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              style={styles.languageList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },

  // Modal styles - Redesigned
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeIconButton: {
    padding: 4,
    marginLeft: 12,
  },
  languageList: {
    maxHeight: 500,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  languageItemSelected: {
    backgroundColor: 'rgba(25, 149, 173, 0.08)',  // Very light teal
  },
  languageItemFlag: {
    fontSize: 32,
  },
  languageItemText: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});
