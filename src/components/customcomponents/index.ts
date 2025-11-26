// Custom Components Index
export { default as HeaderVersionDropdown } from './HeaderVersionDropdown.vue'
export { default as ThemeSwitcher } from './ThemeSwitcher.vue'
export { default as FcxConfirmDialog } from './FcxConfirmDialog.vue'

// Types
export interface VersionOption {
  label: string
  value: string
  description: string
  badge?: string
}

export interface ThemeOption {
  value: 'light' | 'dark' | 'system'
  label: string
  description: string
  icon: 'sun' | 'moon' | 'monitor'
}
