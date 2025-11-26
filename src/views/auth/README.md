# FinCorpX Authentication System

A comprehensive, production-ready authentication system built with Vue 3, TypeScript, Pinia, and Firebase. Features modern UI/UX with PrimeVue components and full integration with your existing state management system.

## 🚀 Features

### Authentication Methods
- **Email/Password Authentication** - Traditional signup and signin
- **Social Login** - Google, LinkedIn, Apple, Facebook, Microsoft, Twitter, Yahoo
- **OTP Verification** - Email and SMS verification with 6-digit codes
- **Remember Me** - Persistent login sessions
- **Multi-company Support** - Switch between different company accounts

### Security Features
- **JWT Token Management** - Access and refresh token handling
- **Session Management** - Automatic session timeout and warnings
- **Password Validation** - Strong password requirements
- **Rate Limiting** - Protection against brute force attacks
- **Device Fingerprinting** - Track login devices
- **Audit Logging** - Track authentication events

### UI/UX Features
- **Split-screen Layout** - Carousel + form for signup
- **Centered Layout** - Clean signin experience
- **Step Indicator** - Visual progress for signup flow
- **Loading States** - Integrated with your StateWrapper component
- **Error Handling** - User-friendly error messages
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant
- **Dark Mode** - System preference support

## 📁 Project Structure

```
src/auth/
├── components/           # Reusable auth components
│   ├── AuthCarousel.vue         # Testimonial carousel
│   ├── CarouselSlide.vue        # Individual carousel slides
│   ├── SignUpForm.vue           # Registration form
│   ├── SignInForm.vue           # Login form
│   ├── OtpVerificationForm.vue  # OTP input component
│   ├── SocialLoginButtons.vue   # Social auth buttons
│   ├── AuthLayoutSplit.vue      # Split-screen layout
│   └── AuthLayoutCentered.vue   # Centered layout
├── views/               # Auth page views
│   ├── SignUpView.vue           # Complete signup flow
│   └── SignInView.vue           # Signin page
├── stores/              # Pinia stores
│   └── authStore.ts             # Authentication state management
├── types/               # TypeScript definitions
│   ├── auth-types.ts            # Core auth types
│   ├── session-types.ts         # Session management types
│   └── carousel-types.ts        # Carousel component types
├── constants/           # Configuration constants
│   └── auth-constants.ts        # Auth constants and messages
├── config/              # Configuration files
│   └── firebase.ts              # Firebase setup
├── data/                # Static data
│   └── carousel-data.ts         # Carousel content and testimonials
└── index.ts             # Main export file
```

## 🛠 Installation & Setup

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Environment Variables

Add Firebase configuration to your environment files:

```env
# .env.development
VITE_FIREBASE_API_KEY_DEV=your_api_key
VITE_FIREBASE_AUTH_DOMAIN_DEV=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID_DEV=your_project_id
VITE_FIREBASE_STORAGE_BUCKET_DEV=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID_DEV=your_sender_id
VITE_FIREBASE_APP_ID_DEV=your_app_id
VITE_FIREBASE_MEASUREMENT_ID_DEV=your_measurement_id

# Optional: Firebase Emulator
VITE_USE_FIREBASE_EMULATOR=true
VITE_FIREBASE_EMULATOR_HOST=localhost
VITE_FIREBASE_EMULATOR_PORT=9099
```

### 3. Router Setup

Add auth routes to your router:

```typescript
// src/router/index.ts
import { SignUpView, SignInView } from '@/auth'

const routes = [
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/signin',
    name: 'SignIn', 
    component: SignInView,
    meta: { requiresGuest: true }
  }
]
```

### 4. Initialize Auth Store

```typescript
// src/main.ts
import { useAuthStore } from '@/auth'

const app = createApp(App)

// Initialize auth store on app start
app.use(pinia)
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.mount('#app')
```

## 📖 Usage Examples

### Basic Authentication

```vue
<template>
  <div>
    <!-- Signup with split layout -->
    <SignUpView />
    
    <!-- Signin with centered layout -->
    <SignInView />
  </div>
</template>

<script setup lang="ts">
import { SignUpView, SignInView } from '@/auth'
</script>
```

### Using Auth Store

```vue
<script setup lang="ts">
import { useAuthStore } from '@/auth'

const authStore = useAuthStore()

// Check authentication status
const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// Sign out
const handleSignOut = async () => {
  await authStore.signOut()
  router.push('/auth/signin')
}

// Switch company
const switchCompany = async (companyId: string) => {
  await authStore.switchCompany(companyId)
}
</script>
```

### Custom Form Integration

```vue
<template>
  <form @submit.prevent="handleSignUp">
    <SignUpForm @success="onSignUpSuccess" />
  </form>
</template>

<script setup lang="ts">
import { SignUpForm, useAuthStore } from '@/auth'

const authStore = useAuthStore()

const onSignUpSuccess = (user: User) => {
  console.log('User signed up:', user)
  // Redirect to dashboard
  router.push('/dashboard')
}
</script>
```

## 🎨 Customization

### Theming

The auth system uses CSS custom properties for easy theming:

```scss
:root {
  --auth-primary-color: #4f46e5;
  --auth-secondary-color: #6b7280;
  --auth-success-color: #10b981;
  --auth-error-color: #ef4444;
  --auth-border-radius: 8px;
  --auth-font-family: 'Inter', sans-serif;
}
```

### Custom Carousel Content

```typescript
// Custom carousel slides
const customSlides: CarouselSlide[] = [
  {
    id: 'custom-slide',
    title: 'Your Custom Title',
    description: 'Your custom description',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    testimonial: {
      quote: 'Custom testimonial',
      name: 'Customer Name',
      title: 'Job Title',
      company: 'Company Name',
      avatar: '/path/to/avatar.jpg',
      rating: 5,
      verified: true
    }
  }
]
```

### Social Providers

Configure which social providers to show:

```vue
<SocialLoginButtons 
  :providers="['google', 'linkedin', 'apple']"
  layout="horizontal"
  :show-labels="true"
  @social-login="handleSocialLogin"
/>
```

## 🔒 Security Best Practices

### Token Management
- Access tokens expire in 30 minutes
- Refresh tokens expire in 7 days
- Automatic token refresh before expiration
- Secure storage in httpOnly cookies (recommended for production)

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Session Security
- Session timeout warnings at 5 minutes
- Automatic logout on inactivity
- Device fingerprinting for suspicious activity
- Rate limiting on login attempts

## 🧪 Testing

### Mock Authentication

The auth store includes mock implementations for development:

```typescript
// Mock successful login
await authStore.signIn({
  emailOrMobile: 'test@example.com',
  password: 'password123',
  rememberMe: false
})

// Mock OTP verification (use '123456' as valid OTP)
await authStore.verifyOtp({
  otp: '123456',
  verificationId: 'mock-id',
  method: 'email',
  contactInfo: 'test@example.com'
})
```

## 🚀 Production Deployment

### Firebase Setup
1. Create Firebase project
2. Enable Authentication methods
3. Configure authorized domains
4. Set up Firebase hosting (optional)

### Environment Configuration
- Use separate Firebase projects for dev/staging/prod
- Enable Firebase Analytics
- Configure custom domains
- Set up monitoring and alerts

### Performance Optimization
- Lazy load auth components
- Implement code splitting
- Optimize images and assets
- Enable compression

## 🤝 Integration Points

### With Your Existing System
- **State Components**: Uses your StateWrapper, LoadingSpinner, etc.
- **Form Components**: Integrates with your FcxInputtext, FcxPassword, etc.
- **Routing**: Works with Vue Router and route guards
- **Styling**: Follows your SCSS architecture and design system

### API Integration
- Replace mock implementations with real API calls
- Add proper error handling for network failures
- Implement retry logic for failed requests
- Add request/response interceptors

## 📚 API Reference

### Auth Store Methods

```typescript
// Authentication
signIn(formData: SignInFormData): Promise<LoginResponse>
signUp(formData: SignUpFormData): Promise<SignUpResponse>
signOut(): Promise<void>
signInWithSocial(provider: SocialProvider): Promise<LoginResponse>

// OTP Verification
verifyOtp(otpData: OtpVerificationData): Promise<void>
resendOtp(): Promise<void>

// Session Management
updateLastActivity(): void
checkSessionValidity(): void
extendSession(): Promise<void>

// Company Management
switchCompany(companyId: string): Promise<void>

// State Management
setLoading(state: AuthLoadingState | null): void
setError(state: AuthErrorState | null): void
setSuccess(state: AuthSuccessState | null): void
clearStates(): void
```

### Component Props

```typescript
// AuthCarousel
interface AuthCarouselProps {
  slides?: CarouselSlide[]
  ratings?: PlatformRating[]
  config?: Partial<CarouselConfiguration>
  variant?: 'signup' | 'signin'
}

// SocialLoginButtons
interface SocialLoginButtonsProps {
  providers: SocialProvider[]
  layout?: 'horizontal' | 'grid' | 'vertical'
  showLabels?: boolean
  loading?: SocialProvider | null
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check environment variables
   - Verify Firebase config

2. **TypeScript errors**
   - Ensure all types are properly imported
   - Check for circular dependencies

3. **Component not found**
   - Verify component imports
   - Check file paths

4. **Styling issues**
   - Ensure SCSS is properly configured
   - Check for CSS conflicts

### Debug Mode

Enable debug logging:

```typescript
// In development
if (import.meta.env.DEV) {
  console.log('Auth Debug:', authStore.$state)
}
```

## 📄 License

This authentication system is part of the FinCorpX project and follows the same licensing terms.

---

For more information or support, please refer to the main project documentation or contact the development team.
