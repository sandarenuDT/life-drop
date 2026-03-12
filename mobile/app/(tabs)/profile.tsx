import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native'
import { router } from 'expo-router'
import { COLORS } from '../../constants/color'
import { useAuthStore } from '../../store/authStore'

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            clearAuth()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Donor'}</Text>
        <Text style={styles.email}>{user?.email || 'donor@email.com'}</Text>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>
            🩸 Blood Group: {user?.bloodGroup || 'O+'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Account Details */}
        <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
        <View style={styles.detailsCard}>
          {[
            { label: '👤 Full Name',      value: user?.name        || 'Not set' },
            { label: '📧 Email',          value: user?.email       || 'Not set' },
            { label: '🏙️ City',           value: user?.city        || 'Not set' },
            { label: '🩸 Blood Group',    value: user?.bloodGroup  || 'Not set' },
            { label: '📅 Last Donation',  value: 'Jan 15, 2026'                 },
            { label: '✅ Eligible',       value: 'Yes'                          },
          ].map((item) => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.prefCard}>
          {[
            { label: '🔔 Donation Reminders', value: 'On'  },
            { label: '🚨 Emergency Alerts',   value: 'On'  },
            { label: '📍 Location Sharing',   value: 'On'  },
          ].map((item) => (
            <View key={item.label} style={styles.prefRow}>
              <Text style={styles.prefLabel}>{item.label}</Text>
              <View style={styles.toggleOn}>
                <Text style={styles.toggleText}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        <View style={styles.achievementsCard}>
          {[
            { badge: '🏅', title: 'First Donation',   desc: 'Donated for the first time'     },
            { badge: '⭐', title: 'Regular Donor',    desc: 'Donated 3 times'                },
            { badge: '🔥', title: 'On a Streak',      desc: '2 donations in a row'           },
          ].map((item) => (
            <View key={item.title} style={styles.achievementRow}>
              <Text style={styles.achievementBadge}>{item.badge}</Text>
              <View>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 12,
  },
  bloodBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  bloodBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  prefCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  prefLabel: {
    fontSize: 13,
    color: COLORS.text,
  },
  toggleOn: {
    backgroundColor: '#e8fff5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  toggleText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  achievementsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  achievementBadge: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  bottomSpace: {
    height: 20,
  },
})