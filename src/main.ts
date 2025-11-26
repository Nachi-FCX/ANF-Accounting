import './assets/main.css'
import './styles/base.scss'
import './styles/rtl.scss'
import './assets/styles/global-ui-variables.scss'
import './components/formcomponents/styles/common.scss'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'

// VeeValidate imports
import { configure } from 'vee-validate'
import './components/formcomponents/utils/validation-rules'

// i18n imports
import i18n from './locales'

// Custom imports
import App from './App.vue'
import router from './router'
import FcxFormPlugin from './plugins/fcx-form'
import FcxButtonPlugin from './plugins/fcx-button'
import FcxStatePlugin from './plugins/fcx-state'
import FcxDataPlugin from './plugins/fcx-data'

const app = createApp(App)

// Configure VeeValidate with i18n support
configure({
  generateMessage: (ctx) => {
    const { t } = i18n.global
    const ruleName = ctx.rule?.name as string
    const field = ctx.field
    
    // Get rule parameters
    const params = Array.isArray(ctx.rule?.params) ? ctx.rule.params : []
    
    // Create translation parameters
    const translationParams: Record<string, any> = { field }
    
    // Add rule-specific parameters
    if (ruleName === 'min' && params[0]) {
      translationParams.min = params[0]
    } else if (ruleName === 'max' && params[0]) {
      translationParams.max = params[0]
    }
    
    // Try to get localized validation message
    const messageKey = `forms.validation.${ruleName}`
    try {
      return t(messageKey, translationParams)
    } catch (error) {
      // Fallback to English if translation is missing
      const fallbackMessages: Record<string, string> = {
        required: `The ${field} field is required.`,
        email: `The ${field} field must be a valid email.`,
        min: `The ${field} field must have at least ${params[0] || ''} characters.`,
        max: `The ${field} field must not exceed ${params[0] || ''} characters.`
      }
      return fallbackMessages[ruleName] || `The ${field} field is invalid.`
    }
  }
})

// Install plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Configure PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})

// Install ToastService
app.use(ToastService)

// Install custom components
app.use(FcxFormPlugin)
app.use(FcxButtonPlugin)
app.use(FcxStatePlugin)
app.use(FcxDataPlugin)

// Initialize systems before mounting
import { getSavedLocale } from './locales'

// Initialize theme system
import { useTheme } from './composables/useTheme'

const initTheme = () => {
  const { initializeTheme } = useTheme()
  initializeTheme()
}

// Initialize i18n direction
const initDirection = () => {
  const savedLocale = getSavedLocale()
  const htmlElement = document.documentElement
  
  // Set the i18n locale first
  i18n.global.locale.value = savedLocale as 'en' | 'ar' | 'he' | 'es' | 'fr'
  
  // Set language attribute
  htmlElement.setAttribute('lang', savedLocale)
  
  // Set direction for RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  const direction = rtlLanguages.includes(savedLocale) ? 'rtl' : 'ltr'
  htmlElement.setAttribute('dir', direction)
  
  if (direction === 'rtl') {
    htmlElement.classList.add('rtl')
    htmlElement.classList.remove('ltr')
  } else {
    htmlElement.classList.add('ltr')
    htmlElement.classList.remove('rtl')
  }
  
  console.log('Direction initialized:', { savedLocale, direction, htmlDir: htmlElement.getAttribute('dir') })
}

// Initialize systems
initTheme()
initDirection()

// Initialize notification system
import { useNotificationStore } from './components/layout/header/notification/stores/notificationStore'

const initNotifications = async () => {
  const notificationStore = useNotificationStore()
  await notificationStore.initialize()
}

// Initialize notifications after app is mounted
initNotifications()

// Initialize authentication system
import { useAuthStore } from '@/views/auth/stores/authStore'

const initAuth = () => {
  const authStore = useAuthStore()
  try {
    authStore.initializeFromStorage()
    console.log('Auth system initialized')
  } catch (error) {
    console.error('Failed to initialize auth system:', error)
  }
}

// Initialize auth system
initAuth()

// Add global utility functions for testing/debugging
if (typeof window !== 'undefined') {
  // Global function to clear authentication state for testing
  (window as any).clearAuth = async () => {
    try {
      const authStore = useAuthStore()
      await authStore.signOut()
      console.log('✅ Authentication state cleared successfully')
      console.log('You can now navigate to signup or signin pages')
      return true
    } catch (error) {
      console.error('❌ Failed to clear authentication state:', error)
      return false
    }
  }

  // Global function to check current auth state
  (window as any).checkAuth = () => {
    try {
      const authStore = useAuthStore()
      const authInfo = {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        authStep: authStore.authStep,
        hasSuccess: authStore.hasSuccess,
        success: authStore.success
      }
      console.log('Current authentication state:', authInfo)
      return authInfo
    } catch (error) {
      console.error('❌ Failed to check authentication state:', error)
      return null
    }
  }

  console.log('🔧 Debug utilities available:')
  console.log('  - clearAuth(): Clear authentication state')
  console.log('  - checkAuth(): Check current authentication state')
}

// Mount the app after all initialization
app.mount('#app')
