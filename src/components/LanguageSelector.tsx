import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Language } from '../types/translation.types';
import { globalStyles, colors } from '../styles/global';

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
  excludeAuto = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const displayLanguages = excludeAuto
    ? languages.filter(lang => lang.code !== 'auto')
    : languages;

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>{title}</Text>
      
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedLang?.flag} {selectedLang?.name}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {displayLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage === lang.code && styles.languageItemSelected
                  ]}
                  onPress={() => {
                    onLanguageSelect(lang.code);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageItemText}>
                    {lang.flag} {lang.name}
                  </Text>
                  {selectedLanguage === lang.code && (
                    <MaterialIcons name="check" size={20} color="#667eea" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    height: 50
  },
  dropdownButtonText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  languageList: {
    padding: 8
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 4
  },
  languageItemSelected: {
    backgroundColor: '#f1f5f9'
  },
  languageItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500'
  }
});