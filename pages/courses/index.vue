<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { PaginatedResponse, ApiResponse } from '~/types/api'
import type { Course } from '~/types/course'
import type { Category } from '~/types/category'

useHead({ title: 'Courses - BoomLearning' })

const { apiFetch } = useApi()
const route = useRoute()

const search = ref((route.query.q as string) || '')
const level = ref((route.query.level as string) || '')
const categoryId = ref((route.query.category as string) || '')
const sort = ref((route.query.sort as string) || '')
const page = ref(Number(route.query.page) || 1)

// Fetch categories for filter dropdowns
const { data: catData } = await useAsyncData('course-categories', () =>
  apiFetch<ApiResponse<Category[]>>('/data/categories')
)
const categories = computed(() => catData.value?.data ?? [])

// Build query params
const queryParams = computed(() => {
  const params: Record<string, string | number> = { page: page.value }
  if (search.value) params['filter[search]'] = search.value
  if (level.value) params['filter[level]'] = level.value
  if (categoryId.value) params['filter[category_id]'] = categoryId.value
  if (sort.value) params.sort = sort.value
  return params
})

// Fetch courses
const { data: coursesData, status } = await useAsyncData(
  'courses-catalog',
  () => apiFetch<PaginatedResponse<Course>>('/courses', { params: queryParams.value }),
  { watch: [queryParams] }
)

const courses = computed(() => coursesData.value?.data ?? [])
const pagination = computed(() => coursesData.value?.pagination)

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
  }, 400)
})

// Reset page on filter change
watch([level, categoryId, sort], () => {
  page.value = 1
})

// Sync query params to URL
watch([search, level, categoryId, sort, page], () => {
  const query: Record<string, string> = {}
  if (search.value) query.q = search.value
  if (level.value) query.level = level.value
  if (categoryId.value) query.category = categoryId.value
  if (sort.value) query.sort = sort.value
  if (page.value > 1) query.page = String(page.value)
  navigateTo({ query }, { replace: true })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Courses</h1>
      <p class="text-gray-500 mt-1">Browse and find the perfect course for you</p>
    </div>

    <CourseFilters
      v-model:search="search"
      v-model:level="level"
      v-model:category-id="categoryId"
      v-model:sort="sort"
      :categories="categories"
    />

    <div class="mt-8">
      <CourseGrid
        :courses="courses"
        :loading="status === 'pending'"
        empty-message="No courses match your filters. Try adjusting your search."
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total_pages > 1" class="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="page <= 1"
        @click="page--"
      >
        <ChevronLeft class="w-4 h-4" />
      </Button>
      <template v-for="p in pagination.total_pages" :key="p">
        <Button
          v-if="p === 1 || p === pagination.total_pages || (p >= page - 1 && p <= page + 1)"
          :variant="p === page ? 'default' : 'outline'"
          size="sm"
          @click="page = p"
        >
          {{ p }}
        </Button>
        <span
          v-else-if="p === page - 2 || p === page + 2"
          class="px-1 text-gray-400"
        >...</span>
      </template>
      <Button
        variant="outline"
        size="sm"
        :disabled="page >= pagination.total_pages"
        @click="page++"
      >
        <ChevronRight class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>
