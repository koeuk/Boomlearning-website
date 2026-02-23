<script setup lang="ts">
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { PaginatedResponse, ApiResponse } from '~/types/api'
import type { Course } from '~/types/course'
import type { Category } from '~/types/category'

const route = useRoute()
const { apiFetch } = useApi()

const search = ref((route.query.q as string) || '')
const level = ref('')
const categoryId = ref('')
const sort = ref('')
const page = ref(1)

useHead({
  title: computed(() => search.value ? `Search: ${search.value} - BoomLearning` : 'Search - BoomLearning'),
})

// Fetch categories for filters
const { data: catData } = await useAsyncData('search-categories', () =>
  apiFetch<ApiResponse<Category[]>>('/data/categories')
)
const categories = computed(() => catData.value?.data ?? [])

// Build params
const queryParams = computed(() => {
  const params: Record<string, string | number> = { page: page.value }
  if (search.value) params['filter[search]'] = search.value
  if (level.value) params['filter[level]'] = level.value
  if (categoryId.value) params['filter[category_id]'] = categoryId.value
  if (sort.value) params.sort = sort.value
  return params
})

const { data: coursesData, status } = await useAsyncData(
  'search-results',
  () => apiFetch<PaginatedResponse<Course>>('/courses', { params: queryParams.value }),
  { watch: [queryParams] }
)

const courses = computed(() => coursesData.value?.data ?? [])
const pagination = computed(() => coursesData.value?.pagination)

// Watch for URL query changes (from navbar search)
watch(() => route.query.q, (val) => {
  if (val && val !== search.value) {
    search.value = val as string
    page.value = 1
  }
})

// Debounce search input
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
  }, 400)
})

watch([level, categoryId, sort], () => {
  page.value = 1
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Search</h1>
      <p v-if="search" class="text-gray-500 mt-1">
        Results for "<span class="font-medium text-gray-700">{{ search }}</span>"
        <template v-if="pagination">
          — {{ pagination.total }} {{ pagination.total === 1 ? 'course' : 'courses' }} found
        </template>
      </p>
    </div>

    <CourseFilters
      v-model:search="search"
      v-model:level="level"
      v-model:category-id="categoryId"
      v-model:sort="sort"
      :categories="categories"
    />

    <div class="mt-8">
      <!-- No search query yet -->
      <div v-if="!search && courses.length === 0 && status !== 'pending'" class="text-center py-16">
        <Search class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Type a search query to find courses</p>
      </div>

      <CourseGrid
        v-else
        :courses="courses"
        :loading="status === 'pending'"
        empty-message="No courses match your search. Try different keywords."
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
