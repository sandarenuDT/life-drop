import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native'
import { router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import {
  layout, header, cards, typography,
  buttons, stats, loading
} from '../../constants/styles'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import { donationsService } from '../../services/donation.service'

export default function ProfileScreen() {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)
  const clearAuth   = useAuthStore((s) => s.clearAuth)
  const role        = user?.role || 'DONOR'

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['myProfile', user?.id],
    queryFn:  authService.getMe,
    enabled:  !!user,
  })

  const { data: donorStats, isLoading: statsLoading } = useQuery({
    queryKey: ['donationStats', user?.id],
    queryFn:  donationsService.getDonationStats,
    enabled:  !!user && role === 'DONOR',
  })

  const isLoading = profileLoading || (role === 'DONOR' && statsLoading)

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await queryClient.clear()
            clearAuth()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <View style={loading.full}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={loading.text}>Loading profile...</Text>
      </View>
    )
  }

  const displayUser = profile || user

  // Role specific config
  const roleConfig: Record<string, {
    icon: string
    label: string
    desc: string
    color: string
  }> = {
    ADMIN: {
      icon:  '👑',
      label: 'Administrator',
      desc:  'Full system access — manage centers, users and emergencies',
      color: '#e63946',
    },
    STAFF: {
      icon:  '🏥',
      label: 'Hospital Staff',
      desc:  'Manage appointments and donations at your center',
      color: '#00d4ff',
    },
    EMERGENCY_REQUESTER: {
      icon:  '🚨',
      label: 'Emergency Requester',
      desc:  'Post and manage urgent blood requests',
      color: '#ffd166',
    },
    DONOR: {
      icon:  '🩸',
      label: 'Blood Donor',
      desc:  'Donate blood and save up to 3 lives per donation',
      color: '#06d6a0',
    },
  }

  const rc = roleConfig[role] || roleConfig.DONOR

  return (
    <ScrollView style={layout.container}>

      {/* Header */}
      <View style={[header.container, { alignItems: 'center' }]}>
        {/* Avatar */}
        <View style={{
          width:           80,
          height:          80,
          borderRadius:    40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems:      'center',
          justifyContent:  'center',
          marginBottom:    12,
          borderWidth:     3,
          borderColor:     'rgba(255,255,255,0.4)',
        }}>
          <Text style={{ fontSize: 36 }}>{rc.icon}</Text>
        </View>

        <Text style={header.name}>{displayUser?.name || 'User'}</Text>
        <Text style={header.subtitle}>{displayUser?.email}</Text>

        {/* Blood group badge — DONORS only */}
        {role === 'DONOR' && displayUser?.bloodGroup && (
          <View style={{
            backgroundColor:   'rgba(255,255,255,0.2)',
            borderRadius:      20,
            paddingHorizontal: 16,
            paddingVertical:   6,
            marginTop:         8,
          }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
              🩸 Blood Group:{' '}
              {displayUser.bloodGroup
                .replace('_POS', '+')
                .replace('_NEG', '-')}
            </Text>
          </View>
        )}
      </View>

      <View style={layout.content}>

        {/* ── DONOR ONLY — Donation Stats ─────────────────────────────────── */}
        {role === 'DONOR' && (
          <View style={stats.row}>
            <View style={stats.box}>
              <Text style={stats.icon}>🩸</Text>
              <Text style={stats.value}>{donorStats?.totalDonations || 0}</Text>
              <Text style={stats.label}>Donations</Text>
            </View>
            <View style={stats.box}>
              <Text style={stats.icon}>❤️</Text>
              <Text style={stats.value}>{donorStats?.livesSaved || 0}</Text>
              <Text style={stats.label}>Lives Saved</Text>
            </View>
            <View style={stats.box}>
              <Text style={stats.icon}>
                {donorStats?.isEligible ? '✅' : '⏳'}
              </Text>
              <Text style={stats.value}>
                {donorStats?.isEligible ? 'Yes' : 'No'}
              </Text>
              <Text style={stats.label}>Eligible</Text>
            </View>
          </View>
        )}

        {/* ── Account Details ──────────────────────────────────────────────── */}
        <Text style={typography.sectionTitle}>ACCOUNT DETAILS</Text>
        <View style={cards.base}>
          {[
            { label: '👤 Full Name', value: displayUser?.name  || 'Not set' },
            { label: '📧 Email',     value: displayUser?.email || 'Not set' },
            { label: '📞 Phone',     value: displayUser?.phone || 'Not set' },
            { label: '🏙️ City',      value: displayUser?.city  || 'Not set' },

            // Blood group — DONORS only
            ...(role === 'DONOR' ? [{
              label: '🩸 Blood Group',
              value: displayUser?.bloodGroup
                ? displayUser.bloodGroup
                    .replace('_POS', '+')
                    .replace('_NEG', '-')
                : 'Not set',
            }] : []),

            // Eligible — DONORS only
            ...(role === 'DONOR' ? [{
              label: '✅ Eligible to Donate',
              value: donorStats?.isEligible ? 'Yes' : 'Not yet',
            }] : []),

          ].map((item, i, arr) => (
            <View
              key={item.label}
              style={{
                flexDirection:     'row',
                justifyContent:    'space-between',
                alignItems:        'center',
                paddingVertical:   12,
                paddingHorizontal: 4,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.surface,
              }}
            >
              <Text style={typography.cardSubtitle}>{item.label}</Text>
              <Text style={[typography.cardTitle, { marginBottom: 0 }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Role Card ────────────────────────────────────────────────────── */}
        <Text style={typography.sectionTitle}>ACCOUNT TYPE</Text>
        <View style={[cards.base, {
          borderLeftWidth: 4,
          borderLeftColor: rc.color,
          flexDirection:   'row',
          alignItems:      'center',
          gap:             14,
        }]}>
          <View style={{
            width:           50,
            height:          50,
            borderRadius:    25,
            backgroundColor: `${rc.color}22`,
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <Text style={{ fontSize: 24 }}>{rc.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.cardTitle}>{rc.label}</Text>
            <Text style={typography.cardSubtitle}>{rc.desc}</Text>
          </View>
        </View>

        {/* ── DONOR ONLY — Next Donation Date ─────────────────────────────── */}
        {role === 'DONOR' && (
          <>
            <Text style={typography.sectionTitle}>NEXT DONATION DATE</Text>
            <View style={cards.row}>
              <Text style={{ fontSize: 28 }}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={typography.cardTitle}>
                  {donorStats?.nextEligibleDate
                    ? new Date(donorStats.nextEligibleDate).toDateString()
                    : 'You can donate now!'}
                </Text>
                <Text style={typography.cardSubtitle}>
                  {donorStats?.isEligible
                    ? '✅ You are eligible to donate today'
                    : '⏳ Please wait for the required period'}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ── Logout ──────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={buttons.outline}
          onPress={handleLogout}
        >
          <Text style={buttons.outlineText}>Log Out</Text>
        </TouchableOpacity>

        <View style={layout.bottomSpace} />
      </View>
    </ScrollView>
  )
}