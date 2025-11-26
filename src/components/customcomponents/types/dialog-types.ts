// Dialog Component Types

export type DialogVariant = 'warning' | 'white' | 'danger'

export interface ConfirmDialogProps {
  visible: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
  icon?: string
  width?: string
  maxWidth?: string
}

export interface ConfirmDialogEmits {
  confirm: []
  cancel: []
  close: []
}

export interface DialogVariantConfig {
  iconColor: string
  confirmButtonClass: string
  borderColor: string
  backgroundColor: string
  titleColor: string
}

export interface DialogVariantConfigs {
  warning: DialogVariantConfig
  white: DialogVariantConfig
  danger: DialogVariantConfig
}

// Dialog button configuration
export interface DialogButton {
  text: string
  variant: 'primary' | 'secondary' | 'danger'
  action: 'confirm' | 'cancel'
}

// Dialog state management
export interface DialogState {
  isVisible: boolean
  isClosing: boolean
  focusTrapActive: boolean
}

// Dialog accessibility options
export interface DialogA11yOptions {
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  focusOnMount?: boolean
  restoreFocus?: boolean
}

// Complete dialog configuration
export interface DialogConfig extends ConfirmDialogProps {
  buttons?: DialogButton[]
  a11y?: DialogA11yOptions
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}
