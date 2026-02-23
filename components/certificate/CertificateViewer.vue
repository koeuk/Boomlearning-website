<script setup lang="ts">
import { Award } from 'lucide-vue-next'
import type { Certificate } from '~/types/certificate'

defineProps<{
  certificate: Certificate
}>()
</script>

<template>
  <div class="bg-white border-2 border-primary-200 rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
    <!-- Decorative corners -->
    <div class="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary-300 rounded-tl-xl" />
    <div class="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary-300 rounded-tr-xl" />
    <div class="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary-300 rounded-bl-xl" />
    <div class="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary-300 rounded-br-xl" />

    <div class="relative">
      <Award class="w-12 h-12 text-accent-500 mx-auto mb-4" />
      <p class="text-sm text-primary-600 font-medium uppercase tracking-wider mb-2">Certificate of Completion</p>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{{ certificate.student_name }}</h2>
      <p class="text-gray-500 mb-6">has successfully completed</p>
      <h3 class="text-xl font-semibold text-primary-700 mb-1">{{ certificate.course_name }}</h3>
      <p class="text-sm text-gray-500 mb-6">{{ certificate.course_code }}</p>

      <Separator class="my-6 max-w-xs mx-auto" />

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
        <div>
          <p class="text-xs text-gray-400">Instructor</p>
          <p class="font-medium">{{ certificate.instructor_name }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Date Issued</p>
          <p class="font-medium">{{ formatDate(certificate.issue_date) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Certificate ID</p>
          <p class="font-medium font-mono text-xs">{{ certificate.certificate_code }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
