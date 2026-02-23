<script setup lang="ts">
import { BookOpen, CheckCircle, Award, PlayCircle, Activity, Zap } from 'lucide-vue-next'

interface ActivityItem {
  id: number
  type: string
  description: string
  created_at: string
}

defineProps<{
  activities: ActivityItem[]
  loading?: boolean
}>()

function getIcon(type: string) {
  switch (type) {
    case 'enrollment': return BookOpen
    case 'completion': return CheckCircle
    case 'certificate': return Award
    case 'lesson': return PlayCircle
    default: return Activity
  }
}

function getColor(type: string) {
  switch (type) {
    case 'enrollment': return 'text-blue-600 bg-blue-100'
    case 'completion': return 'text-emerald-600 bg-emerald-100'
    case 'certificate': return 'text-violet-600 bg-violet-100'
    case 'lesson': return 'text-amber-600 bg-amber-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-gray-900 mb-5">Recent Activity</h2>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
      <div v-for="i in 5" :key="i" class="p-4 flex gap-3">
        <Skeleton class="w-9 h-9 rounded-lg shrink-0" />
        <div class="flex-1 space-y-1.5">
          <Skeleton class="h-3.5 w-4/5" />
          <Skeleton class="h-3 w-20" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="activities.length === 0" class="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
      <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <Zap class="w-8 h-8 text-gray-300" />
      </div>
      <p class="text-sm text-gray-500">No recent activity</p>
      <p class="text-xs text-gray-400 mt-1">Start a course to see your activity here</p>
    </div>

    <!-- Activity list -->
    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
      <div
        v-for="(item, idx) in activities"
        :key="item.id"
        class="p-4 flex gap-3 hover:bg-gray-50/50 transition-colors"
      >
        <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', getColor(item.type)]">
          <component :is="getIcon(item.type)" class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 leading-snug">{{ item.description }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(item.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
