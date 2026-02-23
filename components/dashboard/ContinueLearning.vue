<script setup lang="ts">
import { PlayCircle, ArrowRight } from 'lucide-vue-next'
import type { Enrollment } from '~/types/enrollment'

defineProps<{
  enrollments: Enrollment[]
  loading?: boolean
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Continue Learning</h2>
      <NuxtLink
        to="/enrollments"
        class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
      >
        View All
        <ArrowRight class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <Card v-for="i in 3" :key="i" class="p-4">
        <div class="flex gap-4">
          <Skeleton class="w-20 h-14 rounded-md shrink-0" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-1/2" />
            <Skeleton class="h-2 w-full rounded-full" />
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty -->
    <Card v-else-if="enrollments.length === 0" class="p-8 text-center">
      <PlayCircle class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500 mb-3">No courses in progress</p>
      <NuxtLink to="/courses">
        <Button size="sm" variant="outline">Browse Courses</Button>
      </NuxtLink>
    </Card>

    <!-- Enrollment list -->
    <div v-else class="space-y-3">
      <NuxtLink
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :to="`/enrollments/${enrollment.id}`"
        class="block group"
      >
        <Card class="p-4 transition-shadow hover:shadow-md">
          <div class="flex gap-4">
            <div class="w-20 h-14 rounded-md bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden shrink-0">
              <img
                v-if="resolveImageUrl(enrollment.course.thumbnail)"
                :src="resolveImageUrl(enrollment.course.thumbnail)!"
                :alt="enrollment.course.course_name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                {{ enrollment.course.course_name }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ enrollment.course.instructor_name }}</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-500 rounded-full transition-all"
                    :style="{ width: `${enrollment.progress_percentage}%` }"
                  />
                </div>
                <span class="text-xs text-gray-500 shrink-0">{{ enrollment.progress_percentage }}%</span>
              </div>
            </div>
          </div>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
