<script setup lang="ts">
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-vue-next'
import type { Payment } from '~/types/payment'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { apiFetch } = useApi()

const { data, status } = await useAsyncData(`payment-${route.params.uuid}`, () =>
  apiFetch<ApiResponse<Payment>>(`/payments/${route.params.uuid}`)
)
const payment = computed(() => data.value?.data ?? null)

useHead({
  title: computed(() => payment.value ? `Payment ${payment.value.transaction_id}` : 'Payment Detail'),
})

function statusColor(s: string) {
  const map: Record<string, string> = {
    completed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    failed: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-50 text-gray-700',
  }
  return map[s] ?? 'bg-gray-50 text-gray-700'
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/payments" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
      <ArrowLeft class="w-4 h-4" />
      Back to Payments
    </NuxtLink>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="payment" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <CreditCard class="w-8 h-8 text-primary-500" />
          <div>
            <h1 class="text-lg font-bold text-gray-900">Payment Detail</h1>
            <p class="text-sm font-mono text-gray-500">{{ payment.transaction_id }}</p>
          </div>
        </div>
        <span :class="['text-sm font-medium px-3 py-1 rounded-full', statusColor(payment.status)]">
          {{ payment.status }}
        </span>
      </div>

      <div class="p-6 space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-400 mb-1">Course</p>
            <p class="text-sm font-medium text-gray-900">{{ payment.course?.course_name ?? '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Amount</p>
            <p class="text-lg font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Payment Method</p>
            <p class="text-sm text-gray-700 capitalize">{{ payment.payment_method?.replace('_', ' ') }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Payment Date</p>
            <p class="text-sm text-gray-700">{{ formatDateTime(payment.payment_date) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
