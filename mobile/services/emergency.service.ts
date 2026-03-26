import { api } from './api'

export const emergencyService = {
  // Get all emergency requests
  getEmergencyRequests: async (city?: string) => {
    const response = await api.get('/emergency', {
      params: city ? { city } : {}
    })
    return response.data
  },

  // Post emergency request
  createEmergencyRequest: async (data: {
    bloodGroup: string
    hospital: string
    city: string
    units: number
    urgency: string
  }) => {
    const response = await api.post('/emergency', data)
    return response.data
  },

  // Resolve emergency request
  resolveEmergencyRequest: async (id: string) => {
    const response = await api.put(`/emergency/${id}/resolve`)
    return response.data
  },
}