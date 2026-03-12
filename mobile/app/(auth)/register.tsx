import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { COLORS } from '../../constants/color'
import { api } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !city) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    try {
      setLoading(true)
      const { data } = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        city,
        bloodGroup: 'O_POS',
        dateOfBirth: '1990-01-01',
      })
      setAuth(data.user, data.accessToken, data.refreshToken)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join thousands of lifesavers</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimum 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Login</Text>
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
    paddingTop: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    paddingBottom: 40,
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
    marginBottom: 12,
    color: COLORS.text,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  loginText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
})
