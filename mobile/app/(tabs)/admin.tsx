

import {
  View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator,
  Modal
} from 'react-native'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import {
  layout, header, cards, typography,
  buttons, tags, stats, emptyState, modal as modalStyles
} from '../../constants/styles'
import { adminService } from '../../services/admin.service'
import { centersService } from '../../services/center.service'
import { adminStyles } from '../../constants/styles'
const CENTER_TYPES = ['BANK', 'HOSPITAL', 'NGO', 'CLINIC']


const CENTER_TYPE_ICONS: Record<string, string> = {
  BANK: '🏦',
  HOSPITAL: '🏥',
  NGO: '❤️',
  CLINIC: '🩺',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#e63946',
  DONOR: '#06d6a0',
  STAFF: '#00d4ff',
  EMERGENCY_REQUESTER: '#ffd166',
}

// ── Validation ────────────────────────────────────────────────────────────────
const validateCenter = (fields: any) => {
  const errors: Record<string, string> = {}

  if (!fields.name || fields.name.trim().length < 2) {
    errors.name = "Center name must be at least 2 characters"
  }
  if (!fields.address || fields.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters"
  }
  if (!fields.phone || fields.phone.replace(/\D/g, '').length < 7) {
    errors.phone = "Please enter a valid phone number"
  }
  if (!fields.hours || fields.hours.trim().length < 3) {
    errors.hours = "Please enter opening hours e.g. 8AM - 5PM"
  }
  if (!fields.latitude) {
    errors.latitude = "Latitude is required"
  } else if (isNaN(parseFloat(fields.latitude))) {
    errors.latitude = "Latitude must be a number e.g. 6.9271"
  }
  if (!fields.longitude) {
    errors.longitude = "Longitude is required"
  } else if (isNaN(parseFloat(fields.longitude))) {
    errors.longitude = "Longitude must be a number e.g. 79.8612"
  }
  if (!fields.slots) {
    errors.slots = "Number of slots is required"
  } else if (isNaN(parseInt(fields.slots)) || parseInt(fields.slots) < 1) {
    errors.slots = "Slots must be at least 1"
  }

  return errors
}

// ── Field Error Component ─────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <View style={adminStyles.fieldError}>
      <Text style={adminStyles.fieldErrorText}>⚠️ {message}</Text>
    </View>
  )
}

// ── Add Center Modal ──────────────────────────────────────────────────────────
function AddCenterModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [hours, setHours] = useState('')
  const [type, setType] = useState<'HOSPITAL' | 'BANK' | 'NGO' | 'CLINIC'>('HOSPITAL')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [slots, setSlots] = useState('10')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validateCenter({
      name, address, phone, hours, latitude, longitude, slots
    }))
  }

  const resetForm = () => {
    setName(''); setAddress(''); setPhone('')
    setHours(''); setType('HOSPITAL')
    setLatitude(''); setLongitude('')
    setSlots('10'); setErrors({}); setTouched({})
  }

  const { mutate: addCenter, isPending } = useMutation({
    mutationFn: adminService.addCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      Alert.alert('✅ Success', 'Donation center added successfully!')
      resetForm()
      onClose()
    },
    onError: (error: any) => {
      Alert.alert(
        'Failed to Add Center',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      )

    }

  })

  const handleSubmit = () => {
    // Touch all fields
    setTouched({
      name: true, address: true, phone: true,
      hours: true, latitude: true, longitude: true, slots: true,
    })
    const e = validateCenter({ name, address, phone, hours, latitude, longitude, slots })
    setErrors(e)
    if (Object.keys(e).length > 0) return

    addCenter({
      name,
      address,
      phone,
      hours,
      type,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      slots: parseInt(slots),
    })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>

          {/* Modal Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>➕ Add Donation Center</Text>
            <TouchableOpacity onPress={() => { resetForm(); onClose() }}>
              <Text style={modalStyles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* Center Name */}
            <Text style={typography.label}>Center Name</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.name && errors.name && adminStyles.inputError,
                touched.name && !errors.name && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. National Blood Centre"
              value={name}
              onChangeText={setName}
              onBlur={() => handleBlur('name')}
            />
            {touched.name && errors.name && <FieldError message={errors.name} />}
            {touched.name && !errors.name && name.length > 0 && (
              <Text style={typography.successText}>✅ Looks good!</Text>
            )}

            {/* Address */}
            <Text style={typography.label}>Address</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.address && errors.address && adminStyles.inputError,
                touched.address && !errors.address && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. Narahenpita, Colombo 05"
              value={address}
              onChangeText={setAddress}
              onBlur={() => handleBlur('address')}
            />
            {touched.address && errors.address && <FieldError message={errors.address} />}
            {touched.address && !errors.address && address.length > 0 && (
              <Text style={typography.successText}>✅ Looks good!</Text>
            )}

            {/* Phone */}
            <Text style={typography.label}>Phone Number</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.phone && errors.phone && adminStyles.inputError,
                touched.phone && !errors.phone && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. +94-11-269-4600"
              value={phone}
              onChangeText={setPhone}
              onBlur={() => handleBlur('phone')}
              keyboardType="phone-pad"
            />
            {touched.phone && errors.phone && <FieldError message={errors.phone} />}
            {touched.phone && !errors.phone && phone.length > 0 && (
              <Text style={typography.successText}>✅ Valid phone!</Text>
            )}

            {/* Hours */}
            <Text style={typography.label}>Opening Hours</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.hours && errors.hours && adminStyles.inputError,
                touched.hours && !errors.hours && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. 8:00 AM - 4:30 PM"
              value={hours}
              onChangeText={setHours}
              onBlur={() => handleBlur('hours')}
            />
            {touched.hours && errors.hours && <FieldError message={errors.hours} />}
            {touched.hours && !errors.hours && hours.length > 0 && (
              <Text style={typography.successText}>✅ Looks good!</Text>
            )}

            {/* Center Type */}
            <Text style={typography.label}>Center Type</Text>
            <View style={adminStyles.typeRow}>
              {CENTER_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    adminStyles.typeBtn,
                    type === t && adminStyles.typeBtnActive
                  ]}
                  onPress={() => setType(t as 'HOSPITAL' | 'BANK' | 'NGO' | 'CLINIC')}
                >
                  <Text style={adminStyles.typeBtnIcon}>
                    {CENTER_TYPE_ICONS[t]}
                  </Text>
                  <Text style={[
                    adminStyles.typeBtnText,
                    type === t && adminStyles.typeBtnTextActive
                  ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Latitude */}
            <Text style={typography.label}>Latitude</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.latitude && errors.latitude && adminStyles.inputError,
                touched.latitude && !errors.latitude && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. 6.9271"
              value={latitude}
              onChangeText={setLatitude}
              onBlur={() => handleBlur('latitude')}
              keyboardType="numeric"
            />
            {touched.latitude && errors.latitude && <FieldError message={errors.latitude} />}

            {/* Longitude */}
            <Text style={typography.label}>Longitude</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.longitude && errors.longitude && adminStyles.inputError,
                touched.longitude && !errors.longitude && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. 79.8612"
              value={longitude}
              onChangeText={setLongitude}
              onBlur={() => handleBlur('longitude')}
              keyboardType="numeric"
            />
            {touched.longitude && errors.longitude && <FieldError message={errors.longitude} />}

            {/* How to get coordinates */}
            <View style={adminStyles.hintBox}>
              <Text style={adminStyles.hintTitle}>💡 How to get coordinates</Text>
              <Text style={adminStyles.hintText}>
                1. Open Google Maps on your phone{'\n'}
                2. Long press on the center location{'\n'}
                3. The numbers that appear at the bottom are Latitude and Longitude{'\n'}
                e.g. 6.9271, 79.8612
              </Text>
            </View>

            {/* Slots */}
            <Text style={typography.label}>Available Slots Per Day</Text>
            <TextInput
              style={[
                adminStyles.input,
                touched.slots && errors.slots && adminStyles.inputError,
                touched.slots && !errors.slots && adminStyles.inputSuccess,
              ]}
              placeholder="e.g. 10"
              value={slots}
              onChangeText={setSlots}
              onBlur={() => handleBlur('slots')}
              keyboardType="numeric"
            />
            {touched.slots && errors.slots && <FieldError message={errors.slots} />}
            <Text style={typography.hint}>
              How many donors can donate per day at this center
            </Text>

            {/* Submit Button */}
            <TouchableOpacity
              style={[buttons.primary, isPending && buttons.disabled]}
              onPress={handleSubmit}
              disabled={isPending}
            >
              <Text style={buttons.primaryText}>
                {isPending ? "Adding Center..." : "➕ Add Center"}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

// ── Main Admin Screen ─────────────────────────────────────────────────────────
export default function AdminScreen() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'centers' | 'users'>('centers')
  const [showAddCenter, setShowAddCenter] = useState(false)

  // Admin Stats
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
    refetchOnWindowFocus: true,
    staleTime: 0,
  })
  console.log('Admin Statsdeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeygu:', adminStats)

  // All Centers
  const { data: centers, isLoading: centersLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: centersService.getAllCenters,
    staleTime: 0,

  })

  // All Users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: adminService.getAllUsers,
    enabled: activeTab === 'users',
    staleTime: 0,

  })

  // Delete Center
  const { mutate: deleteCenter } = useMutation({
    mutationFn: adminService.deleteCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      // console.log('sdvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',adminStats?.totalUsers)

      Alert.alert('✅ Done', 'Center deleted successfully')
    },
    onError: (error: any) => {
      Alert.alert(
        'Delete Failed',
        error.response?.data?.message || 'Could not delete center'
      )
    }
  })

  // Delete User
  const { mutate: deleteUser } = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      Alert.alert('✅ Done', 'User deleted successfully')
    },
    onError: (error: any) => {
      Alert.alert(
        'Delete Failed',
        error.response?.data?.message || 'Could not delete user'
      )
    }
  })

  const confirmDeleteCenter = (id: string, name: string) => {
    Alert.alert(
      '🗑️ Delete Center',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCenter(id)
        }
      ]
    )
  }

  const confirmDeleteUser = (id: string, name: string) => {
    Alert.alert(
      '🗑️ Delete User',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(id)
        }
      ]
    )
  }

  return (
    <View style={layout.container}>

      {/* Header */}
      {/* Header */}
      <View style={header.container}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={header.title}>👑 Admin Panel</Text>
            <Text style={header.subtitle}>Manage your LifeDrop system</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              queryClient.invalidateQueries({ queryKey: ['adminStats'] })
              queryClient.invalidateQueries({ queryKey: ['centers'] })
              queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={layout.content}>

        {/* Stats Row */}
        {statsLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 10 }} />
        ) : (
          <View style={stats.row}>
            {[
              { icon: '👥', label: 'Users', value: adminStats?.totalUsers || 0 },
              { icon: '🩸', label: 'Donors', value: adminStats?.totalDonors || 0 },
              { icon: '🏥', label: 'Centers', value: adminStats?.totalCenters || 0 },
              { icon: '🚨', label: 'Active SOS', value: adminStats?.activeEmergencies || 0 },
            ].map((s) => (
              <View key={s.label} style={stats.box}>
                <Text style={stats.icon}>{s.icon}</Text>
                <Text style={stats.value}>{s.value}</Text>
                <Text style={stats.label}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tab Switcher */}
        <View style={adminStyles.tabRow}>
          <TouchableOpacity
            style={[adminStyles.tab, activeTab === 'centers' && adminStyles.tabActive]}
            onPress={() => setActiveTab('centers')}
          >
            <Text style={[
              adminStyles.tabText,
              activeTab === 'centers' && adminStyles.tabTextActive
            ]}>
              🏥 Centers ({centers?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[adminStyles.tab, activeTab === 'users' && adminStyles.tabActive]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[
              adminStyles.tabText,
              activeTab === 'users' && adminStyles.tabTextActive
            ]}>
              👥 Users ({users?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Centers Tab ── */}
        {activeTab === 'centers' && (
          <View>
            {/* Add Center Button */}
            <TouchableOpacity
              style={adminStyles.addButton}
              onPress={() => setShowAddCenter(true)}
            >
              <Text style={adminStyles.addButtonText}>➕ Add New Center</Text>
            </TouchableOpacity>

            {centersLoading && (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            )}

            {!centersLoading && centers?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>🏥</Text>
                <Text style={emptyState.title}>No Centers Yet</Text>
                <Text style={emptyState.text}>
                  Tap &quot;Add New Center&quot; to add your first donation center.
                  Donors will see it on their map.
                </Text>
              </View>
            )}

            {centers?.map((center: any) => (
              <View key={center.id} style={cards.base}>
                <View style={adminStyles.cardHeader}>
                  <Text style={adminStyles.centerTypeIcon}>
                    {CENTER_TYPE_ICONS[center.type] || '🏥'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.cardTitle}>{center.name}</Text>
                    <View style={adminStyles.typeTagRow}>
                      <View style={tags.danger}>
                        <Text style={tags.dangerText}>{center.type}</Text>
                      </View>
                      <View style={tags.success}>
                        <Text style={tags.successText}>
                          {center.slots} slots/day
                        </Text>
                      </View>
                      <View style={[
                        tags.info,
                        !center.isActive && tags.warning
                      ]}>
                        <Text style={[
                          tags.infoText,
                          !center.isActive && tags.warningText
                        ]}>
                          {center.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={buttons.danger}
                    onPress={() => confirmDeleteCenter(center.id, center.name)}
                  >
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {/* Center Details */}
                <View style={adminStyles.detailsSection}>
                  <Text style={typography.cardSubtitle}>
                    📍 {center.address}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    📞 {center.phone}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    ⏰ {center.hours}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    🌐 {center.latitude}, {center.longitude}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <View>
            {usersLoading && (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            )}

            {!usersLoading && users?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>👥</Text>
                <Text style={emptyState.title}>No Users Yet</Text>
                <Text style={emptyState.text}>
                  No users have registered yet.
                </Text>
              </View>
            )}

            {users?.map((user: any) => (
              <View key={user.id} style={cards.base}>
                <View style={adminStyles.cardHeader}>
                  <View style={[
                    adminStyles.roleAvatar,
                    { backgroundColor: `${ROLE_COLORS[user.role] || '#888'}22` }
                  ]}>
                    <Text style={adminStyles.roleAvatarIcon}>
                      {user.role === 'ADMIN' ? '👑'
                        : user.role === 'STAFF' ? '🏥'
                          : user.role === 'EMERGENCY_REQUESTER' ? '🚨'
                            : '🩸'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.cardTitle}>{user.name}</Text>
                    <View style={adminStyles.typeTagRow}>
                      <View style={[
                        adminStyles.roleTag,
                        { backgroundColor: `${ROLE_COLORS[user.role] || '#888'}22` }
                      ]}>
                        <Text style={[
                          adminStyles.roleTagText,
                          { color: ROLE_COLORS[user.role] || '#888' }
                        ]}>
                          {user.role}
                        </Text>
                      </View>
                      {user.bloodGroup && (
                        <View style={tags.blood}>
                          <Text style={tags.bloodText}>
                            🩸 {user.bloodGroup
                              .replace('_POS', '+')
                              .replace('_NEG', '-')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={buttons.danger}
                    onPress={() => confirmDeleteUser(user.id, user.name)}
                  >
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {/* User Details */}
                <View style={adminStyles.detailsSection}>
                  <Text style={typography.cardSubtitle}>
                    📧 {user.email}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    📞 {user.phone}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    🏙️ {user.city}
                  </Text>
                  <Text style={typography.cardSubtitle}>
                    📅 Joined: {new Date(user.createdAt).toDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={layout.bottomSpace} />
      </ScrollView>

      {/* Add Center Modal */}
      <AddCenterModal
        visible={showAddCenter}
        onClose={() => setShowAddCenter(false)}
      />
    </View>
  )
}