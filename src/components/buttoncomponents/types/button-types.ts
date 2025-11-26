import type { Component } from 'vue'

// Base button props
export interface BaseButtonProps {
  /** Button label text */
  label?: string
  /** Button icon component or icon class */
  icon?: Component | string
  /** Icon position relative to label */
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  /** Button HTML type */
  type?: 'button' | 'submit' | 'reset'
  /** Button size variant */
  size?: 'small' | 'medium' | 'large'
  /** Whether button is disabled */
  disabled?: boolean
  /** Whether button is in loading state */
  loading?: boolean
  /** Loading icon override */
  loadingIcon?: Component | string
  /** Custom CSS classes */
  class?: string
  /** Custom inline styles */
  style?: string | Record<string, any>
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Tab index */
  tabindex?: number
}

// Button severity/variant types
export type ButtonSeverity = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'info' 
  | 'warning' 
  | 'danger' 
  | 'help'

// Button style variants
export type ButtonVariant = 
  | 'filled'    // Default solid button
  | 'outlined'  // Border with transparent background
  | 'text'      // Text only, no background or border
  | 'ghost'     // Subtle background on hover

// Main button component props
export interface ButtonProps extends BaseButtonProps {
  /** Button color severity */
  severity?: ButtonSeverity
  /** Button style variant */
  variant?: ButtonVariant
  /** Whether button has raised appearance */
  raised?: boolean
  /** Whether button is rounded */
  rounded?: boolean
  /** Whether button takes full width */
  block?: boolean
  /** Whether button is icon-only (auto-detected if no label) */
  iconOnly?: boolean
}

// Icon button specific props
export interface IconButtonProps extends BaseButtonProps {
  /** Button color severity */
  severity?: ButtonSeverity
  /** Button style variant */
  variant?: ButtonVariant
  /** Whether button is circular */
  rounded?: boolean
  /** Tooltip text to show on hover */
  tooltip?: string
  /** Tooltip position */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

// Button group props
export interface ButtonGroupProps {
  /** Array of button configurations */
  buttons?: ButtonProps[]
  /** Whether buttons are connected (no gap) */
  connected?: boolean
  /** Group orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Whether group allows multiple selection */
  multiple?: boolean
  /** Currently selected button indices (for toggle behavior) */
  modelValue?: number | number[]
  /** Button size for all buttons in group */
  size?: 'small' | 'medium' | 'large'
  /** Button severity for all buttons in group */
  severity?: ButtonSeverity
  /** Button variant for all buttons in group */
  variant?: ButtonVariant
  /** Custom CSS classes */
  class?: string
}

// Split button props
export interface SplitButtonProps extends BaseButtonProps {
  /** Button color severity */
  severity?: ButtonSeverity
  /** Button style variant */
  variant?: ButtonVariant
  /** Dropdown menu items */
  menuItems?: SplitButtonMenuItem[]
  /** Whether dropdown is disabled */
  menuDisabled?: boolean
  /** Dropdown placement */
  menuPlacement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  /** Whether to show dropdown on main button click */
  dropdownOnMainClick?: boolean
}

// Split button menu item
export interface SplitButtonMenuItem {
  /** Menu item label */
  label: string
  /** Menu item icon */
  icon?: Component | string
  /** Whether item is disabled */
  disabled?: boolean
  /** Whether item is a separator */
  separator?: boolean
  /** Click handler */
  command?: () => void
  /** Custom CSS classes */
  class?: string
}

// Floating Action Button props
export interface FloatingActionButtonProps extends BaseButtonProps {
  /** FAB position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Distance from screen edges */
  offset?: string | number
  /** Whether FAB is extended (shows label) */
  extended?: boolean
  /** Mini FAB variant */
  mini?: boolean
  /** Tooltip text */
  tooltip?: string
  /** Whether FAB is hidden */
  hidden?: boolean
}

// Button events
export interface ButtonEvents {
  /** Button click event */
  'click': [event: MouseEvent]
  /** Button focus event */
  'focus': [event: FocusEvent]
  /** Button blur event */
  'blur': [event: FocusEvent]
  /** Button keydown event */
  'keydown': [event: KeyboardEvent]
  /** Button keyup event */
  'keyup': [event: KeyboardEvent]
}

// Button group events
export interface ButtonGroupEvents {
  /** Selection change event */
  'update:modelValue': [value: number | number[]]
  /** Button click event with index */
  'button-click': [index: number, event: MouseEvent]
}

// Split button events
export interface SplitButtonEvents extends ButtonEvents {
  /** Dropdown toggle event */
  'dropdown-toggle': [visible: boolean]
  /** Menu item click event */
  'menu-item-click': [item: SplitButtonMenuItem, event: MouseEvent]
}

// Button size configuration
export interface ButtonSizeConfig {
  height: string
  padding: string
  fontSize: string
  iconSize: string
  borderRadius: string
  minWidth?: string
}

// Button theme configuration
export interface ButtonThemeConfig {
  background: string
  color: string
  border: string
  hoverBackground: string
  hoverColor: string
  hoverBorder: string
  activeBackground: string
  activeColor: string
  activeBorder: string
  focusRing: string
  disabledBackground: string
  disabledColor: string
  disabledBorder: string
  disabledOpacity: string
}

// Button state
export interface ButtonState {
  /** Whether button is currently focused */
  focused: boolean
  /** Whether button is currently pressed */
  pressed: boolean
  /** Whether button is currently hovered */
  hovered: boolean
  /** Whether button is currently loading */
  loading: boolean
  /** Whether button is currently disabled */
  disabled: boolean
}

// Utility types
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonElement = HTMLButtonElement
export type ButtonRef = ButtonElement | null

// Component exposure interface
export interface ButtonExpose {
  /** Focus the button */
  focus: () => void
  /** Blur the button */
  blur: () => void
  /** Get button element */
  getElement: () => ButtonElement | null
}
