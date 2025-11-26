<template>
  <Dialog
    :visible="visible"
    :header="header"
    :modal="modal"
    :position="primeVuePosition"
    :draggable="draggable"
    :resizable="resizable"
    :closable="closable"
    :dismissableMask="dismissableMask"
    :closeOnEscape="closeOnEscape"
    :showHeader="showHeader"
    :baseZIndex="baseZIndex"
    :autoZIndex="autoZIndex"
    :ariaCloseLabel="ariaCloseLabel"
    :maximizable="maximizable"
    :breakpoints="breakpoints"
    :style="computedDialogStyle"
    :class="computedDialogClass"
    :contentStyle="contentStyle"
    :contentClass="contentClass"
    :appendTo="appendTo"
    :focusOnShow="focusOnShow"
    :keepInViewport="keepInViewport"
    :blockScroll="blockScroll"
    @update:visible="onVisibilityChange"
    @show="onShow"
    @hide="onHide"
    @after-hide="onAfterHide"
    @maximize="onMaximize"
    @unmaximize="onUnmaximize"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
    @resize-start="onResizeStart"
    @resize-end="onResizeEnd"
    ref="dialogRef"
  >
    <!-- Default slot for content -->
    <template #default>
      <slot></slot>
    </template>

    <!-- Header slot -->
    <template #header v-if="$slots.header">
      <slot name="header" :close="close"></slot>
    </template>

    <!-- Footer slot -->
    <template #footer v-if="$slots.footer || footer">
      <slot name="footer">
        {{ footer }}
      </slot>
    </template>

    <!-- Close icon slot -->
    <template #closeicon v-if="$slots.closeicon">
      <slot name="closeicon"></slot>
    </template>

    <!-- Maximize icon slot -->
    <template #maximizeicon v-if="$slots.maximizeicon">
      <slot name="maximizeicon" :maximized="isMaximized"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import type { 
  FcxDialogProps, 
  FcxDialogEmits, 
  DialogState,
  DialogExpose 
} from './types/dialog-types'

// Props with defaults
const props = withDefaults(defineProps<FcxDialogProps>(), {
  visible: false,
  modal: true,
  position: 'center',
  draggable: false,
  resizable: false,
  rtl: false,
  closable: true,
  dismissableMask: false,
  closeOnEscape: true,
  showHeader: true,
  baseZIndex: 1000,
  autoZIndex: true,
  ariaCloseLabel: 'Close',
  maximizable: false,
  size: 'medium',
  theme: 'default',
  rounded: false,
  shadow: false,
  appendTo: 'body',
  focusOnShow: true,
  keepInViewport: true,
  blockScroll: true
})

// Emits
const emit = defineEmits<FcxDialogEmits>()

// Template refs
const dialogRef = ref<any>()

// State
const isMaximized = ref(false)
const dialogState = ref<DialogState>({
  visible: props.visible,
  maximized: false,
  dragging: false,
  resizing: false,
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 }
})

// Map custom position to PrimeVue position
const primeVuePosition = computed(() => {
  const positionMap: Record<string, string> = {
    'center': 'center',
    'top': 'top',
    'bottom': 'bottom',
    'left': 'left',
    'right': 'right',
    'topleft': 'topleft',
    'topright': 'topright',
    'bottomleft': 'bottomleft',
    'bottomright': 'bottomright'
  }
  return positionMap[props.position] || 'center'
})

// Computed styles for dialog
const computedDialogStyle = computed(() => {
  const styles: Record<string, any> = {
    ...props.style
  }

  // Apply responsive width based on size if no explicit width is provided
  if (!props.width && !isMaximized.value) {
    switch (props.size) {
      case 'small':
      case 's':
        styles.width = '95vw'
        styles.maxWidth = '400px'
        break
      case 'medium':
      case 'm':
        styles.width = '90vw'
        styles.maxWidth = '500px'
        break
      case 'large':
      case 'l':
        styles.width = '95vw'
        styles.maxWidth = '800px'
        break
      case 'xl':
        styles.width = '95vw'
        styles.maxWidth = '1200px'
        break
      case 'fullscreen':
        styles.width = '100vw'
        styles.height = '100vh'
        styles.maxWidth = 'none'
        styles.maxHeight = 'none'
        break
    }
  } else if (props.width && !isMaximized.value) {
    styles.width = props.width
  }

  if (props.height && !isMaximized.value) {
    styles.height = props.height
  }
  if (props.minWidth) {
    styles.minWidth = props.minWidth
  }
  if (props.minHeight) {
    styles.minHeight = props.minHeight
  }
  if (props.maxWidth && !isMaximized.value) {
    styles.maxWidth = props.maxWidth
  }
  if (props.maxHeight && !isMaximized.value) {
    styles.maxHeight = props.maxHeight
  }

  return styles
})

// Computed classes for dialog
const computedDialogClass = computed(() => [
  'fcx-dialog',
  `fcx-dialog--${props.size}`,
  `fcx-dialog--${props.theme}`,
  {
    'fcx-dialog--rounded': props.rounded,
    'fcx-dialog--shadow': props.shadow,
    'fcx-dialog--maximized': isMaximized.value
  },
  props.class
])

// Event handlers
const onVisibilityChange = (visible: boolean) => {
  emit('update:visible', visible)
}

const onShow = () => {
  dialogState.value.visible = true
  emit('show')
}

const onHide = () => {
  dialogState.value.visible = false
  emit('hide')
}

const onAfterHide = () => {
  emit('after-hide')
}

const onMaximize = (event: Event) => {
  isMaximized.value = true
  dialogState.value.maximized = true
  emit('maximize', { originalEvent: event, maximized: true })
}

const onUnmaximize = (event: Event) => {
  isMaximized.value = false
  dialogState.value.maximized = false
  emit('unmaximize', { originalEvent: event, maximized: false })
}

const onDragStart = (event: DragEvent) => {
  dialogState.value.dragging = true
  emit('drag-start', event)
}

const onDragEnd = (event: DragEvent) => {
  dialogState.value.dragging = false
  emit('drag-end', event)
}

const onResizeStart = (event: MouseEvent) => {
  dialogState.value.resizing = true
  emit('resize-start', event)
}

const onResizeEnd = (event: MouseEvent) => {
  dialogState.value.resizing = false
  emit('resize-end', event)
}

// Methods
const show = () => {
  emit('update:visible', true)
}

const hide = () => {
  emit('update:visible', false)
  emit('hide')
}

const close = () => {
  hide()
}

const toggle = () => {
  if (props.visible) {
    hide()
  } else {
    show()
  }
}

const maximize = () => {
  if (!isMaximized.value && dialogRef.value) {
    dialogRef.value.maximize()
  }
}

const unmaximize = () => {
  if (isMaximized.value && dialogRef.value) {
    dialogRef.value.unmaximize()
  }
}

const focus = () => {
  if (dialogRef.value) {
    dialogRef.value.focus()
  }
}

const getElement = (): HTMLDivElement | null => {
  return dialogRef.value?.$el || null
}

const getState = (): DialogState => {
  return dialogState.value
}

// Expose methods
const expose: DialogExpose = {
  show,
  hide,
  toggle,
  maximize,
  unmaximize,
  getElement,
  getState,
  focus
}

defineExpose(expose)
</script>

<style lang="scss" scoped>
@use './styles/fcx-dialog.scss';
</style>
