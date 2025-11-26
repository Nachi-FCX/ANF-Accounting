// Auth Components
export { default as AuthCarousel } from './components/AuthCarousel.vue'
export { default as CarouselSlide } from './components/CarouselSlide.vue'
export { default as SignUpForm } from './components/SignUpForm.vue'
export { default as SignInForm } from './components/SignInForm.vue'
export { default as ForgotPasswordForm } from './components/ForgotPasswordForm.vue'

export { default as OtpVerificationForm } from './components/OtpVerificationForm.vue'
export { default as SocialLoginButtons } from './components/SocialLoginButtons.vue'
export { default as AuthLayoutSplit } from './components/AuthLayoutSplit.vue'
export { default as AuthLayoutCentered } from './components/AuthLayoutCentered.vue'

// Auth Views
export { default as SignUpView } from './views/SignUpView.vue'
export { default as SignInView } from './views/SignInView.vue'

// Auth Store
export { useAuthStore } from './stores/authStore'

// Auth Types
export type * from './types/auth-types'
export type * from './types/session-types'
export type * from './types/carousel-types'

// Auth Constants
export * from './constants/auth-constants'

// Auth Data
export * from './data/carousel-data'

// Firebase Config
export * from './config/firebase'
