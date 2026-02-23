<script setup lang="ts">
import type { Category } from '~/types/category'

const props = defineProps<{
  categories: Category[]
  modelValue?: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

function select(id: number | null) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      class="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
      :class="modelValue == null
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      @click="select(null)"
    >
      All
    </button>
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
      :class="modelValue === cat.id
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      @click="select(cat.id)"
    >
      {{ cat.category_name }}
    </button>
  </div>
</template>
