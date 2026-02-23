<script setup lang="ts">
import { User, Mail, Phone, Calendar, MapPin, Edit, Key } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Profile - BoomLearning' })

const auth = useAuthStore()
const user = computed(() => auth.user)
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
      <div class="flex gap-2">
        <NuxtLink
          to="/profile/edit"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Edit class="w-4 h-4" />
          Edit
        </NuxtLink>
        <NuxtLink
          to="/profile/change-password"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Key class="w-4 h-4" />
          Password
        </NuxtLink>
      </div>
    </div>

    <div v-if="user" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
          <img
            v-if="user.image_url"
            :src="user.image_url"
            :alt="user.full_name"
            class="w-full h-full object-cover"
          />
          <User v-else class="w-10 h-10 text-white/70" />
        </div>
        <div class="text-white">
          <h2 class="text-xl font-bold">{{ user.full_name }}</h2>
          <p class="text-primary-100 text-sm">@{{ user.username }}</p>
        </div>
      </div>

      <!-- Details -->
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3">
          <Mail class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Email</p>
            <p class="text-sm text-gray-900">{{ user.email }}</p>
          </div>
        </div>

        <div v-if="user.phone" class="flex items-center gap-3">
          <Phone class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Phone</p>
            <p class="text-sm text-gray-900">{{ user.phone }}</p>
          </div>
        </div>

        <div v-if="user.date_of_birth" class="flex items-center gap-3">
          <Calendar class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Date of Birth</p>
            <p class="text-sm text-gray-900">{{ formatDate(user.date_of_birth) }}</p>
          </div>
        </div>

        <div v-if="user.gender" class="flex items-center gap-3">
          <User class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Gender</p>
            <p class="text-sm text-gray-900 capitalize">{{ user.gender }}</p>
          </div>
        </div>

        <div v-if="user.address" class="flex items-center gap-3">
          <MapPin class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Address</p>
            <p class="text-sm text-gray-900">{{ user.address }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <Calendar class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Member Since</p>
            <p class="text-sm text-gray-900">{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
