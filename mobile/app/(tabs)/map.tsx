import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Dimensions
} from 'react-native'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { COLORS } from '../../constants/color'
import { centersService } from '../../services/center.service'
import { useAuthStore } from '@/store/authStore'

const { width } = Dimensions.get('window')

const CENTER_TYPE_ICONS: Record<string, string> = {
  BANK: '🏦',
  HOSPITAL: '🏥',
  NGO: '❤️',
  CLINIC: '🩺',
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null)
  // Add at top inside component
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'DONOR'

  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const [locationError, setLocationError] = useState('')
  const [selectedCenter, setSelectedCenter] = useState<any>(null)

  // Get user location
  useEffect(() => {
    ; (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationError(
          'Location permission denied. Showing default location.'
        )
        // Default to Colombo if no permission
        setUserLocation({ latitude: 6.9271, longitude: 79.8612 })
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    })()
  }, [])

  // Get centers from backend
  const { data: centers, isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: centersService.getAllCenters,
  })

  // Move map to user location
  const goToMyLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000)
    }
  }

  // Move map to a center
  const focusCenter = (center: any) => {
    setSelectedCenter(center)
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 800)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Find Centers</Text>
        <Text style={styles.headerSubtitle}>
          {centers
            ? `${centers.length} centers near you`
            : 'Loading centers...'}
        </Text>
      </View>

      {/* Location error warning */}
      {locationError ? (
        <View style={styles.locationWarning}>
          <Text style={styles.locationWarningText}>⚠️ {locationError}</Text>
        </View>
      ) : null}

      {/* Map */}
      {userLocation ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass
            showsScale
          >
            {/* Center Markers */}
            {centers?.map((center: any) => (
              <Marker
                key={center.id}
                coordinate={{
                  latitude: center.latitude,
                  longitude: center.longitude,
                }}
                onPress={() => focusCenter(center)}
              >
                {/* Custom marker */}
                <View style={[
                  styles.marker,
                  selectedCenter?.id === center.id && styles.markerSelected
                ]}>
                  <Text style={styles.markerIcon}>
                    {CENTER_TYPE_ICONS[center.type] || '🏥'}
                  </Text>
                </View>

                {/* Callout popup on marker tap */}
                <Callout
                  tooltip
                  onPress={() => {
                    if (role === 'DONOR') {
                      router.push(`/center/${center.id}` as any)
                    }
                  }}
                >
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{center.name}</Text>
                    <Text style={styles.calloutAddress}>
                      📍 {center.address}
                    </Text>
                    <Text style={styles.calloutHours}>
                      ⏰ {center.hours}
                    </Text>
                    <Text style={styles.calloutSlots}>
                      ✅ {center.slots} slots available
                    </Text>
                    <View style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>
                        {role === 'DONOR' ? 'Tap to Book →' : 'View Details →'}                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* My Location Button */}
          <TouchableOpacity
            style={styles.myLocationBtn}
            onPress={goToMyLocation}
          >
            <Text style={styles.myLocationIcon}>🎯</Text>
          </TouchableOpacity>

          {/* Loading overlay */}
          {isLoading && (
            <View style={styles.mapLoading}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.mapLoadingText}>
                Loading centers...
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.mapLoading}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.mapLoadingText}>
            Getting your location...
          </Text>
        </View>
      )}

      {/* Centers List below map */}
      <ScrollView
        style={styles.list}
        horizontal={false}
      >
        <Text style={styles.sectionTitle}>
          ALL CENTERS {centers ? `(${centers.length})` : ''}
        </Text>

        {centers?.map((center: any) => (
          <TouchableOpacity
            key={center.id}
            style={[
              styles.centerCard,
              selectedCenter?.id === center.id && styles.centerCardSelected
            ]}
            onPress={() => focusCenter(center)}
          >
            <View style={styles.centerLeft}>
              <View style={styles.centerNameRow}>
                <Text style={styles.centerIcon}>
                  {CENTER_TYPE_ICONS[center.type] || '🏥'}
                </Text>
                <Text style={styles.centerName}>{center.name}</Text>
              </View>
              <Text style={styles.centerAddress}>📍 {center.address}</Text>
              <Text style={styles.centerHours}>⏰ {center.hours}</Text>
            </View>
            <View style={styles.centerRight}>
              <View style={styles.slotsTag}>
                <Text style={styles.slotsText}>
                  ✅ {center.slots}
                </Text>
              </View>
              {/* Only donors can book */}
              {role === 'DONOR' ? (
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => router.push(`/center/${center.id}` as any)}
                >
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
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
  locationWarning: {
    backgroundColor: '#fff8e1',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  locationWarningText: {
    fontSize: 12,
    color: '#856404',
  },
  mapContainer: {
    height: 280,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapLoading: {
    height: 280,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mapLoadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // Custom marker
  marker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.2 }],
  },
  markerIcon: {
    fontSize: 20,
  },

  // Callout
  callout: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    width: 220,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  calloutAddress: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  calloutHours: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  calloutSlots: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // My location button
  myLocationBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  myLocationIcon: {
    fontSize: 22,
  },

  // List
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
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  centerCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff8f8',
  },
  centerLeft: {
    flex: 1,
    marginRight: 10,
  },
  centerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  centerIcon: {
    fontSize: 16,
  },
  centerName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  centerAddress: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  centerHours: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  centerRight: {
    alignItems: 'flex-end',
    gap: 6,
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
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  viewBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
})