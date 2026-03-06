import { defineStore } from 'pinia'
import type { Course } from '~/types/course'

export interface CartItem {
  course: Course
  addedAt: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    count: (state) => state.items.length,
    totalAmount: (state) =>
      state.items.reduce((sum, item) => sum + parseFloat(item.course.price), 0),
    isEmpty: (state) => state.items.length === 0,
    hasCourse: (state) => (courseId: string) =>
      state.items.some((item) => item.course.id === courseId),
  },

  actions: {
    add(course: Course) {
      if (this.hasCourse(course.id)) return
      this.items.push({ course, addedAt: new Date().toISOString() })
      this.save()
    },

    remove(courseId: string) {
      this.items = this.items.filter((item) => item.course.id !== courseId)
      this.save()
    },

    clear() {
      this.items = []
      this.save()
    },

    save() {
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    init() {
      if (import.meta.client) {
        const saved = localStorage.getItem('cart')
        if (saved) {
          try {
            this.items = JSON.parse(saved)
          } catch {
            localStorage.removeItem('cart')
          }
        }
      }
    },
  },
})
