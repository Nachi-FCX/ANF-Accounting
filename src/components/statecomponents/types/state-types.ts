// Base state interfaces
export interface BaseStateProps {
  customMessage?: string
  showActions?: boolean
  className?: string
}

// Error state interface
export interface ErrorState {
  status?: number
  type?: 'client' | 'server' | 'network' | 'validation'
  message: string
  details?: string[]
  field?: string
  code?: string
}

// Success state interface
export interface SuccessState {
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning'
  duration?: number
  persistent?: boolean
  primaryAction?: string
  secondaryAction?: string
}

// Loading state interface
export interface LoadingState {
  message?: string
  progress?: number
  type?: 'spinner' | 'skeleton' | 'overlay'
  size?: 'sm' | 'md' | 'lg'
}

// HTTP Status Code mapping
export const HTTP_STATUS_MESSAGES = {
  400: {
    title: 'Bad Request',
    message: 'The request contains invalid data. Please check your input and try again.',
    icon: 'warning.svg',
    retryable: true
  },
  401: {
    title: 'Authentication Required',
    message: 'You need to sign in to access this resource.',
    icon: 'lock.svg',
    retryable: false,
    requiresAuth: true
  },
  403: {
    title: 'Access Denied',
    message: 'You don\'t have permission to access this resource.',
    icon: 'shield-block.svg',
    retryable: false
  },
  404: {
    title: 'Page Not Found',
    message: 'The page you\'re looking for doesn\'t exist or has been moved.',
    icon: 'search-not-found.svg',
    retryable: false
  },
  500: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    icon: 'server-error.svg',
    retryable: true
  }
} as const

// Component props interfaces
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  color?: 'primary' | 'secondary' | 'accent'
}

export interface LoadingOverlayProps {
  visible: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg'
  blur?: boolean
  fullscreen?: boolean
}

export interface ErrorComponentProps extends BaseStateProps {
  details?: string[]
  showRetry?: boolean
  showHome?: boolean
  showContact?: boolean
  errorId?: string
  redirectAfterAuth?: string
}

export interface SuccessComponentProps extends BaseStateProps {
  title?: string
  message: string
  primaryAction?: string
  secondaryAction?: string
}

export interface EmptyStateProps extends BaseStateProps {
  title?: string
  message?: string
  icon?: string
  actionText?: string
  showAction?: boolean
}

export interface StateWrapperProps {
  loading?: boolean
  loadingMessage?: string
  error?: ErrorState | null
  success?: SuccessState | null
  isEmpty?: boolean
  emptyMessage?: string
  showEmptyAction?: boolean
  redirectAfterAuth?: string
}

// Event interfaces
export interface StateComponentEvents {
  retry: []
  'primary-action': []
  'secondary-action': []
  'empty-action': []
}
