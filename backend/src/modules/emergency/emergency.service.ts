import { prisma   } from '../../config/database'
import { AppError } from '../../utils/AppError'

// Get all active emergency requests
export const getEmergencyRequests = async (city?: string) => {
  return prisma.emergencyRequest.findMany({
    where: {
      resolved: false,
      ...(city && { city })
    },
    include: {
      responses: {
        select: {
          donorId: true,
          status:  true,
          donor: {
            select: {
              name:       true,
              bloodGroup: true,
              phone:      true,
            }
          }
        }
      },
      _count: {
        select: { responses: true }
      }
    },
    orderBy: [
      { urgency:   'asc'  },
      { createdAt: 'desc' }
    ]
  })
}

// Get single emergency request
export const getEmergencyRequestById = async (id: string) => {
  const request = await prisma.emergencyRequest.findUnique({
    where: { id },
    include: {
      responses: {
        include: {
          donor: {
            select: {
              name:       true,
              bloodGroup: true,
              phone:      true,
              city:       true,
            }
          }
        }
      }
    }
  })
  if (!request) throw new AppError('Emergency request not found', 404)
  return request
}

// Post a new emergency request
export const createEmergencyRequest = async (
  userId: string,
  data: {
    bloodGroup: string
    hospital:   string
    city:       string
    units:      number
    urgency:    string
  }
) => {
  return prisma.emergencyRequest.create({
    data: {
      bloodGroup: data.bloodGroup as any,
      hospital:   data.hospital,
      city:       data.city,
      units:      data.units,
      urgency:    data.urgency as any,
      postedBy:   userId,
    }
  })
}

// Donor responds to emergency request
export const respondToEmergency = async (
  requestId: string,
  donorId:   string
) => {
  // Check request exists and is active
  const request = await prisma.emergencyRequest.findUnique({
    where: { id: requestId }
  })
  if (!request) throw new AppError('Emergency request not found', 404)
  if (request.resolved) {
    throw new AppError('This emergency request has already been resolved', 400)
  }

  // Check donor has not already responded
  const existing = await prisma.emergencyResponse.findUnique({
    where: {
      requestId_donorId: { requestId, donorId }
    }
  })
  if (existing) {
    throw new AppError('You have already responded to this request', 400)
  }

  // Create response
  const response = await prisma.emergencyResponse.create({
    data: {
      requestId,
      donorId,
      status: 'PENDING',
    },
    include: {
      donor: {
        select: {
          name:       true,
          bloodGroup: true,
          phone:      true,
        }
      },
      request: {
        select: {
          hospital: true,
          city:     true,
          bloodGroup: true,
        }
      }
    }
  })

  return response
}

// Cancel donor response
export const cancelResponse = async (
  requestId: string,
  donorId:   string
) => {
  const response = await prisma.emergencyResponse.findUnique({
    where: {
      requestId_donorId: { requestId, donorId }
    }
  })
  if (!response) throw new AppError('Response not found', 404)

  return prisma.emergencyResponse.update({
    where: { requestId_donorId: { requestId, donorId } },
    data:  { status: 'CANCELLED' }
  })
}

// Get my responses as a donor
export const getMyResponses = async (donorId: string) => {
  return prisma.emergencyResponse.findMany({
    where:   { donorId },
    include: {
      request: {
        select: {
          id:         true,
          bloodGroup: true,
          hospital:   true,
          city:       true,
          urgency:    true,
          resolved:   true,
          createdAt:  true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Mark emergency request as resolved
export const resolveEmergencyRequest = async (
  id:     string,
  userId: string
) => {
  const request = await prisma.emergencyRequest.findUnique({
    where: { id }
  })
  if (!request)          throw new AppError('Emergency request not found', 404)
  if (request.postedBy !== userId) {
    // Check if user is staff or admin
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
      throw new AppError('Not authorized to resolve this request', 403)
    }
  }

  return prisma.emergencyRequest.update({
    where: { id },
    data:  { resolved: true }
  })
}

// Get my posted requests
export const getMyEmergencyRequests = async (userId: string) => {
  return prisma.emergencyRequest.findMany({
    where:   { postedBy: userId },
    include: {
      responses: {
        include: {
          donor: {
            select: {
              name:       true,
              bloodGroup: true,
              phone:      true,
            }
          }
        }
      },
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Get requests by blood group
export const getRequestsByBloodGroup = async (bloodGroup: string) => {
  return prisma.emergencyRequest.findMany({
    where:   { bloodGroup: bloodGroup as any, resolved: false },
    orderBy: { createdAt: 'desc' }
  })
}