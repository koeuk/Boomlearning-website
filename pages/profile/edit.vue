<script setup lang="ts">
import { ArrowLeft, Save, Loader2, Camera } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Edit Profile - BoomLearning' })

const auth = useAuthStore()

const form = reactive({
  full_name: auth.user?.full_name ?? '',
  phone: auth.user?.phone ?? '',
  date_of_birth: auth.user?.date_of_birth ?? '',
  gender: auth.user?.gender ?? '',
  address: auth.user?.address ?? '',
})

const profilePicture = ref<File | null>(null)
const previewUrl = ref<string | null>(auth.user?.image_url ?? null)
const loading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    profilePicture.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  errors.value = {}
  success.value = false

  if (!form.full_name.trim()) {
    errors.value.full_name = 'Full name is required'
    return
  }

  loading.value = true
  try {
    const { apiFetch } = useApi()
    const formData = new FormData()
    formData.append('full_name', form.full_name)
    if (form.phone) formData.append('phone', form.phone)
    if (form.date_of_birth) formData.append('date_of_birth', form.date_of_birth)
    if (form.gender) formData.append('gender', form.gender)
    if (form.address) formData.append('address', form.address)
    if (profilePicture.value) formData.append('profile_picture', profilePicture.value)

    // PUT with FormData requires _method override
    formData.append('_method', 'PUT')
    await apiFetch<ApiResponse<any>>('/auth/profile', {
      method: 'POST',
      body: formData,
    })

    await auth.fetchProfile()
    success.value = true
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/profile" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
      <ArrowLeft class="w-4 h-4" />
      Back to Profile
    </NuxtLink>

    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h1 class="text-xl font-bold text-gray-900 mb-6">Edit Profile</h1>

      <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {{ errors.general }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
        Profile updated successfully!
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Profile Picture -->
        <div class="flex items-center gap-4">
          <div class="relative w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Profile"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <Camera class="w-8 h-8" />
            </div>
          </div>
          <div>
            <label
              for="profile_picture"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <Camera class="w-4 h-4" />
              Change Photo
            </label>
            <input id="profile_picture" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onFileChange" />
            <p class="text-xs text-gray-400 mt-1">JPEG, PNG or WebP. Max 2MB.</p>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            id="full_name"
            v-model="form.full_name"
            type="text"
            class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="errors.full_name ? 'border-red-300' : 'border-gray-300'"
          />
          <p v-if="errors.full_name" class="mt-1 text-xs text-red-500">{{ errors.full_name }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

        <!-- Address -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            id="address"
            v-model="form.address"
            rows="3"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>
