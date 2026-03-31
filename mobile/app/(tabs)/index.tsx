import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { COLORS } from '../../constants/color'
import {
  layout, header, cards, typography,
  stats, quickActions as qa
} from '../../constants/styles'
import { donationsService } from '../../services/donation.service'
import { emergencyService } from '../../services/emergency.service'
import { adminService } from '../../services/admin.service'

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'DONOR'

  // Donor stats
  const { data: donorStats } = useQuery({
    queryKey: ['donationStats', user?.id],
    queryFn:  donationsService.getDonationStats,
    enabled:  role === 'DONOR',
  })

  // Admin stats
  const { data: adminStats, isLoading: adminLoading } = useQuery({
    queryKey: ['adminStats', user?.id],
    queryFn:  adminService.getStats,
    enabled:  role === 'ADMIN',
  })

  // Emergency requests — all roles
  const { data: emergencyRequests } = useQuery({
    queryKey: ['emergencyRequests'],
    queryFn:  () => emergencyService.getEmergencyRequests(),
  })

  const criticalCount = emergencyRequests?.filter(
    (r: any) => r.urgency === 'CRITICAL'
  ).length || 0

  // ── Emergency Banner ─────────────────────────────────────────────────────────
  const EmergencyBanner = () => (
    <TouchableOpacity
      style={cards.emergency}
      onPress={() => router.push('/(tabs)/emergency' as any)}
    >
      <Text style={{ fontSize: 32 }}>🚨</Text>
      <View>
        <Text style={typography.emergencyTitle}>Emergency Requests</Text>
        <Text style={typography.emergencySubtitle}>
          {criticalCount > 0
            ? `${criticalCount} critical needs active`
            : 'No critical requests right now'}
        </Text>
      </View>
    </TouchableOpacity>
  )

  // ── ADMIN HOME ───────────────────────────────────────────────────────────────
  if (role === 'ADMIN') {
    return (
      <ScrollView style={layout.container}>
        <View style={header.container}>
          <Text style={header.roleTag}>👑 Administrator</Text>
          <Text style={header.name}>Welcome, {user?.name}!</Text>
          <Text style={header.subtitle}>Manage your LifeDrop system</Text>
        </View>

        <View style={layout.content}>
          {/* Admin Stats */}
          {adminLoading ? (
            <ActivityIndicator
              color={COLORS.primary}
              style={{ marginVertical: 16 }}
            />
          ) : (
            <View style={stats.row}>
              {[
                { icon: '👥', label: 'Users',      value: adminStats?.totalUsers        || 0 },
                { icon: '🩸', label: 'Donors',     value: adminStats?.totalDonors       || 0 },
                { icon: '🏥', label: 'Centers',    value: adminStats?.totalCenters      || 0 },
                { icon: '🚨', label: 'Active SOS', value: adminStats?.activeEmergencies || 0 },
              ].map((s) => (
                <View key={s.label} style={stats.box}>
                  <Text style={stats.icon}>{s.icon}</Text>
                  <Text style={stats.value}>{s.value}</Text>
                  <Text style={stats.label}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          <EmergencyBanner />

          <Text style={typography.sectionTitle}>QUICK ACTIONS</Text>
          <View style={qa.grid}>
            {[
              { icon: '🏥', label: 'Manage Centers', route: '/(tabs)/admin'     },
              { icon: '👥', label: 'Manage Users',   route: '/(tabs)/admin'     },
              { icon: '🚨', label: 'SOS Requests',   route: '/(tabs)/emergency' },
              { icon: '👤', label: 'My Profile',     route: '/(tabs)/profile'   },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={qa.item}
                onPress={() => router.push(a.route as any)}
              >
                <Text style={qa.icon}>{a.icon}</Text>
                <Text style={qa.label}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  // ── STAFF HOME ───────────────────────────────────────────────────────────────
  if (role === 'STAFF') {
    return (
      <ScrollView style={layout.container}>
        <View style={header.container}>
          <Text style={header.roleTag}>🏥 Hospital Staff</Text>
          <Text style={header.name}>Welcome, {user?.name}!</Text>
          <Text style={header.subtitle}>Manage donations at your center</Text>
        </View>

        <View style={layout.content}>
          <EmergencyBanner />

          <Text style={typography.sectionTitle}>QUICK ACTIONS</Text>
          <View style={qa.grid}>
            {[
              { icon: '🚨', label: 'Post SOS',      route: '/(tabs)/emergency' },
              { icon: '📍', label: 'View Centers',  route: '/(tabs)/map'       },
              { icon: '👤', label: 'My Profile',    route: '/(tabs)/profile'   },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={qa.item}
                onPress={() => router.push(a.route as any)}
              >
                <Text style={qa.icon}>{a.icon}</Text>
                <Text style={qa.label}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  // ── EMERGENCY REQUESTER HOME ─────────────────────────────────────────────────
  if (role === 'EMERGENCY_REQUESTER') {
    return (
      <ScrollView style={layout.container}>
        <View style={header.container}>
          <Text style={header.roleTag}>🚨 Emergency Requester</Text>
          <Text style={header.name}>Welcome, {user?.name}!</Text>
          <Text style={header.subtitle}>
            Post and manage emergency blood requests
          </Text>
        </View>

        <View style={layout.content}>
          <EmergencyBanner />

          {/* Active requests count */}
          <View style={cards.base}>
            <View style={{
              flexDirection:  'row',
              alignItems:     'center',
              justifyContent: 'space-between'
            }}>
              <View>
                <Text style={typography.cardTitle}>
                  Active Emergency Requests
                </Text>
                <Text style={typography.cardSubtitle}>
                  {emergencyRequests?.length || 0} total active requests
                </Text>
              </View>
              <Text style={{ fontSize: 32 }}>🚨</Text>
            </View>
          </View>

          <Text style={typography.sectionTitle}>QUICK ACTIONS</Text>
          <View style={qa.grid}>
            {[
              { icon: '🆘', label: 'Post SOS',      route: '/(tabs)/emergency' },
              { icon: '📋', label: 'My Requests',   route: '/(tabs)/emergency' },
              { icon: '👤', label: 'My Profile',    route: '/(tabs)/profile'   },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={qa.item}
                onPress={() => router.push(a.route as any)}
              >
                <Text style={qa.icon}>{a.icon}</Text>
                <Text style={qa.label}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  // ── DONOR HOME ───────────────────────────────────────────────────────────────
  return (
    <ScrollView style={layout.container}>
      <View style={header.container}>
        <Text style={header.roleTag}>🩸 Donor</Text>
        <Text style={header.name}>{user?.name || 'Donor'} 👋</Text>

        {/* Donor badges */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <View style={{
            flex:            1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius:    10,
            padding:         10,
            alignItems:      'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
              {user?.bloodGroup
                ?.replace('_POS', '+')
                .replace('_NEG', '-') || 'N/A'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
              Blood Type
            </Text>
          </View>
          <View style={{
            flex:            1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius:    10,
            padding:         10,
            alignItems:      'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
              {donorStats?.totalDonations || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
              Donations
            </Text>
          </View>
          <View style={{
            flex:            1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius:    10,
            padding:         10,
            alignItems:      'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
              {donorStats?.livesSaved || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
              Lives Saved
            </Text>
          </View>
        </View>
      </View>

      <View style={layout.content}>
        <EmergencyBanner />

        <Text style={typography.sectionTitle}>QUICK ACTIONS</Text>
        <View style={qa.grid}>
          {[
            { icon: '📍', label: 'Find Centers', route: '/(tabs)/map'     },
            { icon: '📅', label: 'Book Slot',    route: '/(tabs)/map'     },
            { icon: '📋', label: 'My History',   route: '/(tabs)/history' },
            { icon: '👤', label: 'My Profile',   route: '/(tabs)/profile' },
          ].map((a) => (
            <TouchableOpacity
              key={a.label}
              style={qa.item}
              onPress={() => router.push(a.route as any)}
            >
              <Text style={qa.icon}>{a.icon}</Text>
              <Text style={qa.label}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next eligible date */}
        <Text style={typography.sectionTitle}>NEXT ELIGIBLE DATE</Text>
        <View style={cards.row}>
          <Text style={{ fontSize: 28 }}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text style={typography.cardTitle}>
              {donorStats?.nextEligibleDate
                ? new Date(donorStats.nextEligibleDate).toDateString()
                : 'You are eligible now!'}
            </Text>
            <Text style={typography.cardSubtitle}>
              {donorStats?.isEligible
                ? '✅ You can donate today'
                : '⏳ Waiting period not over yet'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}