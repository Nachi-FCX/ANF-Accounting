<template>
  <div class="auth-carousel-container">
    <Carousel 
      :value="carouselSlides" 
      :numVisible="1" 
      :numScroll="1"
      :autoplayInterval="config.autoplayInterval"
      :showIndicators="config.showIndicators"
      :showNavigators="config.showNavigators"
      :circular="config.circular"
      :autoplay="config.autoplay"
      class="auth-carousel"
      @page="onSlideChange"
    >
      <template #item="slotProps">
        <CarouselSlide 
          :slide="slotProps.data"
          :is-active="true"
        />
      </template>
      
    </Carousel>
    
    <!-- Bottom ratings section -->
    <div class="ratings-section">
      <h3>RATED BY THE BEST</h3>
      <div class="rating-cards">
        <div 
          v-for="rating in platformRatings" 
          :key="rating.platform" 
          class="rating-card"
          @click="openRatingUrl(rating.url)"
        >
          <img :src="rating.logo" :alt="rating.platform" />
          <span class="rating-score">{{ rating.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Carousel from 'primevue/carousel'
import CarouselSlide from './CarouselSlide.vue'
import type { CarouselSlide as CarouselSlideType, PlatformRating, CarouselConfiguration } from '../types/carousel-types'
import { authCarouselSlides, platformRatings, carouselConfigs } from '../data/carousel-data'

interface Props {
  slides?: CarouselSlideType[]
  ratings?: PlatformRating[]
  config?: Partial<CarouselConfiguration>
  variant?: 'signup' | 'signin'
}

const props = withDefaults(defineProps<Props>(), {
  slides: () => authCarouselSlides,
  ratings: () => platformRatings,
  config: () => ({}),
  variant: 'signup'
})

const emit = defineEmits<{
  slideChange: [index: number]
}>()

// Reactive state
const currentSlide = ref(0)

// Computed properties
const carouselSlides = computed(() => props.slides)
const config = computed(() => ({
  ...carouselConfigs[props.variant],
  ...props.config
}))

// Methods
const onSlideChange = (event: any) => {
  currentSlide.value = event.page
  emit('slideChange', event.page)
}

const openRatingUrl = (url?: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped lang="scss">
.auth-carousel-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/patterns/dots.svg') repeat;
    opacity: 0.1;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
  
  .auth-carousel {
    flex: 1;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    
    :deep(.p-carousel) {
      width: 100%;
      height: auto;
      min-height: 400px;
    }
    
    :deep(.p-carousel-content) {
      height: auto;
      min-height: 400px;
      display: flex;
      align-items: center;
    }

    :deep(.p-carousel-container) {
      height: auto;
      min-height: 400px;
      width: 100%;
    }

    :deep(.p-carousel-items-content) {
      height: auto;
      min-height: 400px;
      display: flex;
      align-items: center;
      transition: transform 0.5s ease-in-out;
    }

    :deep(.p-carousel-items-container) {
      height: auto;
      min-height: 400px;
    }

    :deep(.p-carousel-item) {
      height: auto;
      min-height: 400px;
      display: flex;
      align-items: flex-start;
      width: 100%;
      flex-shrink: 0;
    }
    
    :deep(.p-carousel-indicators) {
      position: absolute;
      bottom: 8rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.75rem;
      z-index: 10;

      .p-carousel-indicator {
        button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;

          &:hover {
            background: rgba(255, 255, 255, 0.6);
            transform: scale(1.1);
          }
        }

        &.p-highlight button {
          background: white;
          transform: scale(1.2);
        }
      }
    }
  }
  
  .ratings-section {
    text-align: center;
    margin-top: 2rem;
    
    h3 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      opacity: 0.8;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .rating-cards {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      
      .rating-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 0.75rem 1rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        img {
          height: 20px;
          width: auto;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        
        .rating-score {
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }
      }
    }
  }

  // Responsive design
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .ratings-section {
      .rating-cards {
        gap: 0.5rem;
        
        .rating-card {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          
          img {
            height: 16px;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    
    .ratings-section {
      h3 {
        font-size: 0.8rem;
      }
      
      .rating-cards {
        .rating-card {
          padding: 0.4rem 0.6rem;
          
          .rating-score {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .auth-carousel-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .auth-carousel-container {
    .rating-cards .rating-card {
      border: 2px solid rgba(255, 255, 255, 0.3);
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .auth-carousel-container {
    .rating-cards .rating-card {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
    
    :deep(.p-carousel-indicators .p-carousel-indicator button) {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
  }
}
</style>
