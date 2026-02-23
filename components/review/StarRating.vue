<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}>(), {
  max: 5,
  size: 'md',
  showValue: false,
})

const sizeClass = computed(() => ({
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}[props.size]))

const textClass = computed(() => ({
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}[props.size]))
</script>

<template>
  <div class="flex items-center gap-1">
    <template v-for="i in max" :key="i">
      <Star
        :class="[
          sizeClass,
          i <= Math.round(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        ]"
      />
    </template>
    <span v-if="showValue" :class="['font-medium text-gray-700 ml-0.5', textClass]">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>
