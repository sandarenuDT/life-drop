
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Modal, TextInput
} from 'react-native'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import {
  layout, header, cards, typography,
  buttons, emptyState, modal as modalStyles
} from '../../constants/styles'
import { emergencyService } from '../../services/emergency.service'
import { useAuthStore } from '../../store/authStore'
import DropDownPicker from 'react-native-dropdown-picker'

// ── Urgency Colors ────────────────────────────────────────────────────────────
const urgencyConfig = {
  CRITICAL: { bg: '#fff0f0', text: '#e63946', border: '#ffc0c0', label: '🔴 CRITICAL' },
  URGENT:   { bg: '#fff8ed', text: '#ff9f43', border: '#ffd9a0', label: '🟠 URGENT'   },
  NEEDED:   { bg: '#f0fff8', text: '#06d6a0', border: '#a0ffd9', label: '🟢 NEEDED'   },
}

// ── Blood Groups ──────────────────────────────────────────────────────────────
const BLOOD_GROUPS = [
  { value: 'A_POS',  label: 'A+'  },
  { value: 'A_NEG',  label: 'A-'  },
  { value: 'B_POS',  label: 'B+'  },
  { value: 'B_NEG',  label: 'B-'  },
  { value: 'AB_POS', label: 'AB+' },
  { value: 'AB_NEG', label: 'AB-' },
  { value: 'O_POS',  label: 'O+'  },
  { value: 'O_NEG',  label: 'O-'  },
]

const URGENCY_LEVELS = [
  { value: 'CRITICAL', label: '🔴 Critical — Immediate need'  },
  { value: 'URGENT',   label: '🟠 Urgent — Needed soon'       },
  { value: 'NEEDED',   label: '🟢 Needed — General request'   },
]

// ── Post SOS Modal ────────────────────────────────────────────────────────────
function PostSOSModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)

  const [bloodGroup,  setBloodGroup]  = useState<string | null>(null)
  const [hospital,    setHospital]    = useState('')
  const [city,        setCity]        = useState(user?.city || '')
  const [units,       setUnits]       = useState('1')
  const [urgency,     setUrgency]     = useState<string | null>(null)
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [touched,     setTouched]     = useState<Record<string, boolean>>({})

  // Dropdowns
  const [bloodOpen,   setBloodOpen]   = useState(false)
  const [urgencyOpen, setUrgencyOpen] = useState(false)
  const [bloodItems,  setBloodItems]  = useState(BLOOD_GROUPS)
  const [urgencyItems, setUrgencyItems] = useState(URGENCY_LEVELS)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!bloodGroup)                    e.bloodGroup = 'Please select a blood group'
    if (!hospital || hospital.length < 3) e.hospital = 'Hospital name is required'
    if (!city     || city.length     < 2) e.city     = 'City is required'
    if (!urgency)                       e.urgency   = 'Please select urgency level'
    if (!units || isNaN(parseInt(units)) || parseInt(units) < 1)
      e.units = 'Please enter a valid number of units (min 1)'
    return e
  }

  const { mutate: postRequest, isPending } = useMutation({
    mutationFn: emergencyService.createEmergencyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']   })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyRequests'] })
      Alert.alert(
        '✅ Request Posted!',
        'Your emergency request has been posted. Nearby donors will be notified.'
      )
      resetForm()
      onClose()
    },
    onError: (error: any) => {
      Alert.alert(
        'Failed to Post',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      )
    }
  })

  const resetForm = () => {
    setBloodGroup(null); setHospital('')
    setCity(user?.city || ''); setUnits('1')
    setUrgency(null); setErrors({}); setTouched({})
  }

  const handleSubmit = () => {
    setTouched({
      bloodGroup: true, hospital: true,
      city: true, units: true, urgency: true,
    })
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    postRequest({
      bloodGroup: bloodGroup!,
      hospital,
      city,
      units:   parseInt(units),
      urgency: urgency!,
    })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>🚨 Post Emergency Request</Text>
            <TouchableOpacity onPress={() => { resetForm(); onClose() }}>
              <Text style={modalStyles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* Blood Group */}
            <Text style={typography.label}>
              Blood Group Needed <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <DropDownPicker
              open={bloodOpen}
              value={bloodGroup}
              items={bloodItems}
              setOpen={(o) => { setBloodOpen(o); if (o === true) setUrgencyOpen(false) }}
              setValue={(v) => {
                setBloodGroup(v)
                setTouched(p => ({ ...p, bloodGroup: true }))
              }}
              setItems={setBloodItems}
              placeholder="Select blood group"
              listMode="SCROLLVIEW"
              style={[
                styles.dropdown,
                touched.bloodGroup && errors.bloodGroup && styles.inputError,
                touched.bloodGroup && !errors.bloodGroup && bloodGroup && styles.inputSuccess,
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
            {bloodOpen && <View style={{ height: BLOOD_GROUPS.length * 44 }} />}
            {touched.bloodGroup && errors.bloodGroup && (
              <Text style={styles.errorText}>⚠️ {errors.bloodGroup}</Text>
            )}

            {/* Hospital */}
            <Text style={typography.label}>
              Hospital Name <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                touched.hospital && errors.hospital   && styles.inputError,
                touched.hospital && !errors.hospital  && styles.inputSuccess,
              ]}
              placeholder="e.g. Negombo General Hospital"
              value={hospital}
              onChangeText={setHospital}
              onBlur={() => setTouched(p => ({ ...p, hospital: true }))}
            />
            {touched.hospital && errors.hospital && (
              <Text style={styles.errorText}>⚠️ {errors.hospital}</Text>
            )}

            {/* City */}
            <Text style={typography.label}>
              City <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                touched.city && errors.city   && styles.inputError,
                touched.city && !errors.city  && styles.inputSuccess,
              ]}
              placeholder="e.g. Negombo"
              value={city}
              onChangeText={setCity}
              onBlur={() => setTouched(p => ({ ...p, city: true }))}
            />
            {touched.city && errors.city && (
              <Text style={styles.errorText}>⚠️ {errors.city}</Text>
            )}

            {/* Units */}
            <Text style={typography.label}>
              Units Needed <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                touched.units && errors.units   && styles.inputError,
                touched.units && !errors.units  && styles.inputSuccess,
              ]}
              placeholder="e.g. 2"
              value={units}
              onChangeText={setUnits}
              keyboardType="numeric"
              onBlur={() => setTouched(p => ({ ...p, units: true }))}
            />
            {touched.units && errors.units && (
              <Text style={styles.errorText}>⚠️ {errors.units}</Text>
            )}

            {/* Urgency */}
            <Text style={typography.label}>
              Urgency Level <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <DropDownPicker
              open={urgencyOpen}
              value={urgency}
              items={urgencyItems}
              setOpen={(o) => { setUrgencyOpen(o); if (o) setBloodOpen(false) }}
              setValue={(v) => {
                setUrgency(v)
                setTouched(p => ({ ...p, urgency: true }))
              }}
              setItems={setUrgencyItems}
              placeholder="Select urgency level"
              listMode="SCROLLVIEW"
              style={[
                styles.dropdown,
                touched.urgency && errors.urgency   && styles.inputError,
                touched.urgency && !errors.urgency  && urgency && styles.inputSuccess,
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
            {urgencyOpen && <View style={{ height: URGENCY_LEVELS.length * 44 }} />}
            {touched.urgency && errors.urgency && (
              <Text style={styles.errorText}>⚠️ {errors.urgency}</Text>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[buttons.primary, isPending && buttons.disabled]}
              onPress={handleSubmit}
              disabled={isPending}
            >
              <Text style={buttons.primaryText}>
                {isPending ? 'Posting...' : '🚨 Post Emergency Request'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

// ── Emergency Request Card ────────────────────────────────────────────────────
function EmergencyCard({
  req,
  showResolve,
  onRespond,
  onResolve,
}: {
  req: any
  showResolve: boolean
  onRespond?: () => void
  onResolve?: () => void
}) {
  const uc = urgencyConfig[req.urgency as keyof typeof urgencyConfig]

  return (
    <View style={[
      cards.base,
      { borderLeftWidth: 4, borderLeftColor: uc.text }
    ]}>
      {/* Top Row */}
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 12 }}>
        {/* Blood Group */}
        <View style={{
          width:           60,
          height:          60,
          borderRadius:    12,
          backgroundColor: `${uc.text}18`,
          alignItems:      'center',
          justifyContent:  'center',
        }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: uc.text }}>
            {req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={[
            styles.urgencyBadge,
            { backgroundColor: uc.bg, borderColor: uc.border }
          ]}>
            <Text style={[styles.urgencyText, { color: uc.text }]}>
              {uc.label}
            </Text>
          </View>
          <Text style={[typography.cardTitle, { marginTop: 4 }]}>
            {req.hospital}
          </Text>
          <Text style={typography.cardSubtitle}>📍 {req.city}</Text>
        </View>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Units Needed</Text>
          <Text style={styles.detailValue}>{req.units}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Posted</Text>
          <Text style={styles.detailValue}>
            {new Date(req.createdAt).toLocaleTimeString([], {
              hour:   '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[
            styles.detailValue,
            { color: req.resolved ? COLORS.success : uc.text }
          ]}>
            {req.resolved ? '✅ Resolved' : '⏳ Active'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {!req.resolved && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {onRespond && (
            <TouchableOpacity
              style={[buttons.primary, { flex: 1, marginTop: 0, marginBottom: 0 }]}
              onPress={onRespond}
            >
              <Text style={buttons.primaryText}>🩸 Respond Now</Text>
            </TouchableOpacity>
          )}
          {showResolve && onResolve && (
            <TouchableOpacity
              style={[styles.resolveBtn, onRespond ? { flex: 1 } : { flex: 1 }]}
              onPress={onResolve}
            >
              <Text style={styles.resolveBtnText}>✅ Mark Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function EmergencyScreen() {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)
  const role        = user?.role || 'DONOR'

  const [showPostModal, setShowPostModal] = useState(false)
  const [activeTab, setActiveTab]         = useState<'all' | 'mine'>('all')

  // All active emergency requests
  const { data: allRequests, isLoading: allLoading } = useQuery({
    queryKey: ['emergencyRequests'],
    queryFn:  () => emergencyService.getEmergencyRequests(),
    refetchInterval: 30000,
  })

  // My posted requests
  const { data: myRequests, isLoading: myLoading } = useQuery<any[]>({
    queryKey: ['myEmergencyRequests', user?.id],
    queryFn:  () => emergencyService.getEmergencyRequests().then(reqs =>
      reqs.filter((req: any) => req.postedBy === user?.id)
    ),
    enabled:
      role === 'EMERGENCY_REQUESTER' ||
      role === 'STAFF'               ||
      role === 'ADMIN',
  })

  // Resolve a request
  const { mutate: resolveRequest } = useMutation({
    mutationFn: emergencyService.resolveEmergencyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']   })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyRequests'] })
      Alert.alert('✅ Resolved', 'Emergency request marked as resolved.')
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not resolve request.'
      )
    }
  })

  const handleRespond = (req: any) => {
    Alert.alert(
      '🩸 Respond to Request',
      `Donate ${req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} at ${req.hospital}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I will donate',
          onPress: () => Alert.alert(
            'Thank You! 🩸',
            'The hospital has been notified. Please arrive as soon as possible.'
          )
        }
      ]
    )
  }

  const handleResolve = (id: string, bloodGroup: string) => {
    Alert.alert(
      '✅ Mark as Resolved',
      `Mark this ${bloodGroup.replace('_POS', '+').replace('_NEG', '-')} request as resolved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Resolved',
          onPress: () => resolveRequest(id)
        }
      ]
    )
  }

  // ── DONOR — See all requests and respond ─────────────────────────────────
  if (role === 'DONOR') {
    return (
      <View style={layout.container}>
        <View style={header.container}>
          <Text style={header.title}>🚨 Emergency Requests</Text>
          <Text style={header.subtitle}>
            {allRequests?.length || 0} active requests near you
          </Text>
        </View>

        <ScrollView style={layout.content}>
          {allLoading && (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
          )}

          {!allLoading && allRequests?.length === 0 && (
            <View style={emptyState.container}>
              <Text style={emptyState.icon}>✅</Text>
              <Text style={emptyState.title}>No Active Requests</Text>
              <Text style={emptyState.text}>
                There are no emergency blood requests right now.
                Check back later.
              </Text>
            </View>
          )}

          {allRequests?.map((req: any) => (
            <EmergencyCard
              key={req.id}
              req={req}
              showResolve={false}
              onRespond={() => handleRespond(req)}
            />
          ))}

          <View style={layout.bottomSpace} />
        </ScrollView>
      </View>
    )
  }

  // ── EMERGENCY REQUESTER / STAFF — Post + manage ───────────────────────────
  return (
    <View style={layout.container}>
      <View style={header.container}>
        <View style={{
          flexDirection:  'row',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}>
          <View>
            <Text style={header.title}>🚨 Emergency Requests</Text>
            <Text style={header.subtitle}>
              {role === 'EMERGENCY_REQUESTER'
                ? 'Post and manage your requests'
                : 'Manage emergency blood requests'}
            </Text>
          </View>

          {/* Post New Request Button */}
          {(role === 'EMERGENCY_REQUESTER' || role === 'STAFF') && (
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => setShowPostModal(true)}
            >
              <Text style={styles.postBtnText}>+ Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.tabTextActive
          ]}>
            🌍 All Requests ({allRequests?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mine' && styles.tabActive]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'mine' && styles.tabTextActive
          ]}>
            📋 My Requests ({myRequests?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={layout.content}>

        {/* All Requests Tab */}
        {activeTab === 'all' && (
          <>
            {allLoading && (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            )}

            {!allLoading && allRequests?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>✅</Text>
                <Text style={emptyState.title}>No Active Requests</Text>
                <Text style={emptyState.text}>
                  No emergency requests right now.
                  Tap &quot;+ Post&quot; to create one.
                </Text>
              </View>
            )}

            {allRequests?.map((req: any) => (
              <EmergencyCard
                key={req.id}
                req={req}
                showResolve={
                  req.postedBy === user?.id ||
                  role === 'STAFF'
                }
                onResolve={() => handleResolve(req.id, req.bloodGroup)}
              />
            ))}
          </>
        )}

        {/* My Requests Tab */}
        {activeTab === 'mine' && (
          <>
            {myLoading && (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            )}

            {!myLoading && myRequests?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>🚨</Text>
                <Text style={emptyState.title}>No Requests Posted Yet</Text>
                <Text style={emptyState.text}>
                  You have not posted any emergency requests yet.{'\n'}
                  Tap &quot;+ Post&quot; to create your first request.
                </Text>
                <TouchableOpacity
                  style={[buttons.primary, { marginTop: 16, width: '80%' }]}
                  onPress={() => setShowPostModal(true)}
                >
                  <Text style={buttons.primaryText}>
                    🚨 Post Emergency Request
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {myRequests?.map((req: any) => (
              <EmergencyCard
                key={req.id}
                req={req}
                showResolve={true}
                onResolve={() => handleResolve(req.id, req.bloodGroup)}
              />
            ))}
          </>
        )}

        <View style={layout.bottomSpace} />
      </ScrollView>

      {/* Post SOS Modal */}
      <PostSOSModal
        visible={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </View>
  )
}

// ── Local Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabRow: {
    flexDirection:   'row',
    backgroundColor: '#fff',
    margin:          16,
    marginBottom:    0,
    borderRadius:    14,
    padding:         4,
  },
  tab: {
    flex:          1,
    padding:       10,
    borderRadius:  10,
    alignItems:    'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize:   12,
    fontWeight: '600',
    color:      COLORS.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  postBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius:    10,
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.4)',
  },
  postBtnText: {
    color:      '#fff',
    fontWeight: '700',
    fontSize:   14,
  },
  urgencyBadge: {
    alignSelf:         'flex-start',
    borderWidth:       1,
    borderRadius:      20,
    paddingHorizontal: 10,
    paddingVertical:   3,
  },
  urgencyText: {
    fontSize:   11,
    fontWeight: '800',
  },
  detailsRow: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    backgroundColor:  COLORS.surface,
    borderRadius:     10,
    padding:          12,
  },
  detailItem: {
    alignItems: 'center',
    flex:       1,
  },
  detailLabel: {
    fontSize:  10,
    color:     COLORS.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  resolveBtn: {
    backgroundColor: '#e8fff5',
    borderRadius:    12,
    padding:         14,
    alignItems:      'center',
    borderWidth:     1.5,
    borderColor:     COLORS.success,
  },
  resolveBtnText: {
    color:      COLORS.success,
    fontWeight: '700',
    fontSize:   14,
  },
  dropdown: {
    borderColor:  COLORS.border,
    borderRadius: 12,
    borderWidth:  1.5,
  },
  dropdownContainer: {
    borderColor:  COLORS.border,
    borderWidth:  1.5,
    borderRadius: 12,
  },
  input: {
    borderWidth:   1.5,
    borderColor:   COLORS.border,
    borderRadius:  12,
    padding:       13,
    fontSize:      14,
    color:         COLORS.text,
    backgroundColor: '#fff',
    marginBottom:  4,
  },
  inputError: {
    borderColor:     '#FF3B30',
    backgroundColor: '#fff8f8',
  },
  inputSuccess: {
    borderColor:     '#06d6a0',
    backgroundColor: '#f8fffc',
  },
  errorText: {
    fontSize:  12,
    color:     '#cc0000',
    marginBottom: 4,
  },
})