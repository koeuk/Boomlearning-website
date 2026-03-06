<template>
  <Card class="hover:shadow-md transition-shadow">
    <CardContent class="p-5">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
          <Award class="w-6 h-6 text-primary-600" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ certificate.course.course_name }}</h3>
          <p class="text-sm text-gray-500 mt-0.5">{{ certificate.course.course_code }}</p>
          <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ formatDate(certificate.issue_date) }}
            </span>
            <span class="font-mono">{{ certificate.certificate_code }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <NuxtLink :to="`/certificates/${certificate.id}`">
          <Button size="sm" variant="outline">
            <Eye class="w-3.5 h-3.5 mr-1" />
            View
          </Button>
        </NuxtLink>
        <a :href="certificate.download_url" target="_blank">
          <Button size="sm" variant="outline">
            <Download class="w-3.5 h-3.5 mr-1" />
            Download
          </Button>
        </a>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Award, Calendar, Eye, Download } from 'lucide-vue-next'
import type { Certificate } from '~/types/certificate'

defineProps<{
  certificate: Certificate
}>()
</script>
