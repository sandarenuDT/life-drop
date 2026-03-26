import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { COLORS } from '../../constants/color'
import { centersService } from '../../services/center.service'

export default function MapScreen() {
  const { data: centers, isLoading, isError } = useQuery({
    queryKey: ['centers'],
    queryFn: centersService.getAllCenters,
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Find Centers</Text>
        <Text style={styles.headerSubtitle}>
          Donation centers near you
        </Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.mapLabel}>
          Map loads here with Google Maps SDK
        </Text>
      </View>

      {/* Centers List */}
      <ScrollView style={styles.list}>
        <Text style={styles.sectionTitle}>
          ALL CENTERS {centers ? `(${centers.length})` : ''}
        </Text>

        {isLoading && (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              ⚠️ Could not load centers. Check your connection.
            </Text>
          </View>
        )}

        {centers?.map((center: any) => (
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
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#cce0ea',
  },
  mapText: {
    fontSize: 36,
    marginBottom: 6,
  },
  mapLabel: {
    fontSize: 12,
    color: '#555',
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
  errorBox: {
    backgroundColor: '#fff3f3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 13,
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