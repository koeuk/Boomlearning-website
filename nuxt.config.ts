import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE || 'http://localhost:8000/storage',
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    '/': { prerender: true },
    '/courses': { isr: 60 },
    '/courses/**': { isr: 60 },
    '/categories': { isr: 60 },
    '/categories/**': { isr: 60 },
    '/certificates/verify/**': { ssr: true },
    '/dashboard/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/enrollments/**': { ssr: false },
    '/lessons/**': { ssr: false },
    '/quizzes/**': { ssr: false },
    '/payments/**': { ssr: false },
    '/certificates': { ssr: false },
  },

  compatibilityDate: '2025-01-01',
})
