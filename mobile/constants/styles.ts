import { StyleSheet } from 'react-native'
import { COLORS } from './color'

// ── Shared Layout ─────────────────────────────────────────────────────────────
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  bottomSpace: {
    height: 20,
  },
})

// ── Shared Header ─────────────────────────────────────────────────────────────
export const header = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  roleTag: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 4,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
})

// ── Shared Cards ──────────────────────────────────────────────────────────────
export const cards = StyleSheet.create({
  base: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergency: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: '#fff8f8',
  },
})

// ── Shared Typography ─────────────────────────────────────────────────────────
export const typography = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  emergencyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emergencySubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#cc0000',
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: '#06d6a0',
    fontWeight: '600',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
})

// ── Shared Buttons ────────────────────────────────────────────────────────────
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  outline: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  danger: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
  small: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
})

// ── Shared Form Inputs ────────────────────────────────────────────────────────
export const form = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#fff8f8',
  },
  inputSuccess: {
    borderColor: '#06d6a0',
    backgroundColor: '#f8fffc',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  dropdownContainer: {
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  dateButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
  },
  serverError: {
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  serverErrorText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
})

// ── Shared Tags & Badges ──────────────────────────────────────────────────────
export const tags = StyleSheet.create({
  success: {
    backgroundColor: '#e8fff5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  successText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
  },
  danger: {
    backgroundColor: '#fff0f0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dangerText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  warning: {
    backgroundColor: '#fff8e1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  warningText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#e8f4ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  infoText: {
    fontSize: 11,
    color: '#0066cc',
    fontWeight: '600',
  },
  blood: {
    backgroundColor: '#fff3f3',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bloodText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
})

// ── Shared Stats ──────────────────────────────────────────────────────────────
export const stats = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  box: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
  },
})

// ── Shared Error Block ────────────────────────────────────────────────────────
export const errorBlock = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  icon: {
    fontSize: 13,
  },
  text: {
    fontSize: 12,
    color: '#cc0000',
    fontWeight: '500',
    flex: 1,
  },
})

// ── Quick Actions Grid ────────────────────────────────────────────────────────
export const quickActions = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  item: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
})

// ── Loading ───────────────────────────────────────────────────────────────────
export const loading = StyleSheet.create({
  full: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
})

// ── Empty State ───────────────────────────────────────────────────────────────
export const emptyState = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  text: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
})

// ── Modal ─────────────────────────────────────────────────────────────────────
export const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  close: {
    fontSize: 18,
    color: COLORS.textMuted,
    padding: 4,
  },
  body: {
    padding: 20,
  },
})

export const adminStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  centerTypeIcon: {
    fontSize: 28,
    marginTop: 2,
  },
  typeTagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailsSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    gap: 3,
  },
  roleAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleAvatarIcon: {
    fontSize: 22,
  },
  roleTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Form styles
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#fff8f8',
  },
  inputSuccess: {
    borderColor: '#06d6a0',
    backgroundColor: '#f8fffc',
  },
  fieldError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#cc0000',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeBtnIcon: {
    fontSize: 16,
  },
  typeBtnText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  hintBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cce0ff',
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 6,
  },
  hintText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 20,
  },
})
