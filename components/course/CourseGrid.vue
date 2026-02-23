<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import type { Course } from '~/types/course'

defineProps<{
  courses: Course[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div>
    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i">
        <Card class="overflow-hidden">
          <Skeleton class="aspect-video w-full" />
          <CardHeader class="pb-2">
            <Skeleton class="h-3 w-20" />
            <Skeleton class="h-5 w-full mt-1" />
            <Skeleton class="h-5 w-3/4" />
          </CardHeader>
          <CardContent class="pb-2">
            <Skeleton class="h-3 w-24" />
            <Skeleton class="h-4 w-28 mt-2" />
          </CardContent>
          <CardFooter class="pt-2 border-t border-gray-100">
            <Skeleton class="h-5 w-16" />
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="courses.length === 0" class="text-center py-16">
      <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">{{ emptyMessage || 'No courses found.' }}</p>
    </div>

    <!-- Course Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <CourseCard v-for="course in courses" :key="course.id" :course="course" />
    </div>
  </div>
</template>
