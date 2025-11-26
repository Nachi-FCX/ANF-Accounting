import { ref, computed, watch, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { 
  MenuItem, 
  UserProfile,
  MenuConfig,
  UseSidebarReturn 
} from '../types/sidebar-types'
import type { User } from '@/views/auth/types/auth-types'
import { STORAGE_KEYS } from '@/views/auth/constants/auth-constants'
import menuData from '../data/menu-data.json'

export function useSidebar(): UseSidebarReturn {
  // Get current instance to access emit
  const instance = getCurrentInstance()
  const emit = instance?.emit
  
  // State
  const isCollapsed = ref<boolean>(false)
  const activeMenuItem = ref<string | null>(null)
  const expandedMenus = ref<string[]>([])
  
  // Screen width tracking for responsive behavior
  const screenWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)
  
  // Reactive trigger for user profile updates
  const userDataTrigger = ref<number>(0)
  
  // Router
  const route = useRoute()
  const router = useRouter()
  
  // Menu data
  const menuConfig = menuData as MenuConfig
  
  // Computed
  const topMenuItems = computed<MenuItem[]>(() => 
    menuConfig.topMenuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  )
  
  const bottomMenuItems = computed<MenuItem[]>(() => 
    menuConfig.bottomMenuItems.sort((a, b) => (a.order || 0) - (b.order || 0))
  )
  
  // Dynamic user profile from localStorage
  const userProfile = computed<UserProfile>(() => {
    // Use the trigger to make this reactive to manual updates
    userDataTrigger.value
    
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      
      if (userData) {
        const user: User = JSON.parse(userData)
        
        // Transform API user data to sidebar UserProfile format
        return {
          id: 'profile',
          name: `${user.firstName} ${user.lastName}`.trim() || user.email.split('@')[0],
          email: user.email,
          avatar: 'profile-avatar.jpg', // Default avatar
          route: '/profile'
        }
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
    }
    
    // Fallback user profile if no data in localStorage
    return {
      id: 'profile',
      name: 'Guest User',
      email: 'guest@fincorpx.com',
      avatar: 'profile-avatar.jpg',
      route: '/profile'
    }
  })
  
  // Dynamic sidebar width computation for responsive behavior
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

  // Computed for dynamic collapsed width based on screen size
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
  
  // Actions
  const toggleSidebar = (): void => {
    isCollapsed.value = !isCollapsed.value
    // Store in localStorage for persistence
    localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString())
  }
  
  const collapseSidebar = (): void => {
    isCollapsed.value = true
    localStorage.setItem('sidebar-collapsed', 'true')
  }
  
  const expandSidebar = (): void => {
    isCollapsed.value = false
    localStorage.setItem('sidebar-collapsed', 'false')
  }
  
  const setActiveMenuItem = (menuId: string): void => {
    activeMenuItem.value = menuId
  }
  
  const toggleMenuExpansion = (menuId: string): void => {
    const index = expandedMenus.value.indexOf(menuId)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    } else {
      expandedMenus.value.push(menuId)
    }
  }
  
  const navigateToRoute = (routePath: string): void => {
    if (routePath && routePath !== route.path) {
      router.push(routePath)
    }
  }
  
  // Refresh user profile data from localStorage
  const refreshUserProfile = (): void => {
    userDataTrigger.value++
  }
  
  // Computed helpers
  const isMenuExpanded = (menuId: string): boolean => {
    return expandedMenus.value.includes(menuId)
  }
  
  const isMenuActive = (menuId: string): boolean => {
    return activeMenuItem.value === menuId
  }
  
  // Initialize from localStorage
  const initializeSidebar = (): void => {
    // const savedState = localStorage.getItem('sidebar-collapsed')
    // if (savedState !== null) {
      isCollapsed.value = false
      // savedState === 'true'
    // }
    
    // Set active menu based on current route
    updateActiveMenuFromRoute()
  }
  
  // Update active menu based on current route
  const updateActiveMenuFromRoute = (): void => {
    const currentPath = route.path
    
    // Check top menu items
    const topItem = topMenuItems.value.find(item => item.route === currentPath)
    if (topItem) {
      setActiveMenuItem(topItem.id)
      return
    }
    
    // Check bottom menu items
    const bottomItem = bottomMenuItems.value.find(item => item.route === currentPath)
    if (bottomItem) {
      setActiveMenuItem(bottomItem.id)
      return
    }
    
    // Check if it's profile route
    if (currentPath === userProfile.value.route) {
      setActiveMenuItem(userProfile.value.id)
    }
  }
  
  // Watch route changes
  watch(() => route.path, () => {
    updateActiveMenuFromRoute()
  })
  
  // Window resize handler for responsive behavior
  const handleResize = (): void => {
    screenWidth.value = window.innerWidth
  }
  
  // Setup resize listener
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      // Update initial screen width
      screenWidth.value = window.innerWidth
    }
  })
  
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })
  
  // Watch isCollapsed changes and emit the value
  watch(() => isCollapsed.value, (newValue) => {
    if (emit) {
      emit('sidebar-collapsed', newValue)
    }
  }, { immediate: true })
  
  // Initialize on mount
  initializeSidebar()
  
  return {
    // State
    isCollapsed,
    activeMenuItem,
    expandedMenus,
    topMenuItems,
    bottomMenuItems,
    userProfile,
    
    // Dynamic width properties
    dynamicSidebarWidth,
    dynamicCollapsedWidth,
    screenWidth,
    
    // Actions
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    setActiveMenuItem,
    toggleMenuExpansion,
    navigateToRoute,
    refreshUserProfile,
    
    // Computed
    isMenuExpanded,
    isMenuActive
  }
}
