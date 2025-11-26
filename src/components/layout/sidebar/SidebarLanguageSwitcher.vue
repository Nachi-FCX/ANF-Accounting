<template>
  <div class="sidebar-language-switcher" :class="{ collapsed: isCollapsed }">
    <FcxDropdown
      v-if="!isCollapsed"
      :model-value="currentLanguage.code"
      :options="languageOptions"
      option-label="displayName"
      option-value="code"
      :placeholder="t('common.selectLanguage')"
      class="language-dropdown"
      size="sm"
      name="language"
      @update:model-value="handleLanguageChange"
    >
      <template #value="{ value }">
        <div v-if="value" class="language-option">
          <span class="language-flag">{{ getLanguageByCode(value)?.flag }}</span>
          <span class="language-name">{{ getLanguageByCode(value)?.nativeName }}</span>
        </div>
      </template>
      
      <template #option="{ option }">
        <div class="language-option">
          <span class="language-flag">{{ option.flag }}</span>
          <span class="language-name">{{ option.nativeName }}</span>
          <span class="language-code">{{ option.code.toUpperCase() }}</span>
        </div>
      </template>
    </FcxDropdown>

    <!-- Collapsed state - show current language flag as button -->
    <button
      v-else
      class="language-toggle-btn"
      :data-tooltip="currentLanguage.nativeName"
      @click="toggleLanguageMenu"
      :title="currentLanguage.nativeName"
    >
      <span class="language-flag">{{ currentLanguage.flag }}</span>
    </button>

    <!-- Collapsed language menu -->
    <div
      v-if="isCollapsed && showLanguageMenu"
      class="collapsed-language-menu"
      @click.stop
    >
      <div class="language-menu-header">
        <span>{{ t('common.selectLanguage') }}</span>
        <button class="close-btn" @click="showLanguageMenu = false">×</button>
      </div>
      <div class="language-menu-options">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          class="language-menu-option"
          :class="{ active: lang.code === currentLanguage.code }"
          @click="handleLanguageChange(lang.code)"
        >
          <span class="language-flag">{{ lang.flag }}</span>
          <span class="language-name">{{ lang.nativeName }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Backdrop for collapsed menu -->
  <div
    v-if="isCollapsed && showLanguageMenu"
    class="language-menu-backdrop"
    @click="showLanguageMenu = false"
  ></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { LanguageConfig } from '@/locales'

// Props
interface Props {
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false
})

// Composables
const { 
  currentLanguage, 
  availableLanguages, 
  setLocale, 
  t 
} = useI18n()

// Local state
const showLanguageMenu = ref(false)

// Computed
const languageOptions = computed(() => {
  return availableLanguages.value.map(lang => ({
    ...lang,
    displayName: `${lang.flag} ${lang.nativeName}`
  }))
})

// Methods
const handleLanguageChange = (languageCode: string) => {
  console.log('Language change requested:', languageCode)
  setLocale(languageCode)
  showLanguageMenu.value = false
  
  // Debug: Check if direction was set
  setTimeout(() => {
    const htmlDir = document.documentElement.getAttribute('dir')
    console.log('HTML dir after language change:', htmlDir)
  }, 100)
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return availableLanguages.value.find(lang => lang.code === code)
}
</script>

<style lang="scss" scoped>
// Theme variables
:root {
  --language-switcher-bg: transparent;
  --language-switcher-border: #e5e7eb;
  --language-switcher-text: #374151;
  --language-switcher-hover: #f3f4f6;
  --language-menu-bg: #ffffff;
  --language-menu-border: #e5e7eb;
  --language-menu-shadow: rgba(0, 0, 0, 0.1);
  --tooltip-bg: #1f2937;
  --tooltip-text: #ffffff;
}

:root[data-theme="dark"] {
  --language-switcher-bg: transparent;
  --language-switcher-border: #4b5563;
  --language-switcher-text: #f9fafb;
  --language-switcher-hover: #374151;
  --language-menu-bg: #1f2937;
  --language-menu-border: #4b5563;
  --language-menu-shadow: rgba(0, 0, 0, 0.5);
  --tooltip-bg: #374151;
  --tooltip-text: #f9fafb;
}

.sidebar-language-switcher {
  position: relative;
  margin: 8px;

  &.collapsed {
    display: flex;
    justify-content: center;
  }

  // Custom dropdown styling for sidebar
  :deep(.language-dropdown) {
    fcx-dropdown {
      background: var(--language-switcher-bg);
      border: 1px solid var(--language-switcher-border);
      border-radius: 6px;
      font-size: 0.875rem;
      min-height: 36px;

      &:hover {
        background: var(--language-switcher-hover);
      }
    }

    fcx-dropdown-panel {
      border: 1px solid var(--language-menu-border);
      box-shadow: 0 4px 12px var(--language-menu-shadow);
    }
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;

  .language-flag {
    font-size: 1.1em;
    flex-shrink: 0;
  }

  .language-name {
    flex: 1;
    font-weight: 500;
  }

  .language-code {
    font-size: 0.75rem;
    opacity: 0.7;
    font-weight: 600;
  }
}

// Collapsed state button
.language-toggle-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--language-switcher-border);
  background: var(--language-switcher-bg);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: var(--language-switcher-hover);
  }

  .language-flag {
    font-size: 1.2em;
  }

  // Tooltip for collapsed state
  &[data-tooltip]:not([data-tooltip=""]) {
    &::after {
      content: attr(data-tooltip);
      position: absolute;
      left: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      background: var(--tooltip-bg);
      color: var(--tooltip-text);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: all 0.2s ease;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    &::before {
      content: '';
      position: absolute;
      left: calc(100% + 6px);
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 6px 6px 0;
      border-color: transparent var(--tooltip-bg) transparent transparent;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 9999;
    }

    &:hover::after,
    &:hover::before {
      opacity: 1;
      visibility: visible;
    }
  }

  // RTL Tooltip positioning
  :root[dir="rtl"] &[data-tooltip]:not([data-tooltip=""]) {
    &::after {
      left: auto;
      right: calc(100% + 12px);
    }

    &::before {
      left: auto;
      right: calc(100% + 6px);
      border-width: 6px 0 6px 6px;
      border-color: transparent transparent transparent var(--tooltip-bg);
    }
  }
}

// Collapsed language menu
.collapsed-language-menu {
  position: absolute;
  left: calc(100% + 12px);
  top: 0;
  background: var(--language-menu-bg);
  border: 1px solid var(--language-menu-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--language-menu-shadow);
  z-index: 10000;
  min-width: 200px;
  overflow: hidden;

  .language-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--language-menu-border);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--language-switcher-text);

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--language-switcher-text);
      opacity: 0.7;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  .language-menu-options {
    max-height: 240px;
    overflow-y: auto;
  }

  .language-menu-option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--language-switcher-text);
    text-align: left;

    &:hover {
      background: var(--language-switcher-hover);
    }

    &.active {
      background: var(--language-switcher-hover);
      font-weight: 600;
    }

    .language-flag {
      font-size: 1.1em;
      flex-shrink: 0;
    }

    .language-name {
      flex: 1;
    }
  }
}

// RTL Collapsed language menu positioning
:root[dir="rtl"] .collapsed-language-menu {
  left: auto;
  right: calc(100% + 12px);
}

// Backdrop
.language-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: transparent;
}
</style>
