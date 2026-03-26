// import {
//   View, Text, ScrollView,
//   TouchableOpacity, StyleSheet, ActivityIndicator
// } from 'react-native'
// import { router } from 'expo-router'
// import { useQuery } from '@tanstack/react-query'
// import { useAuthStore } from '../../store/authStore'
// import { COLORS } from '../../constants/color'
// import { donationsService } from '../../services/donation.service'
// import { emergencyService } from '../../services/emergency.service'

// export default function HomeScreen() {
//   const user = useAuthStore((s) => s.user)

//   // Get donation stats from backend
//   const { data: stats } = useQuery({
//     queryKey: ['donationStats'],
//     queryFn: donationsService.getDonationStats,
//   })

//   // Get emergency requests from backend
//   const { data: emergencyRequests } = useQuery({
//     queryKey: ['emergencyRequests'],
//     queryFn: () => emergencyService.getEmergencyRequests(),
//   })

//   const criticalCount = emergencyRequests?.filter(
//     (r: any) => r.urgency === 'CRITICAL'
//   ).length || 0

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Good morning,</Text>
//         <Text style={styles.name}>{user?.name || 'Donor'} 👋</Text>
//         <View style={styles.badges}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeValue}>
//               {user?.bloodGroup?.replace('_', '') || 'N/A'}
//             </Text>
//             <Text style={styles.badgeLabel}>Blood Type</Text>
//           </View>
//           <View style={styles.badge}>
//             <Text style={styles.badgeValue}>
//               {stats?.totalDonations || 0}
//             </Text>
//             <Text style={styles.badgeLabel}>Donations</Text>
//           </View>
//           <View style={styles.badge}>
//             <Text style={styles.badgeValue}>
//               {stats?.livesSaved || 0}
//             </Text>
//             <Text style={styles.badgeLabel}>Lives Saved</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.content}>
//         {/* Emergency Banner */}
//         <TouchableOpacity
//           style={styles.emergencyCard}
//           onPress={() => router.push('/(tabs)/emergency')}
//         >
//           <Text style={styles.emergencyIcon}>🚨</Text>
//           <View>
//             <Text style={styles.emergencyTitle}>
//               Emergency Requests
//             </Text>
//             <Text style={styles.emergencySubtitle}>
//               {criticalCount > 0
//                 ? `${criticalCount} critical needs near you`
//                 : 'No critical requests right now'}
//             </Text>
//           </View>
//         </TouchableOpacity>

//         {/* Quick Actions */}
//         <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
//         <View style={styles.quickActions}>
//           {[
//             { icon: '📍', label: 'Find Centers', route: '/(tabs)/map'     },
//             { icon: '📅', label: 'Book Slot',    route: '/(tabs)/map'     },
//             { icon: '📋', label: 'My History',   route: '/(tabs)/history' },
//             { icon: '🏆', label: 'Achievements', route: '/(tabs)/profile' },
//           ].map((action) => (
//             <TouchableOpacity
//               key={action.label}
//               style={styles.quickAction}
//               onPress={() => router.push(action.route as any)}
//             >
//               <Text style={styles.quickActionIcon}>{action.icon}</Text>
//               <Text style={styles.quickActionLabel}>{action.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Next Eligible Date */}
//         <Text style={styles.sectionTitle}>NEXT ELIGIBLE DATE</Text>
//         <View style={styles.nextCard}>
//           <Text style={styles.nextIcon}>📅</Text>
//           <View>
//             <Text style={styles.nextDate}>
//               {stats?.nextEligibleDate
//                 ? new Date(stats.nextEligibleDate).toDateString()
//                 : 'You are eligible now!'}
//             </Text>
//             <Text style={styles.nextSub}>
//               {stats?.isEligible
//                 ? '✅ You can donate today'
//                 : '⏳ Waiting period not over yet'}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//   },
//   header: {
//     backgroundColor: COLORS.primaryDark,
//     padding: 24,
//     paddingTop: 60,
//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//   },
//   greeting: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 14,
//   },
//   name: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: '800',
//     marginTop: 2,
//     marginBottom: 16,
//   },
//   badges: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   badge: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'center',
//   },
//   badgeValue: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '800',
//   },
//   badgeLabel: {
//     color: 'rgba(255,255,255,0.65)',
//     fontSize: 10,
//     marginTop: 2,
//   },
//   content: {
//     padding: 16,
//   },
//   emergencyCard: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//     marginBottom: 20,
//   },
//   emergencyIcon: {
//     fontSize: 32,
//   },
//   emergencyTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   emergencySubtitle: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   sectionTitle: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     fontWeight: '700',
//     letterSpacing: 1,
//     marginBottom: 10,
//     marginTop: 4,
//   },
//   quickActions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 20,
//   },
//   quickAction: {
//     width: '47%',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     fontSize: 28,
//     marginBottom: 6,
//   },
//   quickActionLabel: {
//     fontSize: 12,
//     color: COLORS.text,
//     fontWeight: '600',
//   },
//   nextCard: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 20,
//   },
//   nextIcon: {
//     fontSize: 28,
//   },
//   nextDate: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   nextSub: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },
// })

import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { COLORS } from '../../constants/color'
import { donationsService } from '../../services/donation.service'
import { emergencyService } from '../../services/emergency.service'

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'DONOR'

  const { data: stats } = useQuery({
    queryKey: ['donationStats'],
    queryFn: donationsService.getDonationStats,
    enabled: role === 'DONOR',
  })

  const { data: emergencyRequests } = useQuery({
    queryKey: ['emergencyRequests'],
    queryFn: () => emergencyService.getEmergencyRequests(),
  })

  const criticalCount = emergencyRequests?.filter(
    (r: any) => r.urgency === 'CRITICAL'
  ).length || 0

  // Quick actions based on role
  const quickActions = role === 'ADMIN'
    ? [
        { icon: '👥', label: 'All Users',    route: '/(tabs)/profile'   },
        { icon: '🏥', label: 'Centers',      route: '/(tabs)/map'       },
        { icon: '🚨', label: 'Emergencies',  route: '/(tabs)/emergency' },
        { icon: '📊', label: 'Stats',        route: '/(tabs)/profile'   },
      ]
    : role === 'STAFF'
    ? [
        { icon: '📅', label: 'Appointments', route: '/(tabs)/history'   },
        { icon: '🚨', label: 'Emergencies',  route: '/(tabs)/emergency' },
        { icon: '📍', label: 'Centers',      route: '/(tabs)/map'       },
        { icon: '👤', label: 'Profile',      route: '/(tabs)/profile'   },
      ]
    : role === 'EMERGENCY_REQUESTER'
    ? [
        { icon: '🚨', label: 'Post SOS',     route: '/(tabs)/emergency' },
        { icon: '📋', label: 'My Requests',  route: '/(tabs)/emergency' },
        { icon: '📍', label: 'Centers',      route: '/(tabs)/map'       },
        { icon: '👤', label: 'Profile',      route: '/(tabs)/profile'   },
      ]
    : [
        { icon: '📍', label: 'Find Centers', route: '/(tabs)/map'       },
        { icon: '📅', label: 'Book Slot',    route: '/(tabs)/map'       },
        { icon: '📋', label: 'My History',   route: '/(tabs)/history'   },
        { icon: '🏆', label: 'Achievements', route: '/(tabs)/profile'   },
      ]

  // Role greeting
  const roleLabel =
    role === 'ADMIN'               ? '👑 Admin'
    : role === 'STAFF'             ? '🏥 Hospital Staff'
    : role === 'EMERGENCY_REQUESTER' ? '🚨 Emergency Requester'
    : '🩸 Donor'

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roleLabel}>{roleLabel}</Text>
        <Text style={styles.name}>{user?.name || 'User'} 👋</Text>

        {/* Show stats only for donors */}
        {role === 'DONOR' && (
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeValue}>
                {user?.bloodGroup?.replace('_POS', '+').replace('_NEG', '-') || 'N/A'}
              </Text>
              <Text style={styles.badgeLabel}>Blood Type</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeValue}>
                {stats?.totalDonations || 0}
              </Text>
              <Text style={styles.badgeLabel}>Donations</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeValue}>
                {stats?.livesSaved || 0}
              </Text>
              <Text style={styles.badgeLabel}>Lives Saved</Text>
            </View>
          </View>
        )}
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
              {criticalCount > 0
                ? `${criticalCount} critical needs near you`
                : 'No critical requests right now'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
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

        {/* Next Eligible Date — Donors only */}
        {role === 'DONOR' && (
          <>
            <Text style={styles.sectionTitle}>NEXT ELIGIBLE DATE</Text>
            <View style={styles.nextCard}>
              <Text style={styles.nextIcon}>📅</Text>
              <View>
                <Text style={styles.nextDate}>
                  {stats?.nextEligibleDate
                    ? new Date(stats.nextEligibleDate).toDateString()
                    : 'You are eligible now!'}
                </Text>
                <Text style={styles.nextSub}>
                  {stats?.isEligible
                    ? '✅ You can donate today'
                    : '⏳ Waiting period not over yet'}
                </Text>
              </View>
            </View>
          </>
        )}
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
  roleLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 4,
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