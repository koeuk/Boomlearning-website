<script setup lang="ts">
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-vue-next'
import type { Quiz, Question } from '~/types/quiz'

const props = defineProps<{
  quiz: Quiz
}>()

const emit = defineEmits<{
  submit: [answers: Record<number, number | string>]
}>()

const answers = ref<Record<number, number | string>>({})
const currentIndex = ref(0)

const currentQuestion = computed(() => props.quiz.questions[currentIndex.value])
const totalQuestions = computed(() => props.quiz.questions.length)
const answeredCount = computed(() => Object.keys(answers.value).length)
const allAnswered = computed(() => answeredCount.value === totalQuestions.value)

function selectOption(questionId: number, optionId: number) {
  answers.value[questionId] = optionId
}

function setTextAnswer(questionId: number, text: string) {
  answers.value[questionId] = text
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < totalQuestions.value - 1) currentIndex.value++
}

function handleSubmit() {
  emit('submit', { ...answers.value })
}

// Timer
const timeRemaining = ref(props.quiz.time_limit_minutes ? props.quiz.time_limit_minutes * 60 : 0)
const hasTimer = computed(() => !!props.quiz.time_limit_minutes)
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

onMounted(() => {
  if (hasTimer.value) {
    timer = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 0) {
        if (timer) clearInterval(timer)
        handleSubmit()
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <span class="text-sm text-gray-500">
          Question {{ currentIndex + 1 }} of {{ totalQuestions }}
        </span>
        <span class="text-xs text-gray-400 ml-2">({{ currentQuestion.points }} pts)</span>
      </div>
      <div v-if="hasTimer" class="flex items-center gap-1.5 text-sm font-medium" :class="timeRemaining < 60 ? 'text-red-500' : 'text-gray-600'">
        <Clock class="w-4 h-4" />
        {{ formattedTime }}
      </div>
    </div>

    <!-- Progress dots -->
    <div class="flex gap-1.5 flex-wrap">
      <button
        v-for="(q, idx) in quiz.questions"
        :key="q.id"
        @click="currentIndex = idx"
        class="w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-colors"
        :class="[
          idx === currentIndex ? 'ring-2 ring-primary-500 ring-offset-1' : '',
          answers[q.id] !== undefined ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500',
        ]"
      >
        {{ idx + 1 }}
      </button>
    </div>

    <!-- Question -->
    <Card class="p-6">
      <div v-if="currentQuestion.image_url" class="mb-4">
        <img :src="resolveImageUrl(currentQuestion.image_url)!" :alt="`Question ${currentIndex + 1}`" class="max-h-48 rounded-lg" />
      </div>

      <p class="text-gray-900 font-medium mb-4">{{ currentQuestion.question_text }}</p>

      <!-- Multiple choice / True-false -->
      <div v-if="currentQuestion.question_type !== 'text'" class="space-y-2">
        <button
          v-for="option in currentQuestion.options"
          :key="option.id"
          @click="selectOption(currentQuestion.id, option.id)"
          class="w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm"
          :class="answers[currentQuestion.id] === option.id
            ? 'border-primary-500 bg-primary-50 text-primary-700'
            : 'border-gray-200 hover:border-gray-300 text-gray-700'"
        >
          {{ option.option_text }}
        </button>
      </div>

      <!-- Text answer -->
      <div v-else>
        <textarea
          :value="(answers[currentQuestion.id] as string) ?? ''"
          @input="setTextAnswer(currentQuestion.id, ($event.target as HTMLTextAreaElement).value)"
          placeholder="Type your answer..."
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>
    </Card>

    <!-- Navigation -->
    <div class="flex items-center justify-between">
      <Button variant="outline" :disabled="currentIndex === 0" @click="prev">
        <ChevronLeft class="w-4 h-4 mr-1" />
        Previous
      </Button>

      <template v-if="currentIndex < totalQuestions - 1">
        <Button @click="next">
          Next
          <ChevronRight class="w-4 h-4 ml-1" />
        </Button>
      </template>
      <template v-else>
        <Button @click="handleSubmit" :disabled="!allAnswered">
          Submit Quiz
        </Button>
      </template>
    </div>

    <Alert v-if="!allAnswered" class="bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle class="w-4 h-4 text-amber-500" />
      <AlertDescription class="text-amber-700">
        {{ answeredCount }} of {{ totalQuestions }} questions answered
      </AlertDescription>
    </Alert>
  </div>
</template>
