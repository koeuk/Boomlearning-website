<template>
  <nav class="bg-primary-800 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-10">
        <!-- Logo + Nav Links -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-sm font-bold text-white">BoomLearning</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-0.5">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
              :class="route.path === link.to
                ? 'text-white bg-white/15'
                : 'text-primary-100 hover:text-white hover:bg-white/10'"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Search + Actions -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <form @submit.prevent="handleSearch" class="hidden sm:flex items-center">
            <div class="relative">
              <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-300" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search courses..."
                class="pl-8 pr-3 py-1 w-48 text-xs bg-white/10 text-white placeholder-primary-300 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-transparent"
              />
            </div>
          </form>

          <!-- Authenticated -->
          <template v-if="auth.isAuthenticated">
            <!-- Notifications -->
            <NuxtLink to="/notifications" class="relative p-1.5 text-primary-200 hover:text-white transition-colors">
              <Bell class="w-4 h-4" />
              <span
                v-if="notifications.unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
              >
                {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
              </span>
            </NuxtLink>

            <!-- Profile Menu -->
            <div class="relative profile-menu-container">
              <button
                @click="profileMenuOpen = !profileMenuOpen"
                class="flex items-center gap-1.5 p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="auth.avatarUrl"
                    :src="auth.avatarUrl"
                    :alt="auth.fullName"
                    class="w-full h-full object-cover"
                  />
                  <User v-else class="w-3 h-3 text-white" />
                </div>
                <ChevronDown class="w-3 h-3 text-primary-200 hidden sm:block" />
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
                  class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">{{ auth.fullName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
                  </div>
                  <NuxtLink
                    v-for="link in authLinks"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <component :is="link.icon" class="w-4 h-4" />
                    {{ link.label }}
                  </NuxtLink>
                  <hr class="my-1 border-gray-100" />
                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
              class="text-xs font-medium text-primary-100 hover:text-white transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="text-xs font-medium text-primary-800 bg-white hover:bg-primary-50 px-3 py-1 rounded-md transition-colors"
            >
              Register
            </NuxtLink>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-1.5 text-primary-200 hover:text-white"
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
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 bg-primary-900">
        <div class="px-4 py-2 space-y-0.5">
          <!-- Mobile Search -->
          <form @submit.prevent="handleSearch" class="mb-2 sm:hidden">
            <div class="relative">
              <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-300" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search courses..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-white/10 text-white placeholder-primary-300 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
          </form>

          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-1.5 rounded-md text-sm font-medium"
            :class="route.path === link.to
              ? 'text-white bg-white/15'
              : 'text-primary-100 hover:text-white hover:bg-white/10'"
          >
            {{ link.label }}
          </NuxtLink>

          <template v-if="auth.isAuthenticated">
            <hr class="my-1.5 border-white/10" />
            <NuxtLink
              v-for="link in authLinks"
              :key="link.to"
              :to="link.to"
              class="block px-3 py-1.5 rounded-md text-sm font-medium text-primary-100 hover:text-white hover:bg-white/10"
            >
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
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Categories', to: '/categories' },
]

const authLinks = [
  { label: 'My Learning', to: '/enrollments', icon: BookOpen },
  { label: 'Profile', to: '/profile', icon: User },
]

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

// Close profile menu on route change
watch(() => route.fullPath, () => {
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
})

// Close menu when clicking outside
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
