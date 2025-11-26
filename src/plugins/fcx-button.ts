// Fcx Button Components Plugin
import type { App } from 'vue'
import FcxButton from '../components/buttoncomponents/FcxButton.vue'
import FcxIconButton from '../components/buttoncomponents/FcxIconButton.vue'

// Import component styles
import '../components/buttoncomponents/styles/fcx-button.scss'
import '../components/buttoncomponents/styles/fcx-icon-button.scss'

// Export components for individual imports
export { 
  FcxButton,
  FcxIconButton
}

// Export types
export * from '../components/buttoncomponents/types/button-types'

// Component registry
export const FcxButtonComponents = {
  FcxButton,
  FcxIconButton
}

// Plugin for global registration
export default {
  install(app: App) {
    // Register all button components globally
    Object.entries(FcxButtonComponents).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
