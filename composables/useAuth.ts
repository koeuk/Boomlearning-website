export const useAuth = () => {
  const auth = useAuthStore()

  const isAuthenticated = computed(() => auth.isAuthenticated)
  const user = computed(() => auth.user)
  const fullName = computed(() => auth.fullName)
  const avatarUrl = computed(() => auth.avatarUrl)

  function requireAuth(redirectPath?: string) {
    if (!auth.isAuthenticated) {
      const route = useRoute()
      const redirect = redirectPath || route.fullPath
      navigateTo(`/login?redirect=${encodeURIComponent(redirect)}`)
      return false
    }
    return true
  }

  return { isAuthenticated, user, fullName, avatarUrl, requireAuth }
}
