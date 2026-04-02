import {
  View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput
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
import { emergencyStyles as styles } from '../../constants/emergency.styles'
const urgencyConfig = {
  CRITICAL: { bg: '#fff0f0', text: '#e63946', border: '#ffc0c0', label: '🔴 CRITICAL' },
  URGENT:   { bg: '#fff8ed', text: '#ff9f43', border: '#ffd9a0', label: '🟠 URGENT'   },
  NEEDED:   { bg: '#f0fff8', text: '#06d6a0', border: '#a0ffd9', label: '🟢 NEEDED'   },
}

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
  { value: 'CRITICAL', label: '🔴 Critical — Immediate need' },
  { value: 'URGENT',   label: '🟠 Urgent — Needed soon'      },
  { value: 'NEEDED',   label: '🟢 Needed — General request'  },
]

// ── Post SOS Modal ────────────────────────────────────────────────────────────
function PostSOSModal({
  visible, onClose,
}: { visible: boolean; onClose: () => void }) {
  const queryClient = useQueryClient()
  const user        = useAuthStore((s) => s.user)

  const [bloodGroup,   setBloodGroup]   = useState<string | null>(null)
  const [hospital,     setHospital]     = useState('')
  const [city,         setCity]         = useState(user?.city || '')
  const [units,        setUnits]        = useState('1')
  const [urgency,      setUrgency]      = useState<string | null>(null)
  const [errors,       setErrors]       = useState<Record<string, string>>({})
  const [touched,      setTouched]      = useState<Record<string, boolean>>({})
  const [bloodOpen,    setBloodOpen]    = useState(false)
  const [urgencyOpen,  setUrgencyOpen]  = useState(false)
  const [bloodItems,   setBloodItems]   = useState(BLOOD_GROUPS)
  const [urgencyItems, setUrgencyItems] = useState(URGENCY_LEVELS)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!bloodGroup)                       e.bloodGroup = 'Please select a blood group'
    if (!hospital || hospital.length < 3)  e.hospital   = 'Hospital name is required'
    if (!city     || city.length     < 2)  e.city       = 'City is required'
    if (!urgency)                          e.urgency    = 'Please select urgency level'
    if (!units || isNaN(parseInt(units)) || parseInt(units) < 1)
      e.units = 'Please enter valid number of units'
    return e
  }

  const { mutate: postRequest, isPending } = useMutation({
    mutationFn: emergencyService.createEmergencyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']   })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyRequests'] })
      Alert.alert('✅ Posted!', 'Emergency request posted. Nearby donors will be notified.')
      resetForm(); onClose()
    },
    onError: (error: any) => {
      Alert.alert('Failed', error.response?.data?.message || 'Something went wrong.')
    }
  })

  const resetForm = () => {
    setBloodGroup(null); setHospital(''); setCity(user?.city || '')
    setUnits('1'); setUrgency(null); setErrors({}); setTouched({})
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
      hospital, city,
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
          <ScrollView style={modalStyles.body} keyboardShouldPersistTaps="handled">

            <Text style={typography.label}>Blood Group Needed *</Text>
            <DropDownPicker
              open={bloodOpen} value={bloodGroup} items={bloodItems}
              setOpen={(o) => { setBloodOpen(o); if (o) setUrgencyOpen(false) }}
              setValue={(v) => { setBloodGroup(v); setTouched(p => ({...p, bloodGroup: true})) }}
              setItems={setBloodItems}
              placeholder="Select blood group"
              listMode="SCROLLVIEW"
              style={[styles.dropdown,
                touched.bloodGroup && errors.bloodGroup && styles.inputError,
                touched.bloodGroup && !errors.bloodGroup && bloodGroup && styles.inputSuccess,
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000} zIndexInverse={1000}
            />
            {bloodOpen && <View style={{ height: BLOOD_GROUPS.length * 44 }} />}
            {touched.bloodGroup && errors.bloodGroup && (
              <Text style={styles.errorText}>⚠️ {errors.bloodGroup}</Text>
            )}

            <Text style={typography.label}>Hospital Name *</Text>
            <TextInput
              style={[styles.input,
                touched.hospital && errors.hospital  && styles.inputError,
                touched.hospital && !errors.hospital && styles.inputSuccess,
              ]}
              placeholder="e.g. Negombo General Hospital"
              value={hospital} onChangeText={setHospital}
              onBlur={() => setTouched(p => ({...p, hospital: true}))}
            />
            {touched.hospital && errors.hospital && (
              <Text style={styles.errorText}>⚠️ {errors.hospital}</Text>
            )}

            <Text style={typography.label}>City *</Text>
            <TextInput
              style={[styles.input,
                touched.city && errors.city  && styles.inputError,
                touched.city && !errors.city && styles.inputSuccess,
              ]}
              placeholder="e.g. Negombo"
              value={city} onChangeText={setCity}
              onBlur={() => setTouched(p => ({...p, city: true}))}
            />
            {touched.city && errors.city && (
              <Text style={styles.errorText}>⚠️ {errors.city}</Text>
            )}

            <Text style={typography.label}>Units Needed *</Text>
            <TextInput
              style={[styles.input,
                touched.units && errors.units  && styles.inputError,
                touched.units && !errors.units && styles.inputSuccess,
              ]}
              placeholder="e.g. 2"
              value={units} onChangeText={setUnits}
              keyboardType="numeric"
              onBlur={() => setTouched(p => ({...p, units: true}))}
            />
            {touched.units && errors.units && (
              <Text style={styles.errorText}>⚠️ {errors.units}</Text>
            )}

            <Text style={typography.label}>Urgency Level *</Text>
            <DropDownPicker
              open={urgencyOpen} value={urgency} items={urgencyItems}
              setOpen={(o) => { setUrgencyOpen(o); if (o) setBloodOpen(false) }}
              setValue={(v) => { setUrgency(v); setTouched(p => ({...p, urgency: true})) }}
              setItems={setUrgencyItems}
              placeholder="Select urgency level"
              listMode="SCROLLVIEW"
              style={[styles.dropdown,
                touched.urgency && errors.urgency  && styles.inputError,
                touched.urgency && !errors.urgency && urgency && styles.inputSuccess,
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000} zIndexInverse={2000}
            />
            {urgencyOpen && <View style={{ height: URGENCY_LEVELS.length * 44 }} />}
            {touched.urgency && errors.urgency && (
              <Text style={styles.errorText}>⚠️ {errors.urgency}</Text>
            )}

            <TouchableOpacity
              style={[buttons.primary, isPending && buttons.disabled]}
              onPress={handleSubmit} disabled={isPending}
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

// ── Emergency Card ────────────────────────────────────────────────────────────
function EmergencyCard({
  req, showResolve, alreadyResponded, respondersCount,
  onRespond, onCancelResponse, onResolve,
}: {
  req:               any
  showResolve:       boolean
  alreadyResponded?: boolean
  respondersCount?:  number
  onRespond?:        () => void
  onCancelResponse?: () => void
  onResolve?:        () => void
}) {
  const uc = urgencyConfig[req.urgency as keyof typeof urgencyConfig]

  return (
    <View style={[cards.base, { borderLeftWidth: 4, borderLeftColor: uc.text }]}>

      {/* Top Row */}
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 12 }}>
        <View style={{
          width: 60, height: 60, borderRadius: 12,
          backgroundColor: `${uc.text}18`,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: uc.text }}>
            {req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={[styles.urgencyBadge, { backgroundColor: uc.bg, borderColor: uc.border }]}>
            <Text style={[styles.urgencyText, { color: uc.text }]}>{uc.label}</Text>
          </View>
          <Text style={[typography.cardTitle, { marginTop: 4 }]}>{req.hospital}</Text>
          <Text style={typography.cardSubtitle}>📍 {req.city}</Text>
        </View>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Units</Text>
          <Text style={styles.detailValue}>{req.units}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Responders</Text>
          <Text style={[styles.detailValue, { color: COLORS.success }]}>
            {respondersCount || req._count?.responses || 0}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Posted</Text>
          <Text style={styles.detailValue}>
            {new Date(req.createdAt).toLocaleTimeString([], {
              hour: '2-digit', minute: '2-digit'
            })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, { color: req.resolved ? COLORS.success : uc.text }]}>
            {req.resolved ? '✅ Done' : '⏳ Active'}
          </Text>
        </View>
      </View>

      {/* Responders list — for staff/ER/admin */}
      {req.responses && req.responses.length > 0 && (
        <View style={styles.respondersSection}>
          <Text style={styles.respondersTitle}>
            🩸 {req.responses.length} donor(s) responding:
          </Text>
          {req.responses.map((r: any) => (
            <Text key={r.donorId} style={styles.responderItem}>
              • {r.donor.name} ({r.donor.bloodGroup?.replace('_POS', '+').replace('_NEG', '-')}) — 📞 {r.donor.phone}
            </Text>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      {!req.resolved && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {/* Donor respond / cancel response */}
          {onRespond && !alreadyResponded && (
            <TouchableOpacity
              style={[buttons.primary, { flex: 1, marginTop: 0, marginBottom: 0 }]}
              onPress={onRespond}
            >
              <Text style={buttons.primaryText}>🩸 Respond Now</Text>
            </TouchableOpacity>
          )}

          {alreadyResponded && onCancelResponse && (
            <View style={{ flex: 1 }}>
              <View style={styles.respondingBadge}>
                <Text style={styles.respondingText}>✅ You are responding</Text>
              </View>
              <TouchableOpacity
                style={styles.cancelResponseBtn}
                onPress={onCancelResponse}
              >
                <Text style={styles.cancelResponseText}>Cancel Response</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Resolve button */}
          {showResolve && onResolve && (
            <TouchableOpacity
              style={[styles.resolveBtn, { flex: alreadyResponded ? 1 : 1 }]}
              onPress={onResolve}
            >
              <Text style={styles.resolveBtnText}>✅ Resolve</Text>
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

  // All active requests
  const { data: allRequests, isLoading: allLoading } = useQuery({
    queryKey: ['emergencyRequests'],
    queryFn:  () => emergencyService.getEmergencyRequests(),
    refetchInterval: 30000,
  })

  // My posted requests
  const { data: myRequests, isLoading: myLoading } = useQuery({
    queryKey: ['myEmergencyRequests', user?.id],
    queryFn:  emergencyService.getMyRequests,
    enabled:  role !== 'DONOR',
  })

  // My responses as donor
  const { data: myResponses, isLoading: myResponsesLoading } = useQuery({
    queryKey: ['myEmergencyResponses', user?.id],
    queryFn:  emergencyService.getMyResponses,
    enabled:  role === 'DONOR',
  })

  // Respond to emergency
  const { mutate: respond } = useMutation({
    mutationFn: emergencyService.respondToEmergency,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']      })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyResponses']   })
      Alert.alert(
        '🩸 Thank You!',
        `You have confirmed to donate at ${data.request.hospital}. Please go to the hospital as soon as possible.`
      )
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not respond.')
    }
  })

  // Cancel response
  const { mutate: cancelResponse } = useMutation({
    mutationFn: emergencyService.cancelResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']    })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyResponses'] })
      Alert.alert('Cancelled', 'Your response has been cancelled.')
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not cancel.')
    }
  })

  // Resolve request
  const { mutate: resolveRequest } = useMutation({
    mutationFn: emergencyService.resolveEmergencyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyRequests']   })
      queryClient.invalidateQueries({ queryKey: ['myEmergencyRequests'] })
      Alert.alert('✅ Resolved', 'Emergency request marked as resolved.')
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Could not resolve.')
    }
  })

  const handleRespond = (req: any) => {
    Alert.alert(
      '🩸 Confirm Response',
      `Donate ${req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} at ${req.hospital} in ${req.city}?\n\nPlease go to the hospital as soon as possible.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, I will donate', onPress: () => respond(req.id) }
      ]
    )
  }

  const handleCancelResponse = (requestId: string) => {
    Alert.alert(
      'Cancel Response',
      'Are you sure you want to cancel your response?',
      [
        { text: 'No',  style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelResponse(requestId) }
      ]
    )
  }

  const handleResolve = (id: string) => {
    Alert.alert(
      '✅ Mark as Resolved',
      'Has the blood been found? Mark this request as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Resolved', onPress: () => resolveRequest(id) }
      ]
    )
  }

  // ── DONOR ─────────────────────────────────────────────────────────────────
  if (role === 'DONOR') {
    return (
      <View style={layout.container}>
        <View style={header.container}>
          <Text style={header.title}>🚨 Emergency Requests</Text>
          <Text style={header.subtitle}>
            {allRequests?.length || 0} active requests
          </Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              🌍 All ({allRequests?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mine' && styles.tabActive]}
            onPress={() => setActiveTab('mine')}
          >
            <Text style={[styles.tabText, activeTab === 'mine' && styles.tabTextActive]}>
              📋 My Responses ({myResponses?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={layout.content}>
          {/* All Requests */}
          {activeTab === 'all' && (
            <>
              {allLoading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}
              {!allLoading && allRequests?.length === 0 && (
                <View style={emptyState.container}>
                  <Text style={emptyState.icon}>✅</Text>
                  <Text style={emptyState.title}>No Active Requests</Text>
                  <Text style={emptyState.text}>No emergency requests right now.</Text>
                </View>
              )}
              {allRequests?.map((req: any) => {
                const alreadyResponded = myResponses?.some(
                  (r: any) => r.requestId === req.id && r.status !== 'CANCELLED'
                )
                return (
                  <EmergencyCard
                    key={req.id} req={req}
                    showResolve={false}
                    alreadyResponded={alreadyResponded}
                    respondersCount={req._count?.responses || 0}
                    onRespond={() => handleRespond(req)}
                    onCancelResponse={() => handleCancelResponse(req.id)}
                  />
                )
              })}
            </>
          )}

          {/* My Responses */}
          {activeTab === 'mine' && (
            <>
              {myResponsesLoading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}
              {!myResponsesLoading && myResponses?.length === 0 && (
                <View style={emptyState.container}>
                  <Text style={emptyState.icon}>🩸</Text>
                  <Text style={emptyState.title}>No Responses Yet</Text>
                  <Text style={emptyState.text}>
                    You have not responded to any requests yet.
                    Go to All Requests and tap Respond Now.
                  </Text>
                </View>
              )}
              {myResponses?.map((response: any) => (
                <View key={response.id} style={[
                  cards.base,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor:
                      response.status === 'PENDING'  ? '#ff9f43' :
                      response.status === 'DONATED'  ? '#06d6a0' :
                      '#e63946'
                  }
                ]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={typography.cardTitle}>
                        {response.request.bloodGroup
                          .replace('_POS', '+').replace('_NEG', '-')} — {response.request.hospital}
                      </Text>
                      <Text style={typography.cardSubtitle}>📍 {response.request.city}</Text>
                      <Text style={typography.cardSubtitle}>
                        📅 {new Date(response.createdAt).toDateString()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, {
                      backgroundColor:
                        response.status === 'PENDING' ? '#fff8e1' :
                        response.status === 'DONATED' ? '#e8fff5' : '#fff0f0'
                    }]}>
                      <Text style={[styles.statusText, {
                        color:
                          response.status === 'PENDING' ? '#f59e0b' :
                          response.status === 'DONATED' ? '#06d6a0' : '#e63946'
                      }]}>
                        {response.status === 'PENDING' ? '⏳ Responding' :
                         response.status === 'DONATED' ? '🏅 Donated'    : '❌ Cancelled'}
                      </Text>
                    </View>
                  </View>
                  {response.status === 'PENDING' && !response.request.resolved && (
                    <TouchableOpacity
                      style={styles.cancelResponseBtn}
                      onPress={() => handleCancelResponse(response.requestId)}
                    >
                      <Text style={styles.cancelResponseText}>Cancel My Response</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </>
          )}
          <View style={layout.bottomSpace} />
        </ScrollView>
      </View>
    )
  }

  // ── STAFF / EMERGENCY REQUESTER ──────────────────────────────────────────
  return (
    <View style={layout.container}>
      <View style={header.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={header.title}>🚨 Emergency Requests</Text>
            <Text style={header.subtitle}>
              {role === 'EMERGENCY_REQUESTER' ? 'Post and manage your requests' : 'Manage emergency requests'}
            </Text>
          </View>
          {(role === 'EMERGENCY_REQUESTER' || role === 'STAFF') && (
            <TouchableOpacity style={styles.postBtn} onPress={() => setShowPostModal(true)}>
              <Text style={styles.postBtnText}>+ Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            🌍 All ({allRequests?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mine' && styles.tabActive]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.tabTextActive]}>
            📋 My Requests ({myRequests?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={layout.content}>
        {activeTab === 'all' && (
          <>
            {allLoading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}
            {!allLoading && allRequests?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>✅</Text>
                <Text style={emptyState.title}>No Active Requests</Text>
                <Text style={emptyState.text}>Tap "+ Post" to create a request.</Text>
              </View>
            )}
            {allRequests?.map((req: any) => (
              <EmergencyCard
                key={req.id} req={req}
                showResolve={req.postedBy === user?.id || role === 'STAFF'}
                respondersCount={req._count?.responses || 0}
                onResolve={() => handleResolve(req.id)}
              />
            ))}
          </>
        )}

        {activeTab === 'mine' && (
          <>
            {myLoading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}
            {!myLoading && myRequests?.length === 0 && (
              <View style={emptyState.container}>
                <Text style={emptyState.icon}>🚨</Text>
                <Text style={emptyState.title}>No Requests Posted Yet</Text>
                <Text style={emptyState.text}>Tap "+ Post" to create your first request.</Text>
                <TouchableOpacity
                  style={[buttons.primary, { marginTop: 16, width: '80%' }]}
                  onPress={() => setShowPostModal(true)}
                >
                  <Text style={buttons.primaryText}>🚨 Post Request</Text>
                </TouchableOpacity>
              </View>
            )}
            {myRequests?.map((req: any) => (
              <EmergencyCard
                key={req.id} req={req}
                showResolve={true}
                respondersCount={req._count?.responses || 0}
                onResolve={() => handleResolve(req.id)}
              />
            ))}
          </>
        )}
        <View style={layout.bottomSpace} />
      </ScrollView>

      <PostSOSModal visible={showPostModal} onClose={() => setShowPostModal(false)} />
    </View>
  )
}
