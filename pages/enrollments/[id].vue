<script setup lang="ts">
import {
  ChevronRight, ChevronDown, PlayCircle, FileText, HelpCircle,
  CheckCircle, Clock, Lock, ArrowLeft
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Enrollment } from '~/types/enrollment'
import type { Module, Lesson } from '~/types/course'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()
const enrollmentId = Number(route.params.id)

const { data: enrollData, error } = await useAsyncData(
  `enrollment-${enrollmentId}`,
  () => apiFetch<ApiResponse<Enrollment>>(`/enrollments/${enrollmentId}`)
)

const enrollment = computed(() => enrollData.value?.data)
const course = computed(() => enrollment.value?.course)

useHead({
  title: computed(() => course.value ? `${course.value.course_name} - My Learning` : 'Enrollment - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Enrollment not found' })
}

// Module accordion
const openModules = ref<Set<number>>(new Set())

// Auto-open first module
watch(course, (c) => {
  if (c?.modules?.length) {
    openModules.value.add(c.modules[0].id)
  }
}, { immediate: true })

function toggleModule(id: number) {
  if (openModules.value.has(id)) {
    openModules.value.delete(id)
  } else {
    openModules.value.add(id)
  }
}

const lessonIcon = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
} as const

function lessonStatusIcon(lesson: Lesson) {
  if (lesson.progress?.status === 'completed') return CheckCircle
  if (lesson.progress?.status === 'in_progress') return Clock
  return null
}

function lessonStatusColor(lesson: Lesson) {
  if (lesson.progress?.status === 'completed') return 'text-green-500'
  if (lesson.progress?.status === 'in_progress') return 'text-amber-500'
  return 'text-gray-300'
}

function lessonUrl(lesson: Lesson) {
  if (lesson.lesson_type === 'quiz' && lesson.quiz) {
    return `/quizzes/${lesson.quiz.id}`
  }
  return `/lessons/${lesson.id}`
}
</script>

<template>
  <div v-if="enrollment && course">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NuxtLink to="/enrollments" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-3">
          <ArrowLeft class="w-4 h-4" />
          Back to My Learning
        </NuxtLink>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ course.course_name }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ course.instructor_name }}</p>
          </div>
          <Badge
            :class="enrollment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
            variant="secondary"
            class="capitalize self-start"
          >
            {{ enrollment.status }}
          </Badge>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 flex items-center gap-3">
          <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="enrollment.progress_percentage === 100 ? 'bg-green-500' : 'bg-primary-500'"
              :style="{ width: `${enrollment.progress_percentage}%` }"
            />
          </div>
          <span class="text-sm font-medium text-gray-700">{{ enrollment.progress_percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Modules & Lessons -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>

      <div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
        <div v-for="mod in course.modules ?? []" :key="mod.id">
          <button
            @click="toggleModule(mod.id)"
            class="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div>
              <p class="font-medium text-gray-900">{{ mod.module_title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ mod.lessons_count }} lessons</p>
            </div>
            <ChevronDown
              class="w-5 h-5 text-gray-400 transition-transform shrink-0"
              :class="{ 'rotate-180': openModules.has(mod.id) }"
            />
          </button>

          <div v-if="openModules.has(mod.id)" class="bg-gray-50">
            <NuxtLink
              v-for="lesson in mod.lessons ?? []"
              :key="lesson.id"
              :to="lessonUrl(lesson)"
              class="flex items-center gap-3 px-4 py-3 pl-8 hover:bg-gray-100 transition-colors border-t border-gray-100 group"
            >
              <component
                :is="lessonIcon[lesson.lesson_type] || FileText"
                class="w-4 h-4 text-gray-400 shrink-0"
              />
              <span class="text-sm text-gray-700 flex-1 group-hover:text-primary-600 transition-colors">
                {{ lesson.lesson_title }}
              </span>
              <span v-if="lesson.duration_minutes" class="text-xs text-gray-400 mr-2">
                {{ lesson.duration_minutes }}m
              </span>
              <component
                v-if="lessonStatusIcon(lesson)"
                :is="lessonStatusIcon(lesson)"
                :class="['w-4 h-4 shrink-0', lessonStatusColor(lesson)]"
              />
            </NuxtLink>
            <div v-if="!mod.lessons?.length" class="px-4 py-4 pl-8 text-sm text-gray-400 border-t border-gray-100">
              No lessons available
            </div>
          </div>
        </div>

        <div v-if="!course.modules?.length" class="px-4 py-12 text-center text-sm text-gray-400">
          No course content available yet
        </div>
      </div>
    </div>
  </div>
</template>
