<template>
  <div v-if="enrollment && course">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NuxtLink to="/enrollments" class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4">
          <ArrowLeft class="w-4 h-4" />
          Back to My Learning
        </NuxtLink>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ course.course_name }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ course.instructor_name }}</p>
          </div>
          <Badge
            :class="enrollment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'"
            variant="secondary"
            class="capitalize self-start text-xs"
          >
            <component :is="enrollment.status === 'completed' ? CheckCircle : Clock" class="w-3 h-3 mr-1" />
            {{ enrollment.status }}
          </Badge>
        </div>

        <!-- Progress bar -->
        <div class="mt-5 flex items-center gap-3">
          <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="enrollment.progress_percentage === 100 ? 'bg-emerald-500' : 'bg-primary-500'"
              :style="{ width: `${enrollment.progress_percentage}%` }"
            />
          </div>
          <span class="text-sm font-semibold" :class="enrollment.progress_percentage === 100 ? 'text-emerald-600' : 'text-gray-700'">
            {{ enrollment.progress_percentage }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Modules & Lessons -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>

      <div class="space-y-3">
        <div v-for="(mod, index) in course.modules ?? []" :key="mod.id" class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            @click="toggleModule(mod.id)"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0">
                {{ index + 1 }}
              </span>
              <div>
                <p class="font-medium text-gray-900">{{ mod.module_title }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ mod.lessons_count }} lessons</p>
              </div>
            </div>
            <ChevronDown
              class="w-5 h-5 text-gray-400 transition-transform shrink-0"
              :class="{ 'rotate-180': openModules.has(mod.id) }"
            />
          </button>

          <div v-if="openModules.has(mod.id)" class="border-t border-gray-100">
            <NuxtLink
              v-for="lesson in mod.lessons ?? []"
              :key="lesson.id"
              :to="lessonUrl(lesson)"
              class="flex items-center gap-3 px-5 py-3.5 pl-16 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
            >
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                lesson.progress?.status === 'completed' ? 'bg-emerald-50' : 'bg-gray-50']">
                <component
                  v-if="lesson.progress?.status === 'completed'"
                  :is="CheckCircle"
                  class="w-4 h-4 text-emerald-500"
                />
                <component
                  v-else
                  :is="lessonIcon[lesson.lesson_type] || FileText"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
              <span class="text-sm text-gray-700 flex-1 group-hover:text-primary-600 transition-colors">
                {{ lesson.lesson_title }}
              </span>
              <span v-if="lesson.duration_minutes" class="text-xs text-gray-400 mr-1">
                {{ lesson.duration_minutes }}m
              </span>
              <ChevronRightIcon class="w-4 h-4 text-gray-300 group-hover:text-primary-400 shrink-0" />
            </NuxtLink>
            <div v-if="!mod.lessons?.length" class="px-5 py-4 pl-16 text-sm text-gray-400">
              No lessons available
            </div>
          </div>
        </div>

        <div v-if="!course.modules?.length" class="bg-white rounded-xl border border-gray-100 px-5 py-12 text-center text-sm text-gray-400">
          No course content available yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon, ChevronDown, PlayCircle, FileText, HelpCircle,
  CheckCircle, Clock, ArrowLeft
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Enrollment } from '~/types/enrollment'
import type { Lesson } from '~/types/course'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()
const enrollmentId = route.params.id as string

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

const openModules = ref<Set<number>>(new Set())

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

function lessonUrl(lesson: Lesson) {
  if (lesson.lesson_type === 'quiz' && lesson.quiz) {
    return `/quizzes/${lesson.quiz.id}`
  }
  return `/lessons/${lesson.id}`
}
</script>
