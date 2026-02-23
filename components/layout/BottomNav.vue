<script setup lang="ts">
import { Home, BookOpen, Search, Bell, User } from 'lucide-vue-next'

const auth = useAuthStore()
const notifications = useNotificationStore()
const route = useRoute()

const guestLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Courses', to: '/courses', icon: BookOpen },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Login', to: '/login', icon: User },
]

const authLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'My Learning', to: '/enrollments', icon: BookOpen },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Profile', to: '/profile', icon: User },
]

const links = computed(() => auth.isAuthenticated ? authLinks : guestLinks)

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around items-center h-16 px-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 relative"
        :class="isActive(link.to) ? 'text-primary-600' : 'text-gray-400'"
      >
        <div class="relative">
          <component :is="link.icon" class="w-5 h-5" />
          <span
            v-if="link.label === 'Notifications' && notifications.unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
          >
            {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
          </span>
        </div>
        <span class="text-[10px] font-medium truncate">{{ link.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
