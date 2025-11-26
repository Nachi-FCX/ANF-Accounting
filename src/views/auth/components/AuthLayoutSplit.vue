<template>
  <div class="auth-layout-split">
    <!-- Left side - Zoho Books Style Promotional Content -->
    <div class="auth-left-panel">
      <div class="promotional-content">
        <div class="promo-header">
          <h1>Trusted by</h1>
          <h2>businesses and CAs</h2>
        </div>
        
        <div class="promo-description">
          <p>Running a business requires smart accounts management. Zoho Books simplifies everything from invoicing to inventory in one platform.</p>
        </div>
        
        <div class="testimonial">
          <div class="testimonial-avatar">
            <img src="@/assets/img/sidebar/profile-avatar.jpg" alt="Naveedh V.V" />
          </div>
          <div class="testimonial-content">
            <h3>Naveedh V.V</h3>
            <p>CO-FOUNDER, MAKE YOUR OWN PERFUME</p>
          </div>
        </div>
        
        <div class="carousel-dots">
          <div class="dot active"></div>
          <div class="dot"></div>
        </div>
        
        <div class="ratings-section">
          <h4>RATED BY THE BEST</h4>
          <div class="rating-badges">
            <div class="rating-badge">
              <span class="rating-logo">📊</span>
              <div class="rating-info">
                <span class="rating-name">Capterra</span>
                <span class="rating-score">4.4/5</span>
              </div>
            </div>
            <div class="rating-badge">
              <span class="rating-logo">🔴</span>
              <div class="rating-info">
                <span class="rating-name">G2</span>
                <span class="rating-score">4.4/5</span>
              </div>
            </div>
            <div class="rating-badge">
              <span class="rating-logo">▶️</span>
              <div class="rating-info">
                <span class="rating-name">Play Store</span>
                <span class="rating-score">4.7/5</span>
              </div>
            </div>
            <div class="rating-badge">
              <span class="rating-logo">📱</span>
              <div class="rating-info">
                <span class="rating-name">App Store</span>
                <span class="rating-score">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right side - Forms -->
    <div class="auth-right-panel">
      <div class="auth-form-container">
        <div class="brand-header">
          <div class="brand-logo">
            <div class="zoho-logo">
              <span class="zoho-icon">📊</span>
              <span class="zoho-text">Zoho</span>
            </div>
            <span class="books-text">Books</span>
          </div>
        </div>
        
        <StateWrapper
          :loading="authStore.loading?.type === 'overlay'"
          :loading-message="authStore.loading?.message"
          :error="authStore.error as any"
          :success="authStore.success as any"
          @retry="handleRetry"
          @success-primary="handleSuccessAction"
        >
          <slot />
        </StateWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthCarousel from './AuthCarousel.vue'
import { StateWrapper } from '@/components/statecomponents'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from '@/composables/useTheme'
import { authCarouselSlides, platformRatings } from '../data/carousel-data'
import type { CarouselSlide, PlatformRating } from '../types/carousel-types'

interface Props {
  slides?: CarouselSlide[]
  ratings?: PlatformRating[]
}

const props = withDefaults(defineProps<Props>(), {
  slides: () => authCarouselSlides,
  ratings: () => platformRatings
})

const authStore = useAuthStore()
const router = useRouter()
const { forceTheme } = useTheme()

// Force light theme when this component mounts
onMounted(() => {
  forceTheme('light')
})

// Restore normal theme behavior when component unmounts
onUnmounted(() => {
  forceTheme(null)
})

// Computed properties
const carouselSlides = computed(() => props.slides)

// Methods
const onSlideChange = (index: number) => {
  // Handle slide change if needed
  console.log('Slide changed to:', index)
}

const handleRetry = () => {
  // Clear error state
  authStore.clearStates()
}

const handleSuccessAction = () => {
  // Handle success action (e.g., redirect to dashboard)
  if (authStore.success?.redirectUrl) {
    router.push(authStore.success.redirectUrl)
  } else if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
}
</script>

<style scoped lang="scss">
.auth-layout-split {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
  background: #f8fafc;

  .auth-left-panel {
    flex: 0 0 50%;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%);
    
    @media (max-width: 1024px) {
      display: none;
    }
    
    .promotional-content {
      padding: 3rem 2.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      position: relative;
      
      .promo-header {
        margin-bottom: 2rem;
        
        h1 {
          font-size: 3rem;
          font-weight: 300;
          margin: 0;
          line-height: 1.1;
        }
        
        h2 {
          font-size: 3rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.1;
        }
      }
      
      .promo-description {
        margin-bottom: 3rem;
        
        p {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0;
          opacity: 0.95;
          max-width: 400px;
        }
      }
      
      .testimonial {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        
        .testimonial-avatar {
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.2);
          }
        }
        
        .testimonial-content {
          h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
          }
          
          p {
            font-size: 0.875rem;
            margin: 0;
            opacity: 0.8;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
        }
      }
      
      .carousel-dots {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 3rem;
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          
          &.active {
            background: white;
            transform: scale(1.2);
          }
        }
      }
      
      .ratings-section {
        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          letter-spacing: 1px;
        }
        
        .rating-badges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          
          .rating-badge {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            
            .rating-logo {
              font-size: 1.25rem;
            }
            
            .rating-info {
              display: flex;
              flex-direction: column;
              
              .rating-name {
                font-size: 0.75rem;
                font-weight: 500;
                opacity: 0.9;
              }
              
              .rating-score {
                font-size: 0.875rem;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }

  .auth-right-panel {
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: white;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    max-height: 100vh;
    
    @media (max-width: 1024px) {
      flex: none;
      width: 100%;
      min-height: 100vh;
      max-height: 100vh;
      align-items: center;
    }

    @media (max-width: 768px) {
      padding: 0.75rem;
    }

    @media (max-width: 480px) {
      padding: 0.5rem;
    }

    .auth-form-container {
      width: 100%;
      max-width: 480px;
      position: relative;
      padding: 1rem 0;
      max-height: 100vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      @media (max-width: 1024px) {
        padding: 0.5rem 0;
        max-height: 95vh;
      }

      .brand-header {
        text-align: center;
        margin-bottom: 1.5rem;
        flex-shrink: 0;

        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            transform: translateY(-2px);
          }

          .zoho-logo {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            
            .zoho-icon {
              font-size: 1.5rem;
              color: #3b82f6;
            }
            
            .zoho-text {
              font-size: 1.25rem;
              font-weight: 600;
              color: #1f2937;
            }
          }
          
          .books-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
          }

          @media (max-width: 768px) {
            .zoho-logo {
              .zoho-icon {
                font-size: 1.25rem;
              }
              
              .zoho-text {
                font-size: 1.125rem;
              }
            }
            
            .books-text {
              font-size: 1.125rem;
            }
          }

          @media (max-width: 480px) {
            .zoho-logo {
              .zoho-icon {
                font-size: 1.125rem;
              }
              
              .zoho-text {
                font-size: 1rem;
              }
            }
            
            .books-text {
              font-size: 1rem;
            }
          }
        }
      }
    }
  }

  // Mobile-first responsive design
  @media (max-width: 1024px) {
    .auth-left-panel {
      display: none;
    }

    .auth-right-panel {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      .auth-form-container {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);

        @media (max-width: 768px) {
          padding: 1.5rem;
          border-radius: 12px;
        }

        @media (max-width: 480px) {
          padding: 1.25rem;
          border-radius: 8px;
          margin: 1rem;
        }
      }
    }
  }

  // Tablet landscape
  @media (min-width: 1025px) and (max-width: 1200px) {
    .auth-left-panel {
      flex: 0.6;
    }

    .auth-right-panel {
      flex: 0.4;
    }
  }

  // Large screens
  @media (min-width: 1400px) {
    .auth-right-panel .auth-form-container {
      max-width: 520px;
    }
  }
}

// Force light theme for authentication pages - no automatic dark mode
.auth-layout-split {
  background: white !important;

  .auth-right-panel {
    background: white !important;
    color: #1a1a1a !important;

    @media (max-width: 1024px) {
      background: white !important;

      .auth-form-container {
        background: white !important;
        border-color: rgba(0, 0, 0, 0.1) !important;
        color: #1a1a1a !important;
      }
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .auth-layout-split .auth-right-panel {
    @media (max-width: 1024px) {
      .auth-form-container {
        border: 3px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .auth-layout-split .auth-right-panel .auth-form-container .brand-header .brand-logo {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}

// Print styles
@media print {
  .auth-layout-split {
    .auth-left-panel {
      display: none;
    }

    .auth-right-panel {
      background: white;
      box-shadow: none;

      .auth-form-container {
        background: white;
        box-shadow: none;
        border: 1px solid #000;
      }
    }
  }
}
</style>
