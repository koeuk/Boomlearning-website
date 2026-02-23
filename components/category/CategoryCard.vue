<script setup lang="ts">
import { Code, Smartphone, Database, Shield, Cloud, Palette, BarChart3, Cpu, Globe, FolderOpen } from 'lucide-vue-next'
import type { Category } from '~/types/category'

const props = defineProps<{
  category: Category
}>()

const image = computed(() => resolveImageUrl(props.category.image))

// Map category names to gradient backgrounds and icons for visual variety
const gradients = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-violet-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
]

const categoryIcons = [Code, Smartphone, Database, Shield, Cloud, Palette, BarChart3, Cpu]

const gradient = computed(() => gradients[props.category.id % gradients.length])
const CategoryIcon = computed(() => categoryIcons[props.category.id % categoryIcons.length])
</script>

<template>
  <NuxtLink :to="`/categories/${category.id}`" class="group block">
    <div class="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div :class="['aspect-[3/2] relative overflow-hidden flex items-center justify-center bg-gradient-to-br', gradient]">
        <img
          v-if="image"
          :src="image"
          :alt="category.category_name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <template v-else>
          <div class="absolute inset-0 opacity-10">
            <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20" />
            <div class="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/15" />
          </div>
          <component :is="CategoryIcon" class="w-10 h-10 text-white/90 relative z-10" />
        </template>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors truncate">
          {{ category.category_name }}
        </h3>
        <p class="text-xs text-gray-400 mt-1">
          {{ category.courses_count }} {{ category.courses_count === 1 ? 'course' : 'courses' }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
