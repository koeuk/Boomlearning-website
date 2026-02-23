<script setup lang="ts">
import { Award, Download, ArrowLeft, Share2, Loader2 } from 'lucide-vue-next'
import type { Certificate } from '~/types/certificate'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { apiFetch } = useApi()
const config = useRuntimeConfig()

const { data, status } = await useAsyncData(`certificate-${route.params.id}`, () =>
  apiFetch<ApiResponse<Certificate>>(`/certificates/${route.params.id}`)
)
const certificate = computed(() => data.value?.data ?? null)

useHead({
  title: computed(() => certificate.value ? `Certificate - ${certificate.value.course_name}` : 'Certificate'),
})

const downloadUrl = computed(() =>
  `${config.public.apiBase}/certificates/${route.params.id}/download`
)

function shareCertificate() {
  if (certificate.value) {
    const url = `${window.location.origin}/certificates/verify/${certificate.value.certificate_code}`
    navigator.clipboard.writeText(url)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/certificates" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
      <ArrowLeft class="w-4 h-4" />
      Back to Certificates
    </NuxtLink>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="certificate" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Certificate Header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 text-center">
        <Award class="w-16 h-16 mx-auto mb-4 text-accent-300" />
        <h1 class="text-2xl font-bold mb-1">Certificate of Completion</h1>
        <p class="text-primary-100">BoomLearning</p>
      </div>

      <!-- Certificate Body -->
      <div class="p-8 text-center space-y-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">This certifies that</p>
          <h2 class="text-2xl font-bold text-gray-900">{{ certificate.student_name }}</h2>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-1">has successfully completed</p>
          <h3 class="text-xl font-semibold text-primary-700">{{ certificate.course_name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ certificate.course_code }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-1">Instructor</p>
          <p class="font-medium text-gray-900">{{ certificate.instructor_name }}</p>
        </div>

        <div class="flex justify-center gap-8 text-sm text-gray-500">
          <div>
            <p class="text-xs text-gray-400">Issue Date</p>
            <p class="font-medium text-gray-700">{{ formatDate(certificate.issue_date) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Certificate ID</p>
            <p class="font-mono font-medium text-gray-700">{{ certificate.certificate_code }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="border-t border-gray-200 p-6 flex justify-center gap-3">
        <a
          :href="downloadUrl"
          target="_blank"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Download class="w-4 h-4" />
          Download PDF
        </a>
        <button
          @click="shareCertificate"
          class="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Share2 class="w-4 h-4" />
          Copy Link
        </button>
      </div>
    </div>
  </div>
</template>
