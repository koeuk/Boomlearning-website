<script setup lang="ts">
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Quiz, QuizAttempt } from '~/types/quiz'

definePageMeta({
  layout: 'learning',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { apiFetch } = useApi()
const quizId = Number(route.params.id)

const { data: quizData, error } = await useAsyncData(
  `quiz-take-${quizId}`,
  () => apiFetch<ApiResponse<Quiz>>(`/quizzes/${quizId}`)
)

const quiz = computed(() => quizData.value?.data)

useHead({
  title: computed(() => quiz.value ? `Taking: ${quiz.value.quiz_title}` : 'Quiz - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Quiz not found' })
}

// Start attempt
const attemptId = ref<number | null>(null)
const submitting = ref(false)
const startError = ref('')

onMounted(async () => {
  if (!quiz.value?.can_attempt) {
    navigateTo(`/quizzes/${quizId}`)
    return
  }
  try {
    const res = await apiFetch<ApiResponse<{ id: number }>>(`/quizzes/${quizId}/attempts`, {
      method: 'POST',
    })
    attemptId.value = res.data.id
  } catch {
    startError.value = 'Failed to start quiz attempt.'
  }
})

async function handleSubmit(answers: Record<number, number | string>) {
  if (!attemptId.value || submitting.value) return
  submitting.value = true
  try {
    await apiFetch<ApiResponse<QuizAttempt>>(`/quizzes/attempts/${attemptId.value}`, {
      method: 'PUT',
      body: { answers },
    })
    navigateTo(`/quizzes/${quizId}/results/${attemptId.value}`)
  } catch {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          @click="router.back()"
          class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Exit
        </button>
        <p class="text-sm font-medium text-gray-900">{{ quiz?.quiz_title }}</p>
        <div class="w-12" />
      </div>
    </header>

    <main class="flex-1 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <!-- Error -->
        <Alert v-if="startError" variant="destructive">
          <AlertDescription>{{ startError }}</AlertDescription>
        </Alert>

        <!-- Loading -->
        <div v-else-if="!attemptId" class="text-center py-16">
          <Loader2 class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
          <p class="text-gray-500 mt-3 text-sm">Starting quiz...</p>
        </div>

        <!-- Submitting overlay -->
        <div v-else-if="submitting" class="text-center py-16">
          <Loader2 class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
          <p class="text-gray-500 mt-3 text-sm">Submitting your answers...</p>
        </div>

        <!-- Quiz player -->
        <LearningQuizPlayer
          v-else-if="quiz"
          :quiz="quiz"
          @submit="handleSubmit"
        />
      </div>
    </main>
  </div>
</template>
