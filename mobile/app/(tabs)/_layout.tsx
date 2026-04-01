import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { COLORS } from '../../constants/color'
import { useAuthStore } from '../../store/authStore'

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>
}

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'DONOR'

  return (
    <Tabs
      screenOptions={{
        headerShown:            false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor:  COLORS.border,
          paddingBottom:   4,
          height:          60,
        },
      }}
    >
      {/* Home — ALL roles */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon:  () => <Icon emoji="🏠" />,
        }}
      />

      {/* Find Centers — DONOR + STAFF only */}
      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel:     'Find',
          tabBarIcon:      () => <Icon emoji="📍" />,
          tabBarItemStyle: (role === 'ADMIN' || role === 'EMERGENCY_REQUESTER')
            ? { display: 'none' }
            : {},
        }}
      />

      {/* SOS — DONOR + STAFF + EMERGENCY_REQUESTER only
          Admin does NOT need SOS tab — they manage it from Admin Panel */}
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarLabel:     'SOS',
          tabBarIcon:      () => <Icon emoji="🚨" />,
          tabBarItemStyle: role === 'ADMIN'
            ? { display: 'none' }
            : {},
        }}
      />

      {/* History — DONOR only */}
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel:     'History',
          tabBarIcon:      () => <Icon emoji="📋" />,
          tabBarItemStyle: role !== 'DONOR'
            ? { display: 'none' }
            : {},
        }}
      />

      {/* Admin Panel — ADMIN only */}
      <Tabs.Screen
        name="admin"
        options={{
          tabBarLabel:     'Admin',
          tabBarIcon:      () => <Icon emoji="👑" />,
          tabBarItemStyle: role !== 'ADMIN'
            ? { display: 'none' }
            : {},
        }}
      />

      {/* Profile — ALL roles */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon:  () => <Icon emoji="👤" />,
        }}
      />
    </Tabs>
  )
}