
import { Tabs } from 'expo-router'
import { COLORS } from '../../constants/color'
import { useAuthStore } from '../../store/authStore'
import { Text } from 'react-native';

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'DONOR'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🏠" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel: 'Find',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="📍" color={color} />
          ),
          // Hide map for admin
          tabBarItemStyle: role === 'ADMIN' || role === 'EMERGENCY_RESPONDER'
            ? { display: 'none' }
            : {}
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarLabel: 'SOS',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🚨" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="📋" color={color} />
          ),
          // Hide history for non donors
          tabBarItemStyle: role !== 'DONOR'
            ? { display: 'none' }
            : {}
        }}
      />
      {/* //fro admin panel */}
      <Tabs.Screen
        name="admin"
        options={{
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="👑" color={color} />
          ),
          tabBarItemStyle: role !== 'ADMIN'
            ? { display: 'none' }
            : {},
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="👤" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}


function TabIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <Text style={{ color, fontSize: 18 }}>
      {icon}
    </Text>
  )
}