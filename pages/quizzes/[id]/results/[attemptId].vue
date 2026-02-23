<script setup lang="ts">
import {
  ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, ArrowRight
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { QuizAttempt } from '~/types/quiz'

definePageMeta({
  layout: 'learning',
  middleware: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()
const quizId = Number(route.params.id)
const attemptId = Number(route.params.attemptId)

const { data: attemptData, error } = await useAsyncData(
  `quiz-attempt-${attemptId}`,
  () => apiFetch<ApiResponse<QuizAttempt>>(`/quizzes/attempts/${attemptId}`)
)

const attempt = computed(() => attemptData.value?.data)

useHead({ title: 'Quiz Results - BoomLearning' })

if (error.value) {
  throw createError({ statusCode: 404, message: 'Quiz attempt not found' })
}
</script>

<template>
  <div v-if="attempt" class="min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center">
        <NuxtLink
          :to="`/quizzes/${quizId}`"
          class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Quiz
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Card class="p-6 sm:p-8 text-center">
          <!-- Result icon -->
          <div :class="[
            'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center',
            attempt.passed ? 'bg-green-100' : 'bg-red-100'
          ]">
            <Trophy v-if="attempt.passed" class="w-10 h-10 text-green-600" />
            <XCircle v-else class="w-10 h-10 text-red-500" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {{ attempt.passed ? 'Congratulations!' : 'Keep Trying!' }}
          </h1>
          <p class="text-gray-500 mb-6">
            {{ attempt.passed ? 'You passed the quiz!' : 'You did not reach the passing score.' }}
          </p>

          <!-- Score -->
          <div class="inline-flex items-center gap-6 bg-gray-50 rounded-xl px-8 py-4 mb-6">
            <div class="text-center">
              <p class="text-3xl font-bold" :class="attempt.passed ? 'text-green-600' : 'text-red-500'">
                {{ attempt.percentage }}%
              </p>
              <p class="text-xs text-gray-500">Score</p>
            </div>
            <Separator orientation="vertical" class="h-12" />
            <div class="text-center">
              <p class="text-3xl font-bold text-gray-900">{{ attempt.score }}</p>
              <p class="text-xs text-gray-500">of {{ attempt.total_points }} points</p>
            </div>
            <Separator orientation="vertical" class="h-12" />
            <div class="text-center">
              <p class="text-3xl font-bold text-gray-900">{{ attempt.time_spent_minutes }}m</p>
              <p class="text-xs text-gray-500">Time Spent</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <NuxtLink :to="`/quizzes/${quizId}`">
              <Button variant="outline">
                <RotateCcw class="w-4 h-4 mr-2" />
                {{ attempt.passed ? 'View Quiz' : 'Try Again' }}
              </Button>
            </NuxtLink>
            <Button @click="$router.back()">
              Continue
              <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  </div>
</template>
