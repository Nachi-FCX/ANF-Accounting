import type { Component } from 'vue'

// Dialog position options
export type DialogPosition = 
  | 'center' 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'topleft' 
  | 'topright' 
  | 'bottomleft' 
  | 'bottomright'

// Dialog size variants
export type DialogSize = 'small' | 'medium' | 'large' | 'fullscreen' | 's' | 'm' | 'l' | 'xl'

// Dialog theme variants
export type DialogTheme = 'default' | 'minimal' | 'bordered'

// Main dialog props interface
export interface FcxDialogProps {
  /** Whether the dialog is visible */
  visible: boolean
  /** Dialog header text */
  header?: string
  /** Dialog footer text */
  footer?: string
  /** Whether dialog is modal */
  modal?: boolean
  /** Dialog position */
  position?: DialogPosition
  /** Whether dialog is draggable */
  draggable?: boolean
  /** Whether dialog is resizable */
  resizable?: boolean
  /** Content style object */
  contentStyle?: Record<string, any>
  /** Content CSS class */
  contentClass?: string
  /** RTL support */
  rtl?: boolean
  /** Whether close button is shown */
  closable?: boolean
  /** Whether clicking mask dismisses dialog */
  dismissableMask?: boolean
  /** Whether escape key closes dialog */
  closeOnEscape?: boolean
  /** Whether header is shown */
  showHeader?: boolean
  /** Base z-index value */
  baseZIndex?: number
  /** Auto z-index management */
  autoZIndex?: boolean
  /** ARIA label for close button */
  ariaCloseLabel?: string
  /** Whether dialog is maximizable */
  maximizable?: boolean
  /** Responsive breakpoints */
  breakpoints?: Record<string, string>
  /** Dialog size variant */
  size?: DialogSize
  /** Dialog theme */
  theme?: DialogTheme
  /** Whether dialog has rounded corners */
  rounded?: boolean
  /** Whether dialog has shadow */
  shadow?: boolean
  /** Dialog width */
  width?: string
  /** Dialog height */
  height?: string
  /** Dialog minimum width */
  minWidth?: string
  /** Dialog minimum height */
  minHeight?: string
  /** Dialog maximum width */
  maxWidth?: string
  /** Dialog maximum height */
  maxHeight?: string
  /** Custom CSS class */
  class?: string
  /** Custom inline styles */
  style?: Record<string, any>
  /** Whether to append to body */
  appendTo?: string | HTMLElement
  /** Focus on show */
  focusOnShow?: boolean
  /** Keep in viewport */
  keepInViewport?: boolean
  /** Block scroll */
  blockScroll?: boolean
}

// Dialog events interface
export interface FcxDialogEmits {
  /** Emitted when dialog visibility changes */
  'update:visible': [visible: boolean]
  /** Emitted when dialog is shown */
  show: []
  /** Emitted when dialog is hidden */
  hide: []
  /** Emitted after dialog is shown */
  'after-show': []
  /** Emitted after dialog is hidden */
  'after-hide': []
  /** Emitted when dialog is maximized */
  maximize: [event: { originalEvent: Event; maximized: boolean }]
  /** Emitted when dialog is unmaximized */
  unmaximize: [event: { originalEvent: Event; maximized: boolean }]
  /** Emitted when drag starts */
  'drag-start': [event: DragEvent]
  /** Emitted when dragging */
  'drag-end': [event: DragEvent]
  /** Emitted when resize starts */
  'resize-start': [event: MouseEvent]
  /** Emitted when resizing */
  'resize-end': [event: MouseEvent]
}

// Dialog slot types
export interface FcxDialogSlots {
  /** Default slot for dialog content */
  default: () => any
  /** Header slot */
  header: () => any
  /** Footer slot */
  footer: () => any
  /** Close icon slot */
  closeicon: () => any
  /** Maximize icon slot */
  maximizeicon: () => any
}

// Dialog state interface
export interface DialogState {
  /** Whether dialog is visible */
  visible: boolean
  /** Whether dialog is maximized */
  maximized: boolean
  /** Whether dialog is being dragged */
  dragging: boolean
  /** Whether dialog is being resized */
  resizing: boolean
  /** Dialog position */
  position: { x: number; y: number }
  /** Dialog size */
  size: { width: number; height: number }
  /** Original position before drag */
  originalPosition?: { x: number; y: number }
  /** Original size before resize */
  originalSize?: { width: number; height: number }
}

// Dialog configuration for different sizes
export interface DialogSizeConfig {
  width: string
  height?: string
  maxWidth: string
  maxHeight: string
}

// Dialog theme configuration
export interface DialogThemeConfig {
  background: string
  border: string
  borderRadius: string
  shadow: string
  headerBackground: string
  headerBorder: string
  footerBackground: string
  footerBorder: string
}

// Dialog responsive configuration
export interface DialogResponsiveConfig {
  breakpoint: string
  width: string
  height?: string
  position?: DialogPosition
}

// Dialog accessibility configuration
export interface DialogA11yConfig {
  role: string
  ariaModal: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  focusTrap: boolean
  restoreFocus: boolean
  initialFocus?: string
}

// Dialog animation configuration
export interface DialogAnimationConfig {
  showAnimation: string
  hideAnimation: string
  duration: number
  easing: string
}

// Complete dialog configuration
export interface DialogConfig extends FcxDialogProps {
  sizeConfig?: Record<DialogSize, DialogSizeConfig>
  themeConfig?: Record<DialogTheme, DialogThemeConfig>
  responsiveConfig?: DialogResponsiveConfig[]
  a11yConfig?: DialogA11yConfig
  animationConfig?: DialogAnimationConfig
}

// Dialog utility types
export type DialogElement = HTMLDivElement
export type DialogRef = DialogElement | null

// Dialog expose interface
export interface DialogExpose {
  /** Show the dialog */
  show: () => void
  /** Hide the dialog */
  hide: () => void
  /** Toggle dialog visibility */
  toggle: () => void
  /** Maximize the dialog */
  maximize: () => void
  /** Unmaximize the dialog */
  unmaximize: () => void
  /** Get dialog element */
  getElement: () => DialogElement | null
  /** Get dialog state */
  getState: () => DialogState
  /** Focus dialog */
  focus: () => void
}

// Confirmation dialog variant types
export type ConfirmationVariant = 'info' | 'warning' | 'danger' | 'success'

// Confirmation dialog props interface
export interface FcxConfirmationDialogProps {
  /** Whether the confirmation dialog is visible */
  visible: boolean
  /** Dialog title */
  title?: string
  /** Dialog message/content */
  message: string
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Confirmation variant for styling */
  variant?: ConfirmationVariant
  /** Icon to display */
  icon?: string
  /** Whether to show icon */
  showIcon?: boolean
  /** Dialog width */
  width?: string
  /** Whether confirm button is loading */
  confirmLoading?: boolean
  /** Whether to auto-focus confirm button */
  autoFocusConfirm?: boolean
}

// Confirmation dialog emits interface
export interface FcxConfirmationDialogEmits {
  /** Emitted when dialog visibility changes */
  'update:visible': [visible: boolean]
  /** Emitted when user confirms */
  'confirm': []
  /** Emitted when user cancels */
  'cancel': []
}

// Confirmation dialog slots interface
export interface FcxConfirmationDialogSlots {
  /** Custom content slot */
  default?: () => any
  /** Custom icon slot */
  icon?: () => any
  /** Custom actions slot */
  actions?: () => any
}

// Confirmation dialog configuration
export interface ConfirmationDialogConfig {
  /** Default variant */
  defaultVariant: ConfirmationVariant
  /** Default texts */
  defaultTexts: {
    confirm: string
    cancel: string
    title: string
  }
  /** Variant configurations */
  variants: Record<ConfirmationVariant, {
    icon: string
    confirmButtonSeverity: string
    iconColor: string
  }>
}

// Legacy type aliases for backward compatibility
export type MOPDialogProps = FcxDialogProps
export type MOPDialogEmits = FcxDialogEmits
export type MOPDialogSlots = FcxDialogSlots
