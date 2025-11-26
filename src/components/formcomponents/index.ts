// Form Components Export
export { default as FcxInputtext } from './FcxInputtext.vue'
export { default as FcxPassword } from './FcxPassword.vue'
export { default as FcxTextarea } from './FcxTextarea.vue'
export { default as FcxInputNumber } from './FcxInputNumber.vue'
export { default as FcxDropdown } from './FcxDropdown.vue'
export { default as FcxMultiSelect } from './FcxMultiSelect.vue'
export { default as FcxAutoComplete } from './FcxAutoComplete.vue'
export { default as FcxCalendar } from './FcxCalendar.vue'
export { default as FcxCheckbox } from './FcxCheckbox.vue'
export { default as FcxRadioButton } from './FcxRadioButton.vue'
export { default as FcxToggleButton } from './FcxToggleButton.vue'
export { default as FcxInputMask } from './FcxInputMask.vue'
export { default as FcxOtp } from './FcxOtp.vue'

// Form Components Types Export
export type {
  BaseFieldProps,
  InputTextProps,
  PasswordProps,
  TextareaProps,
  InputNumberProps,
  DropdownProps,
  DropdownOption,
  MultiSelectProps,
  AutoCompleteProps,
  CalendarProps,
  FileUploadProps,
  CheckboxProps,
  RadioButtonProps,
  ToggleButtonProps,
  SliderProps,
  RatingProps,
  InputMaskProps,
  ColorPickerProps,
  ButtonProps,
  OtpProps,
  OtpEvents,
  ValidationState,
  FormFieldEvents,
  DropdownEvents,
  ThemeMode,
  ComponentSize,
  ComponentVariant,
  MaybeRef,
  MaybeRefOrGetter
} from './types/form-types'

// Validation utilities export
export { buildValidationString, calculatePasswordStrength } from './utils/validation-rules'
