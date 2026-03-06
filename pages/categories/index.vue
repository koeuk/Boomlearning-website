<template>
  <div>
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-500 mt-1">Explore courses by area of interest</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="status === 'pending'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="i in 10" :key="i" class="bg-white rounded-xl border border-gray-100 p-4">
          <Skeleton class="w-12 h-12 rounded-xl mb-3" />
          <Skeleton class="h-4 w-3/4 mb-1.5" />
          <Skeleton class="h-3 w-16" />
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <CategoryCard v-for="cat in categories" :key="cat.id" :category="cat" />
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500">No categories available yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/api'
import type { Category } from '~/types/category'

useHead({ title: 'Categories - BoomLearning' })

const { apiFetch } = useApi()

const { data: catData, status } = await useAsyncData('categories', () =>
  apiFetch<ApiResponse<Category[]>>('/categories')
)

const categories = computed(() => catData.value?.data ?? [])
</script>
