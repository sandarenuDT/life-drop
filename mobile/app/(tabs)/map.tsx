import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { COLORS } from '../../constants/color'

const centers = [
  {
    id: '1',
    name: 'National Blood Centre',
    address: 'Narahenpita, Colombo 05',
    distance: '0.8 km',
    slots: 5,
    hours: '8AM - 4:30PM',
    type: 'BANK',
  },
  {
    id: '2',
    name: 'Negombo General Hospital',
    address: 'Colombo Rd, Negombo',
    distance: '1.2 km',
    slots: 3,
    hours: '24/7',
    type: 'HOSPITAL',
  },
  {
    id: '3',
    name: 'Red Cross Blood Bank',
    address: 'Dharmapala Mawatha, Colombo 07',
    distance: '2.5 km',
    slots: 8,
    hours: '8:30AM - 4PM',
    type: 'NGO',
  },
  {
    id: '4',
    name: 'Lady Ridgeway Hospital',
    address: 'Baseline Rd, Colombo 08',
    distance: '3.1 km',
    slots: 2,
    hours: '8AM - 5PM',
    type: 'HOSPITAL',
  },
]

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Find Centers</Text>
        <Text style={styles.headerSubtitle}>
          Donation centers near you
        </Text>
      </View>

      {/* Fake Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.mapLabel}>
          Map loads here with Google Maps SDK
        </Text>
        <Text style={styles.mapSub}>
          (Requires Google Maps API key)
        </Text>
      </View>

      {/* Centers List */}
      <ScrollView style={styles.list}>
        <Text style={styles.sectionTitle}>NEARBY CENTERS</Text>
        {centers.map((center) => (
          <TouchableOpacity
            key={center.id}
            style={styles.centerCard}
            onPress={() => router.push(`/center/${center.id}` as any)}
          >
            <View style={styles.centerLeft}>
              <Text style={styles.centerName}>{center.name}</Text>
              <Text style={styles.centerAddress}>
                📍 {center.address}
              </Text>
              <Text style={styles.centerHours}>
                ⏰ {center.hours}
              </Text>
            </View>
            <View style={styles.centerRight}>
              <Text style={styles.centerDistance}>
                {center.distance}
              </Text>
              <View style={styles.slotsTag}>
                <Text style={styles.slotsText}>
                  ✅ {center.slots} slots
                </Text>
              </View>
              <View style={styles.typeTag}>
                <Text style={styles.typeText}>{center.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  mapPlaceholder: {
    backgroundColor: '#e8f4f8',
    margin: 16,
    borderRadius: 16,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#cce0ea',
  },
  mapText: {
    fontSize: 40,
    marginBottom: 8,
  },
  mapLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  mapSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  centerCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  centerLeft: {
    flex: 1,
    marginRight: 10,
  },
  centerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  centerHours: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  centerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  centerDistance: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  slotsTag: {
    backgroundColor: '#e8fff5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  slotsText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
  },
  typeTag: {
    backgroundColor: '#fff3f3',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
})