<template>
  <div class="language-switcher">
    <Dropdown
      v-model="selectedLanguage"
      :options="availableLanguages"
      option-label="nativeName"
      option-value="code"
      :placeholder="t('common.language')"
      class="language-dropdown"
      @change="handleLanguageChange"
    >
      <template #value="{ value }">
        <div v-if="value" class="language-option">
          <span class="flag">{{ currentLanguage.flag }}</span>
          <span class="name">{{ currentLanguage.nativeName }}</span>
        </div>
        <span v-else>{{ t('common.language') }}</span>
      </template>
      
      <template #option="{ option }">
        <div class="language-option">
          <span class="flag">{{ option.flag }}</span>
          <span class="name">{{ option.nativeName }}</span>
          <span class="direction-indicator" :class="option.dir">
            {{ option.dir.toUpperCase() }}
          </span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import { useI18n } from '@/composables/useI18n'

const {
  locale,
  t,
  currentLanguage,
  availableLanguages,
  setLocale
} = useI18n()

const selectedLanguage = ref(locale.value)

// Watch for external locale changes
watch(locale, (newLocale) => {
  selectedLanguage.value = newLocale
})

// Handle language change
const handleLanguageChange = (event: any) => {
  const newLocale = event.value
  if (newLocale && newLocale !== locale.value) {
    setLocale(newLocale)
  }
}
</script>

<style scoped>
.language-switcher {
  min-width: 200px;
}

.language-dropdown {
  width: 100%;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.flag {
  font-size: 1.2em;
  min-width: 1.5rem;
}

.name {
  flex: 1;
  font-weight: 500;
}

.direction-indicator {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-transform: uppercase;
  
  &.ltr {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  &.rtl {
    background-color: #fff3e0;
    color: #f57c00;
  }
}

/* RTL adjustments */
:global(.rtl) .language-option {
  flex-direction: row-reverse;
  text-align: right;
}

:global(.rtl) .direction-indicator {
  margin-left: 0;
  margin-right: auto;
}

/* Dark theme support */
:global([data-theme="dark"]) .direction-indicator {
  &.ltr {
    background-color: rgba(25, 118, 210, 0.2);
    color: #90caf9;
  }
  
  &.rtl {
    background-color: rgba(245, 124, 0, 0.2);
    color: #ffb74d;
  }
}
</style>
