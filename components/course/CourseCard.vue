<template>
  <NuxtLink :to="`/courses/${course.id}`" class="group block">
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
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
        <!-- Featured Badge -->
        <div v-if="course.is_featured" class="absolute top-3 left-3">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500 text-white">
            Featured
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col flex-1">
        <!-- Tags row -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[11px] font-medium text-gray-500 border border-gray-200 rounded px-2 py-0.5">
            {{ course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner' }}
          </span>
          <span class="text-[11px] font-medium text-gray-500 border border-gray-200 rounded px-2 py-0.5">
            {{ course.duration_hours }}h Content
          </span>
        </div>

        <h3 class="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {{ course.course_name }}
        </h3>

        <!-- Instructor + Price -->
        <div class="mt-auto pt-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span class="text-[10px] font-semibold text-gray-600">{{ course.instructor_name?.[0]?.toUpperCase() }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ course.instructor_name }}</span>
          </div>
          <span class="text-sm font-bold text-primary-600">{{ formatCurrency(course.price) }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import type { Course } from '~/types/course'

const props = defineProps<{
  course: Course
}>()

const thumbnail = computed(() => resolveImageUrl(props.course.thumbnail))
</script>
