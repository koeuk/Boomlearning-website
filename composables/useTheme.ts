export const useTheme = () => {
  const colorMode = useState<'light' | 'dark'>('color-mode', () => 'light')

  function toggle() {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  function applyTheme() {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', colorMode.value === 'dark')
      localStorage.setItem('color-mode', colorMode.value)
    }
  }

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('color-mode') as 'light' | 'dark' | null
      if (saved) {
        colorMode.value = saved
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        colorMode.value = 'dark'
      }
      applyTheme()
    }
  }

  return { colorMode, toggle, init }
}
