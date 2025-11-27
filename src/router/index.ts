import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/demo/DataTableDemoView.vue'
import { useAuthStore } from '@/views/auth/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: (to) => {
        // This will be handled by the navigation guard
        // Default redirect to signin, guard will handle auth check
        return '/auth/signin'
      }
    },
    // Authentication Routes
    {
      path: '/auth',
      name: 'auth',
      redirect: '/auth/signin',
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/signin',
      name: 'signin',
      component: () => import('@/views/auth/views/SignInView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Sign In - FinCorpX'
      }
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: () => import('@/views/auth/views/SignUpView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Sign Up - FinCorpX'
      }
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/views/ForgotPasswordView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Forgot Password - FinCorpX'
      }
    },
    {
      path: '/auth/verification',
      name: 'auth-verification',
      component: () => import('@/views/auth/views/AuthVerificationView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Reset Password - FinCorpX'
      }
    },
    // Protected Dashboard Routes - Wrapped with FcxLayout
    {
      path: '/',
      component: () => import('@/components/layout/FcxLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: HomeView,
          meta: {
            requiresAuth: true,
            title: 'Dashboard - FinCorpX'
          }
        },
        {
          path: 'bills',
          name: 'bills',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Bills - FinCorpX'
          }
        },
        // Sales Invoice Routes
        {
          path: 'sales-invoice',
          name: 'sales-invoice',
          redirect: '/sales-invoice/list'
        },
        {
          path: 'sales-invoice/list',
          name: 'sales-invoice-list',
          component: () => import('@/views/sales-invoice/views/SalesInvoiceListView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Sales Invoices - FinCorpX'
          }
        },
        {
          path: 'sales-invoice/create',
          name: 'sales-invoice-create',
          component: () => import('@/views/sales-invoice/views/SalesInvoiceCreateView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Create Sales Invoice - FinCorpX'
          }
        },
        {
          path: 'sales-invoice/edit/:id',
          name: 'sales-invoice-edit',
          component: () => import('@/views/sales-invoice/views/SalesInvoiceEditView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Edit Sales Invoice - FinCorpX'
          }
        },
        // Invoice OCR Routes
        {
          path: 'invoice',
          name: 'invoice',
          component: () => import('../views/invoice/InvoiceOcrView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Invoice Processing - FinCorpX'
          }
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Analysis - FinCorpX'
          }
        },
        {
          path: 'reporting',
          name: 'reporting',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Reporting - FinCorpX'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Users - FinCorpX'
          }
        },
        {
          path: 'support',
          name: 'support',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Support - FinCorpX'
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Settings - FinCorpX'
          }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/demo/DataTableDemoView.vue'), // Placeholder
          meta: {
            requiresAuth: true,
            title: 'Profile - FinCorpX'
          }
        },
        // GSTIN Management Routes
        {
          path: 'gstin',
          name: 'gstin',
          redirect: '/gstin/list'
        },
        {
          path: 'gstin/list',
          name: 'gstin-list',
          component: () => import('@/views/gstin/components/GstinDataTable.vue'),
          meta: {
            requiresAuth: true,
            title: 'GSTIN Management - FinCorpX'
          }
        },
        // Demo Routes
        {
          path: 'form-demo',
          name: 'form-demo',
          component: () => import('../views/demo/FormDemoView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Form Demo - FinCorpX'
          }
        },
        {
          path: 'state-demo',
          name: 'state-demo',
          component: () => import('../views/demo/StateComponentsDemo.vue'),
          meta: {
            requiresAuth: true,
            title: 'State Demo - FinCorpX'
          }
        },
        {
          path: 'button-demo',
          name: 'button-demo',
          component: () => import('../views/demo/ButtonDemoView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Button Demo - FinCorpX'
          }
        },
        {
          path: 'datatable-demo',
          name: 'datatable-demo',
          component: () => import('../views/demo/DataTableDemoView.vue'),
          meta: {
            requiresAuth: true,
            title: 'DataTable Demo - FinCorpX'
          }
        }
      ]
    }
  ],
})

// // Navigation Guards - Authentication Protection
// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Initialize auth store from storage on first navigation
  try {
    authStore.initializeFromStorage()
  } catch (error) {
    console.error('Failed to initialize auth store:', error)
  }

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const requiresGuest = to.meta.requiresGuest

  console.log('🛡️ Route Guard - Navigation check:', {
    to: to.path,
    from: from.path,
    isAuthenticated,
    requiresAuth,
    requiresGuest
  })

  // Handle root route redirect based on authentication
  if (to.name === 'root') {
    if (isAuthenticated) {
      console.log('🏠 Redirecting authenticated user to dashboard')
      next({ name: 'dashboard' })
    } else {
      console.log('🔐 Redirecting unauthenticated user to signin')
      next({ name: 'signin' })
    }
    return
  }

  // Handle authentication requirements
  if (requiresAuth && !isAuthenticated) {
    console.log('🚫 Access denied - authentication required')
    // Redirect to signin if trying to access protected route while not authenticated
    next({
      name: 'signin',
      query: { redirect: to.fullPath } // Save intended destination
    })
  } else if (requiresGuest && isAuthenticated) {
    // Allow navigation between auth pages during auth flow
    // Only redirect to dashboard if user is fully authenticated and not in an auth flow
    const isInAuthFlow = authStore.authStep !== 'idle' && authStore.authStep !== 'success'
    const isAuthPage = to.path.startsWith('/auth/')

    if (isAuthPage && isInAuthFlow) {
      console.log('🔄 Allowing navigation between auth pages during auth flow')
      // Allow navigation between auth pages during active auth flow
      next()
    } else if (isAuthPage && !isInAuthFlow) {
      console.log('🔄 Authenticated user accessing guest route, redirecting to dashboard')
      // Redirect to dashboard for fully authenticated users trying to access auth pages
      next({ name: 'dashboard' })
    } else {
      console.log('🔄 Authenticated user accessing guest route, redirecting to dashboard')
      next({ name: 'dashboard' })
    }
  } else {
    console.log('✅ Navigation allowed')
    // Allow navigation
    next()
  }
})

export default router
