import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user:    JSON.parse(localStorage.getItem('nx_user')) || null,
  token:   localStorage.getItem('nx_token') || null,
  loading: false,
  error:   null,

  register: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/register', data)
      localStorage.setItem('nx_token', res.data.token)
      localStorage.setItem('nx_user',  JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.token, loading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false })
      return { success: false }
    }
  },

  login: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/login', data)
      localStorage.setItem('nx_token', res.data.token)
      localStorage.setItem('nx_user',  JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.token, loading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      return { success: false }
    }
  },

  logout: () => {
    localStorage.removeItem('nx_token')
    localStorage.removeItem('nx_user')
    set({ user: null, token: null })
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/profile', data)
      localStorage.setItem('nx_user', JSON.stringify(res.data.user))
      set({ user: res.data.user })
    } catch (err) {
      console.error(err)
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
