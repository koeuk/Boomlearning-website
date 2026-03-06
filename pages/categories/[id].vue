<template>
  <div v-if="category">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NuxtLink to="/categories" class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4">
          <ArrowLeft class="w-4 h-4" />
          Back to Categories
        </NuxtLink>

        <div class="flex items-center gap-4">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', iconBg]">
            <FolderOpen :class="['w-6 h-6', iconColor]" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">{{ category.category_name }}</h1>
            <p v-if="category.description" class="text-gray-500 mt-1 max-w-2xl">{{ category.description }}</p>
            <p class="text-sm text-gray-400 mt-1">{{ category.courses_count }} courses available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CourseGrid
        :courses="courses"
        :loading="coursesStatus === 'pending'"
        empty-message="No courses in this category yet."
      />

      <!-- Pagination -->
      <div v-if="pagination && pagination.total_pages > 1" class="mt-8 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" :disabled="page <= 1" @click="page--">
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
          <span v-else-if="p === page - 2 || p === page + 2" class="px-1 text-gray-400">...</span>
        </template>
        <Button variant="outline" size="sm" :disabled="page >= pagination.total_pages" @click="page++">
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-vue-next'
import type { ApiResponse, PaginatedResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Course } from '~/types/course'

const route = useRoute()
const { apiFetch } = useApi()
const categoryId = route.params.id as string
const page = ref(1)

const { data: catData, error } = await useAsyncData(
  `category-${categoryId}`,
  () => apiFetch<ApiResponse<Category>>(`/categories/${categoryId}`)
)

const category = computed(() => catData.value?.data)

useHead({
  title: computed(() => category.value ? `${category.value.category_name} - BoomLearning` : 'Category - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Category not found' })
}

const { data: coursesData, status: coursesStatus } = await useAsyncData(
  `category-${categoryId}-courses`,
  () => apiFetch<PaginatedResponse<Course>>(`/categories/${categoryId}/courses`, {
    params: { page: page.value },
  }),
  { watch: [page] }
)

const courses = computed(() => coursesData.value?.data ?? [])
const pagination = computed(() => coursesData.value?.pagination)

const styles = [
  { bg: 'bg-blue-50', color: 'text-blue-600' },
  { bg: 'bg-rose-50', color: 'text-rose-600' },
  { bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { bg: 'bg-violet-50', color: 'text-violet-600' },
  { bg: 'bg-amber-50', color: 'text-amber-600' },
]

function hashIndex(str: string, len: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % len
}

const idx = computed(() => hashIndex(categoryId, styles.length))
const iconBg = computed(() => styles[idx.value].bg)
const iconColor = computed(() => styles[idx.value].color)
</script>
