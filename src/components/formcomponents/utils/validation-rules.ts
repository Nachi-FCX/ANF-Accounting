import { defineRule } from 'vee-validate'

// Define email validation rule
defineRule('email', (value: string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  // Check if email
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return 'This field must be a valid email'
  }
  return true
})

// Define required validation rule
defineRule('required', (value: any) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return 'This field is required'
  }
  return true
})

// Define minimum length validation rule
defineRule('min', (value: string, [limit]: [number]) => {
  // Field is empty, should pass (let required rule handle empty values)
  if (!value || !value.length) {
    return true
  }
  if (value.length < limit) {
    return `This field must be at least ${limit} characters`
  }
  return true
})

// Define maximum length validation rule
defineRule('max', (value: string, [limit]: [number]) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  if (value.length > limit) {
    return `This field must not exceed ${limit} characters`
  }
  return true
})

// Define URL validation rule
defineRule('url', (value: string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  // Check if URL
  if (!/^https?:\/\/.+\..+/.test(value)) {
    return 'This field must be a valid URL'
  }
  return true
})

// Define phone validation rule
defineRule('phone', (value: string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  // Check if phone number
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
    return 'This field must be a valid phone number'
  }
  return true
})

// Define numeric validation rule
defineRule('numeric', (value: string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  // Check if numeric
  if (!/^\d+$/.test(value)) {
    return 'This field must contain only numbers'
  }
  return true
})

// Define text validation rule
defineRule('text', (value: string) => {
  // Field is empty, should pass (let required rule handle empty values)
  if (!value || !value.length) {
    return true
  }
  // Basic text validation - allow letters, numbers, spaces, and common punctuation
  if (!/^[a-zA-Z0-9\s\-_.,!?@#$%&*()+=[\]{}|\\:";'<>?/~`^]*$/.test(value)) {
    return 'This field contains invalid characters'
  }
  return true
})

// Define password validation rule
defineRule('password', (value: string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true
  }
  // Check password strength
  if (value.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  return true
})

// Define date validation rule
defineRule('date', (value: string | Date) => {
  // Field is empty, should pass
  if (!value) {
    return true
  }
  
  // If it's already a Date object, it's valid
  if (value instanceof Date) {
    return !isNaN(value.getTime()) || 'Please enter a valid date'
  }
  
  // If it's a string, try to parse it
  const date = new Date(value)
  return !isNaN(date.getTime()) || 'Please enter a valid date'
})

// Define minimum value validation rule (for numbers)
defineRule('min_value', (value: number, [limit]: [number]) => {
  // Field is empty, should pass
  if (value === null || value === undefined) {
    return true
  }
  if (value < limit) {
    return `This field must be at least ${limit}`
  }
  return true
})

// Define maximum value validation rule (for numbers)
defineRule('max_value', (value: number, [limit]: [number]) => {
  // Field is empty, should pass
  if (value === null || value === undefined) {
    return true
  }
  if (value > limit) {
    return `This field must not exceed ${limit}`
  }
  return true
})

// Define date minimum validation rule
defineRule('min_date', (value: Date, [limit]: [Date]) => {
  // Field is empty, should pass
  if (!value) {
    return true
  }
  if (value < limit) {
    return `Date must be after ${limit.toLocaleDateString()}`
  }
  return true
})

// Define date maximum validation rule
defineRule('max_date', (value: Date, [limit]: [Date]) => {
  // Field is empty, should pass
  if (!value) {
    return true
  }
  if (value > limit) {
    return `Date must be before ${limit.toLocaleDateString()}`
  }
  return true
})

// Define file size validation rule
defineRule('file_size', (files: FileList | File[], [limit]: [number]) => {
  // Field is empty, should pass
  if (!files || files.length === 0) {
    return true
  }
  const fileArray = Array.from(files)
  for (const file of fileArray) {
    if (file.size > limit) {
      return `File size must be less than ${(limit / 1024 / 1024).toFixed(1)}MB`
    }
  }
  return true
})

// Define file type validation rule
defineRule('file_type', (files: FileList | File[], allowedTypes: string[]) => {
  // Field is empty, should pass
  if (!files || files.length === 0) {
    return true
  }
  const fileArray = Array.from(files)
  for (const file of fileArray) {
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }
  return true
})

// Define max files validation rule
defineRule('max_files', (files: FileList | File[], [limit]: [number]) => {
  // Field is empty, should pass
  if (!files || files.length === 0) {
    return true
  }
  if (files.length > limit) {
    return `Maximum ${limit} files allowed`
  }
  return true
})

// Define min files validation rule
defineRule('min_files', (files: FileList | File[], [limit]: [number]) => {
  // Field is empty, should pass
  if (!files || files.length === 0) {
    return true
  }
  if (files.length < limit) {
    return `Minimum ${limit} files required`
  }
  return true
})

/**
 * Utility function to build validation rules string based on props
 */
export function buildValidationString(props: {
  required?: boolean
  validationType?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  minDate?: Date
  maxDate?: Date
  maxFileSize?: number
  allowedTypes?: string[]
  maxFiles?: number
  minFiles?: number
}): string {
  const rules: string[] = []

  // Required validation
  if (props.required) {
    rules.push('required')
  }

  // Type-based validation
  if (props.validationType) {
    rules.push(props.validationType)
  }

  // Length validation
  if (props.minLength !== undefined) {
    rules.push(`min:${props.minLength}`)
  }
  if (props.maxLength !== undefined) {
    rules.push(`max:${props.maxLength}`)
  }

  // Value validation (for numbers)
  if (props.min !== undefined) {
    rules.push(`min_value:${props.min}`)
  }
  if (props.max !== undefined) {
    rules.push(`max_value:${props.max}`)
  }

  // Date validation
  if (props.minDate) {
    rules.push(`min_date:${props.minDate.toISOString()}`)
  }
  if (props.maxDate) {
    rules.push(`max_date:${props.maxDate.toISOString()}`)
  }

  // File validation
  if (props.maxFileSize) {
    rules.push(`file_size:${props.maxFileSize}`)
  }
  if (props.allowedTypes && props.allowedTypes.length > 0) {
    rules.push(`file_type:${props.allowedTypes.join(',')}`)
  }
  if (props.maxFiles) {
    rules.push(`max_files:${props.maxFiles}`)
  }
  if (props.minFiles) {
    rules.push(`min_files:${props.minFiles}`)
  }

  return rules.join('|')
}

/**
 * Password strength calculator
 */
export function calculatePasswordStrength(password: string): {
  score: number
  level: 'weak' | 'medium' | 'strong'
  feedback: string[]
} {
  if (!password) {
    return { score: 0, level: 'weak', feedback: ['Password is required'] }
  }

  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push('Use at least 8 characters')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Add lowercase letters')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Add uppercase letters')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 25
  } else {
    feedback.push('Add numbers')
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 25
  } else {
    feedback.push('Add special characters')
  }

  // Bonus for length
  if (password.length >= 12) {
    score += 10
  }

  // Determine level
  let level: 'weak' | 'medium' | 'strong'
  if (score < 50) {
    level = 'weak'
  } else if (score < 80) {
    level = 'medium'
  } else {
    level = 'strong'
  }

  return { score: Math.min(score, 100), level, feedback }
}
