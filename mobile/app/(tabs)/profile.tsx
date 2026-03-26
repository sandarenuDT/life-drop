import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import { donationsService } from '../../services/donation.service'

export default function ProfileScreen() {
  const clearAuth = useAuthStore((s) => s.clearAuth)

  // Get real profile from backend
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: authService.getMe,
  })

  // Get real stats from backend
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['donationStats'],
    queryFn: donationsService.getDonationStats,
  })

  const isLoading = profileLoading || statsLoading

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        {profile?.bloodGroup && (
          <View style={styles.bloodBadge}>
            <Text style={styles.bloodBadgeText}>
              🩸 Blood Group: {profile.bloodGroup.replace('_', '')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
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

        {/* Account Details */}
        <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
        <View style={styles.detailsCard}>
          {[
            { label: '👤 Full Name', value: profile?.name        || 'Not set' },
            { label: '📧 Email',     value: profile?.email       || 'Not set' },
            { label: '📞 Phone',     value: profile?.phone       || 'Not set' },
            { label: '🏙️ City',      value: profile?.city        || 'Not set' },
            { label: '🩸 Blood',     value: profile?.bloodGroup?.replace('_', '') || 'Not set' },
            { label: '✅ Eligible',  value: stats?.isEligible ? 'Yes' : 'Not yet' },
          ].map((item) => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Next Eligible */}
        <Text style={styles.sectionTitle}>NEXT DONATION DATE</Text>
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
                ? '✅ You are eligible to donate today'
                : '⏳ Waiting period not completed'}
            </Text>
          </View>
        </View>

        {/* Role Badge */}
        <Text style={styles.sectionTitle}>ACCOUNT TYPE</Text>
        <View style={styles.roleCard}>
          <Text style={styles.roleIcon}>
            {profile?.role === 'ADMIN'               ? '👑'
            : profile?.role === 'STAFF'               ? '🏥'
            : profile?.role === 'EMERGENCY_REQUESTER' ? '🚨'
            : '🩸'}
          </Text>
          <View>
            <Text style={styles.roleTitle}>{profile?.role}</Text>
            <Text style={styles.roleSub}>
              {profile?.role === 'ADMIN'
                ? 'Full system access'
                : profile?.role === 'STAFF'
                ? 'Manage donation center'
                : profile?.role === 'EMERGENCY_REQUESTER'
                ? 'Post emergency requests'
                : 'Donate blood and save lives'}
            </Text>
          </View>
        </View>

        {/* Logout */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
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
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  roleIcon: {
    fontSize: 36,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  roleSub: {
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