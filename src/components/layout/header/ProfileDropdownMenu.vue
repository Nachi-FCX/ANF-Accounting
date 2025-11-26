<template>
  <div class="profile-dropdown-container" v-if="isOpen">
    <!-- Backdrop -->
    <div class="profile-backdrop" @click="closeDropdown"></div>
    
    <!-- Dropdown Menu -->
    <div class="profile-dropdown" :class="{ 'open': isOpen }" @click.stop>
      <!-- User Info Header -->
      <div class="dropdown-header">
        <div class="user-info">
          <img
            :src="getAvatarPath(user.avatar)"
            :alt="user.name"
            class="user-avatar"
          />
          <div class="user-details">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
      </div>
      
      <!-- Menu Items -->
      <div class="dropdown-content">
        <div 
          v-for="(item, index) in menuItems" 
          :key="item.id"
          class="dropdown-item"
          :class="{ 'has-divider': item.divider }"
          @click="handleItemClick(item)"
          :title="item.description"
        >
          <div class="item-icon">
            <i :class="item.icon"></i>
          </div>
          <div class="item-content">
            <span class="item-label">{{ item.label }}</span>
            <span v-if="item.description" class="item-description">{{ item.description }}</span>
          </div>
          <div class="item-arrow" v-if="item.action === 'navigate'">
            <i class="pi pi-angle-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Dialog -->
    <FcxConfirmDialog
      :visible="showLogoutDialog"
      title="Confirm Logout"
      message="Are you sure you want to log out of your account? You will need to sign in again to access your dashboard."
      confirm-text="Yes, Log Out"
      cancel-text="Cancel"
      variant="danger"
      icon="pi pi-sign-out"
      @confirm="handleConfirmLogout"
      @cancel="handleCancelLogout"
      @close="handleDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { UserProfile } from '../sidebar/types/sidebar-types'
import { FcxConfirmDialog } from '@/components/customcomponents'
import { useAuthStore } from '@/views/auth/stores/authStore'

// Profile menu item interface
interface ProfileMenuItem {
  id: string
  label: string
  icon: string
  action: 'navigate' | 'function'
  route?: string
  handler?: () => void
  description?: string
  divider?: boolean
}

// Props
interface Props {
  isOpen: boolean
  user: UserProfile
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'close': []
}>()

// Router and Auth Store
const router = useRouter()
const authStore = useAuthStore()

// Dialog state
const showLogoutDialog = ref(false)

// Logout handler function
const handleLogout = () => {
  console.log('handleLogout called')
  // Show confirmation dialog instead of basic confirm()
  // showLogoutDialog.value = true
  handleConfirmLogout()
  
}

// Menu items configuration
const menuItems = computed<ProfileMenuItem[]>(() => [
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'pi pi-user',
    action: 'navigate',
    route: '/profile',
    description: 'View and edit your profile'
  },
  {
    id: 'upgrade',
    label: 'Upgrade Plan',
    icon: 'pi pi-star',
    action: 'navigate',
    route: '/billing',
    description: 'Upgrade to premium features',
    divider: true
  },
  {
    id: 'customize',
    label: 'Customize FinCorpX',
    icon: 'pi pi-palette',
    action: 'navigate',
    route: '/customize',
    description: 'Personalize your experience'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'pi pi-cog',
    action: 'navigate',
    route: '/settings',
    description: 'App preferences and configuration'
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: 'pi pi-question-circle',
    action: 'navigate',
    route: '/help',
    description: 'Get help and support',
    divider: true
  },
  {
    id: 'logout',
    label: 'Log out',
    icon: 'pi pi-sign-out',
    action: 'function',
    handler: () => handleLogout(),
    description: 'Sign out of your account'
  }
])

// Methods
const closeDropdown = () => {
  emit('close')
}

const getAvatarPath = (avatarName: string): string => {
  try {
    return new URL(`../../assets/sidebar/${avatarName}`, import.meta.url).href
  } catch {
    // Fallback to a default avatar or placeholder
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name)}&background=3b82f6&color=fff&size=40`
  }
}

const handleItemClick = (item: ProfileMenuItem) => {
  if (item.action === 'navigate' && item.route) {
    router.push(item.route)
    closeDropdown()
  } else if (item.action === 'function' && item.handler) {
    // Don't close dropdown immediately for function items (like logout)
    // Let the handler decide when to close
    item.handler()
    
    // Only close dropdown if it's not the logout item
    if (item.id !== 'logout') {
      closeDropdown()
    }
  }
}

// Dialog handlers
const handleConfirmLogout = async () => {
  console.log('🚀 handleConfirmLogout called - LOGOUT CONFIRMED!')
  
  try {
    // Close dialog and dropdown first
    showLogoutDialog.value = false
    closeDropdown()
    
    console.log('📊 Auth state before logout:', authStore.isAuthenticated)
    
    // Clear auth data immediately
    console.log('🧹 Clearing auth store...')
    await authStore.signOut()
    
    console.log('📊 Auth state after logout:', authStore.isAuthenticated)
    console.log('🔄 Navigating to signin...')
    
    // Force navigation with replace to prevent back button issues
    await router.replace('/auth/signin')
    
    console.log('✅ Logout completed successfully')
    
  } catch (error) {
    console.error('❌ Logout error:', error)
    
    // Emergency fallback - clear everything manually
    localStorage.clear()
    sessionStorage.clear()
    
    // Force page reload to signin
    window.location.replace('/auth/signin')
  }
}

const handleCancelLogout = () => {
  showLogoutDialog.value = false
  closeDropdown() // Close the dropdown when cancelled
}

const handleDialogClose = () => {
  showLogoutDialog.value = false
}

// Click outside detection
const handleClickOutside = (event: MouseEvent) => {
  if (!props.isOpen) return
  
  const target = event.target as Element
  const dropdown = document.querySelector('.profile-dropdown')
  const profileSection = document.querySelector('.sidebar-profile')
  
  // Don't close if clicking on the dropdown itself or the profile section
  if (dropdown && (dropdown.contains(target) || target === dropdown)) {
    return
  }
  
  if (profileSection && (profileSection.contains(target) || target === profileSection)) {
    return
  }
  
  // Close the dropdown
  closeDropdown()
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeDropdown()
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    // Reset logout dialog state when dropdown closes
    showLogoutDialog.value = false
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style lang="scss" scoped>
// Theme variables - Force white background for ChatGPT style
:root {
  --profile-dropdown-bg: #ffffff;
  --profile-dropdown-border: #e5e7eb;
  --profile-dropdown-text: #1f2937;
  --profile-dropdown-text-secondary: #6b7280;
  --profile-dropdown-hover: #f9fafb;
  --profile-dropdown-shadow: rgba(0, 0, 0, 0.15);
  --profile-dropdown-divider: #e5e7eb;
}

:root[data-theme="light"] {
  --profile-dropdown-bg: #ffffff;
  --profile-dropdown-border: #e5e7eb;
  --profile-dropdown-text: #1f2937;
  --profile-dropdown-text-secondary: #6b7280;
  --profile-dropdown-hover: #f9fafb;
  --profile-dropdown-shadow: rgba(0, 0, 0, 0.15);
  --profile-dropdown-divider: #e5e7eb;
}

:root[data-theme="dark"] {
  // Keep white background even in dark theme for ChatGPT style
  --profile-dropdown-bg: #ffffff;
  --profile-dropdown-border: #e5e7eb;
  --profile-dropdown-text: #1f2937;
  --profile-dropdown-text-secondary: #6b7280;
  --profile-dropdown-hover: #f9fafb;
  --profile-dropdown-shadow: rgba(0, 0, 0, 0.25);
  --profile-dropdown-divider: #e5e7eb;
}

.profile-dropdown-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: auto;
}

.profile-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  cursor: default;
  pointer-events: auto;
}

.profile-dropdown {
  position: absolute;
  bottom: 80px;
  left: 20px;
  width: 280px;
  max-height: 400px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10000;
  pointer-events: auto;

  &.open {
    transform: translateY(0);
    opacity: 1;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.2),
      0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  // RTL support - position dropdown from right side
  [dir="rtl"] & {
    left: auto;
    right: 0px;
  }
}

.dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--profile-dropdown-divider);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--profile-dropdown-border);
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--profile-dropdown-text);
  line-height: 1.3;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: var(--profile-dropdown-text-secondary);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: var(--profile-dropdown-hover);
  }

  &.has-divider {
    border-bottom: 1px solid var(--profile-dropdown-divider);
    margin-bottom: 8px;
    padding-bottom: 20px;
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
}

.item-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 16px;
    color: var(--profile-dropdown-text-secondary);
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--profile-dropdown-text);
  line-height: 1.3;
}

.item-description {
  font-size: 12px;
  color: var(--profile-dropdown-text-secondary);
  line-height: 1.3;
}

.item-arrow {
  width: 16px;
  height: 16px;
  color: var(--profile-dropdown-text-secondary);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.15s ease;

  .dropdown-item:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  i {
    font-size: 12px;
  }
}

// Special styling for logout item
.dropdown-item:last-child {
  .item-icon i {
    color: #ef4444;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.05);

    .item-label {
      color: #ef4444;
    }
  }
}

// Scrollbar styling
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: var(--profile-dropdown-border);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--profile-dropdown-text-secondary);
}

// Mobile responsive
@media (max-width: 768px) {
  .profile-dropdown {
    left: 10px;
    right: 10px;
    width: auto;
    max-width: none;
  }

  .dropdown-item {
    padding: 14px 16px;
  }

  .item-icon {
    margin-right: 10px;
  }
}

// RTL support for item spacing
[dir="rtl"] .item-icon {
  margin-right: 0;
  margin-left: 12px;
}

[dir="rtl"] .item-arrow {
  transform: translateX(4px);

  .dropdown-item:hover & {
    transform: translateX(0);
  }

  i {
    transform: rotate(180deg);
  }
}

@media (max-width: 768px) {
  [dir="rtl"] .item-icon {
    margin-left: 10px;
  }
}
</style>
