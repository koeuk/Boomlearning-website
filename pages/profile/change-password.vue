<script setup lang="ts">
import { ArrowLeft, Eye, EyeOff, Key, Loader2, CheckCircle } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Change Password - BoomLearning' })

const { apiFetch } = useApi()

const form = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const loading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}
  success.value = false

  if (!form.current_password) errors.value.current_password = 'Current password is required'
  if (!form.new_password) errors.value.new_password = 'New password is required'
  else if (!isMinLength(form.new_password, 8)) errors.value.new_password = 'Password must be at least 8 characters'
  if (form.new_password !== form.new_password_confirmation) errors.value.new_password_confirmation = 'Passwords do not match'

  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    await apiFetch<ApiResponse<any>>('/auth/change-password', {
      method: 'PUT',
      body: form,
    })
    success.value = true
    form.current_password = ''
    form.new_password = ''
    form.new_password_confirmation = ''
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/profile" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
      <ArrowLeft class="w-4 h-4" />
      Back to Profile
    </NuxtLink>

    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h1 class="text-xl font-bold text-gray-900 mb-6">Change Password</h1>

      <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {{ errors.general }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
        <CheckCircle class="w-4 h-4" />
        Password changed successfully!
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Current Password -->
        <div>
          <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div class="relative">
            <input
              id="current_password"
              v-model="form.current_password"
              :type="showCurrent ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :class="errors.current_password ? 'border-red-300' : 'border-gray-300'"
            />
            <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff v-if="showCurrent" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="errors.current_password" class="mt-1 text-xs text-red-500">{{ errors.current_password }}</p>
        </div>

        <!-- New Password -->
        <div>
          <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input
              id="new_password"
              v-model="form.new_password"
              :type="showNew ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              :class="errors.new_password ? 'border-red-300' : 'border-gray-300'"
              placeholder="At least 8 characters"
            />
            <button type="button" @click="showNew = !showNew" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff v-if="showNew" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="errors.new_password" class="mt-1 text-xs text-red-500">{{ errors.new_password }}</p>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            id="new_password_confirmation"
            v-model="form.new_password_confirmation"
            type="password"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.new_password_confirmation ? 'border-red-300' : 'border-gray-300'"
          />
          <p v-if="errors.new_password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.new_password_confirmation }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Key v-else class="w-4 h-4" />
          {{ loading ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>
  </div>
</template>
