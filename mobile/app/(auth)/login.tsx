import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { COLORS } from '../../constants/color'
import { api } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.icon}>⚠️</Text>
      <Text style={errorStyles.text}>{message}</Text>
    </View>
  )
}

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [serverError, setServerError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)

  const validate = (fields: { email: string; password: string }) => {
    const errs: Record<string, string> = {}

    if (!fields.email) {
      errs.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Please enter a valid email address"
    }

    if (!fields.password) {
      errs.password = "Password is required"
    } else if (fields.password.length < 8) {
      errs.password = "Password must be at least 8 characters"
    }

    return errs
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validate({ email, password }))
  }

  const handleLogin = async () => {
    setTouched({ email: true, password: true })
    const errs = validate({ email, password })
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      setLoading(true)
      setServerError('')
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.accessToken, data.refreshToken)
      router.replace('/(tabs)')
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🩸</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue saving lives</Text>
      </View>

      <View style={styles.form}>
        {/* Server Error */}
        {serverError ? (
          <View style={styles.serverError}>
            <Text style={styles.serverErrorText}>❌ {serverError}</Text>
          </View>
        ) : null}

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[
            styles.input,
            touched.email && errors.email && styles.inputError,
            touched.email && !errors.email && styles.inputSuccess,
          ]}
          placeholder="example@email.com"
          value={email}
          onChangeText={(v) => {
            setEmail(v)
            if (touched.email) {
              setErrors(validate({ email: v, password }))
            }
          }}
          onBlur={() => handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {touched.email && errors.email && (
          <FieldError message={errors.email} />
        )}
        {touched.email && !errors.email && email.length > 0 && (
          <Text style={styles.successText}>✅ Valid email!</Text>
        )}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[
              styles.passwordInput,
              touched.password && errors.password && styles.inputError,
              touched.password && !errors.password && styles.inputSuccess,
            ]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(v) => {
              setPassword(v)
              if (touched.password) {
                setErrors(validate({ email, password: v }))
              }
            }}
            onBlur={() => handleBlur('password')}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
        {touched.password && errors.password && (
          <FieldError message={errors.password} />
        )}

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>
            Do not have an account?{' '}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  form: { padding: 24, marginTop: 8 },
  serverError: {
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  serverErrorText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#fff8f8',
  },
  inputSuccess: {
    borderColor: '#06d6a0',
    backgroundColor: '#f8fffc',
  },
  successText: {
    fontSize: 12,
    color: '#06d6a0',
    fontWeight: '600',
    marginTop: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  registerText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 14,
  },
  registerLink: { color: COLORS.primary, fontWeight: '700' },
})

const errorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  icon: { fontSize: 13 },
  text: { fontSize: 12, color: '#cc0000', fontWeight: '500', flex: 1 },
})