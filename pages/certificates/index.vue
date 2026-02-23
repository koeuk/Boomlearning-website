<script setup lang="ts">
import { Award, Download, Eye, Loader2 } from 'lucide-vue-next'
import type { Certificate } from '~/types/certificate'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Certificates - BoomLearning' })

const { apiFetch } = useApi()

const { data, status } = await useAsyncData('my-certificates', () =>
  apiFetch<ApiResponse<Certificate[]>>('/certificates')
)
const certificates = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Certificates</h1>

    <!-- Loading -->
    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Empty -->
    <div v-else-if="certificates.length === 0" class="text-center py-20">
      <Award class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">No certificates yet</h3>
      <p class="text-sm text-gray-500 mb-4">Complete a course to earn your first certificate.</p>
      <NuxtLink to="/courses" class="text-sm font-medium text-primary-600 hover:text-primary-700">
        Browse Courses
      </NuxtLink>
    </div>

    <!-- List -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <Award class="w-10 h-10 text-accent-500" />
          <span class="text-xs text-gray-400 font-mono">{{ cert.certificate_code }}</span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-1">{{ cert.course_name }}</h3>
        <p class="text-sm text-gray-500 mb-1">{{ cert.instructor_name }}</p>
        <p class="text-xs text-gray-400 mb-4">Issued {{ formatDate(cert.issue_date) }}</p>
        <div class="flex gap-2">
          <NuxtLink
            :to="`/certificates/${cert.id}`"
            class="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-lg px-3 py-2 transition-colors"
          >
            <Eye class="w-4 h-4" />
            View
          </NuxtLink>
          <a
            v-if="cert.certificate_url"
            :href="cert.certificate_url"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg px-3 py-2 transition-colors"
          >
            <Download class="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
