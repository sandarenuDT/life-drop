import { api } from './api'

export const adminService = {

  // ── Stats ────────────────────────────────────────────────────────────────
 getStats: async () => {
  console.log('📊 Calling admin stats API...')
  try {
    const response = await api.get('/users/stats')
    console.log('📊 Stats response:', JSON.stringify(response.data))
    return response.data
  } catch (error: any) {
    console.log('📊 Stats error:', error.response?.status, error.response?.data)
    throw error
  }
},
  // ── Users ────────────────────────────────────────────────────────────────
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // ── Centers ──────────────────────────────────────────────────────────────
  addCenter: async (data: {
    name:      string
    address:   string
    phone:     string
    hours:     string
    type:      string
    latitude:  number
    longitude: number
    slots:     number
  }) => {
    const response = await api.post('/centers', data)
    return response.data
  },

  updateCenter: async (
    id: string,
    data: {
      name?:     string
      address?:  string
      phone?:    string
      hours?:    string
      type?:     string
      slots?:    number
      isActive?: boolean
    }
  ) => {
    const response = await api.put(`/centers/${id}`, data)
    return response.data
  },

  deleteCenter: async (id: string) => {
    const response = await api.delete(`/centers/${id}`)
    return response.data
  },

  // ── Emergency ────────────────────────────────────────────────────────────
  getAllEmergencyRequests: async () => {
    const response = await api.get('/emergency')
    return response.data
  },

  resolveEmergencyRequest: async (id: string) => {
    const response = await api.put(`/emergency/${id}/resolve`)
    return response.data
  },
}