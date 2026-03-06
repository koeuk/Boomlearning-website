<template>
  <div v-if="lesson" class="min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          @click="$router.back()"
          class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Back to Course</span>
        </button>

        <div class="text-center flex-1 px-4">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ lesson.lesson_title }}</p>
          <p class="text-xs text-gray-400">{{ lesson.module?.module_title }}</p>
        </div>

        <div class="w-20 text-right">
          <Badge v-if="isCompleted" class="bg-emerald-50 text-emerald-700" variant="secondary">
            <CheckCircle class="w-3 h-3 mr-1" />
            Done
          </Badge>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <LearningLessonViewer :lesson="lesson" />
        </div>

        <!-- Complete button -->
        <div class="mt-8 flex items-center justify-center">
          <Button
            v-if="!isCompleted"
            @click="markComplete"
            :disabled="markingComplete"
            size="lg"
            class="rounded-xl px-8 h-12"
          >
            <Loader2 v-if="markingComplete" class="w-4 h-4 mr-2 animate-spin" />
            <CheckCircle v-else class="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
          <div
            v-else
            class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium"
          >
            <CheckCircle class="w-5 h-5" />
            Lesson Completed
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Lesson } from '~/types/course'

definePageMeta({
  layout: 'learning',
  middleware: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()
const lessonId = route.params.id as string

const { data: lessonData, error } = await useAsyncData(
  `lesson-${lessonId}`,
  () => apiFetch<ApiResponse<Lesson>>(`/lessons/${lessonId}`)
)

const lesson = computed(() => lessonData.value?.data)

useHead({
  title: computed(() => lesson.value ? `${lesson.value.lesson_title} - BoomLearning` : 'Lesson - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Lesson not found' })
}

const isCompleted = computed(() => lesson.value?.progress?.status === 'completed')
const markingComplete = ref(false)

async function markComplete() {
  if (!lesson.value || markingComplete.value) return
  markingComplete.value = true
  try {
    await apiFetch(`/lessons/${lesson.value.id}/progress`, {
      method: 'POST',
      body: { status: 'completed' },
    })
    if (lesson.value.progress) {
      lesson.value.progress.status = 'completed'
    }
  } catch {
    // Silent fail
  } finally {
    markingComplete.value = false
  }
}
</script>
