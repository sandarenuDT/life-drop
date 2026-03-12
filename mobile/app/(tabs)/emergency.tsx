import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native'
import { COLORS } from '../../constants/color'

const emergencyRequests = [
  {
    id: '1',
    bloodGroup: 'O-',
    urgency: 'CRITICAL',
    hospital: 'Negombo General Hospital',
    units: 3,
    postedAt: '5 min ago',
    city: 'Negombo',
  },
  {
    id: '2',
    bloodGroup: 'AB+',
    urgency: 'URGENT',
    hospital: 'National Hospital Colombo',
    units: 2,
    postedAt: '22 min ago',
    city: 'Colombo',
  },
  {
    id: '3',
    bloodGroup: 'B+',
    urgency: 'NEEDED',
    hospital: 'Lady Ridgeway Hospital',
    units: 1,
    postedAt: '1 hour ago',
    city: 'Colombo',
  },
  {
    id: '4',
    bloodGroup: 'A-',
    urgency: 'URGENT',
    hospital: 'Kalubowila Teaching Hospital',
    units: 4,
    postedAt: '2 hours ago',
    city: 'Dehiwala',
  },
]

const urgencyColors = {
  CRITICAL: { bg: '#fff0f0', text: '#e63946', border: '#ffc0c0' },
  URGENT:   { bg: '#fff8ed', text: '#ff9f43', border: '#ffd9a0' },
  NEEDED:   { bg: '#f0fff8', text: '#06d6a0', border: '#a0ffd9' },
}

export default function EmergencyScreen() {
  const handleRespond = (bloodGroup: string, hospital: string) => {
    Alert.alert(
      'Respond to Request',
      `Are you sure you want to respond to donate ${bloodGroup} at ${hospital}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I will donate',
          onPress: () =>
            Alert.alert('Thank You! 🩸', 'The hospital has been notified. Please arrive within 2 hours.'),
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚨 Emergency Requests</Text>
        <Text style={styles.headerSubtitle}>
          Urgent blood needs in your area
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Active Requests */}
        <Text style={styles.sectionTitle}>ACTIVE REQUESTS</Text>
        {emergencyRequests.map((req) => {
          const colors = urgencyColors[req.urgency as keyof typeof urgencyColors]
          return (
            <View key={req.id} style={styles.requestCard}>
              <View style={styles.requestTop}>
                {/* Blood Group + Urgency */}
                <View>
                  <View style={[styles.urgencyTag, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    <Text style={[styles.urgencyText, { color: colors.text }]}>
                      {req.urgency}
                    </Text>
                  </View>
                  <Text style={styles.bloodGroup}>{req.bloodGroup}</Text>
                </View>

                {/* Hospital Info */}
                <View style={styles.hospitalInfo}>
                  <Text style={styles.hospitalName}>{req.hospital}</Text>
                  <Text style={styles.hospitalCity}>📍 {req.city}</Text>
                  <Text style={styles.postedAt}>🕐 {req.postedAt}</Text>
                  <Text style={styles.units}>{req.units} units needed</Text>
                </View>
              </View>

              {/* Respond Button */}
              <TouchableOpacity
                style={styles.respondButton}
                onPress={() => handleRespond(req.bloodGroup, req.hospital)}
              >
                <Text style={styles.respondText}>
                  Respond Now →
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Post a Request */}
        <Text style={styles.sectionTitle}>POST A REQUEST</Text>
        <View style={styles.postCard}>
          <Text style={styles.postText}>
            Need blood urgently? Post a request and notify nearby donors instantly.
          </Text>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() =>
              Alert.alert('Coming Soon', 'Post emergency request feature coming in next update.')
            }
          >
            <Text style={styles.postButtonText}>
              + Post Emergency Request
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestTop: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  urgencyTag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bloodGroup: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 36,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  hospitalCity: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  postedAt: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  units: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  respondButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  respondText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  postButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  bottomSpace: {
    height: 20,
  },
})