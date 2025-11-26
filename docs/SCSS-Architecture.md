# SCSS Architecture Guide

This guide covers the SCSS architecture, design system, and styling conventions used in the FincorpX application.

## Overview

The application uses a modern SCSS architecture with design tokens, mixins, and a component-based approach. The codebase has been updated to use modern Sass syntax (`@use` and `map.get()`) to eliminate deprecation warnings and prepare for Dart Sass 3.0.0.

## File Structure

```
src/styles/
├── _variables.scss      # Design tokens and theme variables
├── _mixins.scss        # Reusable SCSS mixins
├── base.scss           # Base styles and utilities
├── rtl.scss           # RTL-specific styles
└── themes/
    ├── variables.css   # CSS custom properties
    └── dark.css       # Dark theme overrides

src/components/
└── form/
    └── styles/
        ├── fcx-inputtext.scss
        └── fcx-dropdown.scss
```

## Modern Sass Syntax

The codebase uses modern Sass syntax to avoid deprecation warnings:

### Before (Deprecated)
```scss
@import 'variables';

.component {
  padding: map-get($spacing, md);
}
```

### After (Modern)
```scss
@use "sass:map";
@use 'variables' as *;

.component {
  padding: map.get($spacing, md);
}
```

## Design Tokens (`_variables.scss`)

### Color System

The color system is organized into theme maps supporting both light and dark themes:

```scss
$theme-colors: (
  light: (
    // Primary colors
    primary-50: #eff6ff,
    primary-100: #dbeafe,
    primary-200: #bfdbfe,
    primary-300: #93c5fd,
    primary-400: #60a5fa,
    primary-500: #3b82f6,  // Main primary color
    primary-600: #2563eb,
    primary-700: #1d4ed8,
    primary-800: #1e40af,
    primary-900: #1e3a8a,
    
    // Gray scale
    gray-50: #f9fafb,
    gray-100: #f3f4f6,
    gray-200: #e5e7eb,
    gray-300: #d1d5db,
    gray-400: #9ca3af,
    gray-500: #6b7280,
    gray-600: #4b5563,
    gray-700: #374151,
    gray-800: #1f2937,
    gray-900: #111827,
    
    // Semantic colors
    success-50: #f0fdf4,
    success-500: #22c55e,
    success-600: #16a34a,
    
    warning-50: #fffbeb,
    warning-500: #f59e0b,
    warning-600: #d97706,
    
    error-50: #fef2f2,
    error-500: #ef4444,
    error-600: #dc2626,
    
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
    // Dark theme variants with inverted/adjusted colors
    primary-500: #60a5fa,
    background: #0f172a,
    surface: #1e293b,
    text-primary: #f8fafc,
    // ... other dark theme colors
  )
);
```

### Spacing System

Consistent spacing scale based on 4px increments:

```scss
$spacing: (
  xs: 4px,   // 0.25rem
  sm: 8px,   // 0.5rem
  md: 12px,  // 0.75rem
  lg: 16px,  // 1rem
  xl: 24px,  // 1.5rem
  2xl: 32px, // 2rem
  3xl: 48px  // 3rem
);
```

Usage:
```scss
.component {
  padding: map.get($spacing, md);
  margin: map.get($spacing, lg);
}
```

### Typography Scale

Harmonious font size scale:

```scss
$font-sizes: (
  xs: 12px,  // 0.75rem
  sm: 14px,  // 0.875rem
  md: 16px,  // 1rem (base)
  lg: 18px,  // 1.125rem
  xl: 20px,  // 1.25rem
  2xl: 24px, // 1.5rem
  3xl: 30px  // 1.875rem
);

$font-weights: (
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
);
```

### Border Radius

Consistent border radius scale:

```scss
$border-radius: (
  sm: 4px,
  md: 6px,
  lg: 8px,
  xl: 12px,
  2xl: 16px,
  full: 9999px
);
```

### Shadows

Elevation system with light and dark variants:

```scss
$shadows: (
  sm: (0 1px 2px 0 rgba(0, 0, 0, 0.05)),
  md: (0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)),
  lg: (0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)),
  xl: (0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04))
);

$dark-shadows: (
  sm: (0 1px 2px 0 rgba(0, 0, 0, 0.3)),
  md: (0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)),
  // ... darker shadow variants
);
```

### Component Sizes

Standardized component sizing:

```scss
$component-sizes: (
  sm: (
    height: 36px,
    padding: map.get($spacing, sm) map.get($spacing, md),
    font-size: map.get($font-sizes, sm)
  ),
  md: (
    height: 44px,
    padding: map.get($spacing, md),
    font-size: map.get($font-sizes, md)
  ),
  lg: (
    height: 52px,
    padding: map.get($spacing, lg),
    font-size: map.get($font-sizes, lg)
  )
);
```

## Mixins (`_mixins.scss`)

### Theme Colors Mixin

Generates CSS custom properties for themes:

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

### Component Size Mixin

Applies consistent sizing to components:

```scss
@mixin component-size($size) {
  $size-map: map.get($component-sizes, $size);
  
  @if $size-map {
    min-height: map.get($size-map, height);
    padding: map.get($size-map, padding);
    font-size: map.get($size-map, font-size);
  } @else {
    @warn "Component size '#{$size}' not found in $component-sizes map.";
  }
}
```

Usage:
```scss
.my-input {
  @include component-size(md);
}
```

### Responsive Breakpoint Mixin

Mobile-first responsive design:

```scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  2xl: 1536px
);

@mixin breakpoint($size) {
  $breakpoint: map.get($breakpoints, $size);
  
  @if $breakpoint {
    @media (min-width: $breakpoint) {
      @content;
    }
  } @else {
    @warn "Breakpoint '#{$size}' not found in $breakpoints map.";
  }
}
```

Usage:
```scss
.responsive-component {
  display: block;
  
  @include breakpoint(md) {
    display: flex;
  }
  
  @include breakpoint(lg) {
    justify-content: space-between;
  }
}
```

### Form Field Base Mixin

Consistent form field styling:

```scss
@mixin form-field-base {
  width: 100%;
  font-family: inherit;
  line-height: 1.5;
  color: var(--fcx-text-primary);
  background-color: var(--fcx-surface);
  border: 1px solid var(--fcx-border-normal);
  border-radius: map.get($border-radius, md);
  outline: none;
  @include fcx-transition(border-color, box-shadow, background-color);
  
  &::placeholder {
    color: var(--fcx-text-muted);
    opacity: 1;
  }
  
  &:hover:not(:disabled) {
    border-color: var(--fcx-border-strong);
    background-color: var(--fcx-surface-hover);
  }
  
  &:focus {
    border-color: var(--fcx-primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: var(--fcx-surface);
  }
  
  &:disabled {
    background-color: var(--fcx-surface-active);
    color: var(--fcx-text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }
}
```

### Form Field States Mixin

Error and success states for form fields:

```scss
@mixin form-field-states {
  &--error {
    border-color: var(--fcx-error-500);
    
    &:focus {
      border-color: var(--fcx-error-500);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
  
  &--success {
    border-color: var(--fcx-success-500);
    
    &:focus {
      border-color: var(--fcx-success-500);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }
}
```

### Utility Mixins

Common utility mixins:

```scss
// Flex center
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Visually hidden (accessibility)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Focus ring
@mixin focus-ring($offset: 2px) {
  outline: 2px solid var(--fcx-focus-ring);
  outline-offset: $offset;
}

// Transitions
@mixin fcx-transition($properties...) {
  @if length($properties) == 0 {
    $properties: all;
  }
  transition: #{$properties} $transition-duration $transition-timing;
}

// Custom scrollbar
@mixin custom-scrollbar($width: 6px) {
  &::-webkit-scrollbar {
    width: $width;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--fcx-surface-hover);
    border-radius: calc($width / 2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--fcx-border-strong);
    border-radius: calc($width / 2);
    
    &:hover {
      background: var(--fcx-text-secondary);
    }
  }
}
```

## Base Styles (`base.scss`)

### CSS Custom Properties Generation

Automatically generates CSS custom properties from design tokens:

```scss
:root {
  // Transition settings
  --fcx-transition-duration: #{$transition-duration};
  --fcx-transition-timing: #{$transition-timing};
  
  // Border radius
  @each $key, $value in $border-radius {
    --fcx-border-radius-#{$key}: #{$value};
  }
  
  // Spacing
  @each $key, $value in $spacing {
    --fcx-spacing-#{$key}: #{$value};
  }
  
  // Font sizes
  @each $key, $value in $font-sizes {
    --fcx-font-size-#{$key}: #{$value};
  }
}
```

### Utility Classes

Pre-built utility classes for common patterns:

```scss
// Text utilities
.fcx-text {
  &-left { text-align: left; }
  &-center { text-align: center; }
  &-right { text-align: right; }
  
  &-primary { color: var(--fcx-text-primary); }
  &-secondary { color: var(--fcx-text-secondary); }
  &-muted { color: var(--fcx-text-muted); }
  
  @each $key, $value in $font-sizes {
    &-#{$key} { font-size: $value; }
  }
}

// Background utilities
.fcx-bg {
  &-background { background-color: var(--fcx-background); }
  &-surface { background-color: var(--fcx-surface); }
  &-primary { background-color: var(--fcx-primary-500); }
}

// Spacing utilities (generated)
@include generate-spacing-utilities('fcx-m', 'margin');
@include generate-spacing-utilities('fcx-p', 'padding');
```

## Component Styling

### File Organization

Each component has its own SCSS file in the component directory:

```scss
// src/components/form/styles/fcx-inputtext.scss
@use "sass:map";
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.fcx-inputtext {
  @include form-field-base;
  @include component-size(md);
  
  // Size variants
  &--sm {
    @include component-size(sm);
  }
  
  &--lg {
    @include component-size(lg);
  }
  
  // States
  @include form-field-states;
}
```

### BEM Methodology

Components follow BEM (Block Element Modifier) naming convention:

```scss
// Block
.fcx-inputtext {
  // Base styles
}

// Elements
.fcx-inputtext-wrapper {
  // Wrapper styles
}

.fcx-inputtext-icon {
  // Icon styles
  
  &--prefix {
    // Prefix icon modifier
  }
  
  &--suffix {
    // Suffix icon modifier
  }
}

// Modifiers
.fcx-inputtext {
  &--sm {
    // Small size modifier
  }
  
  &--error {
    // Error state modifier
  }
  
  &--disabled {
    // Disabled state modifier
  }
}
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```scss
// Good
.component {
  padding: map.get($spacing, md);
  font-size: map.get($font-sizes, sm);
  border-radius: map.get($border-radius, md);
}

// Avoid
.component {
  padding: 12px;
  font-size: 14px;
  border-radius: 6px;
}
```

### 2. Leverage Mixins

Use mixins for common patterns:

```scss
// Good
.form-field {
  @include form-field-base;
  @include component-size(md);
  @include form-field-states;
}

// Avoid repeating styles
.form-field {
  width: 100%;
  font-family: inherit;
  // ... many repeated styles
}
```

### 3. Use CSS Custom Properties

Use CSS custom properties for themeable values:

```scss
// Good
.component {
  color: var(--fcx-text-primary);
  background: var(--fcx-surface);
  border-color: var(--fcx-border-normal);
}

// Avoid hardcoded theme colors
.component {
  color: #111827;
  background: #ffffff;
  border-color: #e5e7eb;
}
```

### 4. Mobile-First Responsive Design

Use mobile-first approach with breakpoint mixins:

```scss
.component {
  // Mobile styles (default)
  display: block;
  
  @include breakpoint(md) {
    // Tablet styles
    display: flex;
  }
  
  @include breakpoint(lg) {
    // Desktop styles
    justify-content: space-between;
  }
}
```

### 5. Consistent Naming

Follow consistent naming conventions:
- Use `fcx-` prefix for utility classes
- Use BEM methodology for components
- Use semantic names for colors and spacing

### 6. Performance Considerations

- Use `@use` instead of `@import` for better performance
- Avoid deep nesting (max 3-4 levels)
- Use mixins to reduce code duplication
- Leverage CSS custom properties for runtime theming

## Migration Guide

### From Legacy Sass to Modern Syntax

1. **Replace `@import` with `@use`**:
```scss
// Before
@import 'variables';
@import 'mixins';

// After
@use "sass:map";
@use 'variables' as *;
@use 'mixins' as *;
```

2. **Replace `map-get()` with `map.get()`**:
```scss
// Before
padding: map-get($spacing, md);

// After
padding: map.get($spacing, md);
```

3. **Add namespace imports when needed**:
```scss
@use "sass:map";
@use "sass:math";
@use "sass:string";
```

This migration eliminates all Sass deprecation warnings and prepares the codebase for future Sass versions.
