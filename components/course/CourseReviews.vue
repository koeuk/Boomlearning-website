<script setup lang="ts">
import type { PaginatedResponse } from '~/types/api'
import type { Review } from '~/types/review'

const props = defineProps<{
  courseId: number
  averageRating: number
  reviewsCount: number
}>()

const { apiFetch } = useApi()
const page = ref(1)

const { data: reviewsData, status } = await useAsyncData(
  `course-${props.courseId}-reviews`,
  () => apiFetch<PaginatedResponse<Review>>(`/courses/${props.courseId}/reviews`, {
    params: { page: page.value },
  }),
  { watch: [page] }
)

const reviews = computed(() => reviewsData.value?.data ?? [])
const pagination = computed(() => reviewsData.value?.pagination)
</script>

<template>
  <div class="space-y-6">
    <ReviewRatingSummary
      :average-rating="averageRating"
      :total-reviews="reviewsCount"
    />

    <Separator />

    <!-- Loading -->
    <div v-if="status === 'pending'" class="space-y-4">
      <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-4">
        <div class="flex gap-3">
          <Skeleton class="w-10 h-10 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-3 w-32" />
            <Skeleton class="h-3 w-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <div v-else-if="reviews.length > 0" class="space-y-4">
      <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />

      <!-- Pagination -->
      <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1"
          @click="page--"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= pagination.total_pages"
          @click="page++"
        >
          Next
        </Button>
      </div>
    </div>

    <p v-else class="text-center text-sm text-gray-400 py-8">No reviews yet.</p>
  </div>
</template>
