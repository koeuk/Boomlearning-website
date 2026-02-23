<script setup lang="ts">
import { CreditCard, Loader2 } from 'lucide-vue-next'
import type { Payment } from '~/types/payment'
import type { PaginatedResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Payment History - BoomLearning' })

const { apiFetch } = useApi()

const { data, status } = await useAsyncData('my-payments', () =>
  apiFetch<PaginatedResponse<Payment>>('/payments')
)
const payments = computed(() => data.value?.data ?? [])

function statusColor(status: string) {
  const map: Record<string, string> = {
    completed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    failed: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-50 text-gray-700',
  }
  return map[status] ?? 'bg-gray-50 text-gray-700'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="payments.length === 0" class="text-center py-20">
      <CreditCard class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">No payments yet</h3>
      <p class="text-sm text-gray-500">Your payment history will appear here.</p>
    </div>

    <!-- Payments Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Mobile Cards -->
      <div class="sm:hidden divide-y divide-gray-200">
        <NuxtLink
          v-for="payment in payments"
          :key="payment.id"
          :to="`/payments/${payment.uuid}`"
          class="block p-4 hover:bg-gray-50"
        >
          <div class="flex justify-between items-start mb-2">
            <p class="font-medium text-gray-900 text-sm">{{ payment.course?.course_name ?? 'Course' }}</p>
            <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', statusColor(payment.status)]">
              {{ payment.status }}
            </span>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ formatDate(payment.payment_date) }}</span>
            <span class="font-semibold text-gray-900">{{ formatCurrency(payment.amount) }}</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop Table -->
      <table class="hidden sm:table w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Transaction</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Course</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Method</th>
            <th class="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Amount</th>
            <th class="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <NuxtLink :to="`/payments/${payment.uuid}`" class="text-sm font-mono text-primary-600 hover:underline">
                {{ payment.transaction_id }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ payment.course?.course_name ?? '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(payment.payment_date) }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">{{ payment.payment_method?.replace('_', ' ') }}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{{ formatCurrency(payment.amount) }}</td>
            <td class="px-6 py-4 text-center">
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusColor(payment.status)]">
                {{ payment.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
