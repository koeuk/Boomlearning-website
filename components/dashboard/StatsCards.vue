<script setup lang="ts">
import { BookOpen, CheckCircle, Clock, Award, TrendingUp } from 'lucide-vue-next'

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
  {
    label: 'Enrolled',
    icon: BookOpen,
    key: 'enrolled_courses' as const,
    iconColor: 'text-blue-600',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500/10',
    border: 'border-blue-100',
  },
  {
    label: 'In Progress',
    icon: Clock,
    key: 'in_progress_courses' as const,
    iconColor: 'text-amber-600',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    iconBg: 'bg-amber-500/10',
    border: 'border-amber-100',
  },
  {
    label: 'Completed',
    icon: CheckCircle,
    key: 'completed_courses' as const,
    iconColor: 'text-emerald-600',
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-500/10',
    border: 'border-emerald-100',
  },
  {
    label: 'Certificates',
    icon: Award,
    key: 'certificates_earned' as const,
    iconColor: 'text-violet-600',
    bg: 'bg-gradient-to-br from-violet-50 to-violet-100',
    iconBg: 'bg-violet-500/10',
    border: 'border-violet-100',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <Skeleton class="h-4 w-16" />
            <Skeleton class="h-8 w-12" />
          </div>
          <Skeleton class="w-12 h-12 rounded-xl" />
        </div>
      </div>
    </template>
    <template v-else-if="stats">
      <div
        v-for="card in cards"
        :key="card.key"
        :class="['rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-default', card.bg, card.border]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ card.label }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats[card.key] }}</p>
          </div>
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', card.iconBg]">
            <component :is="card.icon" :class="['w-6 h-6', card.iconColor]" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
