<script setup lang="ts">
const props = defineProps<{
  averageRating: number
  totalReviews: number
  breakdown?: Record<number, number>
}>()

const bars = computed(() => {
  if (!props.breakdown || props.totalReviews === 0) return []
  return [5, 4, 3, 2, 1].map(star => ({
    star,
    count: props.breakdown![star] || 0,
    percent: ((props.breakdown![star] || 0) / props.totalReviews) * 100,
  }))
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-6">
    <!-- Average -->
    <div class="text-center sm:text-left shrink-0">
      <div class="text-4xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</div>
      <ReviewStarRating :rating="averageRating" size="md" class="justify-center sm:justify-start mt-1" />
      <p class="text-sm text-gray-500 mt-1">{{ totalReviews }} {{ totalReviews === 1 ? 'review' : 'reviews' }}</p>
    </div>

    <!-- Breakdown bars -->
    <div v-if="bars.length > 0" class="flex-1 space-y-1.5">
      <div v-for="bar in bars" :key="bar.star" class="flex items-center gap-2">
        <span class="text-sm text-gray-600 w-6 text-right">{{ bar.star }}</span>
        <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-yellow-400 rounded-full transition-all"
            :style="{ width: `${bar.percent}%` }"
          />
        </div>
        <span class="text-xs text-gray-500 w-8">{{ bar.count }}</span>
      </div>
    </div>
  </div>
</template>
