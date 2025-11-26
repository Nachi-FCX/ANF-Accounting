import type { Ref, ComputedRef } from 'vue'

// Base menu item interface
export interface MenuItem {
  id: string
  title: string
  icon?: string
  route?: string
  type: 'single' | 'group'
  children?: SubMenuItem[]
  isActive?: boolean
  isExpanded?: boolean
  requiresAuth?: boolean
  requiredRole?: string
  badge?: MenuBadge
  order?: number
}

// Submenu item interface
export interface SubMenuItem {
  id: string
  title: string
  route: string
  isActive?: boolean
  requiresAuth?: boolean
  requiredRole?: string
  badge?: MenuBadge
  order?: number
}

// Badge for menu items
export interface MenuBadge {
  text: string
  type: 'info' | 'warning' | 'error' | 'success'
  count?: number
}

// User profile interface
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  route: string
}

// Sidebar state interface
export interface SidebarState {
  isCollapsed: boolean
  activeMenuItem: string | null
  expandedMenus: string[]
  isVisible: boolean
}

// Menu configuration
export interface MenuConfig {
  topMenuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  userProfile: UserProfile
}

// Sidebar props
export interface SidebarProps {
  collapsed?: boolean
  width?: string
  collapsedWidth?: string
  theme?: 'light' | 'dark'
  position?: 'left' | 'right'
}

// Menu item props
export interface MenuItemProps {
  item: MenuItem
  level?: number
  isCollapsed?: boolean
}

// Submenu props
export interface SubmenuProps {
  items: SubMenuItem[]
  parentId: string
  isExpanded: boolean
  isCollapsed?: boolean
}

// Profile props
export interface ProfileProps {
  user: UserProfile
  isCollapsed?: boolean
}

// Event types
export type MenuClickEvent = {
  item: MenuItem | SubMenuItem
  event: MouseEvent
}

export type MenuToggleEvent = {
  menuId: string
  isExpanded: boolean
}

// Composable return type
export interface UseSidebarReturn {
  // State
  isCollapsed: Ref<boolean>
  activeMenuItem: Ref<string | null>
  expandedMenus: Ref<string[]>
  topMenuItems: ComputedRef<MenuItem[]>
  bottomMenuItems: ComputedRef<MenuItem[]>
  userProfile: ComputedRef<UserProfile>
  
  // Dynamic width properties
  dynamicSidebarWidth: ComputedRef<number>
  dynamicCollapsedWidth: ComputedRef<number>
  screenWidth: Ref<number>
  
  // Actions
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  setActiveMenuItem: (menuId: string) => void
  toggleMenuExpansion: (menuId: string) => void
  navigateToRoute: (route: string) => void
  refreshUserProfile: () => void
  
  // Computed
  isMenuExpanded: (menuId: string) => boolean
  isMenuActive: (menuId: string) => boolean
}
