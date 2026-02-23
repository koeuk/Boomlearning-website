<script setup lang="ts">
import { Bell, CheckCheck, Trash2, Loader2, Info, CheckCircle, AlertTriangle, AlertCircle, BookOpen, Award, Clock } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Notifications - BoomLearning' })

const notifications = useNotificationStore()
const loading = ref(true)

onMounted(async () => {
  await notifications.fetch()
  loading.value = false
})

const deleting = ref<number | null>(null)

async function handleDelete(id: number) {
  deleting.value = id
  await notifications.remove(id)
  deleting.value = null
}

function typeIcon(type: string) {
  const map: Record<string, any> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    enrollment: BookOpen,
    completion: Award,
    reminder: Clock,
  }
  return map[type] ?? Info
}

function typeColor(type: string) {
  const map: Record<string, string> = {
    info: 'text-blue-500 bg-blue-50',
    success: 'text-green-500 bg-green-50',
    warning: 'text-yellow-500 bg-yellow-50',
    error: 'text-red-500 bg-red-50',
    enrollment: 'text-primary-500 bg-primary-50',
    completion: 'text-accent-500 bg-accent-50',
    reminder: 'text-purple-500 bg-purple-50',
  }
  return map[type] ?? 'text-gray-500 bg-gray-50'
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      <button
        v-if="notifications.unreadCount > 0"
        @click="notifications.markAllAsRead()"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <CheckCheck class="w-4 h-4" />
        Mark all read
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="notifications.items.length === 0" class="text-center py-20">
      <Bell class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
      <p class="text-sm text-gray-500">You're all caught up!</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="item in notifications.items"
        :key="item.id"
        class="bg-white rounded-lg border p-4 flex items-start gap-3 transition-colors"
        :class="item.is_read ? 'border-gray-200' : 'border-primary-200 bg-primary-50/30'"
      >
        <div :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0', typeColor(item.type)]">
          <component :is="typeIcon(item.type)" class="w-4 h-4" />
        </div>

        <div class="flex-1 min-w-0" @click="notifications.markAsRead(item.id)">
          <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
          <p class="text-sm text-gray-500 mt-0.5">{{ item.message }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(item.created_at) }}</p>
        </div>

        <button
          @click="handleDelete(item.id)"
          :disabled="deleting === item.id"
          class="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
        >
          <Loader2 v-if="deleting === item.id" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
