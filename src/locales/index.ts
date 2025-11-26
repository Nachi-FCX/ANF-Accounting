import { createI18n } from 'vue-i18n'

// Import locale messages
import en from './en.json'
import ar from './ar.json'
import he from './he.json'
import es from './es.json'
import fr from './fr.json'

// Language configuration with RTL support
export interface LanguageConfig {
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  flag: string
  code: string
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
    code: 'en'
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
    code: 'ar'
  },
  he: {
    name: 'Hebrew',
    nativeName: 'עברית',
    dir: 'rtl',
    flag: '🇮🇱',
    code: 'he'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    flag: '🇪🇸',
    code: 'es'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    flag: '🇫🇷',
    code: 'fr'
  }
}

// RTL languages list
export const RTL_LANGUAGES = ['ar', 'he']

// Default locale
export const DEFAULT_LOCALE = 'en'

// Fallback locale
export const FALLBACK_LOCALE = 'en'

// Messages object
const messages = {
  en,
  ar,
  he,
  es,
  fr
}

// Get browser locale or default
export function getBrowserLocale(): string {
  if (typeof navigator !== 'undefined') {
    const browserLocale = navigator.language.split('-')[0]
    return Object.keys(SUPPORTED_LANGUAGES).includes(browserLocale) 
      ? browserLocale 
      : DEFAULT_LOCALE
  }
  return DEFAULT_LOCALE
}

// Get saved locale from localStorage
export function getSavedLocale(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('locale')
    return saved && Object.keys(SUPPORTED_LANGUAGES).includes(saved) 
      ? saved 
      : getBrowserLocale()
  }
  return getBrowserLocale()
}

// Save locale to localStorage
export function saveLocale(locale: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('locale', locale)
  }
}

// Check if language is RTL
export function isRTL(locale: string): boolean {
  return RTL_LANGUAGES.includes(locale)
}

// Get language direction
export function getDirection(locale: string): 'ltr' | 'rtl' {
  return SUPPORTED_LANGUAGES[locale]?.dir || 'ltr'
}

// Create i18n instance
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  globalInjection: true,
  warnHtmlMessage: false
})

// Default export for the i18n instance
export default i18n
