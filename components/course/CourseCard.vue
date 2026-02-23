<script setup lang="ts">
import { Clock, Users } from 'lucide-vue-next'
import type { Course } from '~/types/course'

const props = defineProps<{
  course: Course
}>()

const thumbnail = computed(() => resolveImageUrl(props.course.thumbnail))

const levelColor = computed(() => ({
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}[props.course.level]))
</script>

<template>
  <NuxtLink :to="`/courses/${course.id}`" class="group block">
    <Card class="overflow-hidden h-full transition-shadow hover:shadow-md">
      <!-- Thumbnail -->
      <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
        <img
          v-if="thumbnail"
          :src="thumbnail"
          :alt="course.course_name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge :class="['absolute top-2 left-2', levelColor]" variant="secondary">
          {{ course.level }}
        </Badge>
      </div>

      <CardHeader class="pb-2">
        <p class="text-xs text-primary-600 font-medium">{{ course.category?.category_name }}</p>
        <CardTitle class="text-base line-clamp-2 group-hover:text-primary-600 transition-colors">
          {{ course.course_name }}
        </CardTitle>
      </CardHeader>

      <CardContent class="pb-2">
        <p class="text-sm text-gray-500">{{ course.instructor_name }}</p>
        <div class="flex items-center gap-2 mt-2">
          <ReviewStarRating :rating="course.average_rating" size="sm" />
          <span class="text-xs text-gray-500">({{ course.reviews_count }})</span>
        </div>
      </CardContent>

      <CardFooter class="pt-2 border-t border-gray-100 flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">{{ formatCurrency(course.price) }}</span>
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span class="flex items-center gap-1">
            <Clock class="w-3.5 h-3.5" />
            {{ course.duration_hours }}h
          </span>
          <span class="flex items-center gap-1">
            <Users class="w-3.5 h-3.5" />
            {{ course.enrollments_count }}
          </span>
        </div>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>
