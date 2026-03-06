<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <Label>Rating</Label>
      <div class="flex items-center gap-1 mt-1">
        <button
          v-for="i in 5"
          :key="i"
          type="button"
          @click="form.rating = i"
          class="focus:outline-none"
        >
          <Star
            :class="[
              'w-6 h-6 transition-colors',
              i <= form.rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            ]"
          />
        </button>
      </div>
    </div>

    <div>
      <Label for="review_text">Review (optional)</Label>
      <Textarea
        id="review_text"
        v-model="form.review_text"
        placeholder="Share your experience..."
        rows="4"
        class="mt-1"
      />
    </div>

    <div class="flex items-center gap-2">
      <input
        id="would_recommend"
        v-model="form.would_recommend"
        type="checkbox"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <Label for="would_recommend" class="cursor-pointer">I would recommend this course</Label>
    </div>

    <div class="flex gap-2">
      <Button type="submit" :disabled="loading || form.rating === 0">
        {{ loading ? 'Submitting...' : submitLabel }}
      </Button>
      <Button v-if="showCancel" type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </Button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  courseId: string
  initialRating?: number
  initialText?: string
  initialRecommend?: boolean
  reviewId?: string
  submitLabel?: string
  showCancel?: boolean
}>(), {
  initialRating: 0,
  initialText: '',
  initialRecommend: true,
  submitLabel: 'Submit Review',
  showCancel: false,
})

const emit = defineEmits<{
  submitted: []
  cancel: []
}>()

const { apiFetch } = useApi()
const loading = ref(false)
const error = ref('')

const form = reactive({
  rating: props.initialRating,
  review_text: props.initialText,
  would_recommend: props.initialRecommend,
})

async function handleSubmit() {
  if (form.rating === 0) return
  loading.value = true
  error.value = ''
  try {
    if (props.reviewId) {
      await apiFetch(`/reviews/${props.reviewId}`, {
        method: 'PUT',
        body: form,
      })
    } else {
      await apiFetch(`/courses/${props.courseId}/reviews`, {
        method: 'POST',
        body: form,
      })
    }
    emit('submitted')
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to submit review'
  } finally {
    loading.value = false
  }
}
</script>
