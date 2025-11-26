# Localization (i18n) Guide

This guide covers the internationalization system of the FincorpX application.

## Overview

The application uses Vue I18n for internationalization with support for multiple languages including English, Arabic, Hebrew, Spanish, and French.

## Supported Languages

- **English (en)** - Default language
- **Arabic (ar)** - RTL support
- **Hebrew (he)** - RTL support
- **Spanish (es)**
- **French (fr)**

## File Structure

```
src/
├── locales/
│   ├── index.ts          # Main i18n configuration
│   ├── en.json          # English translations
│   ├── ar.json          # Arabic translations
│   ├── he.json          # Hebrew translations
│   ├── es.json          # Spanish translations
│   └── fr.json          # French translations
├── composables/
│   └── useI18n.ts       # i18n composable
└── components/
    └── LanguageSwitcher.vue  # Language switcher component
```

## Configuration

### Main Configuration (`src/locales/index.ts`)

```typescript
import { createI18n } from 'vue-i18n'
import en from './en.json'
import ar from './ar.json'
import he from './he.json'
import es from './es.json'
import fr from './fr.json'

const messages = {
  en,
  ar,
  he,
  es,
  fr
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjection: true
})

export default i18n
```

### i18n Composable (`src/composables/useI18n.ts`)

```typescript
import { computed, watch } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'

export function useI18n() {
  const { locale, t } = useVueI18n()
  
  const isRTL = computed(() => ['ar', 'he'].includes(locale.value))
  
  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }
  
  // Apply RTL styles when language changes
  watch(isRTL, (newIsRTL) => {
    document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('rtl', newIsRTL)
  }, { immediate: true })
  
  return {
    locale,
    t,
    isRTL,
    setLocale
  }
}
```

## Translation Files Structure

### English (`src/locales/en.json`)

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "dashboard": "Dashboard"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address",
      "minLength": "Minimum {min} characters required",
      "maxLength": "Maximum {max} characters allowed"
    },
    "labels": {
      "name": "Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password"
    },
    "placeholders": {
      "enterName": "Enter your name",
      "enterEmail": "Enter your email",
      "selectOption": "Select an option"
    }
  },
  "messages": {
    "welcome": "Welcome to FincorpX",
    "dataLoaded": "Data loaded successfully",
    "dataSaved": "Data saved successfully",
    "dataDeleted": "Data deleted successfully"
  }
}
```

### Arabic (`src/locales/ar.json`)

```json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "add": "إضافة",
    "search": "بحث",
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح"
  },
  "navigation": {
    "home": "الرئيسية",
    "about": "حول",
    "contact": "اتصل بنا",
    "dashboard": "لوحة التحكم"
  },
  "forms": {
    "validation": {
      "required": "هذا الحقل مطلوب",
      "email": "يرجى إدخال عنوان بريد إلكتروني صحيح",
      "minLength": "الحد الأدنى {min} أحرف مطلوب",
      "maxLength": "الحد الأقصى {max} أحرف مسموح"
    },
    "labels": {
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",
      "confirmPassword": "تأكيد كلمة المرور"
    },
    "placeholders": {
      "enterName": "أدخل اسمك",
      "enterEmail": "أدخل بريدك الإلكتروني",
      "selectOption": "اختر خياراً"
    }
  },
  "messages": {
    "welcome": "مرحباً بك في فينكورب إكس",
    "dataLoaded": "تم تحميل البيانات بنجاح",
    "dataSaved": "تم حفظ البيانات بنجاح",
    "dataDeleted": "تم حذف البيانات بنجاح"
  }
}
```

## Usage in Components

### Template Usage

```vue
<template>
  <div>
    <h1>{{ $t('messages.welcome') }}</h1>
    <button>{{ $t('common.save') }}</button>
    <input :placeholder="$t('forms.placeholders.enterName')" />
    
    <!-- With parameters -->
    <p>{{ $t('forms.validation.minLength', { min: 8 }) }}</p>
    
    <!-- Pluralization -->
    <p>{{ $tc('items', count, { count }) }}</p>
  </div>
</template>
```

### Script Usage

```vue
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t, locale, setLocale, isRTL } = useI18n()

// Using translations in script
const saveText = t('common.save')
const welcomeMessage = t('messages.welcome')

// Change language
const changeLanguage = (lang: string) => {
  setLocale(lang)
}

// Check if current language is RTL
console.log('Is RTL:', isRTL.value)
</script>
```

## Language Switcher Component

```vue
<!-- LanguageSwitcher.vue -->
<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="handleLanguageChange">
      <option value="en">English</option>
      <option value="ar">العربية</option>
      <option value="he">עברית</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { locale, setLocale } = useI18n()
const currentLocale = ref(locale.value)

const handleLanguageChange = () => {
  setLocale(currentLocale.value)
}

watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})
</script>
```

## Adding New Languages

1. **Create translation file**: Add a new JSON file in `src/locales/` (e.g., `de.json` for German)

2. **Update index.ts**: Import and add the new language to the messages object

```typescript
import de from './de.json'

const messages = {
  en,
  ar,
  he,
  es,
  fr,
  de  // Add new language
}
```

3. **Update RTL detection** (if the language is RTL):

```typescript
const isRTL = computed(() => ['ar', 'he', 'ur'].includes(locale.value))
```

4. **Update language switcher**: Add the new option to the language selector

## Best Practices

### 1. Use Nested Keys

Organize translations hierarchically:

```json
{
  "forms": {
    "user": {
      "name": "Name",
      "email": "Email"
    },
    "validation": {
      "required": "Required",
      "invalid": "Invalid"
    }
  }
}
```

### 2. Provide Context

Use descriptive keys that provide context:

```json
{
  "buttons": {
    "save_form": "Save Form",
    "save_file": "Save File",
    "save_settings": "Save Settings"
  }
}
```

### 3. Use Parameters

For dynamic content, use parameters:

```json
{
  "welcome": "Welcome, {name}!",
  "items_count": "You have {count} items"
}
```

Usage:
```javascript
t('welcome', { name: 'John' })
t('items_count', { count: 5 })
```

### 4. Pluralization

Use Vue I18n's pluralization features:

```json
{
  "items": {
    "zero": "No items",
    "one": "1 item",
    "other": "{count} items"
  }
}
```

Usage:
```javascript
tc('items', 0)  // "No items"
tc('items', 1)  // "1 item"
tc('items', 5)  // "5 items"
```

### 5. Consistent Key Naming

Use consistent naming conventions:
- Use snake_case or camelCase consistently
- Group related translations
- Use descriptive names

### 6. Handle Missing Translations

Always provide fallback values:

```javascript
const text = t('some.key', 'Default text if translation missing')
```

## RTL Language Support

### Automatic RTL Detection

RTL languages (Arabic, Hebrew) are automatically detected:

```typescript
const isRTL = computed(() => ['ar', 'he'].includes(locale.value))

watch(isRTL, (newIsRTL) => {
  document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr'
  document.documentElement.classList.toggle('rtl', newIsRTL)
})
```

### RTL-Specific Considerations

1. **Text Direction**: Automatically handled by `dir` attribute
2. **Layout Mirroring**: CSS handles most layout adjustments
3. **Icon Direction**: Some icons may need mirroring
4. **Number Formatting**: Consider locale-specific number formats

## Testing Translations

### 1. Test All Languages

Regularly test the application in all supported languages to ensure:
- All text is translated
- UI layouts work correctly
- Text doesn't overflow containers

### 2. Test RTL Languages

Pay special attention to RTL languages:
- Check text alignment
- Verify icon directions
- Test form layouts
- Ensure proper reading flow

### 3. Test Text Expansion

Some languages require more space than others:
- German text is typically 30% longer than English
- Arabic text can be significantly different in length
- Design flexible layouts that accommodate text expansion

## Performance Considerations

### 1. Lazy Loading

For large applications, consider lazy loading translations:

```typescript
const loadLocaleMessages = async (locale: string) => {
  const messages = await import(`./locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
}
```

### 2. Tree Shaking

Only include translations that are actually used in production builds.

### 3. Caching

Cache translations in localStorage to avoid re-downloading:

```typescript
const cachedLocale = localStorage.getItem('locale')
if (cachedLocale) {
  locale.value = cachedLocale
}
```

## Troubleshooting

### Common Issues

1. **Missing translations**: Check console for missing key warnings
2. **RTL layout issues**: Verify CSS RTL styles are applied
3. **Text overflow**: Test with longer translations
4. **Date/number formatting**: Use locale-specific formatters

### Debug Mode

Enable Vue I18n debug mode during development:

```typescript
export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  silentTranslationWarn: false,  // Show missing translation warnings
  silentFallbackWarn: false      // Show fallback warnings
})
