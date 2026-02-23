<script setup lang="ts">
import { FileText, Download, PlayCircle, HelpCircle } from 'lucide-vue-next'
import type { Lesson } from '~/types/course'

const props = defineProps<{
  lesson: Lesson
}>()

const lessonTypeLabel = computed(() => ({
  video: 'Video Lesson',
  text: 'Reading',
  quiz: 'Quiz',
}[props.lesson.lesson_type]))

const lessonTypeIcon = computed(() => ({
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
}[props.lesson.lesson_type]))
</script>

<template>
  <div class="space-y-6">
    <!-- Lesson header -->
    <div>
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-1">
        <component :is="lessonTypeIcon" class="w-4 h-4" />
        <span>{{ lessonTypeLabel }}</span>
        <span v-if="lesson.duration_minutes" class="text-gray-300">|</span>
        <span v-if="lesson.duration_minutes">{{ lesson.duration_minutes }} min</span>
      </div>
      <h2 class="text-xl font-bold text-gray-900">{{ lesson.lesson_title }}</h2>
      <p v-if="lesson.description" class="text-sm text-gray-500 mt-1">{{ lesson.description }}</p>
    </div>

    <!-- Video -->
    <LearningVideoPlayer
      v-if="lesson.lesson_type === 'video' && lesson.video_url"
      :src="lesson.video_url"
      :poster="lesson.thumbnail"
    />

    <!-- Text Content -->
    <LearningTextContent
      v-if="lesson.content"
      :content="lesson.content"
    />

    <!-- Documents -->
    <div v-if="lesson.documents.length > 0" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700">Attachments</h3>
      <div class="space-y-1.5">
        <a
          v-for="doc in lesson.documents"
          :key="doc.id"
          :href="resolveImageUrl(doc.url)!"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <FileText class="w-4 h-4 text-gray-400 shrink-0" />
          <span class="text-sm text-gray-700 flex-1 truncate">{{ doc.name }}</span>
          <Download class="w-4 h-4 text-gray-400 shrink-0" />
        </a>
      </div>
    </div>
  </div>
</template>
