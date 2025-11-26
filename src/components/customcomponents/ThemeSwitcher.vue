<template>
  <div class="theme-switcher" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      class="theme-trigger"
      :class="{ 'active': isOpen }"
      @click="toggleDropdown"
      @keydown.escape="closeDropdown"
      @keydown.arrow-down.prevent="openDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      :aria-label="`Current theme: ${currentThemeOption.label}. Click to change theme.`"
      :title="`Switch theme (Current: ${currentThemeOption.label})`"
    >
      <div class="theme-icon">
        <!-- Sun Icon for Light Theme -->
        <svg 
          v-if="currentTheme === 'light'" 
          width="18" 
          height="18" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          class="sun-icon"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>

        <!-- Moon Icon for Dark Theme -->
        <svg 
          v-else-if="currentTheme === 'dark'" 
          width="18" 
          height="18" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          class="moon-icon"
        >
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
        </svg>

        <!-- Monitor Icon for System Theme -->
        <svg 
          v-else 
          width="18" 
          height="18" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          class="monitor-icon"
        >
          <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
      </div>
      
      <div class="dropdown-arrow" :class="{ 'rotated': isOpen }">
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="theme-menu"
        role="menu"
        :aria-label="'Theme selection menu'"
      >
        <!-- Backdrop -->
        <div class="menu-backdrop" @click="closeDropdown"></div>
        
        <!-- Menu Panel -->
        <div class="menu-panel">
          <!-- Menu Header -->
          <div class="menu-header">
            <h3 class="menu-title">Choose Theme</h3>
          </div>

          <!-- Menu Items -->
          <div class="menu-items" role="none">
            <button
              v-for="(theme, index) in themeOptions"
              :key="theme.value"
              class="menu-item"
              :class="{ 
                'selected': theme.value === currentTheme,
                'focused': focusedIndex === index 
              }"
              role="menuitem"
              @click="selectTheme(theme)"
              @keydown.escape="closeDropdown"
              @keydown.arrow-down.prevent="focusNext"
              @keydown.arrow-up.prevent="focusPrevious"
              @keydown.enter.prevent="selectTheme(theme)"
              @keydown.space.prevent="selectTheme(theme)"
              :aria-selected="theme.value === currentTheme"
              :tabindex="focusedIndex === index ? 0 : -1"
            >
              <div class="item-icon">
                <!-- Selected checkmark -->
                <svg 
                  v-if="theme.value === currentTheme" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  class="check-icon"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <div v-else class="placeholder-icon"></div>
              </div>
              
              <div class="theme-icon-container">
                <!-- Sun Icon -->
                <svg 
                  v-if="theme.icon === 'sun'" 
                  width="20" 
                  height="20" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  class="theme-option-icon sun-icon"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>

                <!-- Moon Icon -->
                <svg 
                  v-else-if="theme.icon === 'moon'" 
                  width="20" 
                  height="20" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  class="theme-option-icon moon-icon"
                >
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
                </svg>

                <!-- Monitor Icon -->
                <svg 
                  v-else 
                  width="20" 
                  height="20" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  class="theme-option-icon monitor-icon"
                >
                  <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                </svg>
              </div>
              
              <div class="item-content">
                <div class="item-title">{{ theme.label }}</div>
                <div class="item-description">{{ theme.description }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useTheme } from '../../composables/useTheme'
import type { Theme } from '../../composables/useTheme'

// Types
interface ThemeOption {
  value: Theme
  label: string
  description: string
  icon: 'sun' | 'moon' | 'monitor'
}

// Use theme composable
const { currentTheme, setTheme } = useTheme()

// Reactive state
const isOpen = ref(false)
const focusedIndex = ref(0)
const dropdownRef = ref<HTMLElement>()

// Theme options
const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Use light theme',
    icon: 'sun'
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use dark theme',
    icon: 'moon'
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow system preference',
    icon: 'monitor'
  }
]

// Computed
const currentThemeOption = computed(() => {
  return themeOptions.find(option => option.value === currentTheme.value) || themeOptions[2]
})

// Methods
const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = async () => {
  isOpen.value = true
  focusedIndex.value = themeOptions.findIndex(option => option.value === currentTheme.value)
  
  await nextTick()
  // Focus the selected item or first item
  const menuItems = dropdownRef.value?.querySelectorAll('.menu-item')
  if (menuItems && menuItems[focusedIndex.value]) {
    (menuItems[focusedIndex.value] as HTMLElement).focus()
  }
}

const closeDropdown = () => {
  isOpen.value = false
  focusedIndex.value = 0
}

const selectTheme = (themeOption: ThemeOption) => {
  setTheme(themeOption.value)
  closeDropdown()
}

const focusNext = () => {
  focusedIndex.value = (focusedIndex.value + 1) % themeOptions.length
  const menuItems = dropdownRef.value?.querySelectorAll('.menu-item')
  if (menuItems && menuItems[focusedIndex.value]) {
    (menuItems[focusedIndex.value] as HTMLElement).focus()
  }
}

const focusPrevious = () => {
  focusedIndex.value = focusedIndex.value === 0 
    ? themeOptions.length - 1 
    : focusedIndex.value - 1
  const menuItems = dropdownRef.value?.querySelectorAll('.menu-item')
  if (menuItems && menuItems[focusedIndex.value]) {
    (menuItems[focusedIndex.value] as HTMLElement).focus()
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.theme-switcher {
  position: relative;
  display: flex;
  align-items: center;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: none;
  border: 1px solid var(--header-border);
  border-radius: 50%;
  color: var(--header-text);
  cursor: pointer;
  transition: all 0.15s ease;
  width: 40px;
  height: 40px;
  justify-content: center;
  position: relative;

  &:hover {
    background: var(--header-hover);
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    background: var(--header-hover);
  }

  &.active {
    background: var(--header-hover);
    
    .dropdown-arrow {
      transform: rotate(180deg);
    }
  }
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--header-text);
  
  .sun-icon {
    color: #f59e0b;
  }
  
  .moon-icon {
    color: #6366f1;
  }
  
  .monitor-icon {
    color: var(--header-text-secondary);
  }
}

.dropdown-arrow {
  display: none; // Hidden for circular button design
}

.theme-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: -1;
}

.menu-panel {
  position: relative;
  width: 280px;
  max-width: calc(100vw - 40px);
  background: var(--header-bg);
  border: 1px solid var(--header-border);
  border-radius: 12px;
  box-shadow: 0 10px 25px var(--header-shadow);
  overflow: hidden;
  backdrop-filter: blur(10px);

  // Dark theme specific styling
  :root[data-theme="dark"] & {
    background: rgba(23, 23, 23, 0.95);
    border-color: rgba(45, 45, 45, 0.8);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  // Light theme specific styling
  :root[data-theme="light"] & {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(229, 231, 235, 0.8);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
}

.menu-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--header-border);
}

.menu-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--header-text);
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--header-text);

  &:hover,
  &.focused {
    background: var(--header-hover);
  }

  &.selected {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;

    .item-title {
      font-weight: 600;
    }
  }

  &:focus {
    outline: none;
    background: var(--header-hover);
  }
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  .check-icon {
    color: #3b82f6;
  }

  .placeholder-icon {
    width: 16px;
    height: 16px;
  }
}

.theme-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  .theme-option-icon {
    &.sun-icon {
      color: #f59e0b;
    }
    
    &.moon-icon {
      color: #6366f1;
    }
    
    &.monitor-icon {
      color: var(--header-text-secondary);
    }
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 2px;
}

.item-description {
  font-size: 12px;
  color: var(--header-text-secondary);
  line-height: 1.3;
}

// Dropdown transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// Mobile responsive
@media (max-width: 768px) {
  .theme-menu {
    right: -20px;
  }

  .menu-panel {
    width: 260px;
    max-width: calc(100vw - 24px);
  }

  .theme-trigger {
    width: 36px;
    height: 36px;
    padding: 6px;
  }

  .theme-icon svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .theme-trigger {
    width: 32px;
    height: 32px;
    padding: 4px;
  }

  .theme-icon svg {
    width: 14px;
    height: 14px;
  }
}
</style>
