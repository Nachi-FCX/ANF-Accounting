<template>
  <div class="dropdown-container" v-if="isOpen">
    <!-- Backdrop -->
    <div class="dropdown-backdrop" @click="closeDropdown"></div>
    
    <!-- Dropdown Menu -->
    <div class="dropdown-menu" :class="{ 'open': isOpen }">
      <div class="dropdown-header">
        <h3 class="dropdown-title">Create new</h3>
      </div>
      
      <div class="dropdown-content">
        <div 
          v-for="item in menuItems" 
          :key="item.id"
          class="dropdown-item"
          @click="handleItemClick(item)"
          :title="item.description"
        >
          <div class="item-icon">
            <i 
              v-if="item.icon.startsWith('pi ')"
              :class="item.icon"
              class="prime-icon"
            ></i>
            <img 
              v-else-if="item.icon.endsWith('.jpg') || item.icon.endsWith('.png')" 
              :src="getIconPath(item.icon)" 
              :alt="item.title"
              class="icon-image"
            />
            <img 
              v-else
              :src="getIconPath(item.icon)" 
              :alt="item.title"
              class="icon-svg"
            />
          </div>
          <div class="item-content">
            <span class="item-title">{{ item.title }}</span>
            <span v-if="item.description" class="item-description">{{ item.description }}</span>
          </div>
          <div class="item-arrow">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6v12z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import headerMenuData from '../sidebar/data/header-menu-data.json'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'close': []
}>()

// Router
const router = useRouter()

// Computed
const menuItems = computed(() => {
  return headerMenuData.headerMenuItems.sort((a, b) => a.order - b.order)
})

// Methods
const closeDropdown = () => {
  emit('close')
}

const handleItemClick = (item: any) => {
  router.push(item.route)
  closeDropdown()
}

const getIconPath = (iconName: string) => {
  if (iconName.endsWith('.jpg') || iconName.endsWith('.png')) {
    return new URL(`../../assets/sidebar/${iconName}`, import.meta.url).href
  }
  return new URL(`../../assets/sidebar/${iconName}`, import.meta.url).href
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
// Theme variables
:root {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e5e7eb;
  --dropdown-text: #1f2937;
  --dropdown-text-secondary: #6b7280;
  --dropdown-hover: #f9fafb;
  --dropdown-shadow: rgba(0, 0, 0, 0.15);
}

:root[data-theme="light"] {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e5e7eb;
  --dropdown-text: #1f2937;
  --dropdown-text-secondary: #6b7280;
  --dropdown-hover: #f9fafb;
  --dropdown-shadow: rgba(0, 0, 0, 0.15);
}

:root[data-theme="dark"] {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e5e7eb;
  --dropdown-text: #1f2937;
  --dropdown-text-secondary: #6b7280;
  --dropdown-hover: #f9fafb;
  --dropdown-shadow: rgba(0, 0, 0, 0.25);
}

.dropdown-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.dropdown-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.dropdown-menu {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10000;

  &.open {
    transform: translateY(0);
    opacity: 1;
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  // RTL support - position dropdown from left side
  [dir="rtl"] & {
    right: auto;
    left: 20px;
  }
}

.dropdown-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--dropdown-border);
}

.dropdown-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--dropdown-text);
}

.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid transparent;

  &:hover {
    background: var(--dropdown-hover);
    border-bottom-color: var(--dropdown-border);
  }

  &:last-child {
    border-bottom: none;
  }
}

.item-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--dropdown-hover);
  flex-shrink: 0;

  .prime-icon {
    font-size: var(--header-menu-icon-size);
    color: var(--dropdown-text);
  }

  .icon-image,
  .icon-svg {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 4px;
  }

  .icon-image {
    border-radius: 50%;
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: var(--header-menu-text-size);
  font-weight: var(--header-menu-text-weight);
  color: var(--dropdown-text);
  line-height: 1.2;
}

.item-description {
  font-size: var(--header-notification-text-size);
  color: var(--dropdown-text-secondary);
  line-height: 1.2;
}

.item-route {
  font-size: 12px;
  color: var(--dropdown-text-secondary);
  line-height: 1.2;
}

.item-arrow {
  width: 16px;
  height: 16px;
  color: var(--dropdown-text-secondary);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.15s ease;

  .dropdown-item:hover & {
    opacity: 1;
    transform: translateX(0);
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
  background: var(--dropdown-border);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--dropdown-text-secondary);
}

// Mobile responsive
@media (max-width: 768px) {
  .dropdown-menu {
    right: 10px;
    width: calc(100vw - 20px);
    max-width: 300px;
  }

  .dropdown-item {
    padding: 10px 16px;
  }

  .item-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;

    .icon-image,
    .icon-svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
