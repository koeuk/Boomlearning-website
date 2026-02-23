<script setup lang="ts">
import {
  ArrowLeft, Clock, Target, RotateCcw, HelpCircle,
  CheckCircle, XCircle, ArrowRight
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Quiz, QuizAttempt } from '~/types/quiz'

definePageMeta({
  layout: 'learning',
  middleware: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()
const quizId = Number(route.params.id)

const { data: quizData, error } = await useAsyncData(
  `quiz-${quizId}`,
  () => apiFetch<ApiResponse<Quiz>>(`/quizzes/${quizId}`)
)

const quiz = computed(() => quizData.value?.data)

useHead({
  title: computed(() => quiz.value ? `${quiz.value.quiz_title} - BoomLearning` : 'Quiz - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Quiz not found' })
}

// Fetch attempts
const { data: attemptsData } = await useAsyncData(
  `quiz-${quizId}-attempts`,
  () => apiFetch<ApiResponse<QuizAttempt[]>>(`/quizzes/${quizId}/attempts`)
)
const attempts = computed(() => attemptsData.value?.data ?? [])
</script>

<template>
  <div v-if="quiz" class="min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center">
        <button
          @click="$router.back()"
          class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
      </div>
    </header>

    <main class="flex-1 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Card class="p-6 sm:p-8">
          <div class="text-center mb-6">
            <HelpCircle class="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <h1 class="text-2xl font-bold text-gray-900">{{ quiz.quiz_title }}</h1>
            <p v-if="quiz.instructions" class="text-gray-500 mt-2 text-sm">{{ quiz.instructions }}</p>
          </div>

          <!-- Quiz info -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <HelpCircle class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ quiz.total_questions }}</p>
              <p class="text-xs text-gray-500">Questions</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <Target class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ quiz.total_points }}</p>
              <p class="text-xs text-gray-500">Total Points</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <Clock class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ quiz.time_limit_minutes ?? '∞' }}</p>
              <p class="text-xs text-gray-500">Minutes</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <RotateCcw class="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">
                {{ quiz.max_attempts ? `${quiz.attempts_used}/${quiz.max_attempts}` : quiz.attempts_used }}
              </p>
              <p class="text-xs text-gray-500">Attempts</p>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500 mb-6">
            Passing score: <strong class="text-gray-700">{{ quiz.passing_score }}%</strong>
          </div>

          <div class="text-center">
            <NuxtLink v-if="quiz.can_attempt" :to="`/quizzes/${quiz.id}/take`">
              <Button size="lg">
                {{ quiz.attempts_used > 0 ? 'Retake Quiz' : 'Start Quiz' }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </NuxtLink>
            <p v-else class="text-sm text-red-500">
              You have reached the maximum number of attempts for this quiz.
            </p>
          </div>
        </Card>

        <!-- Previous attempts -->
        <div v-if="attempts.length > 0" class="mt-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Previous Attempts</h2>
          <div class="space-y-3">
            <NuxtLink
              v-for="attempt in attempts"
              :key="attempt.id"
              :to="`/quizzes/${quizId}/results/${attempt.id}`"
              class="block"
            >
              <Card class="p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      attempt.passed ? 'bg-green-100' : 'bg-red-100'
                    ]">
                      <CheckCircle v-if="attempt.passed" class="w-4 h-4 text-green-600" />
                      <XCircle v-else class="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ attempt.score }}/{{ attempt.total_points }} points ({{ attempt.percentage }}%)
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatRelativeTime(attempt.started_at) }}
                        <span v-if="attempt.time_spent_minutes"> · {{ attempt.time_spent_minutes }}m</span>
                      </p>
                    </div>
                  </div>
                  <Badge
                    :class="attempt.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    variant="secondary"
                  >
                    {{ attempt.passed ? 'Passed' : 'Failed' }}
                  </Badge>
                </div>
              </Card>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
