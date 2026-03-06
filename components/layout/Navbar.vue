<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <!-- Logo + Nav Links -->
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <BookOpen class="w-4 h-4 text-white" />
            </div>
            <span class="text-base font-bold text-gray-900">BoomLearning</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="isActive(link.to)
                ? 'text-primary-700 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Search + Actions -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <form @submit.prevent="handleSearch" class="hidden sm:flex items-center">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search courses..."
                class="pl-9 pr-4 py-2 w-56 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-colors"
              />
            </div>
          </form>

          <!-- Authenticated -->
          <template v-if="auth.isAuthenticated">
            <!-- Notifications -->
            <NuxtLink to="/notifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell class="w-5 h-5" />
              <span
                v-if="notifications.unreadCount > 0"
                class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium"
              >
                {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
              </span>
            </NuxtLink>

            <!-- Profile Menu -->
            <div class="relative profile-menu-container">
              <button
                @click="profileMenuOpen = !profileMenuOpen"
                class="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden ring-2 ring-white">
                  <img
                    v-if="auth.avatarUrl"
                    :src="auth.avatarUrl"
                    :alt="auth.fullName"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xs font-semibold text-white">{{ auth.user?.full_name?.[0]?.toUpperCase() }}</span>
                </div>
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="profileMenuOpen"
                  class="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900">{{ auth.fullName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
                  </div>
                  <div class="py-1">
                    <NuxtLink
                      v-for="link in authLinks"
                      :key="link.to"
                      :to="link.to"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <component :is="link.icon" class="w-4 h-4 text-gray-400" />
                      {{ link.label }}
                    </NuxtLink>
                  </div>
                  <hr class="my-1 border-gray-100" />
                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut class="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </Transition>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <NuxtLink
              to="/login"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
            >
              Register
            </NuxtLink>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <X v-if="mobileMenuOpen" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-3 space-y-1">
          <!-- Mobile Search -->
          <form @submit.prevent="handleSearch" class="mb-3 sm:hidden">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search courses..."
                class="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(link.to)
              ? 'text-primary-700 bg-primary-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            {{ link.label }}
          </NuxtLink>

          <template v-if="auth.isAuthenticated">
            <hr class="my-2 border-gray-100" />
            <NuxtLink
              v-for="link in authLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <component :is="link.icon" class="w-4 h-4 text-gray-400" />
              {{ link.label }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { Menu, X, Bell, User, LogOut, BookOpen, Search, ChevronDown } from 'lucide-vue-next'

const auth = useAuthStore()
const notifications = useNotificationStore()
const route = useRoute()

const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const searchQuery = ref('')

const navLinks = [
  { label: 'Browse', to: '/courses' },
  { label: 'Categories', to: '/categories' },
  { label: 'My Courses', to: '/enrollments' },
]

const authLinks = [
  { label: 'My Learning', to: '/enrollments', icon: BookOpen },
  { label: 'Profile', to: '/profile', icon: User },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}

function handleLogout() {
  profileMenuOpen.value = false
  auth.logout()
}

watch(() => route.fullPath, () => {
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
})

function closeProfileMenu(e: Event) {
  const target = e.target as HTMLElement
  if (!target.closest('.profile-menu-container')) {
    profileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeProfileMenu)
  if (auth.isAuthenticated) {
    notifications.fetch().catch(() => {})
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenu)
})
</script>
