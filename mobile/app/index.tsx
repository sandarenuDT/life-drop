// import { Redirect } from 'expo-router'
// import { useAuthStore } from '../store/authStore'

// export default function Index() {
//   const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

//   if (isLoggedIn) {
//     return <Redirect href="/(tabs)" />
//   }

//   return <Redirect href="/(auth)/onboarding" />
// }

import { Redirect } from 'expo-router'
import { useAuthStore } from '../store/authStore'

export default function Index() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user) as { role?: string } | null

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/onboarding" />
  }

  // Role based navigation
  if (user?.role === 'ADMIN') {
    return <Redirect href="/(tabs)" />
  }

  if (user?.role === 'STAFF') {
    return <Redirect href="/(tabs)" />
  }

  if (user?.role === 'EMERGENCY_REQUESTER') {
    return <Redirect href="/(tabs)" />
  }

  // Default — DONOR
  return <Redirect href="/(tabs)" />
}