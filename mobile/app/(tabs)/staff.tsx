import {
  View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import {
  layout, header, cards, typography, tags, emptyState, stats
} from '../../constants/styles'
import { donationsService } from '../../services/donation.service'
import { staffStyles as styles } from '../../constants/staff.styles'
// ── Status Config ─────────────────────────────────────────────────────────────
const statusConfig: Record<string, {
  bg: string; text: string; label: string
}> = {
  PENDING:   { bg: '#fff8e1', text: '#f59e0b', label: '⏳ Pending'   },
  CONFIRMED: { bg: '#e8f0ff', text: '#3b82f6', label: '✅ Confirmed'  },
  COMPLETED: { bg: '#e8fff5', text: '#06d6a0', label: '🏅 Completed'  },
  CANCELLED: { bg: '#fff0f0', text: '#e63946', label: '❌ Cancelled'  },
}

// ── Appointment Card ──────────────────────────────────────────────────────────
function AppointmentCard({
  appointment,
  onConfirm,
  onComplete,
  onCancel,
}: {
  appointment: any
  onConfirm:  (id: string) => void
  onComplete: (id: string) => void
  onCancel:   (id: string) => void
}) {
  const sc = statusConfig[appointment.status] || statusConfig.PENDING

  return (
    <View style={[
      cards.base,
      { borderLeftWidth: 4, borderLeftColor: sc.text }
    ]}>

      {/* Header Row */}
      <View style={{
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        marginBottom:   10,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={typography.cardTitle}>
            {appointment.user?.name || 'Unknown Donor'}
          </Text>
          <Text style={typography.cardSubtitle}>
            📞 {appointment.user?.phone || 'No phone'}
          </Text>
          {appointment.user?.bloodGroup && (
            <Text style={typography.cardSubtitle}>
              🩸 {appointment.user.bloodGroup
                .replace('_POS', '+')
                .replace('_NEG', '-')}
            </Text>
          )}
        </View>

        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: sc.bg }
        ]}>
          <Text style={[styles.statusText, { color: sc.text }]}>
            {sc.label}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Center</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {appointment.center?.name || 'Unknown'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(appointment.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{appointment.timeSlot}</Text>
        </View>
      </View>

      {/* Donation Type */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        <View style={tags.blood}>
          <Text style={tags.bloodText}>
            {appointment.type.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {appointment.status !== 'CANCELLED' &&
       appointment.status !== 'COMPLETED' && (
        <View style={styles.actionRow}>
          {/* Confirm — only for PENDING */}
          {appointment.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.confirmBtn]}
              onPress={() => onConfirm(appointment.id)}
            >
              <Text style={styles.confirmBtnText}>✅ Confirm</Text>
            </TouchableOpacity>
          )}

          {/* Complete — for PENDING or CONFIRMED */}
          {(appointment.status === 'PENDING' ||
            appointment.status === 'CONFIRMED') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.completeBtn]}
              onPress={() => onComplete(appointment.id)}
            >
              <Text style={styles.completeBtnText}>🏅 Complete</Text>
            </TouchableOpacity>
          )}

          {/* Cancel */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => onCancel(appointment.id)}
          >
            <Text style={styles.cancelBtnText}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// ── Main Staff Screen ─────────────────────────────────────────────────────────
export default function StaffScreen() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')
  const [filter, setFilter] = useState<string>('ALL')

  // Stats
  const { data: apptStats } = useQuery({
    queryKey: ['appointmentStats'],
    queryFn:  donationsService.getAppointmentStats,
    staleTime: 0,
  })

  // Today's appointments
  const { data: todayAppts, isLoading: todayLoading } = useQuery({
    queryKey: ['todayAppointments'],
    queryFn:  donationsService.getTodayAppointments,
    staleTime: 0,
  })

  // All appointments
  const { data: allAppts, isLoading: allLoading } = useQuery({
    queryKey: ['allAppointments'],
    queryFn:  donationsService.getAllAppointments,
    enabled:  activeTab === 'all',
    staleTime: 0,
  })

  // Confirm
  const { mutate: confirm } = useMutation({
    mutationFn: donationsService.confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] })
      queryClient.invalidateQueries({ queryKey: ['allAppointments']   })
      queryClient.invalidateQueries({ queryKey: ['appointmentStats']  })
      Alert.alert('✅ Confirmed', 'Appointment confirmed successfully.')
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not confirm.')
    }
  })

  // Complete
  const { mutate: complete } = useMutation({
    mutationFn: donationsService.completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] })
      queryClient.invalidateQueries({ queryKey: ['allAppointments']   })
      queryClient.invalidateQueries({ queryKey: ['appointmentStats']  })
      Alert.alert(
        '🏅 Donation Complete!',
        'Donation marked as completed. The donor\'s history has been updated.'
      )
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not complete.')
    }
  })

  // Cancel
  const { mutate: cancel } = useMutation({
    mutationFn: donationsService.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAppointments'] })
      queryClient.invalidateQueries({ queryKey: ['allAppointments']   })
      queryClient.invalidateQueries({ queryKey: ['appointmentStats']  })
      Alert.alert('❌ Cancelled', 'Appointment cancelled.')
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not cancel.')
    }
  })

  // Confirm with dialog
  const handleConfirm = (id: string) => {
    Alert.alert(
      'Confirm Appointment',
      'Are you sure you want to confirm this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => confirm(id) }
      ]
    )
  }

  // Complete with dialog
  const handleComplete = (id: string) => {
    Alert.alert(
      '🏅 Mark as Completed',
      'Confirm that the donor has donated blood? This will update their donation history.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Completed', onPress: () => complete(id) }
      ]
    )
  }

  // Cancel with dialog
  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No',   style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancel(id) }
      ]
    )
  }

  // Filter appointments
  const filterAppointments = (appts: any[]) => {
    if (filter === 'ALL') return appts
    return appts.filter((a) => a.status === filter)
  }

  const displayedAppts = activeTab === 'today'
    ? filterAppointments(todayAppts || [])
    : filterAppointments(allAppts   || [])

  const isLoading = activeTab === 'today' ? todayLoading : allLoading

  return (
    <View style={layout.container}>

      {/* Header */}
      <View style={header.container}>
        <View style={{
          flexDirection:  'row',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}>
          <View>
            <Text style={header.title}>🏥 Staff Panel</Text>
            <Text style={header.subtitle}>
              Manage donation appointments
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius:    10,
              padding:         8,
            }}
            onPress={() => {
              queryClient.invalidateQueries({ queryKey: ['todayAppointments'] })
              queryClient.invalidateQueries({ queryKey: ['allAppointments']   })
              queryClient.invalidateQueries({ queryKey: ['appointmentStats']  })
            }}
          >
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={layout.content}>

        {/* Stats Row */}
        <View style={stats.row}>
          <View style={stats.box}>
            <Text style={stats.icon}>📅</Text>
            <Text style={stats.value}>{apptStats?.todayTotal || 0}</Text>
            <Text style={stats.label}>Today</Text>
          </View>
          <View style={stats.box}>
            <Text style={stats.icon}>⏳</Text>
            <Text style={stats.value}>{apptStats?.todayPending || 0}</Text>
            <Text style={stats.label}>Pending</Text>
          </View>
          <View style={stats.box}>
            <Text style={stats.icon}>✅</Text>
            <Text style={stats.value}>{apptStats?.todayConfirmed || 0}</Text>
            <Text style={stats.label}>Confirmed</Text>
          </View>
          <View style={stats.box}>
            <Text style={stats.icon}>🏅</Text>
            <Text style={stats.value}>{apptStats?.todayCompleted || 0}</Text>
            <Text style={stats.label}>Done</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'today' && styles.tabTextActive
            ]}>
              📅 Today ({todayAppts?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'all' && styles.tabTextActive
            ]}>
              📋 All ({allAppts?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.filterBtnActive
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterText,
                filter === f && styles.filterTextActive
              ]}>
                {f === 'ALL'       ? 'All'
                : f === 'PENDING'  ? '⏳ Pending'
                : f === 'CONFIRMED'? '✅ Confirmed'
                : f === 'COMPLETED'? '🏅 Completed'
                :                   '❌ Cancelled'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Appointments List */}
        {isLoading && (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {!isLoading && displayedAppts.length === 0 && (
          <View style={emptyState.container}>
            <Text style={emptyState.icon}>📅</Text>
            <Text style={emptyState.title}>
              {activeTab === 'today'
                ? 'No Appointments Today'
                : 'No Appointments Found'}
            </Text>
            <Text style={emptyState.text}>
              {activeTab === 'today'
                ? 'There are no appointments scheduled for today.'
                : 'No appointments match the selected filter.'}
            </Text>
          </View>
        )}

        {displayedAppts.map((appt: any) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            onConfirm={handleConfirm}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        ))}

        <View style={layout.bottomSpace} />
      </ScrollView>
    </View>
  )
}
