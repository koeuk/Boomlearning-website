<script setup lang="ts">
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({ title: 'Forgot Password - BoomLearning' })

const form = reactive({ email: '' })
const loading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}

  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
    return
  }
  if (!isValidEmail(form.email)) {
    errors.value.email = 'Invalid email address'
    return
  }

  loading.value = true
  try {
    const { apiFetch } = useApi()
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email: form.email },
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
    <!-- Success State -->
    <template v-if="success">
      <div class="text-center">
        <CheckCircle class="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p class="text-sm text-gray-500 mb-6">
          We've sent a password reset link to <strong>{{ form.email }}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Login
        </NuxtLink>
      </div>
    </template>

    <!-- Form -->
    <template v-else>
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Forgot Password</h1>
      <p class="text-sm text-gray-500 text-center mb-6">
        Enter your email and we'll send you a reset link
      </p>

      <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {{ errors.general }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.email ? 'border-red-300' : 'border-gray-300'"
            placeholder="Enter your email"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Mail v-else class="w-4 h-4" />
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <p class="mt-6 text-center">
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Login
        </NuxtLink>
      </p>
    </template>
  </div>
</template>
