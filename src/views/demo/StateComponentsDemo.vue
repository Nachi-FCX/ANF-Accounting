<template>
  <div class="state-demo">
    <div class="demo-header">
      <h1>State Components Demo</h1>
      <p>Interactive demonstration of all state management components</p>
    </div>

    <div class="demo-grid">
      <!-- Loading Components -->
      <div class="demo-section">
        <h2>Loading Components</h2>
        
        <div class="demo-item">
          <h3>Loading Spinner</h3>
          <div class="demo-preview">
            <LoadingSpinner size="sm" message="Small spinner" />
            <LoadingSpinner size="md" message="Medium spinner" />
            <LoadingSpinner size="lg" message="Large spinner" />
          </div>
        </div>

        <div class="demo-item">
          <h3>Loading Overlay</h3>
          <div class="demo-preview overlay-demo">
            <div class="overlay-container">
              <p>Content behind overlay</p>
              <LoadingOverlay :visible="showOverlay" message="Loading data..." />
            </div>
            <button @click="toggleOverlay" class="btn btn-primary">
              {{ showOverlay ? 'Hide' : 'Show' }} Overlay
            </button>
          </div>
        </div>
      </div>

      <!-- Error Components -->
      <div class="demo-section">
        <h2>Error Components</h2>
        
        <div class="demo-item">
          <h3>Error 400 - Bad Request</h3>
          <div class="demo-preview">
            <Error400 
              :details="['Invalid email format', 'Password too short']"
              @retry="handleRetry"
            />
          </div>
        </div>

        <div class="demo-item">
          <h3>Error 401 - Unauthorized</h3>
          <div class="demo-preview">
            <Error401 @retry="handleRetry" />
          </div>
        </div>

        <div class="demo-item">
          <h3>Error 403 - Forbidden</h3>
          <div class="demo-preview">
            <Error403 />
          </div>
        </div>

        <div class="demo-item">
          <h3>Error 404 - Not Found</h3>
          <div class="demo-preview">
            <Error404 />
          </div>
        </div>

        <div class="demo-item">
          <h3>Error 500 - Server Error</h3>
          <div class="demo-preview">
            <Error500 
              error-id="ERR-2024-001"
              @retry="handleRetry"
            />
          </div>
        </div>

        <div class="demo-item">
          <h3>Network Error</h3>
          <div class="demo-preview">
            <ErrorNetwork 
              :retry-delay="3"
              :max-retries="3"
              @retry="handleRetry"
            />
          </div>
        </div>
      </div>

      <!-- Success Components -->
      <div class="demo-section">
        <h2>Success Components</h2>
        
        <div class="demo-item">
          <h3>Success 200</h3>
          <div class="demo-preview">
            <Success200 
              title="Operation Successful!"
              message="Your data has been saved successfully."
              primary-action="Continue"
              secondary-action="View Details"
              @primary-action="handleSuccess"
              @secondary-action="handleSuccess"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="demo-section">
        <h2>Empty State</h2>
        
        <div class="demo-item">
          <h3>Empty State</h3>
          <div class="demo-preview">
            <EmptyState 
              title="No Items Found"
              message="There are no items to display. Try adding some items or adjusting your filters."
              action-text="Add Item"
              :show-action="true"
              @action="handleEmptyAction"
            />
          </div>
        </div>
      </div>

      <!-- State Wrapper -->
      <div class="demo-section">
        <h2>State Wrapper</h2>
        
        <div class="demo-controls">
          <button @click="setDemoState('loading')" class="btn btn-outline">Loading</button>
          <button @click="setDemoState('error400')" class="btn btn-outline">Error 400</button>
          <button @click="setDemoState('error500')" class="btn btn-outline">Error 500</button>
          <button @click="setDemoState('success')" class="btn btn-outline">Success</button>
          <button @click="setDemoState('empty')" class="btn btn-outline">Empty</button>
          <button @click="setDemoState('content')" class="btn btn-outline">Content</button>
        </div>

        <div class="demo-item">
          <h3>State Wrapper Demo</h3>
          <div class="demo-preview">
            <StateWrapper 
              :loading="demoState.loading"
              :error="demoState.error"
              :success="demoState.success"
              :is-empty="demoState.isEmpty"
              empty-message="No data available in this demo"
              @retry="handleRetry"
              @success-primary="handleSuccess"
              @empty-action="handleEmptyAction"
            >
              <div class="demo-content">
                <h4>Your Content Here</h4>
                <p>This is the actual content that would be displayed when everything is working correctly.</p>
                <ul>
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
              </div>
            </StateWrapper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  LoadingSpinner,
  LoadingOverlay,
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  ErrorNetwork,
  Success200,
  EmptyState,
  StateWrapper,
  type ErrorState,
  type SuccessState
} from '@/components/statecomponents'

// Demo state
const showOverlay = ref(false)

const demoState = reactive({
  loading: false,
  error: null as ErrorState | null,
  success: null as SuccessState | null,
  isEmpty: false
})

// Methods
const toggleOverlay = () => {
  showOverlay.value = !showOverlay.value
}

const handleRetry = () => {
  console.log('Retry clicked')
  alert('Retry action triggered!')
}

const handleSuccess = () => {
  console.log('Success action clicked')
  alert('Success action triggered!')
}

const handleEmptyAction = () => {
  console.log('Empty action clicked')
  alert('Empty state action triggered!')
}

const setDemoState = (state: string) => {
  // Reset all states
  demoState.loading = false
  demoState.error = null
  demoState.success = null
  demoState.isEmpty = false

  switch (state) {
    case 'loading':
      demoState.loading = true
      break
    case 'error400':
      demoState.error = {
        status: 400,
        message: 'Bad request error in demo',
        details: ['Invalid input data', 'Missing required fields']
      }
      break
    case 'error500':
      demoState.error = {
        status: 500,
        message: 'Server error in demo',
        code: 'DEMO-500'
      }
      break
    case 'success':
      demoState.success = {
        title: 'Demo Success!',
        message: 'This is a success state demonstration',
        primaryAction: 'Continue',
        secondaryAction: 'Details'
      }
      break
    case 'empty':
      demoState.isEmpty = true
      break
    case 'content':
      // All states are already false, showing content
      break
  }
}
</script>

<style scoped lang="scss">
.state-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-primary, #1a202c);
  }
  
  p {
    font-size: 1.125rem;
    color: var(--color-text-secondary, #4a5568);
  }
}

.demo-grid {
  display: grid;
  gap: 3rem;
}

.demo-section {
  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--color-text-primary, #1a202c);
    border-bottom: 2px solid var(--color-border, #e2e8f0);
    padding-bottom: 0.5rem;
  }
}

.demo-item {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--color-text-primary, #1a202c);
  }
}

.demo-preview {
  background: var(--color-background-secondary, #f7fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  padding: 2rem;
  min-height: 200px;
  
  &.overlay-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.overlay-container {
  position: relative;
  background: white;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 6px;
  padding: 2rem;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.demo-content {
  padding: 2rem;
  background: white;
  border-radius: 6px;
  border: 1px solid var(--color-border, #e2e8f0);
  
  h4 {
    margin-bottom: 1rem;
    color: var(--color-text-primary, #1a202c);
  }
  
  p {
    margin-bottom: 1rem;
    color: var(--color-text-secondary, #4a5568);
  }
  
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: var(--color-text-secondary, #4a5568);
    }
  }
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in-out;
  
  &.btn-primary {
    background: var(--color-primary, #3b82f6);
    color: white;
    
    &:hover {
      background: var(--color-primary-dark, #2563eb);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: var(--color-text-primary, #1a202c);
    border: 1px solid var(--color-border, #e2e8f0);
    
    &:hover {
      background: var(--color-background-secondary, #f7fafc);
    }
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .demo-header h1 {
    color: var(--color-text-primary-dark, #f7fafc);
  }
  
  .demo-header p {
    color: var(--color-text-secondary-dark, #a0aec0);
  }
  
  .demo-section h2 {
    color: var(--color-text-primary-dark, #f7fafc);
    border-color: var(--color-border-dark, #4a5568);
  }
  
  .demo-item h3 {
    color: var(--color-text-primary-dark, #f7fafc);
  }
  
  .demo-preview {
    background: var(--color-background-secondary-dark, #2d3748);
    border-color: var(--color-border-dark, #4a5568);
  }
  
  .overlay-container {
    background: var(--color-surface-dark, #2d3748);
    border-color: var(--color-border-dark, #4a5568);
  }
  
  .demo-content {
    background: var(--color-surface-dark, #2d3748);
    border-color: var(--color-border-dark, #4a5568);
    
    h4 {
      color: var(--color-text-primary-dark, #f7fafc);
    }
    
    p, li {
      color: var(--color-text-secondary-dark, #a0aec0);
    }
  }
  
  .btn.btn-outline {
    color: var(--color-text-primary-dark, #f7fafc);
    border-color: var(--color-border-dark, #4a5568);
    
    &:hover {
      background: var(--color-background-secondary-dark, #2d3748);
    }
  }
}
</style>
