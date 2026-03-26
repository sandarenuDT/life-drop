import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Platform, Modal
} from "react-native"
import { router } from "expo-router"
import { useState } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import { COLORS } from "../../constants/color"
import { useAuthStore } from "../../store/authStore"
import { api } from "../../services/api"
import DropDownPicker from "react-native-dropdown-picker"

const BLOOD_GROUPS = [
  { value: "A_POS", label: "A+" },
  { value: "A_NEG", label: "A−" },
  { value: "B_POS", label: "B+" },
  { value: "B_NEG", label: "B−" },
  { value: "AB_POS", label: "AB+" },
  { value: "AB_NEG", label: "AB−" },
  { value: "O_POS", label: "O+" },
  { value: "O_NEG", label: "O−" },
]

const ROLES = [
  { value: "DONOR", label: "Donor" },
  { value: "STAFF", label: "Hospital Staff" },
  { value: "EMERGENCY_REQUESTER", label: "Emergency Requester" },
  { value: "ADMIN", label: "Admin" },
]

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (fields: any) => {
  const errors: Record<string, string> = {}

  if (!fields.name || fields.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters"
  }

  if (!fields.email) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!fields.phone) {
    errors.phone = "Phone number is required"
  } else if (fields.phone.replace(/\D/g, '').length < 10) {
    errors.phone = "Phone number must be at least 10 digits"
  }

  if (!fields.city || fields.city.trim().length < 2) {
    errors.city = "City must be at least 2 characters"
  }

  if (!fields.password) {
    errors.password = "Password is required"
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must contain at least one uppercase letter"
  } else if (!/[0-9]/.test(fields.password)) {
    errors.password = "Password must contain at least one number"
  }

  if (!fields.role) {
    errors.role = "Please select your role"
  }

  if (fields.role === "DONOR") {
    if (!fields.bloodGroup) {
      errors.bloodGroup = "Blood group is required for donors"
    }
    if (!fields.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required for donors"
    } else {
      const dob = new Date(fields.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      if (age < 18) {
        errors.dateOfBirth = "You must be at least 18 years old to donate"
      }
      if (age > 65) {
        errors.dateOfBirth = "Donors must be under 65 years old"
      }
    }
  }

  return errors
}

// ── Field Error ───────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.icon}>⚠️</Text>
      <Text style={errorStyles.text}>{message}</Text>
    </View>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState<string>("DONOR")
  const [bloodGroup, setBloodGroup] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Date picker
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempDate, setTempDate] = useState<Date>(new Date(2000, 0, 1))

  // Dropdowns
  const [roleOpen, setRoleOpen] = useState(false)
  const [roleItems, setRoleItems] = useState(ROLES)
  const [bloodOpen, setBloodOpen] = useState(false)
  const [bloodItems, setBloodItems] = useState(BLOOD_GROUPS)

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [serverError, setServerError] = useState("")

  const setAuth = useAuthStore((s) => s.setAuth)
  const isDonor = role === "DONOR"

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day} / ${month} / ${year}`
  }

  const toISODate = (date: Date) =>
    date.toISOString().split("T")[0]

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validate({
      name, email, phone, password, city, role,
      bloodGroup,
      dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null
    }))
  }

  const handleRegister = async () => {
    setTouched({
      name: true, email: true, phone: true, password: true,
      city: true, role: true, bloodGroup: true, dateOfBirth: true,
    })

    const dobStr = dateOfBirth ? toISODate(dateOfBirth) : null
    const allErrors = validate({
      name, email, phone, password, city,
      role, bloodGroup, dateOfBirth: dobStr
    })
    setErrors(allErrors)

    if (Object.keys(allErrors).length > 0) return

    try {
      setLoading(true)
      setServerError("")

      const { data } = await api.post("/auth/register", {
        name, email, phone, password, city, role,
        ...(isDonor && { bloodGroup }),
        ...(isDonor && dobStr && { dateOfBirth: dobStr }),
      })

      setAuth(data.user, data.accessToken, data.refreshToken)
      router.replace("/(tabs)")

    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join thousands of lifesavers</Text>
      </View>

      <View style={styles.form}>
        {/* Server Error */}
        {serverError ? (
          <View style={styles.serverError}>
            <Text style={styles.serverErrorText}>❌ {serverError}</Text>
          </View>
        ) : null}

        {/* Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            touched.name && errors.name && styles.inputError,
            touched.name && !errors.name && styles.inputSuccess,
          ]}
          placeholder="Enter your full name"
          value={name}
          onChangeText={(v) => {
            setName(v)
            if (touched.name) {
              const e = validate({ name: v, email, phone, password, city, role, bloodGroup, dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null })
              setErrors(prev => ({ ...prev, name: e.name || '' }))
            }
          }}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && <FieldError message={errors.name} />}
        {touched.name && !errors.name && name.length > 0 && (
          <Text style={styles.successText}>✅ Looks good!</Text>
        )}

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
              const e = validate({ name, email: v, phone, password, city, role, bloodGroup, dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null })
              setErrors(prev => ({ ...prev, email: e.email || '' }))
            }
          }}
          onBlur={() => handleBlur("email")}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {touched.email && errors.email && <FieldError message={errors.email} />}
        {touched.email && !errors.email && email.length > 0 && (
          <Text style={styles.successText}>✅ Valid email!</Text>
        )}

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            touched.phone && errors.phone && styles.inputError,
            touched.phone && !errors.phone && styles.inputSuccess,
          ]}
          placeholder="+94 77 123 4567"
          value={phone}
          onChangeText={(v) => {
            setPhone(v)
            if (touched.phone) {
              const e = validate({ name, email, phone: v, password, city, role, bloodGroup, dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null })
              setErrors(prev => ({ ...prev, phone: e.phone || '' }))
            }
          }}
          onBlur={() => handleBlur("phone")}
          keyboardType="phone-pad"
        />
        {touched.phone && errors.phone && <FieldError message={errors.phone} />}
        {touched.phone && !errors.phone && phone.length > 0 && (
          <Text style={styles.successText}>✅ Valid phone number!</Text>
        )}

        {/* City */}
        <Text style={styles.label}>City</Text>
        <TextInput
          style={[
            styles.input,
            touched.city && errors.city && styles.inputError,
            touched.city && !errors.city && styles.inputSuccess,
          ]}
          placeholder="Enter your city"
          value={city}
          onChangeText={(v) => {
            setCity(v)
            if (touched.city) {
              const e = validate({ name, email, phone, password, city: v, role, bloodGroup, dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null })
              setErrors(prev => ({ ...prev, city: e.city || '' }))
            }
          }}
          onBlur={() => handleBlur("city")}
        />
        {touched.city && errors.city && <FieldError message={errors.city} />}
        {touched.city && !errors.city && city.length > 0 && (
          <Text style={styles.successText}>✅ Great!</Text>
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
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={password}
            onChangeText={(v) => {
              setPassword(v)
              if (touched.password) {
                const e = validate({ name, email, phone, password: v, city, role, bloodGroup, dateOfBirth: dateOfBirth ? toISODate(dateOfBirth) : null })
                setErrors(prev => ({ ...prev, password: e.password || '' }))
              }
            }}
            onBlur={() => handleBlur("password")}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password strength */}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            <View style={[styles.strengthBar, password.length >= 8 && styles.strengthFill]} />
            <View style={[styles.strengthBar, /[A-Z]/.test(password) && styles.strengthFill]} />
            <View style={[styles.strengthBar, /[0-9]/.test(password) && styles.strengthFill]} />
            <View style={[styles.strengthBar, /[^A-Za-z0-9]/.test(password) && styles.strengthFill]} />
            <Text style={styles.strengthLabel}>
              {password.length < 8 ? "Too short"
                : !/[A-Z]/.test(password) ? "Add uppercase"
                  : !/[0-9]/.test(password) ? "Add a number"
                    : "Strong 💪"}
            </Text>
          </View>
        )}
        {touched.password && errors.password && <FieldError message={errors.password} />}

        {/* Role */}
        <Text style={styles.label}>I am a</Text>
        <DropDownPicker
          open={roleOpen}
          value={role}
          items={roleItems}
          setOpen={(o) => { setRoleOpen(o); if (o) setBloodOpen(false) }}
          setValue={(val) => { setRole(val); handleBlur("role") }}
          setItems={setRoleItems}
          placeholder="Select your role"
          listMode="SCROLLVIEW"
          style={[
            styles.dropdown,
            touched.role && errors.role && styles.inputError,
          ]}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {roleOpen && <View style={{ height: ROLES.length * 46 }} />}
        {touched.role && errors.role && <FieldError message={errors.role} />}

        {/* Donor only fields */}
        {isDonor && (
          <>
            {/* Blood Group */}
            <Text style={styles.label}>
              Blood Group <Text style={styles.required}>*</Text>
            </Text>
            <DropDownPicker
              open={bloodOpen}
              value={bloodGroup}
              items={bloodItems}
              setOpen={(o) => { setBloodOpen(o); if (o) setRoleOpen(false) }}
              setValue={(val) => { setBloodGroup(val); handleBlur("bloodGroup") }}
              setItems={setBloodItems}
              placeholder="Select your blood group"
              listMode="SCROLLVIEW"
              style={[
                styles.dropdown,
                touched.bloodGroup && errors.bloodGroup && styles.inputError,
                touched.bloodGroup && !errors.bloodGroup && bloodGroup && styles.inputSuccess,
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
            {bloodOpen && <View style={{ height: BLOOD_GROUPS.length * 46 }} />}
            {touched.bloodGroup && errors.bloodGroup && (
              <FieldError message={errors.bloodGroup} />
            )}
            {touched.bloodGroup && !errors.bloodGroup && bloodGroup && (
              <Text style={styles.successText}>✅ Blood group selected!</Text>
            )}
            {/* Date of Birth */}
            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.dateButton,
                touched.dateOfBirth && errors.dateOfBirth && styles.inputError,
                touched.dateOfBirth && !errors.dateOfBirth && dateOfBirth && styles.inputSuccess,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={[styles.dateText, !dateOfBirth && styles.datePlaceholder]}>
                {dateOfBirth ? formatDate(dateOfBirth) : "Select your date of birth"}
              </Text>
              <Text style={styles.dateArrow}>›</Text>
            </TouchableOpacity>

            {touched.dateOfBirth && errors.dateOfBirth && (
              <FieldError message={errors.dateOfBirth} />
            )}
            {touched.dateOfBirth && !errors.dateOfBirth && dateOfBirth && (
              <Text style={styles.successText}>✅ Valid date of birth!</Text>
            )}

            {/* ✅ Single picker — works on both iOS & Android */}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                minimumDate={new Date(1940, 0, 1)}
                onChange={(event, selected) => {
                  setShowDatePicker(false)
                  if (selected) {
                    setDateOfBirth(selected)
                    setTouched(prev => ({ ...prev, dateOfBirth: true }))
                    const e = validate({
                      name, email, phone, password, city,
                      role, bloodGroup,
                      dateOfBirth: toISODate(selected),
                    })
                    setErrors(prev => ({ ...prev, dateOfBirth: e.dateOfBirth || '' }))
                  }
                }}
              />
            )}
          </>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Register Now"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 40,
    paddingTop: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
  form: { padding: 24, paddingBottom: 40 },
  serverError: {
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#ffcccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  serverErrorText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  required: { color: "#FF3B30" },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: { borderColor: "#FF3B30", backgroundColor: "#fff8f8" },
  inputSuccess: { borderColor: "#06d6a0", backgroundColor: "#f8fffc" },
  successText: { fontSize: 12, color: "#06d6a0", fontWeight: "600", marginTop: 4 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeButton: { position: "absolute", right: 14, padding: 4 },
  eyeIcon: { fontSize: 18 },
  strengthRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#e0e0e0" },
  strengthFill: { backgroundColor: "#06d6a0" },
  strengthLabel: { fontSize: 11, color: COLORS.textMuted, marginLeft: 6 },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  dropdownContainer: {
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
  },

  // Date button
  dateButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
  },
  dateIcon: { fontSize: 20 },
  dateText: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: "500" },
  datePlaceholder: { color: "#aaa", fontWeight: "400" },
  dateArrow: { fontSize: 20, color: COLORS.textMuted },

  // iOS modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  modalCancel: { fontSize: 15, color: COLORS.textMuted },
  modalDone: { fontSize: 15, color: COLORS.primary, fontWeight: "700" },
  iosPicker: { height: 220 },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  loginText: { textAlign: "center", color: COLORS.textMuted, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontWeight: "700" },
})

const errorStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#ffcccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  icon: { fontSize: 13 },
  text: { fontSize: 12, color: "#cc0000", fontWeight: "500", flex: 1 },
})