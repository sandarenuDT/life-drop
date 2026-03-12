import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { COLORS } from '../../constants/color'

const centers = [
  {
    id: '1',
    name: 'National Blood Centre',
    address: 'Narahenpita, Colombo 05',
    phone: '+94-11-269-4600',
    distance: '0.8 km',
    slots: 5,
    hours: '8:00 AM - 4:30 PM',
    type: 'BANK',
    about: 'The National Blood Centre is the main blood bank in Sri Lanka. It collects, tests, processes and distributes blood and blood products to hospitals nationwide.',
  },
  {
    id: '2',
    name: 'Negombo General Hospital',
    address: 'Colombo Rd, Negombo',
    phone: '+94-31-222-2261',
    distance: '1.2 km',
    slots: 3,
    hours: '24/7',
    type: 'HOSPITAL',
    about: 'Negombo General Hospital serves the Western Province with 24/7 blood donation facilities. Walk-in donors are welcome at any time.',
  },
  {
    id: '3',
    name: 'Red Cross Blood Bank',
    address: '106 Dharmapala Mawatha, Colombo 07',
    phone: '+94-11-269-4540',
    distance: '2.5 km',
    slots: 8,
    hours: '8:30 AM - 4:00 PM',
    type: 'NGO',
    about: 'The Red Cross Blood Bank operates as part of the International Red Cross network. It provides safe blood to hospitals across the country.',
  },
  {
    id: '4',
    name: 'Lady Ridgeway Hospital',
    address: 'Baseline Rd, Colombo 08',
    phone: '+94-11-269-3711',
    distance: '3.1 km',
    slots: 2,
    hours: '8:00 AM - 5:00 PM',
    type: 'HOSPITAL',
    about: 'Lady Ridgeway Hospital is a leading childrens hospital in Sri Lanka. Blood donations here directly help young patients in critical care.',
  },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM',
]

export default function CenterDetailScreen() {
  const { id } = useLocalSearchParams()
  const center = centers.find((c) => c.id === id) || centers[0]

  const handleBookSlot = (time: string) => {
    Alert.alert(
      'Confirm Booking',
      `Book a donation slot at ${center.name} at ${time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () =>
            Alert.alert(
              '🎉 Booking Confirmed!',
              `Your slot at ${center.name} is confirmed for ${time}. Please arrive 10 minutes early.`,
              [{ text: 'OK', onPress: () => router.back() }]
            ),
        },
      ]
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
            { icon: '📍', label: 'Address',  value: center.address  },
            { icon: '📞', label: 'Phone',    value: center.phone    },
            { icon: '⏰', label: 'Hours',    value: center.hours    },
            { icon: '📏', label: 'Distance', value: center.distance },
            { icon: '✅', label: 'Slots',    value: `${center.slots} available today` },
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

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>{center.about}</Text>
        </View>

        {/* What to bring */}
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

        {/* Book a Slot */}
        <Text style={styles.sectionTitle}>BOOK A SLOT — TODAY</Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={styles.slotButton}
              onPress={() => handleBookSlot(time)}
            >
              <Text style={styles.slotText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
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
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 22,
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
  slotText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  bottomSpace: {
    height: 20,
  },
})