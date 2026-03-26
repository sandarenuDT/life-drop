import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import { centersService } from '../../services/center.service'
import { donationsService } from '../../services/donation.service'

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM',
]

export default function CenterDetailScreen() {
  const { id } = useLocalSearchParams()
  const today = new Date().toISOString().split('T')[0]

  // Get center details from backend
  const { data: center, isLoading } = useQuery({
    queryKey: ['center', id],
    queryFn: () => centersService.getCenterById(id as string),
  })

  // Book appointment mutation
  const { mutate: bookSlot, isPending: isBooking } = useMutation({
    mutationFn: donationsService.bookAppointment,
    onSuccess: (data) => {
      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your slot at ${center?.name} is confirmed for ${data.timeSlot}. Please arrive 10 minutes early.`,
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (error: any) => {
      Alert.alert(
        'Booking Failed',
        error.response?.data?.message || 'Could not book slot. Try again.'
      )
    }
  })

  const handleBookSlot = (timeSlot: string) => {
    Alert.alert(
      'Confirm Booking',
      `Book a donation slot at ${center?.name} at ${timeSlot}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => bookSlot({
            centerId: id as string,
            date: today,
            timeSlot,
            type: 'WHOLE_BLOOD',
          })
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    )
  }

  if (!center) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textMuted }}>Center not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{center.name}</Text>
        <Text style={styles.headerType}>{center.type}</Text>
      </View>

      <View style={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          {[
            { icon: '📍', label: 'Address', value: center.address },
            { icon: '📞', label: 'Phone',   value: center.phone   },
            { icon: '⏰', label: 'Hours',   value: center.hours   },
            { icon: '✅', label: 'Slots',   value: `${center.slots} total slots` },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* What to Bring */}
        <Text style={styles.sectionTitle}>WHAT TO BRING</Text>
        <View style={styles.bringCard}>
          {[
            '🪪 National ID or Passport',
            '💧 Drink plenty of water before coming',
            '🍽️ Eat a light meal 2 hours before',
            '😴 Get a good night sleep',
            '👕 Wear comfortable clothing',
          ].map((item) => (
            <Text key={item} style={styles.bringItem}>{item}</Text>
          ))}
        </View>

        {/* Book Slot */}
        <Text style={styles.sectionTitle}>
          BOOK A SLOT — TODAY ({today})
        </Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.slotButton,
                isBooking && styles.slotButtonDisabled
              ]}
              onPress={() => handleBookSlot(time)}
              disabled={isBooking}
            >
              <Text style={styles.slotText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isBooking && (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginTop: 10 }}
          />
        )}

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
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
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerType: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  bringCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  bringItem: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  slotButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  slotButtonDisabled: {
    opacity: 0.5,
  },
  slotText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  bottomSpace: {
    height: 20,
  },
})