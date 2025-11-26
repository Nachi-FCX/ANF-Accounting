<template>
  <div class="otp-demo">
    <div class="demo-header">
      <h1>FcxOtp Component Demo</h1>
      <p>OTP input component based on PrimeVue InputOtp with enhanced features</p>
    </div>

    <div class="demo-section">
      <h2>Basic OTP</h2>
      <div class="demo-controls">
        <p>Enter a 6-digit OTP code:</p>
      </div>
      
      <FcxOtp
        v-model="basicOtp"
        name="basic-otp"
        label="Verification Code"
        :length="6"
        required
        help="Enter the 6-digit code sent to your phone"
      />
      
      <div class="demo-output">
        <strong>Value:</strong> {{ basicOtp || 'Empty' }}
      </div>
    </div>

    <div class="demo-section">
      <h2>Length Variants</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>4-Digit OTP</h3>
          <FcxOtp
            v-model="fourDigitOtp"
            name="four-digit-otp"
            label="4-Digit Code"
            :length="4"
            size="sm"
          />
          <div class="demo-output">Value: {{ fourDigitOtp || 'Empty' }}</div>
        </div>
        
        <div class="demo-item">
          <h3>8-Digit OTP</h3>
          <FcxOtp
            v-model="eightDigitOtp"
            name="eight-digit-otp"
            label="8-Digit Code"
            :length="8"
            size="lg"
          />
          <div class="demo-output">Value: {{ eightDigitOtp || 'Empty' }}</div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Size Variants</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>Small</h3>
          <FcxOtp
            v-model="smallOtp"
            name="small-otp"
            label="Small OTP"
            :length="6"
            size="sm"
          />
        </div>
        
        <div class="demo-item">
          <h3>Medium (Default)</h3>
          <FcxOtp
            v-model="mediumOtp"
            name="medium-otp"
            label="Medium OTP"
            :length="6"
            size="md"
          />
        </div>
        
        <div class="demo-item">
          <h3>Large</h3>
          <FcxOtp
            v-model="largeOtp"
            name="large-otp"
            label="Large OTP"
            :length="6"
            size="lg"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Masked OTP</h2>
      <div class="demo-controls">
        <p>OTP input with masked characters (dots instead of numbers):</p>
      </div>
      
      <FcxOtp
        v-model="maskedOtp"
        name="masked-otp"
        label="Secure Code"
        :length="6"
        :mask="true"
        help="Characters are hidden for security"
      />
      
      <div class="demo-output">
        <strong>Value:</strong> {{ maskedOtp || 'Empty' }}
      </div>
    </div>

    <div class="demo-section">
      <h2>Variant Styles</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>Default</h3>
          <FcxOtp
            v-model="defaultVariantOtp"
            name="default-variant-otp"
            label="Default Style"
            :length="6"
            variant="default"
          />
        </div>
        
        <div class="demo-item">
          <h3>Filled</h3>
          <FcxOtp
            v-model="filledVariantOtp"
            name="filled-variant-otp"
            label="Filled Style"
            :length="6"
            variant="filled"
          />
        </div>
        
        <div class="demo-item">
          <h3>Outlined</h3>
          <FcxOtp
            v-model="outlinedVariantOtp"
            name="outlined-variant-otp"
            label="Outlined Style"
            :length="6"
            variant="outlined"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>With Separator</h2>
      <div class="demo-controls">
        <p>OTP with custom separator between inputs:</p>
      </div>
      
      <FcxOtp
        v-model="separatorOtp"
        name="separator-otp"
        label="Code with Separator"
        :length="6"
        separator="-"
        help="Inputs separated by dashes"
      />
      
      <div class="demo-output">
        <strong>Value:</strong> {{ separatorOtp || 'Empty' }}
      </div>
    </div>

    <div class="demo-section">
      <h2>Auto-Submit Feature</h2>
      <div class="demo-controls">
        <p>OTP that auto-submits after completion with countdown:</p>
      </div>
      
      <FcxOtp
        v-model="autoSubmitOtp"
        name="auto-submit-otp"
        label="Auto-Submit OTP"
        :length="6"
        :auto-submit="true"
        :auto-submit-timeout="5000"
        @complete="onOtpComplete"
        @auto-submit="onAutoSubmit"
        help="Will auto-submit 5 seconds after completion"
      />
      
      <div class="demo-output">
        <strong>Value:</strong> {{ autoSubmitOtp || 'Empty' }}
        <div v-if="autoSubmitMessage" class="demo-message">{{ autoSubmitMessage }}</div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Validation States</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>Required Field</h3>
          <FcxOtp
            v-model="requiredOtp"
            name="required-otp"
            label="Required OTP"
            :length="6"
            required
            help="This field is required"
          />
        </div>
        
        <div class="demo-item">
          <h3>With Error</h3>
          <FcxOtp
            v-model="errorOtp"
            name="error-otp"
            label="Invalid OTP"
            :length="6"
            :rules="() => errorOtp.length === 6 ? true : 'Please enter all 6 digits'"
          />
        </div>
        
        <div class="demo-item">
          <h3>Disabled</h3>
          <FcxOtp
            v-model="disabledOtp"
            name="disabled-otp"
            label="Disabled OTP"
            :length="6"
            disabled
            help="This field is disabled"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Advanced Features</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>Auto-Focus</h3>
          <FcxOtp
            v-model="autoFocusOtp"
            name="auto-focus-otp"
            label="Auto-Focus OTP"
            :length="6"
            :auto-focus="true"
            help="Automatically focuses first input"
          />
        </div>
        
        <div class="demo-item">
          <h3>Loading State</h3>
          <FcxOtp
            v-model="loadingOtp"
            name="loading-otp"
            label="Loading OTP"
            :length="6"
            :loading="isLoading"
            help="Shows loading state"
          />
          <button @click="toggleLoading" class="demo-button">
            {{ isLoading ? 'Stop Loading' : 'Start Loading' }}
          </button>
        </div>
        
        <div class="demo-item">
          <h3>Paste Disabled</h3>
          <FcxOtp
            v-model="noPasteOtp"
            name="no-paste-otp"
            label="No Paste OTP"
            :length="6"
            :allow-paste="false"
            help="Paste functionality disabled"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Event Handling</h2>
      <div class="demo-controls">
        <p>OTP with comprehensive event handling:</p>
      </div>
      
      <FcxOtp
        v-model="eventOtp"
        name="event-otp"
        label="Event Demo OTP"
        :length="6"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @complete="onComplete"
        @clear="onClear"
        help="Check console for event logs"
      />
      
      <div class="demo-output">
        <strong>Value:</strong> {{ eventOtp || 'Empty' }}
        <div class="demo-events">
          <strong>Events:</strong>
          <ul>
            <li v-for="event in events" :key="event.id">
              {{ event.type }}: {{ event.data }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FcxOtp } from '@/components/formcomponents'

// Basic OTP
const basicOtp = ref('')

// Length variants
const fourDigitOtp = ref('')
const eightDigitOtp = ref('')

// Size variants
const smallOtp = ref('')
const mediumOtp = ref('')
const largeOtp = ref('')

// Masked OTP
const maskedOtp = ref('')

// Variant styles
const defaultVariantOtp = ref('')
const filledVariantOtp = ref('')
const outlinedVariantOtp = ref('')

// Separator OTP
const separatorOtp = ref('')

// Auto-submit OTP
const autoSubmitOtp = ref('')
const autoSubmitMessage = ref('')

// Validation states
const requiredOtp = ref('')
const errorOtp = ref('')
const disabledOtp = ref('123456')

// Advanced features
const autoFocusOtp = ref('')
const loadingOtp = ref('')
const isLoading = ref(false)
const noPasteOtp = ref('')

// Event handling
const eventOtp = ref('')
const events = ref<Array<{ id: number; type: string; data: string }>>([])
let eventId = 0

// Methods
const onOtpComplete = (value: string) => {
  console.log('OTP Complete:', value)
}

const onAutoSubmit = (value: string) => {
  autoSubmitMessage.value = `Auto-submitted: ${value} at ${new Date().toLocaleTimeString()}`
  console.log('Auto-submit:', value)
}

const toggleLoading = () => {
  isLoading.value = !isLoading.value
}

// Event handlers
const onInput = (event: Event) => {
  addEvent('input', (event.target as HTMLInputElement)?.value || '')
}

const onFocus = (event: FocusEvent) => {
  addEvent('focus', 'Input focused')
}

const onBlur = (event: FocusEvent) => {
  addEvent('blur', 'Input blurred')
}

const onComplete = (value: string) => {
  addEvent('complete', value)
}

const onClear = () => {
  addEvent('clear', 'OTP cleared')
}

const addEvent = (type: string, data: string) => {
  events.value.unshift({
    id: eventId++,
    type,
    data
  })
  
  // Keep only last 5 events
  if (events.value.length > 5) {
    events.value = events.value.slice(0, 5)
  }
}
</script>

<style lang="scss" scoped>
.otp-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #1f2937;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1.125rem;
  }
}

.demo-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  
  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #374151;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
}

.demo-controls {
  margin-bottom: 1.5rem;
  
  p {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.demo-item {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.demo-output {
  margin-top: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  
  strong {
    color: #374151;
  }
}

.demo-message {
  margin-top: 0.5rem;
  color: #059669;
  font-weight: 500;
}

.demo-events {
  margin-top: 0.5rem;
  
  ul {
    margin: 0.5rem 0 0 1rem;
    padding: 0;
    
    li {
      margin-bottom: 0.25rem;
      color: #6b7280;
    }
  }
}

.demo-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .demo-header h1 {
    color: #f9fafb;
  }
  
  .demo-header p {
    color: #d1d5db;
  }
  
  .demo-section {
    background: #1f2937;
    border-color: #374151;
    
    h2, h3 {
      color: #f9fafb;
    }
  }
  
  .demo-item {
    background: #111827;
    border-color: #374151;
  }
  
  .demo-output {
    background: #374151;
    color: #d1d5db;
    
    strong {
      color: #f9fafb;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .otp-demo {
    padding: 1rem;
  }
  
  .demo-section {
    padding: 1.5rem;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .demo-item {
    padding: 1rem;
  }
}
</style>
