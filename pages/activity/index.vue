<script setup lang="ts">
import { Activity, Loader2, Clock } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Activity Log - BoomLearning' })

const { apiFetch } = useApi()

interface ActivityItem {
  id: number
  type: string
  description: string
  properties?: Record<string, any>
  created_at: string
}

const { data, status } = await useAsyncData('activity-log', () =>
  apiFetch<ApiResponse<ActivityItem[]>>('/dashboard/activity-log')
)
const activities = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Activity Log</h1>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="activities.length === 0" class="text-center py-20">
      <Activity class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">No activity yet</h3>
      <p class="text-sm text-gray-500">Your activity history will appear here.</p>
    </div>

    <div v-else class="space-y-1">
      <div
        v-for="item in activities"
        :key="item.id"
        class="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3"
      >
        <div class="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
          <Clock class="w-4 h-4 text-primary-500" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">{{ item.description }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(item.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
