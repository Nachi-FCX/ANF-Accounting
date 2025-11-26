// Fcx Form Components Plugin
import type { App } from 'vue'
import FcxInputtext from '../components/formcomponents/FcxInputtext.vue'
import FcxDropdown from '../components/formcomponents/FcxDropdown.vue'
import FcxInputNumber from '../components/formcomponents/FcxInputNumber.vue'
import FcxPassword from '../components/formcomponents/FcxPassword.vue'
import FcxTextarea from '../components/formcomponents/FcxTextarea.vue'
import FcxMultiSelect from '../components/formcomponents/FcxMultiSelect.vue'
import FcxCheckbox from '../components/formcomponents/FcxCheckbox.vue'
import FcxRadioButton from '../components/formcomponents/FcxRadioButton.vue'
import FcxToggleButton from '../components/formcomponents/FcxToggleButton.vue'
import FcxCalendar from '../components/formcomponents/FcxCalendar.vue'
import FcxAutoComplete from '../components/formcomponents/FcxAutoComplete.vue'
import FcxInputMask from '../components/formcomponents/FcxInputMask.vue'

// Import component styles
import '../components/formcomponents/styles/common.scss'
import '../components/formcomponents/styles/fcx-inputtext.scss'
import '../components/formcomponents/styles/fcx-dropdown.scss'

// Export components for individual imports
export { 
  FcxInputtext, 
  FcxDropdown, 
  FcxInputNumber, 
  FcxPassword, 
  FcxTextarea,
  FcxMultiSelect,
  FcxCheckbox,
  FcxRadioButton,
  FcxToggleButton,
  FcxCalendar,
  FcxAutoComplete,
  FcxInputMask
}

// Export types
export * from '../components/formcomponents/types/form-types'

// Component registry
export const FcxFormComponents = {
  FcxInputtext,
  FcxDropdown,
  FcxInputNumber,
  FcxPassword,
  FcxTextarea,
  FcxMultiSelect,
  FcxCheckbox,
  FcxRadioButton,
  FcxToggleButton,
  FcxCalendar,
  FcxAutoComplete,
  FcxInputMask
}

// Plugin for global registration
export default {
  install(app: App) {
    // Register all form components globally
    Object.entries(FcxFormComponents).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
