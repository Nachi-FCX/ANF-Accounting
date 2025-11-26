<template>
  <div class="layout-container">
    <!-- Overlay for mobile when sidebar is open -->
    <div v-if="isMobile && isSidebarOpen" 
         class="fixed inset-0 bg-black bg-opacity-50 z-20"
         @click="closeSidebar">
    </div>
<!-- {{ localIsCollapsed }} -->
    <!-- Sidebar -->
    <div class="sidebar-container">
      <Sidebar 
        ref="sidebar" 
        :is-mobile-open="isSidebarOpen"
        @sidebar-collapsed="handleSidebarCollapsed"
        @close="closeSidebar"
      />
    </div>

    <!-- Header - Full width, positioned based on sidebar state -->
    <Header 
      :is-sidebar-open="isSidebarOpen" 
      :is-collapsed="localIsCollapsed"
      :is-mobile="isMobile"
      @toggle-sidebar="toggleSidebar" 
    />

    <!-- Main Content Area -->
     <!-- {{ mainContainerClasses }} -->
    <main :class="mainContainerClasses" :style="mainContainerStyles">
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '../layout/sidebar/composables/useSidebar.ts'
import { useI18n } from '@/composables/useI18n'
import Header from '../layout/header/Header.vue'
import Sidebar from '../layout/sidebar/Sidebar.vue'

const route = useRoute()
const { isCollapsed, toggleSidebar: sidebarToggle } = useSidebar()
const { isCurrentRTL } = useI18n()

const sidebar = ref()
const isMobile = ref(window.innerWidth < 768)
const isSidebarOpen = ref(!isMobile.value && !isCollapsed.value)
// Local isCollapsed state to receive emitted value
const localIsCollapsed = ref(isCollapsed.value)

// Dynamic screen-based calculations
const screenWidth = ref(window.innerWidth)

// Update screen width on resize
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

// Computed for dynamic sidebar width based on screen size
const dynamicSidebarWidth = computed(() => {
  const width = screenWidth.value
  
  // Enhanced fluid calculation with better scaling
  if (width >= 1024) {
    const baseWidth = 250
    const baseScreen = 1280
    const scaleFactor = 40 // Increased variation for better scaling
    const screenRange = 896 // Extended range from 1024 to 1920
    
    // Calculate proportional width with smoother scaling
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 230px and 300px for better range
    return Math.max(230, Math.min(300, Math.round(calculatedWidth)))
  }
  
  return 250 // Default for smaller screens
})

// Computed for dynamic collapsed width based on screen size
const dynamicCollapsedWidth = computed(() => {
  const width = screenWidth.value
  
  if (width >= 1024) {
    const baseWidth = 64
    const baseScreen = 1280
    const scaleFactor = 24 // Increased variation for better scaling
    const screenRange = 896 // Extended range from 1024 to 1920
    
    const calculatedWidth = baseWidth + (scaleFactor * (width - baseScreen) / screenRange)
    
    // Clamp between 52px and 88px for better range
    return Math.max(52, Math.min(88, Math.round(calculatedWidth)))
  }
  
  return 64 // Default for smaller screens
})

// Computed for main container positioning with dynamic calculations
const mainContainerLeftMargin = computed(() => {
  if (isMobile.value) {
    return '0px'
  }
  
  if (isSidebarOpen.value && !localIsCollapsed.value) {
    return `${dynamicSidebarWidth.value}px`
  } else {
    return `${dynamicCollapsedWidth.value}px`
  }
})

// Computed for main container width with dynamic calculations
const mainContainerWidth = computed(() => {
  if (isMobile.value) {
    return '100vw'
  }
  
  if (isSidebarOpen.value && !localIsCollapsed.value) {
    return `calc(100vw - ${dynamicSidebarWidth.value}px)`
  } else {
    return `calc(100vw - ${dynamicCollapsedWidth.value}px)`
  }
})

// CSS custom properties for dynamic values
const mainContainerStyles = computed(() => ({
  '--dynamic-sidebar-width': `${dynamicSidebarWidth.value}px`,
  '--dynamic-collapsed-width': `${dynamicCollapsedWidth.value}px`,
  '--main-left': mainContainerLeftMargin.value,
  '--main-width': mainContainerWidth.value
}))

// Computed property for main container classes
const mainContainerClasses = computed(() => {
  const classes = ['main-container', 'transition-all', 'duration-300', 'ease-in-out']
  
  if (isMobile.value) {
    classes.push('mobile')
  } else if (isSidebarOpen.value && !localIsCollapsed.value) {
    classes.push('sidebar-expanded')
  } else {
    classes.push('sidebar-collapsed')
  }
  
  return classes
})

const toggleSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value
  } else {
    sidebarToggle()
    isSidebarOpen.value = !isCollapsed.value
  }
  sidebar.value?.toggleSidebar?.()
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    if (!isCollapsed.value) {
      sidebarToggle()
    }
  }
  sidebar.value?.closeSidebar?.()
}

const handleSidebarCollapsed = (collapsedValue: boolean) => {
  localIsCollapsed.value = collapsedValue
  console.log('Sidebar collapsed state received:', collapsedValue)
}

const handleResize = () => {
  updateScreenWidth()
  const newIsMobile = window.innerWidth < 768
  isMobile.value = newIsMobile

  // Auto-expand sidebar on desktop, collapse on mobile
  if (!newIsMobile && !isSidebarOpen.value && isCollapsed.value) {
    isSidebarOpen.value = true
  } else if (newIsMobile && isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
}

// Watch for sidebar collapse state changes
watch(() => isCollapsed.value, (newCollapsed) => {
  if (!isMobile.value) {
    isSidebarOpen.value = !newCollapsed
  }
})

// Watch for route changes to scroll main content to top
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      // Find the main_content div and scroll it to top
      const mainContent = document.querySelector('.main-content')
      if (mainContent) {
        mainContent.scrollTop = 0
      }
    })
  }
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  // Initialize sidebar state
  isSidebarOpen.value = !isMobile.value && !isCollapsed.value
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<script lang="ts">
export default {
  name: 'fcxLayout'
}
</script>

<style scoped>
/* Layout Container */
.layout-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
}

/* Sidebar Container */
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
}

/* RTL Sidebar Container */
:root[dir="rtl"] .sidebar-container {
  left: auto;
  right: 0;
}

/* Main Container */
.main-container {
  position: fixed;
  top: 0;
  padding-top: 60px;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;

  &.mobile {
    left: 0;
    width: 100vw;
  }

  &.sidebar-expanded {
    left: var(--main-left);
    width: var(--main-width);
    
    /* RTL support - position from right side */
    [dir="rtl"] & {
      left: auto;
      right: var(--main-left);
    }
  }

  &.sidebar-collapsed {
    left: var(--main-left);
    width: var(--main-width);
    
    /* RTL support - position from right side */
    [dir="rtl"] & {
      left: auto;
      right: var(--main-left);
    }
  }
}

.main-content {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: auto;
  padding: 0;
  background: var(--main-bg);
  color: var(--main-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Transition utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Handle mobile overflow */
@media (max-width: 768px) {
  .main-container {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .main-content {
    padding: 1rem;
  }
}


/* Utility classes */
.fixed {
  position: fixed;
}

.h-full {
  height: 100%;
}

.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.z-20 {
  z-index: 20;
}

.z-30 {
  z-index: 30;
}

.bg-black {
  background-color: rgb(0 0 0);
}

.bg-opacity-50 {
  background-color: rgb(0 0 0 / 0.5);
}

.translate-x-0 {
  transform: translateX(0px);
}

.-translate-x-full {
  transform: translateX(-100%);
}

/* RTL Mobile transforms */
:root[dir="rtl"] .-translate-x-full {
  transform: translateX(100%);
}
</style>
