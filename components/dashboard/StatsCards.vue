<script setup lang="ts">
import { BookOpen, CheckCircle, Clock, Award } from 'lucide-vue-next'

defineProps<{
  stats: {
    enrolled_courses: number
    completed_courses: number
    in_progress_courses: number
    certificates_earned: number
  } | null
  loading?: boolean
}>()

const cards = computed(() => [
  { label: 'Enrolled', icon: BookOpen, key: 'enrolled_courses' as const, color: 'text-blue-500 bg-blue-50' },
  { label: 'In Progress', icon: Clock, key: 'in_progress_courses' as const, color: 'text-amber-500 bg-amber-50' },
  { label: 'Completed', icon: CheckCircle, key: 'completed_courses' as const, color: 'text-green-500 bg-green-50' },
  { label: 'Certificates', icon: Award, key: 'certificates_earned' as const, color: 'text-purple-500 bg-purple-50' },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <template v-if="loading">
      <Card v-for="i in 4" :key="i" class="p-4">
        <div class="flex items-center gap-3">
          <Skeleton class="w-10 h-10 rounded-lg" />
          <div class="space-y-1.5">
            <Skeleton class="h-6 w-10" />
            <Skeleton class="h-3 w-16" />
          </div>
        </div>
      </Card>
    </template>
    <template v-else-if="stats">
      <Card v-for="card in cards" :key="card.key" class="p-4">
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', card.color]">
            <component :is="card.icon" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats[card.key] }}</p>
            <p class="text-xs text-gray-500">{{ card.label }}</p>
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>
