import { StyleSheet } from 'react-native';

export const colors = {
  // Background
  background: '#f9fafb',
  surface: '#ffffff',
  
  // Text
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#e5e7eb',
  
  // Primary
  primary: '#667eea',
  primaryHover: '#764ba2',
  
  // Status
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  
  // Backgrounds
  inputBg: '#f8fafc',
  cardBg: '#f8fafc',
  
  // Misc
  white: '#ffffff',
  black: '#111827',
};

export const globalStyles = StyleSheet.create({
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  cardLarge: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Section styles
  section: {
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Input styles
  input: {
    minHeight: 80,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
  
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  
  // Button styles
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconBtnDisabled: {
    opacity: 0.4,
  },
  
  stopBtn: {
    backgroundColor: colors.error,
  },
  
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  
  // Text styles
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // History styles
  historyItem: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  
  historyMethod: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  badgeArrow: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  
  historyOriginal: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  historyTranslated: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  
  speakButton: {
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  
  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  emptyStateText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  },
  
  // Result card
  resultCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});