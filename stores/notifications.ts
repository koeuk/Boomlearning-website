import { defineStore } from 'pinia'
import type { Notification } from '~/types/notification'
import type { ApiResponse, PaginatedResponse } from '~/types/api'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: [] as Notification[],
    unreadCount: 0,
  }),

  actions: {
    async fetch() {
      const { apiFetch } = useApi()
      const res = await apiFetch<PaginatedResponse<Notification>>('/notifications')
      this.items = res.data
      this.unreadCount = this.items.filter(n => !n.is_read).length
    },

    async markAsRead(id: number) {
      const { apiFetch } = useApi()
      await apiFetch(`/notifications/${id}/read`, { method: 'PUT' })
      const item = this.items.find(n => n.id === id)
      if (item && !item.is_read) {
        item.is_read = true
        this.unreadCount--
      }
    },

    async markAllAsRead() {
      const { apiFetch } = useApi()
      await apiFetch('/notifications/read-all', { method: 'PUT' })
      this.items.forEach(n => n.is_read = true)
      this.unreadCount = 0
    },

    async remove(id: number) {
      const { apiFetch } = useApi()
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' })
      const index = this.items.findIndex(n => n.id === id)
      if (index !== -1) {
        if (!this.items[index].is_read) this.unreadCount--
        this.items.splice(index, 1)
      }
    },
  },
})
