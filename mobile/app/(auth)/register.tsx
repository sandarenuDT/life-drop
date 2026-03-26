import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native"
import { router } from "expo-router"
import { useState } from "react"
import { COLORS } from "../../constants/color"
import { useAuthStore } from "../../store/authStore"
import DateTimePicker from "@react-native-community/datetimepicker"
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
] as const

const ROLES = [
  { value: "DONOR",               label: "Donor"               },
  { value: "STAFF",               label: "Hospital Staff"       },
  { value: "EMERGENCY_REQUESTER", label: "Emergency Requester"  },
  { value: "ADMIN",               label: "Admin"                },
] as const
export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [bloodGroup, setBloodGroup] = useState<string | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)

  // Blood group dropdown
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(
    BLOOD_GROUPS.map((bg) => ({ label: bg.label, value: bg.value }))
  )

  // Role dropdown
  const [roleOpen, setRoleOpen] = useState(false)
  const [role, setRole] = useState<string>("DONOR")
  const [roleItems, setRoleItems] = useState(
    ROLES.map((r) => ({ label: r.label, value: r.value }))
  )

  const isDonor = role === "DONOR"

  const setAuth = useAuthStore((s) => s.setAuth)

  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !city) {
      Alert.alert("Missing Fields", "Please fill in all fields")
      return
    }

    // Blood group and DOB only required for DONORs
    if (isDonor && !bloodGroup) {
      Alert.alert("Blood Group Required", "Please select your blood group.")
      return
    }

    if (isDonor && !dateOfBirth) {
      Alert.alert("Date of Birth Required", "Please select your date of birth.")
      return
    }

    try {
      setLoading(true)

      const { data } = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        city,
        role,
        ...(isDonor && { bloodGroup }),
        ...(isDonor && dateOfBirth && { dateOfBirth: formatDate(dateOfBirth) }),
      })

      setAuth(data.user, data.accessToken, data.refreshToken)
      router.replace("/(tabs)")

    } catch (error: any) {
      const zodError = error.response?.data?.errors?.[0]?.message
      const apiError = error.response?.data?.message
      Alert.alert("Registration Failed", zodError || apiError || "Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
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
          placeholder="Enter your phone number (min 10 digits)"
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

        {/* ── Role ────────────────────────────────────────────────────────── */}
        <Text style={styles.label}>
          Role <Text style={styles.required}>*</Text>
        </Text>
        <DropDownPicker
          open={roleOpen}
          value={role}
          items={roleItems}
          setOpen={(o) => {
            setRoleOpen(o)
            if (o) setOpen(false) // close blood group dropdown if open
          }}
          setValue={(val) => setRole(val)}
          setItems={setRoleItems}
          placeholder="Select your role"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={{ color: COLORS.textMuted }}
          selectedItemLabelStyle={{ color: COLORS.primary, fontWeight: "700" }}
          zIndex={2000}
          zIndexInverse={1000}
        />

        {roleOpen && <View style={{ height: ROLES.length * 44 }} />}

        {/* ── Blood Group + DOB (DONOR only) ───────────────────────────────── */}
        {isDonor && (
          <>
            <Text style={styles.label}>
              Blood Group <Text style={styles.required}>*</Text>
            </Text>
            <DropDownPicker
              open={open}
              value={bloodGroup}
              items={items}
              setOpen={(o) => {
                setOpen(o)
                if (o) setRoleOpen(false) // close role dropdown if open
              }}
              setValue={(val) => setBloodGroup(val)}
              setItems={setItems}
              placeholder="Select your blood group"
              listMode="SCROLLVIEW"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={{ color: COLORS.textMuted }}
              selectedItemLabelStyle={{ color: COLORS.primary, fontWeight: "700" }}
              zIndex={1000}
              zIndexInverse={2000}
            />

            {open && <View style={{ height: BLOOD_GROUPS.length * 44 }} />}

            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: dateOfBirth ? COLORS.text : COLORS.textMuted }}>
                {dateOfBirth ? dateOfBirth.toDateString() : "Select your date of birth"}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={dateOfBirth || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false)
                  if (selectedDate) setDateOfBirth(selectedDate)
                }}
              />
            )}
          </>
        )}

        {/* ── Submit ──────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerText}>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  form: {
    padding: 24,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
    justifyContent: "center",
    color: COLORS.text,
  },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  dropdownContainer: {
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  loginText: {
    textAlign: "center",
    color: COLORS.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },
})