import { create } from 'zustand'
import api from '../services/api'

const useAppStore = create((set, get) => ({
  // ── State ──────────────────────────────────
  modules:  [],
  tasks:    [],
  sessions: [],
  stats:    null,
  loading:  { modules: false, tasks: false, sessions: false, stats: false },
  toast:    null,

  // ── Toast ──────────────────────────────────
  showToast: (message, type = 'success') => {
    set({ toast: { message, type, id: Date.now() } })
    setTimeout(() => set({ toast: null }), 3500)
  },

  // ── Modules ───────────────────────────────
  fetchModules: async () => {
    set(s => ({ loading: { ...s.loading, modules: true } }))
    try {
      const res = await api.get('/modules')
      set({ modules: res.data.data })
    } catch (err) { console.error(err) }
    finally { set(s => ({ loading: { ...s.loading, modules: false } })) }
  },

  addModule: async (data) => {
    try {
      const res = await api.post('/modules', data)
      set(s => ({ modules: [res.data.data, ...s.modules] }))
      get().showToast('Module added!')
      return { success: true }
    } catch (err) {
      get().showToast(err.response?.data?.message || 'Error adding module', 'error')
      return { success: false }
    }
  },

  updateModule: async (id, data) => {
    try {
      const res = await api.put(`/modules/${id}`, data)
      set(s => ({ modules: s.modules.map(m => m._id === id ? res.data.data : m) }))
      get().showToast('Module updated!')
      return { success: true }
    } catch (err) {
      get().showToast('Error updating module', 'error')
      return { success: false }
    }
  },

  deleteModule: async (id) => {
    try {
      await api.delete(`/modules/${id}`)
      set(s => ({ modules: s.modules.filter(m => m._id !== id) }))
      get().showToast('Module deleted', 'error')
    } catch (err) { get().showToast('Error deleting module', 'error') }
  },

  addGrade: async (moduleId, gradeData) => {
    try {
      const res = await api.post(`/modules/${moduleId}/grades`, gradeData)
      set(s => ({ modules: s.modules.map(m => m._id === moduleId ? res.data.data : m) }))
      get().showToast('Grade added!')
      return { success: true }
    } catch (err) {
      get().showToast('Error adding grade', 'error')
      return { success: false }
    }
  },

  deleteGrade: async (moduleId, gradeId) => {
    try {
      const res = await api.delete(`/modules/${moduleId}/grades/${gradeId}`)
      set(s => ({ modules: s.modules.map(m => m._id === moduleId ? res.data.data : m) }))
      get().showToast('Grade removed')
    } catch (err) { get().showToast('Error removing grade', 'error') }
  },

  // ── Tasks ─────────────────────────────────
  fetchTasks: async (filters = {}) => {
    set(s => ({ loading: { ...s.loading, tasks: true } }))
    try {
      const res = await api.get('/tasks', { params: filters })
      set({ tasks: res.data.data })
    } catch (err) { console.error(err) }
    finally { set(s => ({ loading: { ...s.loading, tasks: false } })) }
  },

  addTask: async (data) => {
    try {
      const res = await api.post('/tasks', data)
      set(s => ({ tasks: [...s.tasks, res.data.data].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)) }))
      get().showToast('Task created!')
      return { success: true }
    } catch (err) {
      get().showToast(err.response?.data?.message || 'Error creating task', 'error')
      return { success: false }
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await api.put(`/tasks/${id}`, data)
      set(s => ({ tasks: s.tasks.map(t => t._id === id ? res.data.data : t) }))
      get().showToast('Task updated!')
      return { success: true }
    } catch (err) { return { success: false } }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      set(s => ({ tasks: s.tasks.filter(t => t._id !== id) }))
      get().showToast('Task deleted', 'error')
    } catch (err) { get().showToast('Error deleting task', 'error') }
  },

  // ── Sessions ──────────────────────────────
  fetchSessions: async () => {
    set(s => ({ loading: { ...s.loading, sessions: true } }))
    try {
      const res = await api.get('/sessions')
      set({ sessions: res.data.data })
    } catch (err) { console.error(err) }
    finally { set(s => ({ loading: { ...s.loading, sessions: false } })) }
  },

  addSession: async (data) => {
    try {
      const res = await api.post('/sessions', data)
      set(s => ({ sessions: [res.data.data, ...s.sessions] }))
      get().showToast('Study session logged!')
      return { success: true }
    } catch (err) {
      get().showToast('Error logging session', 'error')
      return { success: false }
    }
  },

  deleteSession: async (id) => {
    try {
      await api.delete(`/sessions/${id}`)
      set(s => ({ sessions: s.sessions.filter(s => s._id !== id) }))
      get().showToast('Session removed')
    } catch (err) { console.error(err) }
  },

  // ── Stats ─────────────────────────────────
  fetchStats: async () => {
    set(s => ({ loading: { ...s.loading, stats: true } }))
    try {
      const res = await api.get('/stats')
      set({ stats: res.data.data })
    } catch (err) { console.error(err) }
    finally { set(s => ({ loading: { ...s.loading, stats: false } })) }
  },
}))

export default useAppStore
