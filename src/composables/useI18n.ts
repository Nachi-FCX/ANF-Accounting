import { computed, watch } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import { 
  SUPPORTED_LANGUAGES, 
  saveLocale, 
  isRTL, 
  getDirection,
  i18n,
  type LanguageConfig 
} from '@/locales'

export function useI18n() {
  const { locale, t, tm, rt, d, n } = useVueI18n()

  // Current language configuration
  const currentLanguage = computed<LanguageConfig>(() => {
    return SUPPORTED_LANGUAGES[locale.value] || SUPPORTED_LANGUAGES.en
  })

  // Check if current language is RTL
  const isCurrentRTL = computed(() => isRTL(locale.value))

  // Get current direction
  const currentDirection = computed(() => getDirection(locale.value))

  // Available languages
  const availableLanguages = computed(() => Object.values(SUPPORTED_LANGUAGES))

  // Set document direction and save locale
  const setLocale = (newLocale: string) => {
    if (SUPPORTED_LANGUAGES[newLocale]) {
      locale.value = newLocale
      saveLocale(newLocale)
      updateDocumentDirection(newLocale)
      
      // Force a re-render by updating the i18n instance
      const { locale: i18nLocale } = i18n.global
      i18nLocale.value = newLocale as 'en' | 'ar' | 'he' | 'es' | 'fr'
    }
  }

  // Update document direction
  const updateDocumentDirection = (localeCode: string) => {
    const direction = getDirection(localeCode)
    const htmlElement = document.documentElement
    
    // Set dir attribute
    htmlElement.setAttribute('dir', direction)
    
    // Add/remove RTL class for additional styling
    if (direction === 'rtl') {
      htmlElement.classList.add('rtl')
      htmlElement.classList.remove('ltr')
    } else {
      htmlElement.classList.add('ltr')
      htmlElement.classList.remove('rtl')
    }

    // Set lang attribute
    htmlElement.setAttribute('lang', localeCode)
  }

  // Initialize direction on mount
  const initializeDirection = () => {
    updateDocumentDirection(locale.value)
  }

  // Watch for locale changes
  watch(locale, (newLocale) => {
    updateDocumentDirection(newLocale)
  }, { immediate: true })

  // Translation helpers with fallback
  const translate = (key: string, params?: Record<string, unknown>) => {
    try {
      return params ? t(key, params) : t(key)
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
  }

  // Get nested translation object
  const translateObject = (key: string) => {
    try {
      return tm(key)
    } catch (error) {
      console.warn(`Translation object missing for key: ${key}`)
      return {}
    }
  }

  // Format date with locale
  const formatDate = (date: Date | number, format?: string) => {
    try {
      return format ? d(date, format) : d(date)
    } catch (error) {
      return new Date(date).toLocaleDateString(locale.value)
    }
  }

  // Format number with locale
  const formatNumber = (number: number, format?: string) => {
    try {
      return format ? n(number, format) : n(number)
    } catch (error) {
      return number.toLocaleString(locale.value)
    }
  }

  // Get RTL-aware CSS class
  const getRTLClass = (ltrClass: string, rtlClass: string) => {
    return isCurrentRTL.value ? rtlClass : ltrClass
  }

  // Get direction-aware margin/padding classes
  const getDirectionClass = (property: 'margin' | 'padding', side: 'start' | 'end', size: string) => {
    const prefix = property === 'margin' ? 'm' : 'p'
    const sidePrefix = side === 'start' ? 's' : 'e'
    return `${prefix}${sidePrefix}-${size}`
  }

  return {
    // Core i18n
    locale,
    t: translate,
    tm: translateObject,
    rt,
    d: formatDate,
    n: formatNumber,
    
    // Language management
    currentLanguage,
    availableLanguages,
    setLocale,
    
    // RTL support
    isCurrentRTL,
    currentDirection,
    getRTLClass,
    getDirectionClass,
    
    // Initialization
    initializeDirection
  }
}
