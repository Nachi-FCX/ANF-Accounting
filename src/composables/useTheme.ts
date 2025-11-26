import { ref, computed, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'fcx-theme'

// Reactive theme state
const currentTheme = ref<Theme>('light')
const systemTheme = ref<'light' | 'dark'>('light')
const forcedTheme = ref<'light' | 'dark' | null>(null)

export function useTheme() {
  // Computed actual theme (resolves 'system' to actual theme, or uses forced theme)
  const resolvedTheme = computed(() => {
    if (forcedTheme.value) {
      return forcedTheme.value
    }
    return currentTheme.value === 'system' ? systemTheme.value : currentTheme.value
  })

  // Detect system theme preference
  const detectSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  }

  // Force a specific theme (useful for auth pages)
  const forceTheme = (theme: 'light' | 'dark' | null) => {
    forcedTheme.value = theme
    if (theme) {
      applyTheme(theme)
    } else {
      // Restore normal theme behavior
      const normalTheme = currentTheme.value === 'system' ? systemTheme.value : currentTheme.value
      applyTheme(normalTheme)
    }
  }

  // Set theme and persist to localStorage
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }

    // Only apply if no forced theme is active
    if (!forcedTheme.value) {
      const resolvedThemeValue = theme === 'system' ? systemTheme.value : theme
      applyTheme(resolvedThemeValue)
    }
  }

  // Get theme from localStorage
  const getStoredTheme = (): Theme => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme
      }
    }
    return 'light'
  }

  // Initialize theme system
  const initializeTheme = () => {
    // Set initial system theme
    systemTheme.value = detectSystemTheme()
    
    // Get stored theme preference
    const storedTheme = getStoredTheme()
    currentTheme.value = storedTheme
    
    // Apply initial theme
    const initialTheme = storedTheme === 'system' ? systemTheme.value : storedTheme
    applyTheme(initialTheme)

    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? 'dark' : 'light'
        
        // If current theme is 'system', apply the new system theme
        if (currentTheme.value === 'system' && !forcedTheme.value) {
          applyTheme(systemTheme.value)
        }
      }

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleSystemThemeChange)
      }
    }
  }

  // Watch for theme changes and apply them
  watch(resolvedTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme: readonly(currentTheme),
    resolvedTheme: readonly(resolvedTheme),
    systemTheme: readonly(systemTheme),
    forcedTheme: readonly(forcedTheme),
    setTheme,
    forceTheme,
    initializeTheme,
    detectSystemTheme
  }
}

// Helper function to make refs readonly
function readonly<T>(ref: any) {
  return computed(() => ref.value)
}
