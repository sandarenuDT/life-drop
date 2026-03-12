import { Tabs } from 'expo-router'
import { COLORS } from '../../constants/color'

export default function TabsLayout() {
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
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Find', tabBarLabel: 'Find' }}
      />
      <Tabs.Screen
        name="emergency"
        options={{ title: 'SOS', tabBarLabel: 'SOS' }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History', tabBarLabel: 'History' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarLabel: 'Profile' }}
      />
    </Tabs>
  )
}