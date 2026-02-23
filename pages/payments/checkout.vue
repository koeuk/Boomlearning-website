<script setup lang="ts">
import { CreditCard, Loader2, CheckCircle, ArrowLeft } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Checkout - BoomLearning' })

const route = useRoute()
const { apiFetch } = useApi()

const courseId = route.query.course as string | undefined
const enrollmentId = route.query.enrollment as string | undefined

const form = reactive({
  payment_method: 'credit_card',
})
const loading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

async function handlePayment() {
  errors.value = {}
  loading.value = true

  try {
    await apiFetch<ApiResponse<any>>('/payments', {
      method: 'POST',
      body: {
        course_id: courseId,
        enrollment_id: enrollmentId,
        payment_method: form.payment_method,
      },
    })
    success.value = true
  } catch (error: any) {
    errors.value = parseApiErrors(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Success -->
    <div v-if="success" class="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p class="text-sm text-gray-500 mb-6">Your payment has been processed successfully.</p>
      <div class="flex justify-center gap-3">
        <NuxtLink
          to="/enrollments"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Go to My Learning
        </NuxtLink>
        <NuxtLink
          to="/payments"
          class="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          View Payments
        </NuxtLink>
      </div>
    </div>

    <!-- Checkout Form -->
    <template v-else>
      <NuxtLink to="/enrollments" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft class="w-4 h-4" />
        Back
      </NuxtLink>

      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center gap-3 mb-6">
          <CreditCard class="w-8 h-8 text-primary-500" />
          <h1 class="text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {{ errors.general }}
        </div>

        <form @submit.prevent="handlePayment" class="space-y-6">
          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div class="space-y-2">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
                :class="form.payment_method === method.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'"
              >
                <input
                  v-model="form.payment_method"
                  type="radio"
                  :value="method.value"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm font-medium text-gray-700">{{ method.label }}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <CreditCard v-else class="w-4 h-4" />
            {{ loading ? 'Processing...' : 'Pay Now' }}
          </button>
        </form>
      </div>
    </template>
  </div>
</template>
