<script setup lang="ts">
const props = defineProps<{
  src: string
  poster?: string | null
}>()

const videoRef = ref<HTMLVideoElement>()

const resolvedSrc = computed(() => {
  const url = props.src
  if (url.startsWith('http')) return url
  const config = useRuntimeConfig()
  return `${config.public.apiBase.replace('/api', '')}/${url}`
})

defineExpose({
  get video() { return videoRef.value },
})
</script>

<template>
  <div class="relative bg-black rounded-lg overflow-hidden aspect-video">
    <video
      ref="videoRef"
      :src="resolvedSrc"
      :poster="poster ? resolveImageUrl(poster)! : undefined"
      controls
      controlsList="nodownload"
      class="w-full h-full"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>
