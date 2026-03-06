import type { PaginatedResponse } from '~/types/api'

export function usePagination<T>(endpoint: string, filters?: Ref<Record<string, any>>) {
  const items = ref<T[]>([])
  const page = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const { apiFetch } = useApi()
      const res = await apiFetch<PaginatedResponse<T>>(endpoint, {
        params: { page: page.value, per_page: 20, ...filters?.value },
      })
      items.value.push(...res.data)
      hasMore.value = page.value < res.pagination.total_pages
      page.value++
    } finally {
      loading.value = false
    }
  }

  function reset() {
    items.value = []
    page.value = 1
    hasMore.value = true
  }

  return { items, loading, hasMore, loadMore, reset }
}
