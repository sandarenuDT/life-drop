import {
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import { COLORS } from '../../constants/color'

const donationHistory = [
  {
    id: '1',
    date: 'Jan 15, 2026',
    location: 'National Blood Centre',
    type: 'Whole Blood',
    badge: '🏅',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Sep 20, 2025',
    location: 'Red Cross Blood Bank',
    type: 'Platelets',
    badge: '⭐',
    status: 'Completed',
  },
  {
    id: '3',
    date: 'May 05, 2025',
    location: 'Negombo General Hospital',
    type: 'Whole Blood',
    badge: '🏅',
    status: 'Completed',
  },
]

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Donation History</Text>
        <Text style={styles.headerSubtitle}>
          Your impact so far
        </Text>
      </View>

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Donations</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>🔥 2</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* History List */}
        <Text style={styles.sectionTitle}>ALL DONATIONS</Text>
        {donationHistory.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <Text style={styles.historyBadge}>{item.badge}</Text>
            <View style={styles.historyInfo}>
              <Text style={styles.historyLocation}>{item.location}</Text>
              <Text style={styles.historyMeta}>
                {item.type} · {item.date}
              </Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}

        {/* Next Eligible */}
        <Text style={styles.sectionTitle}>NEXT ELIGIBLE DATE</Text>
        <View style={styles.nextCard}>
          <Text style={styles.nextIcon}>📅</Text>
          <View>
            <Text style={styles.nextDate}>April 15, 2026</Text>
            <Text style={styles.nextSub}>
              Whole Blood · 56 day waiting period
            </Text>
          </View>
        </View>

        {/* Impact Card */}
        <Text style={styles.sectionTitle}>YOUR IMPACT</Text>
        <View style={styles.impactCard}>
          <Text style={styles.impactEmoji}>❤️</Text>
          <Text style={styles.impactTitle}>
            You have saved up to 9 lives!
          </Text>
          <Text style={styles.impactSub}>
            Each whole blood donation can save up to 3 lives.
            Keep donating to make a bigger difference.
          </Text>
        </View>

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
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyBadge: {
    fontSize: 32,
  },
  historyInfo: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  statusTag: {
    backgroundColor: '#e8fff5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  impactCard: {
    backgroundColor: '#fff3f3',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffc0c0',
  },
  impactEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  impactSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
})