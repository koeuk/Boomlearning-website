<script setup lang="ts">
import { BookOpen, CheckCircle, Award, PlayCircle, Activity } from 'lucide-vue-next'

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
    case 'enrollment': return 'text-blue-500 bg-blue-50'
    case 'completion': return 'text-green-500 bg-green-50'
    case 'certificate': return 'text-purple-500 bg-purple-50'
    case 'lesson': return 'text-amber-500 bg-amber-50'
    default: return 'text-gray-500 bg-gray-50'
  }
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>

    <!-- Loading -->
    <Card v-if="loading" class="divide-y divide-gray-100">
      <div v-for="i in 5" :key="i" class="p-4 flex gap-3">
        <Skeleton class="w-8 h-8 rounded-full shrink-0" />
        <div class="flex-1 space-y-1.5">
          <Skeleton class="h-3 w-3/4" />
          <Skeleton class="h-3 w-20" />
        </div>
      </div>
    </Card>

    <!-- Empty -->
    <Card v-else-if="activities.length === 0" class="p-8 text-center">
      <Activity class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">No recent activity</p>
    </Card>

    <!-- Activity list -->
    <Card v-else class="divide-y divide-gray-100">
      <div v-for="item in activities" :key="item.id" class="p-4 flex gap-3">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0', getColor(item.type)]">
          <component :is="getIcon(item.type)" class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700">{{ item.description }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ formatRelativeTime(item.created_at) }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>
