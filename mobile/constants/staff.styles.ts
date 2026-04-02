import { StyleSheet } from 'react-native'
import { COLORS } from './color';

export const staffStyles = StyleSheet.create({
  tabRow: {
    flexDirection:   'row',
    backgroundColor: '#fff',
    borderRadius:    14,
    padding:         4,
    marginBottom:    12,
  },
  tab: {
    flex:          1,
    padding:       10,
    borderRadius:  10,
    alignItems:    'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize:   12,
    fontWeight: '600',
    color:      COLORS.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  filterRow: {
    marginBottom: 14,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderRadius:      20,
    borderWidth:       1.5,
    borderColor:       COLORS.border,
    marginRight:       8,
    backgroundColor:   '#fff',
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  filterText: {
    fontSize:   12,
    color:      COLORS.textMuted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  statusBadge: {
    borderRadius:      20,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  statusText: {
    fontSize:   11,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection:    'row',
    backgroundColor:  COLORS.surface,
    borderRadius:     10,
    padding:          10,
    marginTop:        8,
  },
  detailItem: {
    flex:       1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize:     10,
    color:        COLORS.textMuted,
    marginBottom: 3,
  },
  detailValue: {
    fontSize:   12,
    fontWeight: '700',
    color:      COLORS.text,
    textAlign:  'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap:           8,
    marginTop:     12,
  },
  actionBtn: {
    flex:          1,
    padding:       10,
    borderRadius:  10,
    alignItems:    'center',
  },
  confirmBtn: {
    backgroundColor: '#e8f0ff',
    borderWidth:     1.5,
    borderColor:     '#3b82f6',
  },
  confirmBtnText: {
    color:      '#3b82f6',
    fontWeight: '700',
    fontSize:   13,
  },
  completeBtn: {
    backgroundColor: '#e8fff5',
    borderWidth:     1.5,
    borderColor:     COLORS.success,
  },
  completeBtnText: {
    color:      COLORS.success,
    fontWeight: '700',
    fontSize:   13,
  },
  cancelBtn: {
    backgroundColor: '#fff0f0',
    borderWidth:     1.5,
    borderColor:     COLORS.primary,
  },
  cancelBtnText: {
    color:      COLORS.primary,
    fontWeight: '700',
    fontSize:   13,
  },
})