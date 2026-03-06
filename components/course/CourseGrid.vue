<template>
  <div>
    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Skeleton class="aspect-video w-full" />
        <div class="p-4 space-y-3">
          <div class="flex gap-2">
            <Skeleton class="h-5 w-20 rounded" />
            <Skeleton class="h-5 w-24 rounded" />
          </div>
          <Skeleton class="h-5 w-full" />
          <Skeleton class="h-5 w-3/4" />
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-2">
              <Skeleton class="w-6 h-6 rounded-full" />
              <Skeleton class="h-3 w-24" />
            </div>
            <Skeleton class="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="courses.length === 0" class="text-center py-16">
      <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <BookOpen class="w-8 h-8 text-gray-300" />
      </div>
      <p class="text-gray-500">{{ emptyMessage || 'No courses found.' }}</p>
    </div>

    <!-- Course Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard v-for="course in courses" :key="course.id" :course="course" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import type { Course } from '~/types/course'

defineProps<{
  courses: Course[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>
