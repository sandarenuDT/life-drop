import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { COLORS } from '../../constants/color'
import { api } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    try {
      setLoading(true)
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.accessToken, data.refreshToken)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🩸</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue saving lives</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    padding: 24,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  registerText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
})