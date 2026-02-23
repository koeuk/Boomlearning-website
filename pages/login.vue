<script setup lang="ts">
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({ title: 'Login - BoomLearning' })

const auth = useAuthStore()
const route = useRoute()

const form = reactive({
  login: '',
  password: '',
})
const showPassword = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

async function handleLogin() {
  errors.value = {}

  if (!form.login.trim()) {
    errors.value.login = 'Email or username is required'
    return
  }
  if (!form.password) {
    errors.value.password = 'Password is required'
    return
  }

  loading.value = true
  try {
    await auth.login({ login: form.login, password: form.password })
    const redirect = route.query.redirect as string | undefined
    navigateTo(redirect || '/')
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
    <p class="text-sm text-gray-500 text-center mb-6">Sign in to continue learning</p>

    <!-- General Error -->
    <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
      {{ errors.general }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email/Username -->
      <div>
        <label for="login" class="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
        <input
          id="login"
          v-model="form.login"
          type="text"
          autocomplete="username"
          class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :class="errors.login ? 'border-red-300' : 'border-gray-300'"
          placeholder="Enter your email or username"
        />
        <p v-if="errors.login" class="mt-1 text-xs text-red-500">{{ errors.login }}</p>
      </div>

      <!-- Password -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <NuxtLink to="/forgot-password" class="text-xs text-primary-600 hover:text-primary-700">
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.password ? 'border-red-300' : 'border-gray-300'"
            placeholder="Enter your password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <LogIn v-else class="w-4 h-4" />
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Don't have an account?
      <NuxtLink to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
        Register
      </NuxtLink>
    </p>
  </div>
</template>
