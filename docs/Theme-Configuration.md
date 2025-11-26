# Theme Configuration Guide

This guide covers the theming system, dark mode support, and theme customization in the FincorpX application.

## Overview

The application features a comprehensive theming system that supports light and dark themes with seamless switching. The system uses CSS custom properties (CSS variables) for dynamic theme changes without page reloads.

## Theme Architecture

### CSS Custom Properties

The theming system is built on CSS custom properties that are dynamically generated from SCSS design tokens:

```css
:root {
  /* Light theme (default) */
  --fcx-primary-500: #3b82f6;
  --fcx-background: #ffffff;
  --fcx-surface: #ffffff;
  --fcx-text-primary: #111827;
  --fcx-border-normal: #e5e7eb;
}

:root[data-theme="dark"] {
  /* Dark theme */
  --fcx-primary-500: #60a5fa;
  --fcx-background: #0f172a;
  --fcx-surface: #1e293b;
  --fcx-text-primary: #f8fafc;
  --fcx-border-normal: #475569;
}
```

### Theme Structure

Themes are organized into semantic color categories:

#### Primary Colors
- `primary-50` to `primary-900` - Brand color scale
- Main brand color is `primary-500`

#### Gray Scale
- `gray-50` to `gray-900` - Neutral color scale
- Used for text, borders, and backgrounds

#### Semantic Colors
- `success-*` - Success states (green)
- `warning-*` - Warning states (orange)
- `error-*` - Error states (red)
- `info-*` - Information states (blue)

#### Component Colors
- `background` - Page background
- `surface` - Card/component backgrounds
- `surface-hover` - Hover states
- `surface-active` - Active/pressed states

#### Text Colors
- `text-primary` - Main text color
- `text-secondary` - Secondary text color
- `text-muted` - Muted/disabled text color
- `text-inverse` - Inverse text color

#### Border Colors
- `border-light` - Light borders
- `border-normal` - Standard borders
- `border-strong` - Emphasized borders

## Theme Configuration

### useTheme Composable

The `useTheme` composable provides theme management functionality:

```typescript
// src/composables/useTheme.ts
import { ref, computed, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')
  
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }
  
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }
  
  const applyTheme = (themeName: Theme) => {
    document.documentElement.setAttribute('data-theme', themeName)
    document.documentElement.classList.toggle('dark', themeName === 'dark')
  }
  
  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
  }
  
  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
  
  return {
    theme: readonly(theme),
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme
  }
}
```

### Usage in Components

```vue
<template>
  <div>
    <button @click="toggleTheme">
      {{ isDark ? 'Light Mode' : 'Dark Mode' }}
    </button>
    
    <div class="themed-component">
      Content that adapts to theme
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.themed-component {
  background-color: var(--fcx-surface);
  color: var(--fcx-text-primary);
  border: 1px solid var(--fcx-border-normal);
}
</style>
```

## Theme Generation

### SCSS Theme Maps

Themes are defined in SCSS maps in `_variables.scss`:

```scss
$theme-colors: (
  light: (
    // Primary colors
    primary-50: #eff6ff,
    primary-100: #dbeafe,
    primary-200: #bfdbfe,
    primary-300: #93c5fd,
    primary-400: #60a5fa,
    primary-500: #3b82f6,
    primary-600: #2563eb,
    primary-700: #1d4ed8,
    primary-800: #1e40af,
    primary-900: #1e3a8a,
    
    // Component colors
    background: #ffffff,
    surface: #ffffff,
    surface-hover: #f9fafb,
    surface-active: #f3f4f6,
    
    text-primary: #111827,
    text-secondary: #6b7280,
    text-muted: #9ca3af,
    text-inverse: #ffffff,
    
    border-light: #f3f4f6,
    border-normal: #e5e7eb,
    border-strong: #d1d5db,
    
    focus-ring: #3b82f6,
    focus-ring-offset: #ffffff
  ),
  
  dark: (
    // Primary colors - adjusted for dark theme
    primary-50: #1e3a8a,
    primary-100: #1e40af,
    primary-200: #1d4ed8,
    primary-300: #2563eb,
    primary-400: #3b82f6,
    primary-500: #60a5fa,
    primary-600: #93c5fd,
    primary-700: #bfdbfe,
    primary-800: #dbeafe,
    primary-900: #eff6ff,
    
    // Component colors for dark theme
    background: #0f172a,
    surface: #1e293b,
    surface-hover: #334155,
    surface-active: #475569,
    
    text-primary: #f8fafc,
    text-secondary: #cbd5e1,
    text-muted: #94a3b8,
    text-inverse: #0f172a,
    
    border-light: #334155,
    border-normal: #475569,
    border-strong: #64748b,
    
    focus-ring: #60a5fa,
    focus-ring-offset: #0f172a
  )
);
```

### Theme Mixin

The `theme-colors` mixin generates CSS custom properties:

```scss
@mixin theme-colors($theme-name) {
  $theme-map: map.get($theme-colors, $theme-name);
  
  @each $key, $value in $theme-map {
    --fcx-#{$key}: #{$value};
  }
  
  // Add shadows based on theme
  @if $theme-name == 'dark' {
    @each $key, $value in $dark-shadows {
      --fcx-shadow-#{$key}: #{$value};
    }
  } @else {
    @each $key, $value in $shadows {
      --fcx-shadow-#{$key}: #{$value};
    }
  }
}
```

### Applying Themes

Themes are applied in `base.scss`:

```scss
// Generate CSS custom properties for themes
:root,
:root[data-theme="light"],
.light {
  @include theme-colors(light);
}

:root[data-theme="dark"],
.dark {
  @include theme-colors(dark);
}
```

## Dark Theme Considerations

### Color Adjustments

Dark themes require careful color adjustments:

1. **Inverted Hierarchy**: Light colors become dark and vice versa
2. **Reduced Contrast**: Slightly lower contrast for eye comfort
3. **Adjusted Shadows**: Darker, more prominent shadows
4. **Focus States**: Adjusted focus ring colors for visibility

### Dark Theme Shadows

```scss
$dark-shadows: (
  sm: (0 1px 2px 0 rgba(0, 0, 0, 0.3)),
  md: (0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)),
  lg: (0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)),
  xl: (0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3))
);
```

### Dark Theme Focus States

Special focus adjustments for dark theme:

```scss
@mixin dark-theme-focus {
  :root[data-theme="dark"] &,
  .dark & {
    &:focus {
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    &--error:focus {
      box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
    }
    
    &--success:focus {
      box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
    }
  }
}
```

## Creating Custom Themes

### 1. Define Theme Colors

Add a new theme to the `$theme-colors` map:

```scss
$theme-colors: (
  light: (
    // existing light theme
  ),
  dark: (
    // existing dark theme
  ),
  purple: (
    primary-500: #8b5cf6,
    primary-600: #7c3aed,
    background: #faf5ff,
    surface: #ffffff,
    text-primary: #1f2937,
    text-secondary: #6b7280,
    border-normal: #e5e7eb,
    // ... other colors
  )
);
```

### 2. Generate CSS Custom Properties

Add the theme application in `base.scss`:

```scss
:root[data-theme="purple"],
.purple {
  @include theme-colors(purple);
}
```

### 3. Update Theme Type

Update the theme type in the composable:

```typescript
type Theme = 'light' | 'dark' | 'purple'
```

### 4. Add Theme Selector

Update your theme selector component:

```vue
<template>
  <select v-model="currentTheme" @change="setTheme(currentTheme)">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="purple">Purple</option>
  </select>
</template>
```

## Theme Switcher Component

### Basic Theme Toggle

```vue
<template>
  <button 
    @click="toggleTheme"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="isDark" class="sun-icon">
      <!-- Sun icon SVG -->
    </svg>
    <svg v-else class="moon-icon">
      <!-- Moon icon SVG -->
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  padding: 0.5rem;
  border: none;
  background: var(--fcx-surface);
  color: var(--fcx-text-primary);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: var(--fcx-surface-hover);
}

.sun-icon,
.moon-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
```

### Advanced Theme Selector

```vue
<template>
  <div class="theme-selector">
    <label for="theme-select">Theme:</label>
    <select 
      id="theme-select"
      v-model="currentTheme" 
      @change="handleThemeChange"
      class="theme-select"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, setTheme } = useTheme()
const currentTheme = ref('system')

const handleThemeChange = () => {
  if (currentTheme.value === 'system') {
    // Follow system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(systemPrefersDark ? 'dark' : 'light')
    localStorage.removeItem('theme') // Let system preference take over
  } else {
    setTheme(currentTheme.value as 'light' | 'dark')
  }
}

// Initialize from localStorage
const savedTheme = localStorage.getItem('theme')
currentTheme.value = savedTheme || 'system'
</script>

<style scoped>
.theme-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--fcx-border-normal);
  border-radius: 0.25rem;
  background: var(--fcx-surface);
  color: var(--fcx-text-primary);
}
</style>
```

## System Integration

### Initialize Theme on App Start

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { useTheme } from '@/composables/useTheme'

const app = createApp(App)

// Initialize theme before mounting
const { initializeTheme } = useTheme()
initializeTheme()

app.mount('#app')
```

### Prevent Flash of Unstyled Content

Add a script in `index.html` to prevent theme flash:

```html
<script>
  // Prevent flash of unstyled content
  (function() {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  })()
</script>
```

## Best Practices

### 1. Use Semantic Color Names

```scss
// Good
color: var(--fcx-text-primary);
background: var(--fcx-surface);

// Avoid
color: var(--fcx-gray-900);
background: var(--fcx-white);
```

### 2. Test Both Themes

Always test components in both light and dark themes:
- Check color contrast ratios
- Verify readability
- Test interactive states
- Ensure proper focus visibility

### 3. Smooth Transitions

Add transitions for theme changes:

```scss
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

// Disable transitions during theme initialization
.theme-transition-disabled * {
  transition: none !important;
}
```

### 4. Accessibility Considerations

- Maintain sufficient color contrast (WCAG AA: 4.5:1 for normal text)
- Provide theme preference controls
- Respect system preferences
- Test with screen readers

### 5. Performance Optimization

- Use CSS custom properties for runtime theme switching
- Avoid JavaScript-based theme switching for better performance
- Minimize the number of theme-dependent properties

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check if `data-theme` attribute is set correctly
2. **Flash of unstyled content**: Add theme initialization script to HTML
3. **Colors not updating**: Ensure CSS custom properties are used instead of hardcoded colors
4. **Poor contrast in dark theme**: Adjust color values for better accessibility

### Debug Theme Issues

```javascript
// Check current theme
console.log(document.documentElement.getAttribute('data-theme'))

// List all CSS custom properties
const styles = getComputedStyle(document.documentElement)
const customProps = Array.from(styles).filter(prop => prop.startsWith('--fcx-'))
console.log(customProps)
```

This comprehensive theming system provides a solid foundation for creating beautiful, accessible, and user-friendly interfaces that adapt to user preferences and system settings.
