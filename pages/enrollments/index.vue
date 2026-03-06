<template>
  <div>
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Learning</h1>
        <p class="text-gray-500 mt-1">Track your enrolled courses and progress</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="f in (['all', 'active', 'completed'] as const)"
          :key="f"
          @click="filter = f"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
          :class="filter === f
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'"
        >
          {{ f === 'all' ? 'All Courses' : f }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="status === 'pending'" class="space-y-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl border border-gray-100 p-5">
          <div class="flex gap-4">
            <Skeleton class="w-28 h-20 rounded-lg shrink-0" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-5 w-3/4" />
              <Skeleton class="h-3 w-1/3" />
              <Skeleton class="h-2.5 w-full rounded-full mt-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="enrollments.length === 0" class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <BookOpen class="w-8 h-8 text-gray-300" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No courses yet</h3>
        <p class="text-gray-500 mb-6 text-sm">
          {{ filter === 'all' ? "You haven't enrolled in any courses yet." : `No ${filter} courses.` }}
        </p>
        <NuxtLink to="/courses">
          <Button class="rounded-xl">Browse Courses</Button>
        </NuxtLink>
      </div>

      <!-- Enrollment list -->
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="enrollment in enrollments"
          :key="enrollment.id"
          :to="`/enrollments/${enrollment.id}`"
          class="block group"
        >
          <div class="bg-white rounded-xl border border-gray-100 p-5 transition-all hover:shadow-md hover:border-gray-200">
            <div class="flex gap-4">
              <div class="w-28 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden shrink-0">
                <img
                  v-if="resolveImageUrl(enrollment.course.thumbnail)"
                  :src="resolveImageUrl(enrollment.course.thumbnail)!"
                  :alt="enrollment.course.course_name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {{ enrollment.course.course_name }}
                    </h3>
                    <p class="text-sm text-gray-400 mt-0.5">{{ enrollment.course.instructor_name }}</p>
                  </div>
                  <Badge
                    :class="statusColor(enrollment.status)"
                    variant="secondary"
                    class="shrink-0 capitalize text-xs"
                  >
                    <component :is="statusIcon(enrollment.status)" class="w-3 h-3 mr-1" />
                    {{ enrollment.status }}
                  </Badge>
                </div>
                <div class="flex items-center gap-3 mt-3">
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="enrollment.status === 'completed' ? 'bg-emerald-500' : 'bg-primary-500'"
                      :style="{ width: `${enrollment.progress_percentage}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium" :class="enrollment.status === 'completed' ? 'text-emerald-600' : 'text-gray-500'">
                    {{ enrollment.progress_percentage }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.total_pages > 1" class="mt-8 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" :disabled="page <= 1" @click="page--">Previous</Button>
        <span class="text-sm text-gray-400">Page {{ page }} of {{ pagination.total_pages }}</span>
        <Button variant="outline" size="sm" :disabled="page >= pagination.total_pages" @click="page++">Next</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-vue-next'
import type { PaginatedResponse } from '~/types/api'
import type { Enrollment } from '~/types/enrollment'

definePageMeta({
  middleware: 'auth',
})

useHead({ title: 'My Learning - BoomLearning' })

const { apiFetch } = useApi()
const page = ref(1)
const filter = ref<'all' | 'active' | 'completed'>('all')

const queryParams = computed(() => {
  const params: Record<string, string | number> = { page: page.value }
  if (filter.value !== 'all') params['filter[status]'] = filter.value
  return params
})

const { data: enrollData, status } = await useAsyncData(
  'my-enrollments',
  () => apiFetch<PaginatedResponse<Enrollment>>('/enrollments', { params: queryParams.value }),
  { watch: [queryParams] }
)

const enrollments = computed(() => enrollData.value?.data ?? [])
const pagination = computed(() => enrollData.value?.pagination)

watch(filter, () => { page.value = 1 })

function statusColor(s: string) {
  return {
    active: 'text-blue-600 bg-blue-50',
    completed: 'text-emerald-600 bg-emerald-50',
    dropped: 'text-red-600 bg-red-50',
    expired: 'text-gray-600 bg-gray-100',
  }[s] ?? 'text-gray-600 bg-gray-100'
}

function statusIcon(s: string) {
  return {
    active: Clock,
    completed: CheckCircle,
    dropped: XCircle,
  }[s] ?? Clock
}
</script>
