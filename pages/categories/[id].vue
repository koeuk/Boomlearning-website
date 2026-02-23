<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { ApiResponse, PaginatedResponse } from '~/types/api'
import type { Category } from '~/types/category'
import type { Course } from '~/types/course'

const route = useRoute()
const { apiFetch } = useApi()
const categoryId = Number(route.params.id)
const page = ref(1)

// Fetch category details
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

// Fetch courses in category
const { data: coursesData, status: coursesStatus } = await useAsyncData(
  `category-${categoryId}-courses`,
  () => apiFetch<PaginatedResponse<Course>>(`/categories/${categoryId}/courses`, {
    params: { page: page.value },
  }),
  { watch: [page] }
)

const courses = computed(() => coursesData.value?.data ?? [])
const pagination = computed(() => coursesData.value?.pagination)
const image = computed(() => category.value ? resolveImageUrl(category.value.image) : null)
</script>

<template>
  <div v-if="category">
    <!-- Hero -->
    <div class="relative bg-gradient-to-r from-primary-700 to-primary-500 overflow-hidden">
      <img
        v-if="image"
        :src="image"
        :alt="category.category_name"
        class="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="flex items-center gap-2 text-primary-200 text-sm mb-3">
          <NuxtLink to="/categories" class="hover:text-white">Categories</NuxtLink>
          <ChevronRight class="w-4 h-4" />
          <span class="text-white">{{ category.category_name }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ category.category_name }}</h1>
        <p v-if="category.description" class="text-primary-100 max-w-2xl">{{ category.description }}</p>
        <p class="text-primary-200 text-sm mt-3">{{ category.courses_count }} courses</p>
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
  </div>
</template>
