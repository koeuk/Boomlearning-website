import type { ApiResponse, PaginatedResponse } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      const headers = options.headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')
      if (authStore.token) {
        headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.clearAuth()
        navigateTo('/login')
      }
    }
  })

  return { apiFetch }
}
