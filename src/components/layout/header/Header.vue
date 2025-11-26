<template>
  <!-- Debug info -->
  <!-- isDropdownOpen: {{ isDropdownOpen }}, unreadCount: {{ unreadCount }} -->
  <header class="app-header" :class="headerClasses" :style="headerStyles">
    <div class="header-content" :class="{ 'collapsed': isCollapsed }">
      <div class="header-left">
        <HeaderVersionDropdown 
          v-model="selectedCompany"
          :companys="companyOptions"
          @change="handleCompanyChange"
          @more-companys="handleMoreCompanys"
          @add-company="handleAddCompany"
        />
      </div>
      
      <div class="header-right">
        <!-- Mobile: Only show hamburger menu -->
        <template v-if="isMobile">
          <button 
            class="header-btn mobile-menu-btn" 
            @click="$emit('toggle-sidebar')"
            title="Toggle Menu"
          >
            <i class="pi pi-bars"></i>
          </button>
        </template>
        
        <!-- Desktop: Show all buttons -->
        <template v-else>
          <button class="header-btn" title="Share">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>

          <!-- Theme Switcher -->
          <ThemeSwitcher />
          
          <!-- Notification Icon Button -->
          <button 
            class="header-btn notification-btn" 
            :class="{ 'has-notifications': hasUnreadNotifications, 'active': isDropdownOpen }"
            @click="toggleNotificationDropdown"
            :title="`${unreadCount} unread notifications`"
          >
            <i class="pi pi-bell"></i>
            <!-- Unread Count Badge -->
            <div 
              v-if="unreadCount > 0" 
              class="notification-badge"
              :class="{ 'pulse': hasUnreadNotifications }"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </div>
          </button>

          <!-- Plus Icon Button for Menu -->
          <button 
            class="header-btn plus-btn" 
            :class="{ 'active': isPlusMenuOpen }"
            @click="togglePlusDropdown"
            title="Quick Navigation"
          >
            <i class="pi pi-plus"></i>
          </button>
          
          <!-- Desktop Menu Button -->
          <button 
            class="header-btn menu-btn" 
            title="Menu"
          >
            <i class="pi pi-th-large"></i>
          </button>
        </template>
      </div>
    </div>
    
    <!-- Header Dropdown Menu (only show on desktop) -->
    <HeaderDropdownMenu 
      v-if="!isMobile"
      :is-open="isPlusMenuOpen" 
      @close="closePlusDropdown"
    />

    <!-- New Tabbed Notification System -->
    <NotificationTabs v-if="!isMobile" />
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderDropdownMenu from './HeaderDropdownMenu.vue'
import { useNotificationSystem } from './notification/composables/useNotificationSystem'
import { NotificationTabs } from './notification'
import { HeaderVersionDropdown, ThemeSwitcher } from '../../customcomponents'
import type { VersionOption } from '../../customcomponents'

// Props
interface Props {
  isCollapsed?: boolean
  isSidebarOpen?: boolean
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isSidebarOpen: true,
  isMobile: false
})

// Emits
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

// Router
const router = useRouter()

// Use new notification system
const {
  totalUnreadCount: unreadCount,
  hasUnreadNotifications, 
  toggleDropdown: toggleNotificationDropdown,
  isDropdownOpen
} = useNotificationSystem()

// Reactive state for plus menu dropdown
const isPlusMenuOpen = ref(false)

// Company dropdown state
const selectedCompany = ref('')
const companyOptions = ref<any[]>([])

// For testing empty state - uncomment the line below to test empty state
// const versionOptions = ref<VersionOption[]>([])

// Methods
const togglePlusDropdown = () => {
  isPlusMenuOpen.value = !isPlusMenuOpen.value
}

const closePlusDropdown = () => {
  isPlusMenuOpen.value = false
}

const handleVersionChange = (version: VersionOption) => {
  console.log('Version changed to:', version)
  // Handle version change logic here
  // You can emit an event, navigate to different routes, etc.
}

const handleMoreVersions = () => {
  console.log('More versions requested')
  // Handle more versions logic here
  // You can navigate to a versions page, show a modal, etc.
}

const handleAddVersion = () => {
  console.log('Add version requested')
  // Handle add version logic here
  // You can show a modal to add new version, navigate to add version page, etc.
}

const handleCompanyChange = (company: any) => {
  console.log('Company changed to:', company)
  // Handle company change logic here
  // You can emit an event, navigate to different routes, etc.
}

const handleMoreCompanys = () => {
  console.log('More companies requested')
  // Handle more companies logic here
  // You can navigate to a companies page, show a modal, etc.
}

const handleAddCompany = () => {
  console.log('Add company requested')
  // Handle add company logic here
  // You can show a modal to add new company, navigate to add company page, etc.
}

// Computed to determine if sidebar is effectively collapsed
const sidebarCollapsed = computed(() => {
  return props.isCollapsed || !props.isSidebarOpen
})

// Dynamic screen-based calculations
const screenWidth = ref(window.innerWidth)

// Update screen width on resize
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

// Computed for dynamic sidebar width based on screen size - MATCH SIDEBAR CALCULATIONS
const dynamicSidebarWidth = computed(() => {
  const width = screenWidth.value
  
  // Desktop: Large screens (≥1200px) - Premium scaling
  if (width >= 1200) {
    const baseWidth = 260
    const baseScreen = 1280
    const scaleFactor = 50 // Enhanced variation for large screens
    const screenRange = 720 // Range from 1200 to 1920
    
    // Calculate proportional width with premium scaling
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 240px and 320px for large screens
    return Math.max(240, Math.min(320, Math.round(calculatedWidth)))
  }
  
  // Desktop: Standard screens (1024px - 1199px) - Standard scaling
  if (width >= 1024) {
    const baseWidth = 240
    const baseScreen = 1024
    const scaleFactor = 20 // Moderate scaling for standard desktop
    const screenRange = 175 // Range from 1024 to 1199
    
    // Calculate proportional width for standard desktop
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 240px and 260px for standard desktop
    return Math.max(240, Math.min(260, Math.round(calculatedWidth)))
  }
  
  // Tablet: Large tablets (768px - 1023px) - Optimized for iPad and similar
  if (width >= 768) {
    const baseWidth = 200
    const baseScreen = 768
    const scaleFactor = 40 // Good scaling for tablet range
    const screenRange = 255 // Range from 768 to 1023
    
    // Calculate proportional width for tablets
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 200px and 240px for tablets
    return Math.max(200, Math.min(240, Math.round(calculatedWidth)))
  }
  
  // Small tablets and large phones (600px - 767px)
  if (width >= 600) {
    return 110 // Fixed smaller width for small tablets
  }
  
  return 160 // Minimal width for mobile phones
})

// Computed for dynamic collapsed width based on screen size - MATCH SIDEBAR CALCULATIONS
const dynamicCollapsedWidth = computed(() => {
  const width = screenWidth.value
  
  // Desktop: Large screens (≥1200px) - Enhanced collapsed width
  if (width >= 1200) {
    const baseWidth = 72
    const baseScreen = 1280
    const scaleFactor = 16 // Moderate scaling for collapsed state
    const screenRange = 720 // Range from 1200 to 1920
    
    // Calculate proportional collapsed width for large screens
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 64px and 88px for large screens
    return Math.max(64, Math.min(88, Math.round(calculatedWidth)))
  }
  
  // Desktop: Standard screens (1024px - 1199px)
  if (width >= 1024) {
    const baseWidth = 64
    const baseScreen = 1024
    const scaleFactor = 8 // Small scaling for standard desktop
    const screenRange = 175 // Range from 1024 to 1199
    
    // Calculate proportional collapsed width for standard desktop
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 64px and 72px for standard desktop
    return Math.max(64, Math.min(72, Math.round(calculatedWidth)))
  }
  
  // Tablet: Large tablets (768px - 1023px)
  if (width >= 768) {
    const baseWidth = 56
    const baseScreen = 768
    const scaleFactor = 8 // Small scaling for tablet collapsed
    const screenRange = 255 // Range from 768 to 1023
    
    // Calculate proportional collapsed width for tablets
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 56px and 64px for tablets
    return Math.max(56, Math.min(64, Math.round(calculatedWidth)))
  }
  
  // Small tablets and large phones (600px - 767px)
  if (width >= 600) {
    return 52 // Fixed smaller collapsed width for small tablets
  }
  
  return 48 // Minimal collapsed width for mobile phones
})

// Computed for header positioning with dynamic calculations
const headerLeftMargin = computed(() => {
  if (props.isMobile) {
    return '0px'
  }
  
  if (props.isSidebarOpen && !props.isCollapsed) {
    return `${dynamicSidebarWidth.value}px`
  } else {
    return `${dynamicCollapsedWidth.value}px`
  }
})

// Computed for header width with dynamic calculations
const headerWidth = computed(() => {
  if (props.isMobile) {
    return '100vw'
  }
  
  if (props.isSidebarOpen && !props.isCollapsed) {
    return `calc(100vw - ${dynamicSidebarWidth.value}px)`
  } else {
    return `calc(100vw - ${dynamicCollapsedWidth.value}px)`
  }
})

// CSS custom properties for dynamic values
const headerStyles = computed(() => ({
  '--dynamic-sidebar-width': `${dynamicSidebarWidth.value}px`,
  '--dynamic-collapsed-width': `${dynamicCollapsedWidth.value}px`,
  '--header-left': headerLeftMargin.value,
  '--header-width': headerWidth.value
}))

// Computed for header classes
const headerClasses = computed(() => {
  const classes = ['app-header']
  
  if (props.isMobile) {
    classes.push('mobile')
  } else if (props.isSidebarOpen && !props.isCollapsed) {
    classes.push('sidebar-expanded')
  } else {
    classes.push('sidebar-collapsed')
  }
  
  return classes
})

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})
</script>

<style lang="scss" scoped>
// Header uses global theme variables from global-ui-variables.scss
// No need for local variable overrides

.app-header {
  position: fixed;
  top: 0;
  height: 60px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  flex-shrink: 0;
  transition: all 0.3s ease;
  z-index: 999;

  &.mobile {
    left: 0;
    width: 100vw;
  }

  &.sidebar-expanded {
    left: var(--dynamic-sidebar-width);
    width: calc(100vw - var(--dynamic-sidebar-width));
    
    // RTL support - position from right side
    [dir="rtl"] & {
      left: auto;
      right: var(--dynamic-sidebar-width);
    }
  }

  &.sidebar-collapsed {
    left: var(--dynamic-collapsed-width);
    width: calc(100vw - var(--dynamic-collapsed-width));
    
    // RTL support - position from right side
    [dir="rtl"] & {
      left: auto;
      right: var(--dynamic-collapsed-width);
    }
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}


.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: 1px solid var(--header-border);
  border-radius: 6px;
  color: var(--header-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--header-hover);
  }

  &.menu-btn,
  &.mobile-menu-btn {
    padding: 8px;
    min-width: auto;
    
    i {
      font-size: 16px;
    }
  }

  &.mobile-menu-btn {
    &:hover {
      background: var(--header-hover);
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  &.notification-btn {
    position: relative;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    justify-content: center;

    &:hover {
      transform: scale(1.05);
    }

    &.has-notifications {
      color: #3b82f6;
      
      &:hover {
        color: #2563eb;
      }
    }

    &.active {
      background: var(--header-hover);
      border-color: #3b82f6;
      color: #3b82f6;
    }

    i {
      font-size: 18px;
    }
  }

  &.plus-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
    background: none;
    color: var(--header-text);
    border: 1px solid var(--header-border);
    justify-content: center;
    position: relative;

    &:hover {
      background: var(--header-hover);
      border-color: var(--header-text-secondary);
      transform: scale(1.05);
    }

    &.active {
      background: var(--header-hover);
      border-color: var(--header-text-secondary);
      transform: rotate(45deg);
    }

    i {
      font-size: 16px;
      font-weight: bold;
    }
  }

  svg {
    flex-shrink: 0;
  }
}

// Notification badge
.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  padding: 0 4px;
  border: 2px solid var(--header-bg, transparent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &.pulse {
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

// Notification dropdown styles
.notification-dropdown-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.notification-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.notification-dropdown {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 380px;
  max-height: 600px;
  background: rgba(23, 23, 23, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 45, 45, 0.8);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.2s ease;

  &.open {
    transform: translateY(0);
    opacity: 1;
  }

  // RTL support - position dropdown from left side
  [dir="rtl"] & {
    right: auto;
    left: 20px;
  }
}

:root[data-theme="light"] .notification-dropdown {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(229, 231, 235, 0.8);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(45, 45, 45, 0.8);
}

:root[data-theme="light"] .dropdown-header {
  border-bottom-color: rgba(229, 231, 235, 0.8);
}

.dropdown-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--header-text);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.mark-all-btn,
.refresh-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid rgba(45, 45, 45, 0.8);
  border-radius: 6px;
  color: var(--header-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--header-hover);
    color: var(--header-text);
  }

  &.spinning i {
    animation: spin 1s linear infinite;
  }
}

:root[data-theme="light"] .mark-all-btn,
:root[data-theme="light"] .refresh-btn {
  border-color: rgba(229, 231, 235, 0.8);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--header-text-secondary);
  text-align: center;

  i {
    font-size: 24px;
  }

  &.error-state {
    color: #ef4444;
  }
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;

  &:hover {
    background: #dc2626;
  }
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid transparent;

  &:hover {
    background: var(--header-hover);
  }

  &.unread {
    background: rgba(59, 130, 246, 0.05);
    border-left: 3px solid #3b82f6;
  }

  &:last-child {
    border-bottom: none;
  }
}

.notification-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--header-hover);
  border-radius: 50%;
  flex-shrink: 0;

  i {
    font-size: 14px;
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--header-text);
  margin: 0;
  line-height: 1.3;
}

.notification-time {
  font-size: 11px;
  color: var(--header-text-secondary);
  flex-shrink: 0;
  margin-left: 8px;
}

.notification-message {
  font-size: 12px;
  color: var(--header-text-secondary);
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-category {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--header-text-secondary);
  text-transform: capitalize;

  i {
    font-size: 10px;
  }
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;

  .notification-item:hover & {
    opacity: 1;
  }
}

.action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid rgba(45, 45, 45, 0.8);
  border-radius: 4px;
  color: var(--header-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--header-hover);
    color: var(--header-text);
  }

  &.delete:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  i {
    font-size: 10px;
  }
}

:root[data-theme="light"] .action-btn {
  border-color: rgba(229, 231, 235, 0.8);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--header-text-secondary);

  i {
    font-size: 32px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  h4 {
    font-size: 16px;
    margin: 0 0 6px 0;
    color: var(--header-text);
  }

  p {
    font-size: 12px;
    margin: 0;
  }
}

// Scrollbar styling
.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(45, 45, 45, 0.8);
  border-radius: 2px;
}

:root[data-theme="light"] .notifications-list::-webkit-scrollbar-thumb {
  background: rgba(229, 231, 235, 0.8);
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: var(--header-text-secondary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 1s linear infinite;
}

// Mobile responsive styles
@media (max-width: 1023px) {
  .app-header {
    &.sidebar-expanded,
    &.sidebar-collapsed {
      left: var(--header-left, 0);
      width: var(--header-width, 100vw);
    }
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 56px;
    
    &.mobile {
     left: var(--header-left, 0);
      width: var(--header-width, 100vw);
    }
  }

  .header-content {
    padding: 0 12px;
    gap: 8px;
  }

  .header-left {
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .header-right {
    gap: 6px;
    flex-shrink: 0;
  }

  .header-btn {
    &.mobile-menu-btn {
      width: 40px;
      height: 40px;
      padding: 8px;
      
      i {
        font-size: 18px;
      }
    }
  }
}

@media (max-width: 480px) {
  .app-header {
    height: 52px;
    
    &.mobile,
    &.sidebar-expanded,
    &.sidebar-collapsed {
      left: var(--header-left, 0);
      width: var(--header-width, 100vw);
    }
  }

  .header-content {
    padding: 0 8px;
    gap: 4px;
  }

  .header-left {
    gap: 4px;
  }

  .header-right {
    gap: 4px;
  }

  .header-btn {
    &.mobile-menu-btn {
      width: 36px;
      height: 36px;
      padding: 6px;
      
      i {
        font-size: 16px;
      }
    }
  }
}

// Touch device optimizations
@media (hover: none) and (pointer: coarse) {
  .header-btn {
    min-height: 44px;
    min-width: 44px;
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.95);
      background: var(--header-hover);
    }
  }
}

// Landscape orientation on mobile
@media (max-width: 768px) and (orientation: landscape) {
  .app-header {
    height: 48px;
  }
}

// High DPI displays
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .header-btn {
    border-width: 1px;
  }
}
</style>
