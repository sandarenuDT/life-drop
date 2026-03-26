import { api } from './api'

export const centersService = {
  // Get all centers
  getAllCenters: async () => {
    const response = await api.get('/centers')
    return response.data
  },

  // Get nearest centers
  getNearestCenters: async (lat: number, lng: number) => {
    const response = await api.get('/centers/nearest', {
      params: { lat, lng }
    })
    return response.data
  },

  // Get single center
  getCenterById: async (id: string) => {
    const response = await api.get(`/centers/${id}`)
    return response.data
  },

  // Get available slots
  getAvailableSlots: async (centerId: string, date: string) => {
    const response = await api.get(`/centers/${centerId}/slots`, {
      params: { date }
    })
    return response.data
  },
}