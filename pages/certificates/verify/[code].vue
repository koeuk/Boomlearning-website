<script setup lang="ts">
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Certificate } from '~/types/certificate'

useHead({ title: 'Verify Certificate - BoomLearning' })

const route = useRoute()
const { apiFetch } = useApi()

const code = ref((route.params.code as string) || '')
const inputCode = ref(code.value)
const certificate = ref<Certificate | null>(null)
const error = ref('')
const loading = ref(false)
const searched = ref(false)

async function verify(certificateCode: string) {
  if (!certificateCode.trim()) return

  loading.value = true
  error.value = ''
  certificate.value = null
  searched.value = true

  try {
    const res = await apiFetch<ApiResponse<Certificate>>(`/certificates/verify/${certificateCode.trim()}`)
    certificate.value = res.data
  } catch (e: any) {
    if (e?.response?.status === 404) {
      error.value = 'Certificate not found. Please check the code and try again.'
    } else {
      error.value = 'An error occurred while verifying the certificate.'
    }
  } finally {
    loading.value = false
  }
}

function handleSubmit() {
  if (inputCode.value.trim()) {
    code.value = inputCode.value.trim()
    navigateTo(`/certificates/verify/${encodeURIComponent(code.value)}`, { replace: true })
    verify(code.value)
  }
}

// Auto-verify if code is in the URL
onMounted(() => {
  if (code.value) {
    verify(code.value)
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Verify Certificate</h1>
      <p class="text-gray-500 mt-1">Enter a certificate code to verify its authenticity</p>
    </div>

    <!-- Search Form -->
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto mb-8">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="inputCode"
            type="text"
            placeholder="Enter certificate code..."
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <Button type="submit" :disabled="loading || !inputCode.trim()">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <template v-else>Verify</template>
        </Button>
      </div>
    </form>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <Loader2 class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
      <p class="text-gray-500 mt-3 text-sm">Verifying certificate...</p>
    </div>

    <!-- Error -->
    <Alert v-else-if="error" variant="destructive" class="max-w-md mx-auto">
      <XCircle class="w-4 h-4" />
      <AlertTitle>Verification Failed</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Certificate Found -->
    <div v-else-if="certificate" class="space-y-4">
      <Alert class="max-w-md mx-auto bg-green-50 border-green-200 text-green-800">
        <CheckCircle class="w-4 h-4 text-green-600" />
        <AlertTitle class="text-green-800">Certificate Verified</AlertTitle>
        <AlertDescription class="text-green-700">
          This certificate is authentic and was issued by BoomLearning.
        </AlertDescription>
      </Alert>

      <CertificateViewer :certificate="certificate" />
    </div>

    <!-- No search yet -->
    <div v-else-if="!searched" class="text-center py-12">
      <Search class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter a certificate code above to verify</p>
    </div>
  </div>
</template>
