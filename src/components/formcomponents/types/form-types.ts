import type { Component, Ref } from 'vue'

// Base form field props
export interface BaseFieldProps {
  /** Field name for form handling */
  name: string
  /** Field label */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field is in loading state */
  loading?: boolean
  /** Help text to display below the field */
  help?: string
  /** Custom CSS classes */
  class?: string
  /** Field size variant */
  size?: 'sm' | 'md' | 'lg'
  
  // Validation Props
  /** Whether the field is required */
  required?: boolean
  /** Validation type for automatic validation */
  validationType?: 'email' | 'url' | 'phone' | 'numeric' | 'text' | 'password'
  /** Minimum length for text inputs */
  minLength?: number
  /** Maximum length for text inputs */
  maxLength?: number
  /** Pattern for validation (string or RegExp) */
  pattern?: string | RegExp
  /** Custom validator function */
  customValidator?: (value: any) => boolean | string
  /** Custom error message override */
  errorMessage?: string
  /** Legacy support for VeeValidate rules */
  rules?: string | Record<string, any> | ((value: any) => boolean | string)
}

// Input text specific props
export interface InputTextProps extends BaseFieldProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  /** Model value */
  modelValue?: string
  /** Maximum length */
  maxlength?: number
  /** Minimum length */
  minlength?: number
  /** Input pattern for validation */
  pattern?: string
  /** Whether to show character counter */
  showCounter?: boolean
  /** Prefix icon */
  prefixIcon?: Component | string
  /** Suffix icon */
  suffixIcon?: Component | string
  /** Whether to clear the field on escape */
  clearable?: boolean
  /** Auto-complete attribute */
  autocomplete?: string
  /** Whether to auto-focus this input */
  autofocus?: boolean
  /** Whether to focus on component mount */
  focusOnMount?: boolean
  /** Manual error message to display */
  error?: string
  /** Text transformation to apply */
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}

// Dropdown option interface
export interface DropdownOption {
  label: string
  value: any
  disabled?: boolean
  group?: string
  [key: string]: any
}

// Dropdown specific props
export interface DropdownProps extends BaseFieldProps {
  /** Model value */
  modelValue?: any
  /** Array of options */
  options?: DropdownOption[] | any[]
  /** Property name for option label (when using object array) */
  optionLabel?: string
  /** Property name for option value (when using object array) */
  optionValue?: string
  /** Property name for option disabled state */
  optionDisabled?: string
  /** Property name for option grouping */
  optionGroupLabel?: string
  /** Property name for option group children */
  optionGroupChildren?: string
  /** Whether to show filter/search */
  filter?: boolean
  /** Filter placeholder text */
  filterPlaceholder?: string
  /** Whether to show clear button */
  showClear?: boolean
  /** Whether dropdown is searchable */
  editable?: boolean
  /** Empty message when no options */
  emptyMessage?: string
  /** Empty filter message when no results */
  emptyFilterMessage?: string
  /** Whether to allow multiple selection */
  multiple?: boolean
  /** Maximum number of selections (for multiple) */
  maxSelectedLabels?: number
  /** Text to show when max selections reached */
  selectedItemsLabel?: string
  /** Custom option template */
  optionTemplate?: Component
  /** Custom selected value template */
  valueTemplate?: Component
  /** Custom empty template */
  emptyTemplate?: Component
}

// Form validation state
export interface ValidationState {
  /** Whether the field has been touched */
  touched: boolean
  /** Whether the field is currently being validated */
  pending: boolean
  /** Whether the field is valid */
  valid: boolean
  /** Validation error message */
  error?: string
  /** All validation errors */
  errors: string[]
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'

// Component size variants
export type ComponentSize = 'sm' | 'md' | 'lg'

// Component variant types
export type ComponentVariant = 'default' | 'outline' | 'ghost' | 'filled'

// Event types
export interface FormFieldEvents {
  'update:modelValue': [value: any]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'input': [event: Event]
  'change': [event: Event]
  'clear': []
}

export interface DropdownEvents extends FormFieldEvents {
  'show': []
  'hide': []
  'filter': [event: { originalEvent: Event; value: string }]
}

// Input Number specific props
export interface InputNumberProps extends BaseFieldProps {
  /** Model value */
  modelValue?: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Number of decimal places */
  fractionDigits?: number
  /** Whether to allow decimal values */
  allowDecimal?: boolean
  /** Whether to allow negative values */
  allowNegative?: boolean
  /** Whether to show increment/decrement buttons */
  showButtons?: boolean
  /** Button layout */
  buttonLayout?: 'stacked' | 'horizontal'
  /** Prefix text or symbol */
  prefix?: string
  /** Suffix text or symbol */
  suffix?: string
  /** Currency code for formatting */
  currency?: string
  /** Locale for number formatting */
  locale?: string
}

// Password specific props
export interface PasswordProps extends BaseFieldProps {
  /** Model value */
  modelValue?: string
  /** Whether to show password toggle */
  toggleMask?: boolean
  /** Whether to show password strength indicator */
  showStrength?: boolean
  /** Feedback for password strength */
  feedback?: boolean
  /** Prompt label for password strength */
  promptLabel?: string
  /** Weak password label */
  weakLabel?: string
  /** Medium password label */
  mediumLabel?: string
  /** Strong password label */
  strongLabel?: string
  /** Manual error message to display */
  error?: string
}

// Textarea specific props
export interface TextareaProps extends BaseFieldProps {
  /** Model value */
  modelValue?: string
  /** Number of rows */
  rows?: number
  /** Number of columns */
  cols?: number
  /** Whether to auto-resize */
  autoResize?: boolean
  /** Whether to show character counter */
  showCounter?: boolean
}

// MultiSelect specific props
export interface MultiSelectProps extends BaseFieldProps {
  /** Model value */
  modelValue?: any[]
  /** Array of options */
  options?: DropdownOption[] | any[]
  /** Property name for option label */
  optionLabel?: string
  /** Property name for option value */
  optionValue?: string
  /** Property name for option disabled state */
  optionDisabled?: string
  /** Property name for option grouping */
  optionGroupLabel?: string
  /** Property name for option group children */
  optionGroupChildren?: string
  /** Whether to show filter/search */
  filter?: boolean
  /** Filter placeholder text */
  filterPlaceholder?: string
  /** Whether to show clear button */
  showClear?: boolean
  /** Whether to show select all checkbox */
  selectAll?: boolean
  /** Maximum number of selections */
  maxSelectedLabels?: number
  /** Text to show when max selections reached */
  selectedItemsLabel?: string
  /** Empty message when no options */
  emptyMessage?: string
  /** Empty filter message when no results */
  emptyFilterMessage?: string
  /** Display mode for selected items */
  display?: 'comma' | 'chip'
}

// AutoComplete specific props
export interface AutoCompleteProps extends BaseFieldProps {
  /** Model value */
  modelValue?: any
  /** Array of suggestions */
  suggestions?: any[]
  /** Property name for suggestion label */
  optionLabel?: string
  /** Whether to allow multiple selections */
  multiple?: boolean
  /** Minimum characters to trigger search */
  minLength?: number
  /** Delay in milliseconds for search */
  delay?: number
  /** Whether dropdown is always visible */
  dropdown?: boolean
  /** Whether to force selection from suggestions */
  forceSelection?: boolean
  /** Empty message when no suggestions */
  emptyMessage?: string
}

// Calendar specific props
export interface CalendarProps extends BaseFieldProps {
  /** Model value */
  modelValue?: Date | Date[] | string | null
  /** Selection mode */
  selectionMode?: 'single' | 'multiple' | 'range'
  /** Date format */
  dateFormat?: string
  /** Whether to show time picker */
  showTime?: boolean
  /** Time only mode */
  timeOnly?: boolean
  /** Time format (12 or 24 hour) */
  hourFormat?: '12' | '24'
  /** Whether to show seconds */
  showSeconds?: boolean
  /** Whether to show milliseconds */
  showMilliseconds?: boolean
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Array of disabled dates */
  disabledDates?: Date[]
  /** Array of disabled days (0-6, Sunday-Saturday) */
  disabledDays?: number[]
  /** Whether to show on focus */
  showOnFocus?: boolean
  /** Whether to show button bar */
  showButtonBar?: boolean
  /** Whether to show week numbers */
  showWeek?: boolean
  /** Whether to show other months */
  showOtherMonths?: boolean
  /** Whether to allow selection of other months */
  selectOtherMonths?: boolean
  /** Whether to show calendar icon */
  showIcon?: boolean
  /** Calendar icon */
  icon?: string
  /** Number of months to display */
  numberOfMonths?: number
  /** View mode */
  view?: 'date' | 'month' | 'year'
  /** Touch UI mode */
  touchUI?: boolean
  /** Month navigator */
  monthNavigator?: boolean
  /** Year navigator */
  yearNavigator?: boolean
  /** Year range */
  yearRange?: string
  /** Inline mode */
  inline?: boolean
}

// FileUpload specific props
export interface FileUploadProps extends BaseFieldProps {
  /** Model value */
  modelValue?: File | File[]
  /** Whether to allow multiple files */
  multiple?: boolean
  /** Accepted file types */
  accept?: string
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Minimum number of files */
  minFiles?: number
  /** Upload mode */
  mode?: 'basic' | 'advanced'
  /** Whether to show upload button */
  showUploadButton?: boolean
  /** Whether to show cancel button */
  showCancelButton?: boolean
  /** Custom upload handler */
  customUpload?: boolean
  /** Upload URL */
  url?: string
  /** HTTP method for upload */
  method?: 'POST' | 'PUT'
  /** Additional form data */
  withCredentials?: boolean
}

// Checkbox specific props
export interface CheckboxProps extends BaseFieldProps {
  /** Model value */
  modelValue?: boolean | any[]
  /** Value when checked (for array binding) */
  value?: any
  /** Whether checkbox is indeterminate */
  indeterminate?: boolean
  /** Binary mode (true/false only) */
  binary?: boolean
}

// RadioButton specific props
export interface RadioButtonProps extends BaseFieldProps {
  /** Model value */
  modelValue?: any
  /** Value of this radio button */
  value: any
}

// ToggleButton specific props
export interface ToggleButtonProps extends BaseFieldProps {
  /** Model value */
  modelValue?: boolean
  /** Label when on */
  onLabel?: string
  /** Label when off */
  offLabel?: string
  /** Icon when on */
  onIcon?: string
  /** Icon when off */
  offIcon?: string
}

// Slider specific props
export interface SliderProps extends BaseFieldProps {
  /** Model value */
  modelValue?: number | number[]
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Whether to show range */
  range?: boolean
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
}

// Rating specific props
export interface RatingProps extends BaseFieldProps {
  /** Model value */
  modelValue?: number
  /** Number of stars */
  stars?: number
  /** Whether to allow cancel */
  cancel?: boolean
  /** Whether rating is readonly */
  readonly?: boolean
  /** Icon for on state */
  onIcon?: string
  /** Icon for off state */
  offIcon?: string
  /** Icon for cancel */
  cancelIcon?: string
}

// InputMask specific props
export interface InputMaskProps extends BaseFieldProps {
  /** Model value */
  modelValue?: string
  /** Input mask pattern */
  mask: string
  /** Whether to unmask the value */
  unmask?: boolean
  /** Character regex for validation */
  charRegex?: string
  /** Whether to auto clear incomplete values */
  autoClear?: boolean
  /** Whether to show clear button */
  showClear?: boolean
  /** Whether input is readonly */
  readonly?: boolean
}

// ColorPicker specific props
export interface ColorPickerProps extends BaseFieldProps {
  /** Model value */
  modelValue?: string
  /** Color format */
  format?: 'hex' | 'rgb' | 'hsb'
  /** Whether to show input field */
  inline?: boolean
}

// Button specific props
export interface ButtonProps {
  /** Button label */
  label?: string
  /** Button icon */
  icon?: string
  /** Icon position */
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  /** Button type */
  type?: 'button' | 'submit' | 'reset'
  /** Button severity */
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help'
  /** Button size */
  size?: 'small' | 'large'
  /** Whether button is outlined */
  outlined?: boolean
  /** Whether button is text only */
  text?: boolean
  /** Whether button is raised */
  raised?: boolean
  /** Whether button is rounded */
  rounded?: boolean
  /** Whether button is loading */
  loading?: boolean
  /** Loading icon */
  loadingIcon?: string
  /** Whether button is disabled */
  disabled?: boolean
  /** Custom CSS classes */
  class?: string
}

// OTP specific props
export interface OtpProps extends BaseFieldProps {
  /** Model value - the OTP string */
  modelValue?: string
  /** Number of OTP digits */
  length: number
  /** Whether to mask the input (show dots instead of numbers) */
  mask?: boolean
  /** Whether inputs are integer only */
  integerOnly?: boolean
  /** Template for each input slot */
  inputTemplate?: string
  /** Input mode for mobile keyboards */
  inputMode?: 'text' | 'numeric' | 'tel'
  /** Auto-focus first input on mount */
  autoFocus?: boolean
  /** Auto-advance to next input on fill */
  autoAdvance?: boolean
  /** Allow paste functionality */
  allowPaste?: boolean
  /** Separator between inputs */
  separator?: string
  /** Input variant */
  variant?: 'default' | 'filled' | 'outlined'
  /** Timeout for auto-submit after completion (in ms) */
  autoSubmitTimeout?: number
  /** Whether to auto-submit when OTP is complete */
  autoSubmit?: boolean
}

// OTP events interface
export interface OtpEvents extends FormFieldEvents {
  /** Emitted when OTP is complete */
  'complete': [value: string]
  /** Emitted when OTP is cleared */
  'clear': []
  /** Emitted when auto-submit timeout occurs */
  'auto-submit': [value: string]
}

// Utility types
export type MaybeRef<T> = T | Ref<T>
export type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)
