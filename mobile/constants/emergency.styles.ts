
import { StyleSheet } from 'react-native'
import { COLORS } from './color'

// ── Local Styles ──────────────────────────────────────────────────────────────
export const emergencyStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  postBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  resolveBtn: {
    backgroundColor: '#e8fff5',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  resolveBtnText: {
    color: COLORS.success,
    fontWeight: '700',
    fontSize: 14,
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
  errorText: {
    fontSize: 12,
    color: '#cc0000',
    marginBottom: 4,
  },
})