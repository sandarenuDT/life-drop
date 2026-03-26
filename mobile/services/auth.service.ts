import { api } from './api'

export const authService = {
  // Register new user
  register: async (data: {
    name: string
    email: string
    phone: string
    password: string
    city: string
    role: string
    bloodGroup?: string
    dateOfBirth?: string
  }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Login
  login: async (data: {
    email: string
    password: string
  }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  // Get my profile
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}