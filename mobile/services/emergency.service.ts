
import { api } from './api'

export const emergencyService = {

  // Get all active requests
  getEmergencyRequests: async (city?: string) => {
    const response = await api.get('/emergency', {
      params: city ? { city } : {}
    })
    return response.data
  },

  // Get MY posted requests
  getMyRequests: async () => {
    const response = await api.get('/emergency/my-requests')
    return response.data
  },

  // Post a new emergency request
  createEmergencyRequest: async (data: {
    bloodGroup: string
    hospital:   string
    city:       string
    units:      number
    urgency:    string
  }) => {
    const response = await api.post('/emergency', data)
    return response.data
  },

  // Mark as resolved
  resolveEmergencyRequest: async (id: string) => {
    const response = await api.put(`/emergency/${id}/resolve`)
    return response.data
  },
}