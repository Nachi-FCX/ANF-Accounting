<template>
  <router-link
    v-if="item.route"
    :to="item.route"
    class="menu-item"
    :class="{ active: isActive }"
    :data-tooltip="isCollapsed ? item.title : ''"
    @click="handleClick"
  >
    <div class="menu-icon" v-if="item.icon">
      <img :src="getIconPath(item.icon)" :alt="item.title" />
    </div>
    <span class="menu-text" v-show="!isCollapsed">{{ item.title }}</span>
  </router-link>
  
  <div
    v-else
    class="menu-item"
    :class="{ active: isActive }"
    :data-tooltip="isCollapsed ? item.title : ''"
    @click="handleClick"
  >
    <div class="menu-icon" v-if="item.icon">
      <img :src="getIconPath(item.icon)" :alt="item.title" />
    </div>
    <span class="menu-text" v-show="!isCollapsed">{{ item.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem, MenuItemProps } from './types/sidebar-types'

// Props
const props = withDefaults(defineProps<MenuItemProps>(), {
  level: 0,
  isCollapsed: false
})

// Emits
const emit = defineEmits<{
  click: [item: MenuItem, event: MouseEvent]
}>()

// Composables
const route = useRoute()

// Computed
const isActive = computed(() => {
  return route.path === props.item.route
})

// Methods
const getIconPath = (iconName: string): string => {
  return new URL(`../../../assets/img/sidebar/${iconName}`, import.meta.url).href
}

const handleClick = (event: MouseEvent): void => {
  emit('click', props.item, event)
}
</script>

<style lang="scss" scoped>
// All styling is now handled in sidebar.scss for consistency
// This component uses the centralized theme-aware styling system
</style>
