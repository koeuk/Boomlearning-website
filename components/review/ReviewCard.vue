<script setup lang="ts">
import { ThumbsUp } from 'lucide-vue-next'
import type { Review } from '~/types/review'

const props = defineProps<{
  review: Review
}>()

const avatar = computed(() => resolveImageUrl(props.review.student.profile_picture))
const initials = computed(() => {
  const parts = props.review.student.full_name.split(' ')
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <Avatar class="w-10 h-10 shrink-0">
        <AvatarImage v-if="avatar" :src="avatar" :alt="review.student.full_name" />
        <AvatarFallback>{{ initials }}</AvatarFallback>
      </Avatar>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="font-medium text-sm text-gray-900">{{ review.student.full_name }}</p>
          <span class="text-xs text-gray-400 shrink-0">{{ formatRelativeTime(review.created_at) }}</span>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <ReviewStarRating :rating="review.rating" size="sm" />
          <Badge v-if="review.would_recommend" variant="secondary" class="bg-green-50 text-green-700 text-xs">
            <ThumbsUp class="w-3 h-3 mr-1" />
            Recommends
          </Badge>
        </div>
        <p v-if="review.review_text" class="text-sm text-gray-600 mt-2">
          {{ review.review_text }}
        </p>
      </div>
    </div>
  </div>
</template>
