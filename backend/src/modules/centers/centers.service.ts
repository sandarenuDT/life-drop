import { prisma } from '../../config/database'
import { AppError } from '../../utils/AppError'

// Get all centers
export const getAllCenters = async () => {
  return prisma.donationCenter.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })
}

// Get nearest centers using Haversine formula
export const getNearestCenters = async (
  lat: number,
  lng: number,
  radiusKm: number = 50
) => {
  const centers = await prisma.donationCenter.findMany({
    where: { isActive: true }
  })

  // Calculate distance for each center
  const centersWithDistance = centers.map((center) => {
    const R = 6371 // Earth radius in km
    const dLat = ((center.latitude - lat) * Math.PI) / 180
    const dLng = ((center.longitude - lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
      Math.cos((center.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return {
      ...center,
      distance_km: Math.round(distance * 10) / 10
    }
  })

  // Filter by radius and sort by distance
  return centersWithDistance
    .filter((c) => c.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
}

// Get single center by ID
export const getCenterById = async (id: string) => {
  const center = await prisma.donationCenter.findUnique({
    where: { id }
  })
  if (!center) {
    throw new AppError('Center not found', 404)
  }
  return center
}

// Get available slots for a center on a date
export const getAvailableSlots = async (
  centerId: string,
  date: string
) => {
  const center = await prisma.donationCenter.findUnique({
    where: { id: centerId }
  })
  if (!center) {
    throw new AppError('Center not found', 404)
  }

  // Count already booked slots for this date
  const bookedCount = await prisma.appointment.count({
    where: {
      centerId,
      date: new Date(date),
      status: { not: 'CANCELLED' }
    }
  })

  const allSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM',
  ]

  return {
    centerId,
    date,
    totalSlots: center.slots,
    bookedSlots: bookedCount,
    availableSlots: center.slots - bookedCount,
    timeSlots: allSlots,
  }
}