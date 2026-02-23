<script setup lang="ts">
import { PlayCircle, ArrowRight, Play } from 'lucide-vue-next'
import type { Enrollment } from '~/types/enrollment'

defineProps<{
  enrollments: Enrollment[]
  loading?: boolean
}>()

function progressColor(pct: number) {
  if (pct >= 75) return 'bg-emerald-500'
  if (pct >= 40) return 'bg-primary-500'
  return 'bg-amber-500'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-bold text-gray-900">Continue Learning</h2>
      <NuxtLink
        to="/enrollments"
        class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
      >
        View All
        <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div class="flex gap-4">
          <Skeleton class="w-16 h-16 rounded-lg shrink-0" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-1/2" />
            <Skeleton class="h-2.5 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="enrollments.length === 0" class="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
      <div class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
        <PlayCircle class="w-8 h-8 text-primary-400" />
      </div>
      <p class="text-sm text-gray-500 mb-4">No courses in progress</p>
      <NuxtLink to="/courses">
        <Button size="sm">Browse Courses</Button>
      </NuxtLink>
    </div>

    <!-- Enrollment list -->
    <div v-else class="space-y-3">
      <NuxtLink
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :to="`/enrollments/${enrollment.id}`"
        class="block group"
      >
        <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
          <div class="flex gap-4">
            <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden shrink-0 relative">
              <img
                v-if="resolveImageUrl(enrollment.course.thumbnail)"
                :src="resolveImageUrl(enrollment.course.thumbnail)!"
                :alt="enrollment.course.course_name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play class="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                {{ enrollment.course.course_name }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">{{ enrollment.course.instructor_name }}</p>
              <div class="flex items-center gap-3 mt-2.5">
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    :class="['h-full rounded-full transition-all duration-500', progressColor(enrollment.progress_percentage)]"
                    :style="{ width: `${enrollment.progress_percentage}%` }"
                  />
                </div>
                <span class="text-xs font-semibold text-gray-600 shrink-0 tabular-nums">
                  {{ Math.round(enrollment.progress_percentage) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
