<script setup lang="ts">
import { Eye, EyeOff, Lock, Loader2, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({ title: 'Reset Password - BoomLearning' })

const route = useRoute()

const form = reactive({
  token: (route.query.token as string) || '',
  email: (route.query.email as string) || '',
  password: '',
  password_confirmation: '',
})
const showPassword = ref(false)
const loading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}

  if (!form.password) errors.value.password = 'Password is required'
  else if (!isMinLength(form.password, 8)) errors.value.password = 'Password must be at least 8 characters'
  if (form.password !== form.password_confirmation) errors.value.password_confirmation = 'Passwords do not match'

  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    const { apiFetch } = useApi()
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: form,
    })
    success.value = true
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <!-- Success -->
    <template v-if="success">
      <div class="text-center">
        <CheckCircle class="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Password Reset</h1>
        <p class="text-sm text-gray-500 mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Sign In
        </NuxtLink>
      </div>
    </template>

    <!-- Form -->
    <template v-else>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Reset Password</h1>
      <p class="text-sm text-gray-500 text-center mb-6">Enter your new password</p>

      <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {{ errors.general }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              placeholder="At least 8 characters"
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

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.password_confirmation ? 'border-red-300' : 'border-gray-300'"
            placeholder="Confirm your new password"
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.password_confirmation }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Lock v-else class="w-4 h-4" />
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </template>
  </div>
</template>
