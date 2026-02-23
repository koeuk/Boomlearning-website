<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next'
import type { Category } from '~/types/category'

const props = defineProps<{
  category: Category
}>()

const image = computed(() => resolveImageUrl(props.category.image))
</script>

<template>
  <NuxtLink :to="`/categories/${category.id}`" class="group block">
    <Card class="overflow-hidden h-full transition-shadow hover:shadow-md">
      <div class="aspect-[3/2] bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden flex items-center justify-center">
        <img
          v-if="image"
          :src="image"
          :alt="category.category_name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <FolderOpen v-else class="w-12 h-12 text-primary-300" />
      </div>
      <CardHeader class="pb-3">
        <CardTitle class="text-base group-hover:text-primary-600 transition-colors">
          {{ category.category_name }}
        </CardTitle>
        <CardDescription>
          {{ category.courses_count }} {{ category.courses_count === 1 ? 'course' : 'courses' }}
        </CardDescription>
      </CardHeader>
    </Card>
  </NuxtLink>
</template>
