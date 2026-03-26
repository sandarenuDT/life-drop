import {
  View, Text, ScrollView,
  StyleSheet, ActivityIndicator
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import { donationsService } from '../../services/donation.service'

export default function HistoryScreen() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['donationStats'],
    queryFn: donationsService.getDonationStats,
  })

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: donationsService.getMyAppointments,
  })

  const isLoading = statsLoading || appointmentsLoading

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Donation History</Text>
        <Text style={styles.headerSubtitle}>Your impact so far</Text>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {stats?.totalDonations || 0}
                </Text>
                <Text style={styles.statLabel}>Donations</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {stats?.livesSaved || 0}
                </Text>
                <Text style={styles.statLabel}>Lives Saved</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {stats?.isEligible ? '✅' : '⏳'}
                </Text>
                <Text style={styles.statLabel}>Eligible</Text>
              </View>
            </View>

            {/* Appointments */}
            <Text style={styles.sectionTitle}>MY APPOINTMENTS</Text>
            {appointments?.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyText}>
                  No appointments yet. Book your first donation!
                </Text>
              </View>
            ) : (
              appointments?.map((item: any) => (
                <View key={item.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentLeft}>
                    <Text style={styles.appointmentCenter}>
                      {item.center.name}
                    </Text>
                    <Text style={styles.appointmentMeta}>
                      📅 {new Date(item.date).toDateString()}
                    </Text>
                    <Text style={styles.appointmentMeta}>
                      ⏰ {item.timeSlot}
                    </Text>
                    <Text style={styles.appointmentMeta}>
                      🩸 {item.type.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusTag,
                    item.status === 'COMPLETED' && styles.statusCompleted,
                    item.status === 'CANCELLED' && styles.statusCancelled,
                    item.status === 'CONFIRMED' && styles.statusConfirmed,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      item.status === 'CANCELLED' && { color: COLORS.error },
                      item.status === 'CONFIRMED' && { color: '#0066cc' },
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {/* Next Eligible */}
            <Text style={styles.sectionTitle}>NEXT ELIGIBLE DATE</Text>
            <View style={styles.nextCard}>
              <Text style={styles.nextIcon}>📅</Text>
              <View>
                <Text style={styles.nextDate}>
                  {stats?.nextEligibleDate
                    ? new Date(stats.nextEligibleDate).toDateString()
                    : 'You can donate now!'}
                </Text>
                <Text style={styles.nextSub}>
                  {stats?.isEligible
                    ? '✅ You are eligible to donate'
                    : '⏳ Please wait for the required period'}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appointmentLeft: {
    flex: 1,
    marginRight: 10,
  },
  appointmentCenter: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  appointmentMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  statusTag: {
    backgroundColor: '#e8fff5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: '#e8fff5',
  },
  statusCancelled: {
    backgroundColor: '#fff0f0',
  },
  statusConfirmed: {
    backgroundColor: '#e8f0ff',
  },
  statusText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },
  nextCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  nextIcon: {
    fontSize: 28,
  },
  nextDate: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  nextSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bottomSpace: {
    height: 20,
  },
})