<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="prose prose-sm sm:prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600" v-html="content" />
</template>
