# Form Components Styles

Comprehensive styling for all Fincorpx form components with full theme support, size variants, and state management.

## 📁 File Structure

```
styles/
├── _form-base.scss          # Base styles and mixins for all components
├── index.scss               # Central import file
├── fcx-checkbox.scss        # Checkbox component styles
├── fcx-radiobutton.scss     # Radio button component styles
├── fcx-textarea.scss        # Textarea component styles
├── fcx-inputnumber.scss     # Number input component styles
├── fcx-inputmask.scss       # Input mask component styles
├── fcx-togglebutton.scss    # Toggle/Switch component styles
├── fcx-calendar.scss        # Calendar/DatePicker component styles
├── fcx-autocomplete.scss    # AutoComplete component styles
└── fcx-multiselect.scss     # MultiSelect component styles
```

## 🎨 Features

### ✅ **Complete Coverage**
- ✨ All 10 form components styled
- 🎭 Light & Dark theme support
- 📏 Three size variants (sm, md, lg)
- 🎯 Multiple state management (error, success, disabled, loading)
- ♿ Full accessibility support (WCAG 2.1 compliant)
- 📱 Responsive design with mobile-first approach

### 🎨 **Design Tokens**
- Consistent color system using CSS custom properties
- Standardized spacing, typography, and border radius
- Smooth transitions and micro-interactions
- Theme-aware with automatic dark mode switching

### 🔧 **Mixins & Utilities**
- `_form-base.scss` provides reusable mixins
- Common patterns for input states
- Dropdown panel styles
- Icon positioning utilities
- Chip/tag styles for multi-value components

## 🚀 Usage

### Import All Styles

```scss
// In your main SCSS file
@use '@/components/formcomponents/styles' as *;
```

### Import Individual Components

```scss
// Import only what you need
@use '@/components/formcomponents/styles/fcx-checkbox' as *;
@use '@/components/formcomponents/styles/fcx-inputnumber' as *;
```

### Use with Vue Components

The styles automatically apply when you use the components:

```vue
<template>
  <FcxCheckbox
    name="terms"
    label="Accept Terms"
    size="md"
    required
  />
</template>
```

## 📐 Size Variants

All components support three size variants:

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `sm` | 36px   | 0.625rem 0.75rem | 13px | Compact forms, tables |
| `md` | 44px   | 0.75rem 0.875rem | 14px | **Default**, standard forms |
| `lg` | 52px   | 0.875rem 1rem    | 16px | Prominent forms, accessibility |

## 🎯 State Management

### Available States

```scss
// Error state
.fcx-component--error { }

// Success state
.fcx-component--success { }

// Disabled state
.fcx-component--disabled { }

// Loading state
.fcx-component--loading { }

// Focus state (automatic)
.fcx-component:focus { }
```

### Usage Example

```vue
<FcxInputtext
  name="email"
  :error="validationError"
  :success="isValid"
  :loading="isValidating"
  :disabled="isSubmitting"
/>
```

## 🌈 Theme Support

### Light Theme (Default)

```scss
:root {
  --fcx-primary-500: #3b82f6;
  --fcx-success-500: #22c55e;
  --fcx-error-500: #ef4444;
  --fcx-text-primary: #111827;
  --fcx-surface: #ffffff;
  // ... more variables
}
```

### Dark Theme

```scss
:root[data-theme="dark"] {
  --fcx-primary-500: #60a5fa;
  --fcx-text-primary: #f9fafb;
  --fcx-surface: #1e293b;
  // ... more variables
}
```

Switch themes by setting `data-theme` attribute:

```js
document.documentElement.setAttribute('data-theme', 'dark')
```

## 📦 Component Details

### 1. **FcxCheckbox**
- Custom checkmark animation
- Indeterminate state support
- Group layouts (vertical, horizontal, inline)
- Card and button variants available

### 2. **FcxRadioButton**
- Custom radio dot animation
- Group layouts with auto-alignment
- Card-style selection boxes
- Button group variant

### 3. **FcxTextarea**
- Auto-resize support
- Character counter with limit warnings
- Toolbar integration (optional)
- Mention/tag support

### 4. **FcxInputNumber**
- Increment/decrement buttons
- Multiple button layouts (horizontal, vertical, stacked)
- Currency/prefix/suffix support
- Formatted number display

### 5. **FcxInputMask**
- Format-specific styling (phone, date, credit card)
- Validation indicators
- Format hints
- Completion tracking

### 6. **FcxToggleButton**
- Smooth slide animation
- On/off labels inside switch
- External labeled variant
- Icon support (check/cross)

### 7. **FcxCalendar**
- Clean date picker interface
- Month/year navigation
- Today indicator
- Date range selection
- Time picker integration
- Multiple months view

### 8. **FcxAutoComplete**
- Search highlighting
- Avatar/icon support
- Categorized suggestions
- Multiple selection with chips
- Virtual scrolling ready

### 9. **FcxMultiSelect**
- Chip-based selection display
- Select all/clear all
- Search filtering
- Grouped options
- Custom item templates
- Count/comma display modes

## 🎨 Customization

### Override Default Colors

```scss
// In your component or styles
.fcx-checkbox {
  .p-checkbox-box.p-highlight {
    background-color: var(--your-primary-color);
    border-color: var(--your-primary-color);
  }
}
```

### Custom Size Variant

```scss
.fcx-inputtext--xl {
  padding: 1rem 1.25rem;
  font-size: 18px;
  min-height: 60px;
}
```

### Extend Mixins

```scss
@use '@/components/formcomponents/styles/form-base' as base;

.my-custom-input {
  @include base.fcx-input-base;
  @include base.fcx-input-size-md;
  
  // Add your customizations
  border-width: 2px;
}
```

## ♿ Accessibility

All components include:

- ✅ ARIA attributes support
- ✅ Keyboard navigation
- ✅ Focus indicators (visible and accessible)
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Screen reader friendly
- ✅ Proper label associations

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoints: (
  sm: 640px,   // Mobile
  md: 768px,   // Tablet
  lg: 1024px,  // Desktop
  xl: 1280px,  // Large Desktop
  2xl: 1536px  // Extra Large
);
```

### Mobile Optimizations

- Larger touch targets (44px minimum)
- Adjusted spacing and padding
- Simplified layouts on small screens
- Touch-friendly interactions
- Reduced animations for performance

## 🔍 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome)

## 🐛 Troubleshooting

### Styles Not Applying?

1. **Check import order**: Base styles must be imported first
2. **Verify theme setup**: Ensure CSS custom properties are defined
3. **Check component class names**: Verify correct BEM naming
4. **Clear cache**: Sometimes needed after style updates

### Dark Theme Issues?

```scss
// Ensure this attribute is set on root element
:root[data-theme="dark"] { }

// Or check your theme composable
const { theme } = useTheme()
```

### Performance Concerns?

- Import only needed components
- Use virtual scrolling for large lists
- Enable reduced motion for animations
- Optimize images and icons

## 📝 Best Practices

1. **Always use size variants** for consistency
2. **Implement proper validation** with error states
3. **Provide loading states** for async operations
4. **Use help text** to guide users
5. **Test with keyboard navigation**
6. **Verify contrast ratios** for accessibility
7. **Test on mobile devices** for touch interactions

## 🔄 Migration Guide

### From Existing Styles

If you have existing form components styled:

1. Import new styles alongside old ones
2. Gradually migrate components one by one
3. Use CSS specificity to override if needed
4. Test thoroughly before removing old styles

```scss
// Temporary override during migration
.fcx-checkbox {
  @include new-checkbox-styles;
  
  &.legacy {
    @include old-checkbox-styles;
  }
}
```

## 📚 Related Documentation

- [Component API Documentation](../README.md)
- [Theme Configuration](../../../../docs/Theme-Configuration.md)
- [SCSS Architecture](../../../../docs/SCSS-Architecture.md)
- [Localization Guide](../../../../docs/Localization-Guide.md)

## 🤝 Contributing

When adding new styles:

1. Follow existing naming conventions
2. Use provided mixins from `_form-base.scss`
3. Support all size variants (sm, md, lg)
4. Include dark theme support
5. Add responsive breakpoints
6. Test accessibility features
7. Document your changes

## 📄 License

Part of the Fincorpx Frontend project.

---

**Created:** November 2025  
**Last Updated:** November 2025  
**Version:** 1.0.0
