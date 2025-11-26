<template>
  <div class="button-demo">
    <div class="button-demo-header">
      <h1>Fcx Button Components Demo</h1>
      <p>Comprehensive showcase of all button variants with theme integration</p>
    </div>

    <!-- FcxButton Demos -->
    <section class="button-demo-section">
      <h2>FcxButton - Main Button Component</h2>
      
      <!-- Size Variants -->
      <div class="button-demo-group">
        <h3>Size Variants</h3>
        <div class="button-demo-row">
          <FcxButton label="Small Button" size="small" />
          <FcxButton label="Medium Button" size="medium" />
          <FcxButton label="Large Button" size="large" />
        </div>
      </div>

      <!-- Severity Variants -->
      <div class="button-demo-group">
        <h3>Severity Variants (Filled)</h3>
        <div class="button-demo-row">
          <FcxButton label="Primary" severity="primary" />
          <FcxButton label="Secondary" severity="secondary" />
          <FcxButton label="Success" severity="success" />
          <FcxButton label="Info" severity="info" />
          <FcxButton label="Warning" severity="warning" />
          <FcxButton label="Danger" severity="danger" />
          <FcxButton label="Help" severity="help" />
        </div>
      </div>

      <!-- Style Variants -->
      <div class="button-demo-group">
        <h3>Style Variants</h3>
        <div class="button-demo-row">
          <FcxButton label="Filled" variant="filled" />
          <FcxButton label="Outlined" variant="outlined" />
          <FcxButton label="Text" variant="text" />
          <FcxButton label="Ghost" variant="ghost" />
        </div>
      </div>

      <!-- Outlined Variants -->
      <div class="button-demo-group">
        <h3>Outlined Variants</h3>
        <div class="button-demo-row">
          <FcxButton label="Primary" severity="primary" variant="outlined" />
          <FcxButton label="Secondary" severity="secondary" variant="outlined" />
          <FcxButton label="Success" severity="success" variant="outlined" />
          <FcxButton label="Info" severity="info" variant="outlined" />
          <FcxButton label="Warning" severity="warning" variant="outlined" />
          <FcxButton label="Danger" severity="danger" variant="outlined" />
        </div>
      </div>

      <!-- Text Variants -->
      <div class="button-demo-group">
        <h3>Text Variants</h3>
        <div class="button-demo-row">
          <FcxButton label="Primary" severity="primary" variant="text" />
          <FcxButton label="Secondary" severity="secondary" variant="text" />
          <FcxButton label="Success" severity="success" variant="text" />
          <FcxButton label="Info" severity="info" variant="text" />
          <FcxButton label="Warning" severity="warning" variant="text" />
          <FcxButton label="Danger" severity="danger" variant="text" />
        </div>
      </div>

      <!-- With Icons -->
      <div class="button-demo-group">
        <h3>Buttons with Icons</h3>
        <div class="button-demo-row">
          <FcxButton label="Save" icon="fas fa-save" />
          <FcxButton label="Delete" icon="fas fa-trash" severity="danger" />
          <FcxButton label="Edit" icon="fas fa-edit" severity="info" variant="outlined" />
          <FcxButton label="Download" icon="fas fa-download" iconPos="right" />
        </div>
      </div>

      <!-- Special States -->
      <div class="button-demo-group">
        <h3>Special States</h3>
        <div class="button-demo-row">
          <FcxButton label="Loading" :loading="true" />
          <FcxButton label="Disabled" :disabled="true" />
          <FcxButton label="Raised" :raised="true" />
          <FcxButton label="Rounded" :rounded="true" />
          <FcxButton label="Block Button" :block="true" class="block-demo" />
        </div>
      </div>

      <!-- Icon Only Buttons -->
      <div class="button-demo-group">
        <h3>Icon Only Buttons</h3>
        <div class="button-demo-row">
          <FcxButton icon="fas fa-heart" :icon-only="true" severity="danger" />
          <FcxButton icon="fas fa-star" :icon-only="true" severity="warning" />
          <FcxButton icon="fas fa-thumbs-up" :icon-only="true" severity="success" />
          <FcxButton icon="fas fa-share" :icon-only="true" severity="info" variant="outlined" />
        </div>
      </div>
    </section>

    <!-- FcxIconButton Demos -->
    <section class="button-demo-section">
      <h2>FcxIconButton - Icon Button Component</h2>
      
      <!-- Size Variants -->
      <div class="button-demo-group">
        <h3>Size Variants</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-cog" size="small" tooltip="Small Settings" />
          <FcxIconButton icon="fas fa-cog" size="medium" tooltip="Medium Settings" />
          <FcxIconButton icon="fas fa-cog" size="large" tooltip="Large Settings" />
        </div>
      </div>

      <!-- Shape Variants -->
      <div class="button-demo-group">
        <h3>Shape Variants</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-user" :rounded="true" tooltip="Rounded" />
          <FcxIconButton icon="fas fa-user" :rounded="false" tooltip="Square" />
        </div>
      </div>

      <!-- Severity Variants (Filled) -->
      <div class="button-demo-group">
        <h3>Severity Variants (Filled)</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-home" severity="primary" variant="filled" tooltip="Primary" />
          <FcxIconButton icon="fas fa-user" severity="secondary" variant="filled" tooltip="Secondary" />
          <FcxIconButton icon="fas fa-check" severity="success" variant="filled" tooltip="Success" />
          <FcxIconButton icon="fas fa-info" severity="info" variant="filled" tooltip="Info" />
          <FcxIconButton icon="fas fa-exclamation" severity="warning" variant="filled" tooltip="Warning" />
          <FcxIconButton icon="fas fa-times" severity="danger" variant="filled" tooltip="Danger" />
          <FcxIconButton icon="fas fa-question" severity="help" variant="filled" tooltip="Help" />
        </div>
      </div>

      <!-- Style Variants -->
      <div class="button-demo-group">
        <h3>Style Variants</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-heart" variant="filled" tooltip="Filled" />
          <FcxIconButton icon="fas fa-heart" variant="outlined" tooltip="Outlined" />
          <FcxIconButton icon="fas fa-heart" variant="text" tooltip="Text" />
          <FcxIconButton icon="fas fa-heart" variant="ghost" tooltip="Ghost" />
        </div>
      </div>

      <!-- Outlined Variants -->
      <div class="button-demo-group">
        <h3>Outlined Variants</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-home" severity="primary" variant="outlined" tooltip="Primary Outlined" />
          <FcxIconButton icon="fas fa-user" severity="secondary" variant="outlined" tooltip="Secondary Outlined" />
          <FcxIconButton icon="fas fa-check" severity="success" variant="outlined" tooltip="Success Outlined" />
          <FcxIconButton icon="fas fa-info" severity="info" variant="outlined" tooltip="Info Outlined" />
          <FcxIconButton icon="fas fa-exclamation" severity="warning" variant="outlined" tooltip="Warning Outlined" />
          <FcxIconButton icon="fas fa-times" severity="danger" variant="outlined" tooltip="Danger Outlined" />
        </div>
      </div>

      <!-- Ghost Variants -->
      <div class="button-demo-group">
        <h3>Ghost Variants</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-home" severity="primary" variant="ghost" tooltip="Primary Ghost" />
          <FcxIconButton icon="fas fa-user" severity="secondary" variant="ghost" tooltip="Secondary Ghost" />
          <FcxIconButton icon="fas fa-check" severity="success" variant="ghost" tooltip="Success Ghost" />
          <FcxIconButton icon="fas fa-info" severity="info" variant="ghost" tooltip="Info Ghost" />
          <FcxIconButton icon="fas fa-exclamation" severity="warning" variant="ghost" tooltip="Warning Ghost" />
          <FcxIconButton icon="fas fa-times" severity="danger" variant="ghost" tooltip="Danger Ghost" />
        </div>
      </div>

      <!-- Special States -->
      <div class="button-demo-group">
        <h3>Special States</h3>
        <div class="button-demo-row">
          <FcxIconButton icon="fas fa-spinner" :loading="true" tooltip="Loading" />
          <FcxIconButton icon="fas fa-ban" :disabled="true" tooltip="Disabled" />
        </div>
      </div>
    </section>

    <!-- Interactive Demo -->
    <section class="button-demo-section">
      <h2>Interactive Demo</h2>
      <div class="button-demo-group">
        <h3>Click Counter</h3>
        <div class="button-demo-row">
          <FcxButton 
            :label="`Clicked ${clickCount} times`" 
            @click="incrementCounter"
            severity="primary"
          />
          <FcxIconButton 
            icon="fas fa-redo" 
            @click="resetCounter"
            severity="secondary"
            variant="outlined"
            tooltip="Reset Counter"
          />
        </div>
      </div>

      <div class="button-demo-group">
        <h3>Loading State Toggle</h3>
        <div class="button-demo-row">
          <FcxButton 
            :label="isLoading ? 'Loading...' : 'Start Loading'"
            :loading="isLoading"
            @click="toggleLoading"
            severity="info"
          />
        </div>
      </div>
    </section>

    <!-- Theme Integration Info -->
    <section class="button-demo-section">
      <h2>Theme Integration</h2>
      <div class="button-demo-group">
        <p>
          All buttons automatically adapt to your application's light/dark theme.
          They use the global theme colors defined in your SCSS variables and
          follow your established design system patterns.
        </p>
        <ul>
          <li><strong>Font Family:</strong> Inherits from your global font settings</li>
          <li><strong>Font Sizes:</strong> Uses your menu text size system (13px, 14px, 16px)</li>
          <li><strong>Font Weights:</strong> Uses your menu font weights (400, 500, 600)</li>
          <li><strong>Colors:</strong> Integrates with your theme color palette</li>
          <li><strong>Icons:</strong> Uses your menu icon sizing system</li>
          <li><strong>Transitions:</strong> Consistent with your global transition settings</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Interactive demo state
const clickCount = ref(0)
const isLoading = ref(false)

const incrementCounter = () => {
  clickCount.value++
}

const resetCounter = () => {
  clickCount.value = 0
}

const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
.button-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: inherit;
}

.button-demo-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--text-primary, #111827);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.125rem;
    color: var(--text-secondary, #6b7280);
  }
}

.button-demo-section {
  margin-bottom: 3rem;
  
  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary, #111827);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border-normal, #e5e7eb);
  }
}

.button-demo-group {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-primary, #111827);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary, #6b7280);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul {
    color: var(--text-secondary, #6b7280);
    line-height: 1.6;
    
    li {
      margin-bottom: 0.5rem;
      
      strong {
        color: var(--text-primary, #111827);
      }
    }
  }
}

.button-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  
  .block-demo {
    width: 100%;
    max-width: 300px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .button-demo {
    padding: 1rem;
  }
  
  .button-demo-header h1 {
    font-size: 2rem;
  }
  
  .button-demo-row {
    gap: 0.75rem;
  }
}

// Dark theme support
[data-theme="dark"] {
  .button-demo-header h1,
  .button-demo-section h2,
  .button-demo-group h3 {
    color: var(--text-primary, #f8fafc);
  }
  
  .button-demo-header p,
  .button-demo-group p,
  .button-demo-group ul {
    color: var(--text-secondary, #cbd5e1);
  }
  
  .button-demo-group ul li strong {
    color: var(--text-primary, #f8fafc);
  }
  
  .button-demo-section h2 {
    border-bottom-color: var(--border-normal, #475569);
  }
}
</style>
