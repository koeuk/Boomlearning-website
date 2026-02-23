<script setup lang="ts">
import { ChevronDown, PlayCircle, FileText, HelpCircle } from 'lucide-vue-next'
import type { Module } from '~/types/course'

defineProps<{
  modules: Module[]
}>()

const openModules = ref<Set<number>>(new Set())

function toggle(moduleId: number) {
  if (openModules.value.has(moduleId)) {
    openModules.value.delete(moduleId)
  } else {
    openModules.value.add(moduleId)
  }
}

const lessonIcon = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
} as const
</script>

<template>
  <div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
    <div v-for="mod in modules" :key="mod.id">
      <button
        @click="toggle(mod.id)"
        class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <p class="font-medium text-sm text-gray-900">{{ mod.module_title }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ mod.lessons_count }} lessons</p>
        </div>
        <ChevronDown
          class="w-4 h-4 text-gray-400 transition-transform shrink-0"
          :class="{ 'rotate-180': openModules.has(mod.id) }"
        />
      </button>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[1000px] opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="max-h-[1000px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="openModules.has(mod.id)" class="overflow-hidden">
          <ul class="bg-gray-50 divide-y divide-gray-100">
            <li
              v-for="lesson in mod.lessons ?? []"
              :key="lesson.id"
              class="flex items-center gap-3 px-4 py-2.5 pl-8"
            >
              <component
                :is="lessonIcon[lesson.lesson_type] || FileText"
                class="w-4 h-4 text-gray-400 shrink-0"
              />
              <span class="text-sm text-gray-700 flex-1">{{ lesson.lesson_title }}</span>
              <span v-if="lesson.duration_minutes" class="text-xs text-gray-400">
                {{ lesson.duration_minutes }}m
              </span>
            </li>
            <li v-if="!mod.lessons?.length" class="px-4 py-3 pl-8 text-sm text-gray-400">
              No lessons available
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <div v-if="modules.length === 0" class="px-4 py-8 text-center text-sm text-gray-400">
      No modules available yet
    </div>
  </div>
</template>
