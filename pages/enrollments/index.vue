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
    completed: 'text-green-600 bg-green-50',
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

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Learning</h1>
      <p class="text-gray-500 mt-1">Track your enrolled courses and progress</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="f in (['all', 'active', 'completed'] as const)"
        :key="f"
        @click="filter = f"
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
        :class="filter === f
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ f === 'all' ? 'All Courses' : f }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="status === 'pending'" class="space-y-4">
      <Card v-for="i in 4" :key="i" class="p-4">
        <div class="flex gap-4">
          <Skeleton class="w-24 h-16 rounded-md shrink-0" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-5 w-3/4" />
            <Skeleton class="h-3 w-1/3" />
            <Skeleton class="h-2 w-full rounded-full" />
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty -->
    <Card v-else-if="enrollments.length === 0" class="p-12 text-center">
      <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">
        {{ filter === 'all' ? "You haven't enrolled in any courses yet." : `No ${filter} courses.` }}
      </p>
      <NuxtLink to="/courses">
        <Button>Browse Courses</Button>
      </NuxtLink>
    </Card>

    <!-- Enrollment list -->
    <div v-else class="space-y-4">
      <NuxtLink
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :to="`/enrollments/${enrollment.id}`"
        class="block group"
      >
        <Card class="p-4 transition-shadow hover:shadow-md">
          <div class="flex gap-4">
            <div class="w-24 h-16 sm:w-32 sm:h-20 rounded-md bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden shrink-0">
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
                  <h3 class="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                    {{ enrollment.course.course_name }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-0.5">{{ enrollment.course.instructor_name }}</p>
                </div>
                <Badge :class="statusColor(enrollment.status)" variant="secondary" class="shrink-0 capitalize">
                  <component :is="statusIcon(enrollment.status)" class="w-3 h-3 mr-1" />
                  {{ enrollment.status }}
                </Badge>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="enrollment.status === 'completed' ? 'bg-green-500' : 'bg-primary-500'"
                    :style="{ width: `${enrollment.progress_percentage}%` }"
                  />
                </div>
                <span class="text-xs text-gray-500 shrink-0">{{ enrollment.progress_percentage }}%</span>
              </div>
            </div>
          </div>
        </Card>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total_pages > 1" class="mt-8 flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" :disabled="page <= 1" @click="page--">Previous</Button>
      <span class="text-sm text-gray-500">Page {{ page }} of {{ pagination.total_pages }}</span>
      <Button variant="outline" size="sm" :disabled="page >= pagination.total_pages" @click="page++">Next</Button>
    </div>
  </div>
</template>
