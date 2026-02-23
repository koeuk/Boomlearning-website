<script setup lang="ts">
import { Clock, Users, BookOpen } from 'lucide-vue-next'
import type { Course } from '~/types/course'

const props = defineProps<{
  course: Course
}>()

const thumbnail = computed(() => resolveImageUrl(props.course.thumbnail))

const levelConfig = computed(() => ({
  beginner: { class: 'bg-emerald-500/90 text-white', label: 'Beginner' },
  intermediate: { class: 'bg-blue-500/90 text-white', label: 'Intermediate' },
  advanced: { class: 'bg-violet-500/90 text-white', label: 'Advanced' },
}[props.course.level]))
</script>

<template>
  <NuxtLink :to="`/courses/${course.id}`" class="group block">
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <!-- Thumbnail -->
      <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
        <img
          v-if="thumbnail"
          :src="thumbnail"
          :alt="course.course_name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="absolute inset-0 flex items-center justify-center">
          <BookOpen class="w-10 h-10 text-primary-300" />
        </div>
        <div class="absolute top-3 left-3">
          <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm', levelConfig.class]">
            {{ levelConfig.label }}
          </span>
        </div>
        <div v-if="course.is_featured" class="absolute top-3 right-3">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-500/90 text-white backdrop-blur-sm">
            Featured
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col flex-1">
        <p class="text-xs font-semibold text-primary-600 uppercase tracking-wider">{{ course.category?.category_name }}</p>
        <h3 class="text-sm font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {{ course.course_name }}
        </h3>
        <p class="text-xs text-gray-400 mt-1.5">{{ course.instructor_name }}</p>

        <!-- Rating -->
        <div class="flex items-center gap-1.5 mt-2">
          <span class="text-sm font-bold text-amber-500">{{ course.average_rating.toFixed(1) }}</span>
          <ReviewStarRating :rating="course.average_rating" size="sm" />
          <span class="text-xs text-gray-400">({{ course.reviews_count }})</span>
        </div>

        <!-- Footer -->
        <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <span class="text-lg font-extrabold text-gray-900">{{ formatCurrency(course.price) }}</span>
          <div class="flex items-center gap-2.5 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5" />
              {{ course.duration_hours }}h
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-3.5 h-3.5" />
              {{ course.enrollments_count }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
