<template>
  <form @submit.prevent="handleSearch" class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    />
  </form>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: 'Search courses...',
})

const query = ref('')

function handleSearch() {
  if (query.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(query.value.trim())}`)
    query.value = ''
  }
}
</script>
