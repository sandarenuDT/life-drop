import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import { COLORS } from '../../constants/color'

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user)

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{user?.name || 'Donor'} 👋</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{user?.bloodGroup || 'O+'}</Text>
            <Text style={styles.badgeLabel}>Blood Type</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>3</Text>
            <Text style={styles.badgeLabel}>Donations</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>9</Text>
            <Text style={styles.badgeLabel}>Lives Saved</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Emergency Banner */}
        <TouchableOpacity
          style={styles.emergencyCard}
          onPress={() => router.push('/(tabs)/emergency')}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View>
            <Text style={styles.emergencyTitle}>Emergency Requests</Text>
            <Text style={styles.emergencySubtitle}>
              2 critical needs near you
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActions}>
          {[
            { icon: '📍', label: 'Find Centers', route: '/(tabs)/map'       },
            { icon: '📅', label: 'Book Slot',    route: '/(tabs)/map'       },
            { icon: '📋', label: 'My History',   route: '/(tabs)/history'   },
            { icon: '🏆', label: 'Achievements', route: '/(tabs)/profile'   },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => router.push(action.route as any)}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Donation */}
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
  greeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  badgeValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  badgeLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  emergencyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  emergencyIcon: {
    fontSize: 32,
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
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickAction: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
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
})