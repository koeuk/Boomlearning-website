<template>
  <NuxtLink :to="`/categories/${category.id}`" class="group block">
    <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-100 transition-all duration-200 min-w-[140px]">
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-3', iconBg]">
        <component :is="CategoryIcon" :class="['w-5 h-5', iconColor]" />
      </div>
      <h3 class="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
        {{ category.category_name }}
      </h3>
      <p class="text-xs text-gray-400 mt-0.5">
        {{ category.courses_count }} {{ category.courses_count === 1 ? 'course' : 'courses' }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Code, Smartphone, Database, Shield, Cloud, Palette, BarChart3, Cpu } from 'lucide-vue-next'
import type { Category } from '~/types/category'

const props = defineProps<{
  category: Category
}>()

const styles = [
  { bg: 'bg-blue-50', color: 'text-blue-600' },
  { bg: 'bg-rose-50', color: 'text-rose-600' },
  { bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { bg: 'bg-violet-50', color: 'text-violet-600' },
  { bg: 'bg-amber-50', color: 'text-amber-600' },
  { bg: 'bg-cyan-50', color: 'text-cyan-600' },
  { bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { bg: 'bg-pink-50', color: 'text-pink-600' },
]

const categoryIcons = [Code, Smartphone, Database, Shield, Cloud, Palette, BarChart3, Cpu]

function hashIndex(str: string, len: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % len
}

const idx = computed(() => hashIndex(props.category.id, styles.length))
const iconBg = computed(() => styles[idx.value].bg)
const iconColor = computed(() => styles[idx.value].color)
const CategoryIcon = computed(() => categoryIcons[hashIndex(props.category.id, categoryIcons.length)])
</script>
