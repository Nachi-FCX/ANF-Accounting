<template>
  <div class="header-company-dropdown" ref="dropdownRef">
    <!-- Company Creation Dialog -->
    <CompanyCreation 
      v-model:visible="showCompanyDialog"
      @company-added="handleCompanyAdded"
      @close="showCompanyDialog = false"
    />
    <!-- Trigger Button -->
    <button
      class="company-trigger"
      :class="{ 'active': isOpen }"
      @click="toggleDropdown"
      @keydown.escape="closeDropdown"
      @keydown.arrow-down.prevent="openDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      :aria-label="`Current company: ${currentcompany.label}. Click to change company.`"
    >
      <div class="company-info">
        <div class="company-icon">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <span class="company-label">{{ currentcompany.label }}</span>
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
        class="company-menu"
        role="menu"
        :aria-label="'company selection menu'"
      >
        <!-- Backdrop for mobile -->
        <div class="menu-backdrop" @click="closeDropdown"></div>
        
        <!-- Menu Panel -->
        <div class="menu-panel">
          <!-- Menu Header -->
          <div class="menu-header">
            <h3 class="menu-title">Select company</h3>
            <button
              class="plus-icon-btn"
              @click="handleAddcompany"
              @keydown.escape="closeDropdown"
              title="Add new company"
              :aria-label="'Add new company'"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>

          <!-- Menu Items or Empty State -->
          <div v-if="companys.length > 0" class="menu-items" role="none">
            <button
              v-for="(company, index) in companys"
              :key="company.value"
              class="menu-item"
              :class="{ 
                'selected': company.value === currentcompany.value,
                'focused': focusedIndex === index 
              }"
              role="menuitem"
              @click="selectcompany(company)"
              @keydown.escape="closeDropdown"
              @keydown.arrow-down.prevent="focusNext"
              @keydown.arrow-up.prevent="focusPrevious"
              @keydown.enter.prevent="selectcompany(company)"
              @keydown.space.prevent="selectcompany(company)"
              :aria-selected="company.value === currentcompany.value"
              :tabindex="focusedIndex === index ? 0 : -1"
            >
              <div class="item-icon">
                <svg 
                  v-if="company.value === currentcompany.value" 
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
              
              <div class="item-content">
                <div class="item-title">{{ company.label }}</div>
                <div class="item-description">{{ company.description }}</div>
              </div>
              
              <div v-if="company.badge" class="item-badge">
                {{ company.badge }}
              </div>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state" role="none">
            <div class="empty-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h4 class="empty-title">Select Companies Available</h4>
            <p class="empty-description">Get started by adding your first company to the system.</p>
            <button 
              class="add-company-btn"
              @click="handleAddCompany"
              @keydown.escape="closeDropdown"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Company
            </button>
          </div>

          <!-- Menu Footer (optional) -->
          <div v-if="showFooter" class="menu-footer">
            <button class="footer-link" @click="handleMorecompanys">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              More companys
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import CompanyCreation from '@/views/masters/companymasters/views/CompanyCreation.vue'
import type { CompanyData } from '@/views/masters/companymasters/types/company-types'

// Types
interface companyOption {
  label: string
  value: string
  description: string
  badge?: string
}

// Props
interface Props {
  companys?: companyOption[]
  modelValue?: string
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  companys: () => [
  //   {
  //     label: 'FINCORP 4.1',
  //     value: '4.1',
  //     description: 'Latest stable company',
  //     badge: 'Current'
  //   },
  //   {
  //     label: 'FINCORP 4.0',
  //     value: '4.0',
  //     description: 'Previous stable release'
  //   },
  //   {
  //     label: 'FINCORP 3.9',
  //     value: '3.9',
  //     description: 'Legacy support company'
  //   },
  //   {
  //     label: 'FINCORP Beta',
  //     value: 'beta',
  //     description: 'Latest features and improvements',
  //     badge: 'Beta'
  //   }
  ],
  modelValue: '4.1',
  showFooter: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [company: companyOption]
  'more-companys': []
  'add-company': []
  // 'add-company': []
}>()

// Reactive state
const isOpen = ref(false)
const focusedIndex = ref(0)
const dropdownRef = ref<HTMLElement>()
const showCompanyDialog = ref(false)

// Computed
const currentcompany = computed(() => {
  if (props.companys.length === 0) {
    return {
      label: 'Select Companies',
      value: '',
      description: 'No companies available'
    }
  }
  return props.companys.find(v => v.value === props.modelValue) || props.companys[0]
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
  focusedIndex.value = props.companys.findIndex(v => v.value === props.modelValue)
  
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

const selectcompany = (company: companyOption) => {
  emit('update:modelValue', company.value)
  emit('change', company)
  closeDropdown()
}

const focusNext = () => {
  focusedIndex.value = (focusedIndex.value + 1) % props.companys.length
  const menuItems = dropdownRef.value?.querySelectorAll('.menu-item')
  if (menuItems && menuItems[focusedIndex.value]) {
    (menuItems[focusedIndex.value] as HTMLElement).focus()
  }
}

const focusPrevious = () => {
  focusedIndex.value = focusedIndex.value === 0 
    ? props.companys.length - 1 
    : focusedIndex.value - 1
  const menuItems = dropdownRef.value?.querySelectorAll('.menu-item')
  if (menuItems && menuItems[focusedIndex.value]) {
    (menuItems[focusedIndex.value] as HTMLElement).focus()
  }
}

const handleMorecompanys = () => {
  emit('more-companys')
  closeDropdown()
}

const handleAddcompany = () => {
  showCompanyDialog.value = true
  closeDropdown()
}

const handleAddCompany = () => {
  showCompanyDialog.value = true
  closeDropdown()
}

const handleCompanyAdded = (company: CompanyData) => {
  // Handle successful company addition
  console.log('Company added successfully:', company)
  // You can emit an event or update the companies list here
  // For now, we'll just log it
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

.header-company-dropdown {
  position: relative;
  display: flex;
  align-items: center;
}

.company-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.plus-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: 1px solid var(--header-border);
  border-radius: 6px;
  color: var(--header-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--header-hover);
    color: var(--header-text);
    border-color: var(--header-text-secondary);
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    background: var(--header-hover);
    color: var(--header-text);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    flex-shrink: 0;
  }
}

.company-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--header-text);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 500;
  min-height: 36px;

  &:hover {
    background: var(--header-hover);
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

.company-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--header-text-secondary);
}

.company-label {
  font-weight: 600;
  white-space: nowrap;
}

.dropdown-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  color: var(--header-text-secondary);

  &.rotated {
    transform: rotate(180deg);
  }
}

.company-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
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
  width: 320px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--header-border);
}

.menu-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--header-text);
}

.menu-header .plus-icon-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(59, 130, 246, 0.1);
    border-color: #2563eb;
    color: #2563eb;
  }
}

.menu-items {
  padding: 8px 0;
  max-height: 300px;
  overflow-y: auto;
  @include custom-scrollbar;
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

.item-badge {
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.menu-footer {
  padding: 8px 20px 16px;
  border-top: 1px solid var(--header-border);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 0;
  background: none;
  border: none;
  color: var(--header-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: var(--header-text);
  }

  &:focus {
    outline: none;
    color: var(--header-text);
  }
}

// Empty state styles
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--header-hover);
  border-radius: 50%;
  color: var(--header-text-secondary);
  opacity: 0.7;
}

.empty-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--header-text);
  line-height: 1.3;
}

.empty-description {
  margin: 0;
  font-size: 13px;
  color: var(--header-text-secondary);
  line-height: 1.4;
  max-width: 240px;
}

.add-company-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 40px;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:focus {
    outline: none;
    background: #2563eb;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  svg {
    flex-shrink: 0;
  }
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
  .company-menu {
    padding-top: 60px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .menu-panel {
    width: 100%;
    max-width: calc(100vw - 24px);
  }

  .company-trigger {
    padding: 4px 8px;
    min-height: 32px;
    font-size: 13px;
  }

  .company-label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  .company-trigger {
    gap: 6px;
    padding: 4px 6px;
  }

  .company-icon {
    width: 16px;
    height: 16px;
  }

  .company-label {
    max-width: 100px;
    font-size: 12px;
  }
}
</style>
