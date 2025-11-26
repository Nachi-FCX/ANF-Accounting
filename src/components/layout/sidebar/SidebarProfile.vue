<template>
  <div
    class="sidebar-profile"
    :data-tooltip="isCollapsed ? user.name : ''"
    @click="handleClick"
  >
    <div class="profile-avatar-letter">
      {{ getFirstLetter(user.name) }}
    </div>
    <div class="profile-info" v-show="!isCollapsed">
      <div class="profile-name">{{ user.name }}</div>
      <div class="profile-email">{{ user.email }}</div>
    </div>
    
    <!-- Profile Dropdown Menu -->
    <ProfileDropdownMenu 
      :is-open="isDropdownOpen" 
      :user="user"
      @close="closeDropdown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UserProfile, ProfileProps } from './types/sidebar-types'
import ProfileDropdownMenu from '../header/ProfileDropdownMenu.vue'

// Props
const props = withDefaults(defineProps<ProfileProps>(), {
  isCollapsed: false
})

// Emits
const emit = defineEmits<{
  click: [user: UserProfile, event: MouseEvent]
}>()

// Reactive state
const isDropdownOpen = ref(false)

// Methods
const getFirstLetter = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return 'U' // Default to 'U' for User if name is empty
  }
  return name.trim().charAt(0).toUpperCase()
}

const handleClick = (event: MouseEvent): void => {
  // Toggle dropdown instead of just emitting click
  isDropdownOpen.value = !isDropdownOpen.value
  emit('click', props.user, event)
}

const closeDropdown = (): void => {
  isDropdownOpen.value = false
}
</script>

<style lang="scss" scoped>
// Theme variables for profile
:root {
  // Light theme
  --profile-text: #374151;
  --profile-text-secondary: #6b7280;
  --profile-hover: #f3f4f6;
  --profile-border: #e5e7eb;
  --tooltip-bg: #1f2937;
  --tooltip-text: #ffffff;
}

:root[data-theme="dark"] {
  // Dark theme
  --profile-text: #f9fafb;
  --profile-text-secondary: #d1d5db;
  --profile-hover: #374151;
  --profile-border: #4b5563;
  --tooltip-bg: #374151;
  --tooltip-text: #f9fafb;
}

// Profile Section
.sidebar-profile {
  display: flex !important;
  align-items: center !important;
  padding: 12px 16px !important;
  margin: 4px 8px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  position: relative !important;

  &:hover {
    background: var(--profile-hover) !important;
  }

  .profile-avatar {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
    flex-shrink: 0 !important;
    border: 2px solid var(--profile-border) !important;
  }

  .profile-avatar-letter {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    text-transform: uppercase !important;
    transition: all 0.2s ease !important;

    // Light theme avatar letter
    [data-theme="light"] & {
      background: #3b82f6 !important;
      border: 2px solid #2563eb !important;
    }

    // Dark theme avatar letter
    [data-theme="dark"] & {
      background: #1e40af !important;
      border: 2px solid #1d4ed8 !important;
    }

    // Hover effect
    .sidebar-profile:hover & {
      transform: scale(1.05) !important;
      
      [data-theme="light"] & {
        background: #2563eb !important;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
      }

      [data-theme="dark"] & {
        background: #1d4ed8 !important;
        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.4) !important;
      }
    }
  }

  .profile-info {
    margin-left: 12px !important;
    transition: all 0.3s ease !important;
    overflow: hidden !important;

    .profile-name {
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      color: var(--profile-text) !important;
      line-height: 1.2 !important;
      margin-bottom: 2px !important;
    }

    .profile-email {
      font-size: 0.75rem !important;
      color: var(--profile-text-secondary) !important;
      line-height: 1.2 !important;
    }
  }

  // Tooltip for collapsed state - Enhanced implementation
  &[data-tooltip]:not([data-tooltip=""]) {
    position: relative;
    
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
</style>
