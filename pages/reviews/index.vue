<script setup lang="ts">
import { Star, Loader2, MessageSquare, Trash2 } from 'lucide-vue-next'
import type { Review } from '~/types/review'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Reviews - BoomLearning' })

const { apiFetch } = useApi()

const { data, status, refresh } = await useAsyncData('my-reviews', () =>
  apiFetch<ApiResponse<Review[]>>('/reviews')
)
const reviews = computed(() => data.value?.data ?? [])

const deleting = ref<number | null>(null)

async function deleteReview(id: number) {
  if (!confirm('Are you sure you want to delete this review?')) return
  deleting.value = id
  try {
    await apiFetch(`/reviews/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {}
  deleting.value = null
}

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="reviews.length === 0" class="text-center py-20">
      <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
      <p class="text-sm text-gray-500">After completing a course, you can leave a review.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <NuxtLink
              v-if="review.course"
              :to="`/courses/${review.course.id}`"
              class="font-semibold text-gray-900 hover:text-primary-600"
            >
              {{ review.course.course_name }}
            </NuxtLink>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-accent-500 text-sm tracking-wider">{{ renderStars(review.rating) }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
            </div>
          </div>
          <button
            @click="deleteReview(review.id)"
            :disabled="deleting === review.id"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Loader2 v-if="deleting === review.id" class="w-4 h-4 animate-spin" />
            <Trash2 v-else class="w-4 h-4" />
          </button>
        </div>
        <p v-if="review.review_text" class="text-sm text-gray-600">{{ review.review_text }}</p>
      </div>
    </div>
  </div>
</template>
