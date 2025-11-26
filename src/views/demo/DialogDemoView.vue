<template>
  <div class="dialog-demo">
    <div class="demo-header">
      <h1>FcxDialog Component Demo</h1>
      <p>Comprehensive dialog component based on PrimeVue Dialog API</p>
    </div>

    <div class="demo-section">
      <h2>Basic Dialog</h2>
      <div class="demo-controls">
        <button @click="basicDialog = true" class="demo-button">Show Basic Dialog</button>
      </div>
      
      <FcxDialog
        v-model:visible="basicDialog"
        header="Basic Dialog"
        :style="{ width: '450px' }"
      >
        <p>This is a basic dialog with default settings.</p>
        <p>You can close it by clicking the X button, pressing Escape, or clicking outside the dialog.</p>
        
        <template #footer>
          <button @click="basicDialog = false" class="demo-button demo-button--secondary">Cancel</button>
          <button @click="basicDialog = false" class="demo-button demo-button--primary">OK</button>
        </template>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Size Variants</h2>
      <div class="demo-controls">
        <button @click="showSizeDialog('small')" class="demo-button">Small</button>
        <button @click="showSizeDialog('medium')" class="demo-button">Medium</button>
        <button @click="showSizeDialog('large')" class="demo-button">Large</button>
        <button @click="showSizeDialog('fullscreen')" class="demo-button">Fullscreen</button>
      </div>
      
      <FcxDialog
        v-model:visible="sizeDialog.visible"
        :header="`${sizeDialog.size} Dialog`"
        :size="sizeDialog.size"
      >
        <p>This is a {{ sizeDialog.size }} dialog.</p>
        <p>Different sizes provide different default widths and behaviors.</p>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Position Variants</h2>
      <div class="demo-controls">
        <button @click="showPositionDialog('center')" class="demo-button">Center</button>
        <button @click="showPositionDialog('top')" class="demo-button">Top</button>
        <button @click="showPositionDialog('bottom')" class="demo-button">Bottom</button>
        <button @click="showPositionDialog('left')" class="demo-button">Left</button>
        <button @click="showPositionDialog('right')" class="demo-button">Right</button>
        <button @click="showPositionDialog('topleft')" class="demo-button">Top Left</button>
        <button @click="showPositionDialog('topright')" class="demo-button">Top Right</button>
      </div>
      
      <FcxDialog
        v-model:visible="positionDialog.visible"
        :header="`${positionDialog.position} Position`"
        :position="positionDialog.position"
        :style="{ width: '400px' }"
      >
        <p>This dialog is positioned at {{ positionDialog.position }}.</p>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Interactive Features</h2>
      <div class="demo-controls">
        <button @click="draggableDialog = true" class="demo-button">Draggable</button>
        <button @click="resizableDialog = true" class="demo-button">Resizable</button>
        <button @click="maximizableDialog = true" class="demo-button">Maximizable</button>
        <button @click="showInteractiveDialog()" class="demo-button">All Features</button>
      </div>
      
      <!-- Draggable Dialog -->
      <FcxDialog
        v-model:visible="draggableDialog"
        header="Draggable Dialog"
        :draggable="true"
        :style="{ width: '450px' }"
      >
        <p>This dialog can be dragged around by clicking and dragging the header.</p>
        <p>Try dragging it to different positions on the screen.</p>
      </FcxDialog>

      <!-- Resizable Dialog -->
      <FcxDialog
        v-model:visible="resizableDialog"
        header="Resizable Dialog"
        :resizable="true"
        :style="{ width: '450px', height: '300px' }"
      >
        <p>This dialog can be resized by dragging the resize handles on the edges and corners.</p>
        <p>Try resizing it to see the resize functionality in action.</p>
      </FcxDialog>

      <!-- Maximizable Dialog -->
      <FcxDialog
        v-model:visible="maximizableDialog"
        header="Maximizable Dialog"
        :maximizable="true"
        :style="{ width: '450px' }"
      >
        <p>This dialog has a maximize button in the header.</p>
        <p>Click the maximize button to toggle between normal and fullscreen modes.</p>
      </FcxDialog>

      <!-- All Features Dialog -->
      <FcxDialog
        v-model:visible="interactiveDialog"
        header="Interactive Dialog"
        :draggable="true"
        :resizable="true"
        :maximizable="true"
        :style="{ width: '500px', height: '350px' }"
      >
        <p>This dialog combines all interactive features:</p>
        <ul>
          <li><strong>Draggable:</strong> Drag the header to move</li>
          <li><strong>Resizable:</strong> Drag edges/corners to resize</li>
          <li><strong>Maximizable:</strong> Click maximize button to fullscreen</li>
        </ul>
        <p>Try all the different interactions!</p>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Theme Variants</h2>
      <div class="demo-controls">
        <button @click="showThemeDialog('default')" class="demo-button">Default</button>
        <button @click="showThemeDialog('minimal')" class="demo-button">Minimal</button>
        <button @click="showThemeDialog('bordered')" class="demo-button">Bordered</button>
      </div>
      
      <FcxDialog
        v-model:visible="themeDialog.visible"
        :header="`${themeDialog.theme} Theme`"
        :theme="themeDialog.theme"
        :style="{ width: '450px' }"
      >
        <p>This dialog uses the {{ themeDialog.theme }} theme variant.</p>
        <p>Different themes provide different visual styles and borders.</p>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Custom Styling</h2>
      <div class="demo-controls">
        <button @click="styledDialog = true" class="demo-button">Custom Styled</button>
      </div>
      
      <FcxDialog
        v-model:visible="styledDialog"
        header="Custom Styled Dialog"
        :rounded="true"
        :shadow="true"
        :style="{ width: '500px' }"
        class="custom-dialog"
      >
        <p>This dialog has custom styling applied:</p>
        <ul>
          <li>Rounded corners</li>
          <li>Enhanced shadow</li>
          <li>Custom CSS classes</li>
        </ul>
        
        <template #footer>
          <button @click="styledDialog = false" class="demo-button demo-button--danger">Close</button>
        </template>
      </FcxDialog>
    </div>

    <div class="demo-section">
      <h2>Non-Modal Dialog</h2>
      <div class="demo-controls">
        <button @click="nonModalDialog = true" class="demo-button">Show Non-Modal</button>
      </div>
      
      <FcxDialog
        v-model:visible="nonModalDialog"
        header="Non-Modal Dialog"
        :modal="false"
        :style="{ width: '400px' }"
        position="topright"
      >
        <p>This is a non-modal dialog.</p>
        <p>You can interact with the background content while this dialog is open.</p>
        <p>It doesn't block the page or show a backdrop.</p>
      </FcxDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FcxDialog } from '@/components/datacomponents'
import type { DialogPosition, DialogSize, DialogTheme } from '@/components/datacomponents'

// Basic dialog
const basicDialog = ref(false)

// Size variants
const sizeDialog = ref({
  visible: false,
  size: 'medium' as DialogSize
})

const showSizeDialog = (size: DialogSize) => {
  sizeDialog.value.size = size
  sizeDialog.value.visible = true
}

// Position variants
const positionDialog = ref({
  visible: false,
  position: 'center' as DialogPosition
})

const showPositionDialog = (position: DialogPosition) => {
  positionDialog.value.position = position
  positionDialog.value.visible = true
}

// Interactive features
const draggableDialog = ref(false)
const resizableDialog = ref(false)
const maximizableDialog = ref(false)
const interactiveDialog = ref(false)

const showInteractiveDialog = () => {
  interactiveDialog.value = true
}

// Theme variants
const themeDialog = ref({
  visible: false,
  theme: 'default' as DialogTheme
})

const showThemeDialog = (theme: DialogTheme) => {
  themeDialog.value.theme = theme
  themeDialog.value.visible = true
}

// Custom styling
const styledDialog = ref(false)

// Non-modal
const nonModalDialog = ref(false)
</script>

<style lang="scss" scoped>
.dialog-demo {
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
}

.demo-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.demo-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  // Default button
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  
  &:hover {
    background: #2563eb;
    border-color: #2563eb;
  }
  
  // Secondary variant
  &--secondary {
    background: transparent;
    color: #6b7280;
    border-color: #d1d5db;
    
    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }
  
  // Primary variant
  &--primary {
    background: #059669;
    color: white;
    border-color: #059669;
    
    &:hover {
      background: #047857;
      border-color: #047857;
    }
  }
  
  // Danger variant
  &--danger {
    background: #dc2626;
    color: white;
    border-color: #dc2626;
    
    &:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }
  }
}

// Custom dialog styling
:deep(.custom-dialog) {
  fcx-dialog-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.2);
  }
  
  fcx-dialog-title {
    color: white;
  }
  
  fcx-dialog-header-icon {
    color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
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
    
    h2 {
      color: #f9fafb;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .dialog-demo {
    padding: 1rem;
  }
  
  .demo-section {
    padding: 1.5rem;
  }
  
  .demo-controls {
    gap: 0.5rem;
  }
  
  .demo-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
