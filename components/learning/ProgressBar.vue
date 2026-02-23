<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: string
}>(), {
  max: 100,
  size: 'md',
  showLabel: false,
  color: 'bg-primary-500',
})

const percentage = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100))
)

const heightClass = computed(() =>
  ({ sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' })[props.size]
)
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="['flex-1 bg-gray-100 rounded-full overflow-hidden', heightClass]">
      <div
        :class="['h-full rounded-full transition-all duration-300', color]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <span v-if="showLabel" class="text-xs text-gray-500 shrink-0">{{ Math.round(percentage) }}%</span>
  </div>
</template>
