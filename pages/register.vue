<script setup lang="ts">
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({ title: 'Register - BoomLearning' })

const auth = useAuthStore()

const form = reactive({
  full_name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  date_of_birth: '',
  gender: '',
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

async function handleRegister() {
  errors.value = {}

  // Client-side validation
  if (!form.full_name.trim()) errors.value.full_name = 'Full name is required'
  if (!form.username.trim()) errors.value.username = 'Username is required'
  if (!form.email.trim()) errors.value.email = 'Email is required'
  else if (!isValidEmail(form.email)) errors.value.email = 'Invalid email address'
  if (!form.password) errors.value.password = 'Password is required'
  else if (!isMinLength(form.password, 8)) errors.value.password = 'Password must be at least 8 characters'
  if (form.password !== form.password_confirmation) errors.value.password_confirmation = 'Passwords do not match'

  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('full_name', form.full_name)
    formData.append('username', form.username)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('password_confirmation', form.password_confirmation)
    if (form.phone) formData.append('phone', form.phone)
    if (form.date_of_birth) formData.append('date_of_birth', form.date_of_birth)
    if (form.gender) formData.append('gender', form.gender)

    await auth.register(formData)
    navigateTo('/')
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
    <p class="text-sm text-gray-500 text-center mb-6">Join BoomLearning and start your journey</p>

    <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
      {{ errors.general }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Full Name -->
      <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input
          id="full_name"
          v-model="form.full_name"
          type="text"
          class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :class="errors.full_name ? 'border-red-300' : 'border-gray-300'"
          placeholder="Enter your full name"
        />
        <p v-if="errors.full_name" class="mt-1 text-xs text-red-500">{{ errors.full_name }}</p>
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :class="errors.username ? 'border-red-300' : 'border-gray-300'"
          placeholder="Choose a username"
        />
        <p v-if="errors.username" class="mt-1 text-xs text-red-500">{{ errors.username }}</p>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
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

      <!-- Confirm Password -->
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
        <div class="relative">
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.password_confirmation ? 'border-red-300' : 'border-gray-300'"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
        <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.password_confirmation }}</p>
      </div>

      <!-- Phone (optional) -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Optional"
        />
      </div>

      <!-- Date of Birth & Gender -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            id="dob"
            v-model="form.date_of_birth"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            id="gender"
            v-model="form.gender"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <UserPlus v-else class="w-4 h-4" />
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Already have an account?
      <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign In
      </NuxtLink>
    </p>
  </div>
</template>
