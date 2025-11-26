// Fcx Data Components Plugin
import type { App } from 'vue'
import FcxDataTable from '../components/datacomponents/FcxDataTable.vue'
import LanguageSwitcher from '../components/datacomponents/LanguageSwitcher.vue'

// Import component styles
import '../components/datacomponents/styles/fcx-datatable.scss'

// Export components for individual imports
export { 
  FcxDataTable,
  LanguageSwitcher
}

// Export types
export * from '../components/datacomponents/types/datatable-types'

// Component registry
export const FcxDataComponents = {
  FcxDataTable,
  LanguageSwitcher
}

// Plugin for global registration
export default {
  install(app: App) {
    // Register all data components globally
    Object.entries(FcxDataComponents).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
