import { defineStore } from 'pinia'
import type { User, LoginRequest, AuthResponse } from '~/types/user'
import type { ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    fullName: (state) => state.user?.full_name ?? '',
    avatarUrl: (state) => state.user?.image_url ?? null,
  },

  actions: {
    init() {
      if (import.meta.client) {
        const saved = localStorage.getItem('auth')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            this.token = parsed.token ?? null
            this.user = parsed.user ?? null
          } catch {
            localStorage.removeItem('auth')
          }
        }
      }
    },

    save() {
      if (import.meta.client) {
        localStorage.setItem('auth', JSON.stringify({
          token: this.token,
          user: this.user,
        }))
      }
    },

    async login(credentials: LoginRequest) {
      const { apiFetch } = useApi()
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
        method: 'POST',
        body: credentials,
      })
      this.token = res.data.token
      this.user = res.data.user
      this.save()
    },

    async register(formData: FormData) {
      const { apiFetch } = useApi()
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/register', {
        method: 'POST',
        body: formData,
      })
      this.token = res.data.token
      this.user = res.data.user
      this.save()
    },

    async fetchProfile() {
      const { apiFetch } = useApi()
      const res = await apiFetch<ApiResponse<User>>('/auth/profile')
      this.user = res.data
      this.save()
    },

    async logout() {
      const { apiFetch } = useApi()
      try {
        await apiFetch('/auth/logout', { method: 'POST' })
      } catch {}
      this.clearAuth()
      navigateTo('/')
    },

    clearAuth() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('auth')
      }
    },
  },
})
