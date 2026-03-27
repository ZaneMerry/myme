import { ref, onMounted, onUnmounted, readonly } from 'vue'

// Singleton state - shared across all useTheme() calls
const themeMode = ref(localStorage.getItem('themeMode') || 'system')
let mediaQuery = null
let systemThemeListener = null
let initialized = false

function resolveTheme() {
  if (themeMode.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return themeMode.value
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', resolveTheme())
}

function updateThemeMode(value) {
  themeMode.value = value
  localStorage.setItem('themeMode', value)
  applyTheme()
}

function initTheme() {
  if (initialized) return
  initialized = true

  applyTheme()
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemThemeListener = () => {
    if (themeMode.value === 'system') {
      applyTheme()
    }
  }
  mediaQuery.addEventListener('change', systemThemeListener)
}

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  return {
    themeMode: readonly(themeMode),
    updateThemeMode,
  }
}
