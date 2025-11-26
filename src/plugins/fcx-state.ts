// Fcx State Components Plugin
import type { App } from 'vue'
import { StateWrapper } from '../components/statecomponents'
import { LoadingSpinner, LoadingOverlay } from '../components/statecomponents'
import { EmptyState } from '../components/statecomponents'
import { 
  Error400, 
  Error401, 
  Error403, 
  Error404, 
  Error500, 
  ErrorGeneric, 
  ErrorNetwork 
} from '../components/statecomponents'
import { Success200 } from '../components/statecomponents'

// Export components for individual imports
export { 
  StateWrapper,
  LoadingSpinner,
  LoadingOverlay,
  EmptyState,
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  ErrorGeneric,
  ErrorNetwork,
  Success200
}

// Export types
export * from '../components/statecomponents/types/state-types'

// Component registry
export const FcxStateComponents = {
  StateWrapper,
  LoadingSpinner,
  LoadingOverlay,
  EmptyState,
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  ErrorGeneric,
  ErrorNetwork,
  Success200
}

// Plugin for global registration
export default {
  install(app: App) {
    // Register all state components globally
    Object.entries(FcxStateComponents).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
