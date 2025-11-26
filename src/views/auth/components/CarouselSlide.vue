<template>
  <div class="carousel-slide" :class="{ 'active': isActive }">
    <div class="slide-content">
      <h2 class="slide-title">{{ slide.title }}</h2>
      <p class="slide-description">{{ slide.description }}</p>
      
      <!-- Testimonial section -->
      <div v-if="slide.testimonial" class="testimonial">
        <div class="testimonial-content">
          <div class="quote-icon">
            <i class="pi pi-quote-left"></i>
          </div>
          <p class="quote-text">{{ slide.testimonial.quote }}</p>
        </div>
        <div class="testimonial-author">
          <div class="author-avatar">
            <img 
              :src="slide.testimonial.avatar" 
              :alt="slide.testimonial.name"
              @error="handleImageError"
            />
          </div>
          <div class="author-info">
            <h4 class="author-name">{{ slide.testimonial.name }}</h4>
            <p class="author-title">{{ slide.testimonial.title }}</p>
            <p class="author-company">{{ slide.testimonial.company }}</p>
            <div v-if="slide.testimonial.rating" class="rating">
              <i 
                v-for="star in 5" 
                :key="star"
                class="pi"
                :class="star <= slide.testimonial.rating ? 'pi-star-fill' : 'pi-star'"
              ></i>
            </div>
          </div>
          <div v-if="slide.testimonial.verified" class="verified-badge">
            <i class="pi pi-verified"></i>
          </div>
        </div>
      </div>
      
      <!-- Feature highlights -->
      <div v-if="slide.features && slide.features.length > 0" class="features">
        <div 
          v-for="(feature, index) in slide.features" 
          :key="index" 
          class="feature-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="feature-icon">
            <i class="pi pi-check"></i>
          </div>
          <span class="feature-text">{{ feature }}</span>
        </div>
      </div>

      <!-- Call to Action -->
      <div v-if="slide.cta" class="cta-section">
        <button 
          class="cta-button"
          :class="`cta-${slide.cta.variant || 'primary'}`"
          @click="handleCtaClick"
        >
          <i v-if="slide.cta.icon" :class="slide.cta.icon"></i>
          {{ slide.cta.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CarouselSlide } from '../types/carousel-types'

interface Props {
  slide: CarouselSlide
  isActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  ctaClick: [action: string]
}>()

// Computed properties
const slideStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.slide.backgroundImage) {
    style.backgroundImage = `url(${props.slide.backgroundImage})`
  }
  
  if (props.slide.backgroundGradient) {
    style.background = props.slide.backgroundGradient
  }
  
  return style
})

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Create a simple colored circle as fallback
  const canvas = document.createElement('canvas')
  canvas.width = 60
  canvas.height = 60
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Create a gradient circle
    const gradient = ctx.createRadialGradient(30, 30, 0, 30, 30, 30)
    gradient.addColorStop(0, '#4f46e5')
    gradient.addColorStop(1, '#7c3aed')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(30, 30, 30, 0, 2 * Math.PI)
    ctx.fill()
    
    // Add initials
    ctx.fillStyle = 'white'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const initials = props.slide.testimonial?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
    ctx.fillText(initials, 30, 30)
    
    img.src = canvas.toDataURL()
  }
}

const handleCtaClick = () => {
  if (props.slide.cta) {
    emit('ctaClick', props.slide.cta.action)
  }
}
</script>

<style scoped lang="scss">
.carousel-slide {
  padding: 2rem 2rem;
  text-align: center;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: 1;
  transform: scale(1);

  .slide-content {
    max-width: 450px;
    width: 100%;
  }
  
  .slide-title {
    font-size: 2.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      font-size: 2.25rem;
    }

    @media (max-width: 480px) {
      font-size: 1.875rem;
    }
  }
  
  .slide-description {
    font-size: 1.125rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    line-height: 1.7;
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 2.5rem;
    }
  }
  
  .testimonial {
    margin-bottom: 2.5rem;

    .testimonial-content {
      margin-bottom: 2rem;
      position: relative;

      .quote-icon {
        display: none; // Hide quote icon for cleaner look
      }

      .quote-text {
        font-style: italic;
        font-size: 1.125rem;
        line-height: 1.6;
        color: white;
        margin: 0;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        font-weight: 400;
      }
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      position: relative;

      .author-avatar {
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }
      }
      
      .author-info {
        text-align: left;

        .author-name {
          margin: 0 0 0.125rem 0;
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .author-title {
          margin: 0 0 0.125rem 0;
          opacity: 0.85;
          font-size: 0.8rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .author-company {
          margin: 0;
          opacity: 0.8;
          font-size: 0.75rem;
          color: white;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .rating {
          display: none; // Hide rating for cleaner look
        }
      }

      .verified-badge {
        display: none; // Hide verified badge for cleaner look
      }
    }
  }

  .features {
    display: none; // Hide features for cleaner look like Zoho
  }

  .cta-section {
    display: none; // Hide CTA for cleaner look like Zoho
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;

    .testimonial .testimonial-author {
      flex-direction: column;
      text-align: center;
      gap: 0.75rem;

      .author-info {
        text-align: center;
      }

      .author-avatar img {
        width: 45px;
        height: 45px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;

    .slide-title {
      margin-bottom: 1rem;
    }

    .slide-description {
      margin-bottom: 2rem;
    }

    .testimonial {
      margin-bottom: 2rem;

      .testimonial-content .quote-text {
        font-size: 1rem;
      }

      .testimonial-author {
        .author-avatar img {
          width: 40px;
          height: 40px;
        }

        .author-info {
          .author-name {
            font-size: 0.85rem;
          }

          .author-title,
          .author-company {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
}

// Animations
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Accessibility improvements
@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transition: none;

    &.active {
      transform: none;
    }

    .features .feature-item {
      animation: none;
      opacity: 1;
    }

    .testimonial-author .author-avatar img:hover {
      transform: none;
    }

    .cta-button:hover {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .carousel-slide {
    .testimonial-content .quote-text {
      border-left-color: white;
    }

    .feature-item .feature-icon {
      background: white;
      
      i {
        color: #4f46e5;
      }
    }

    .cta-button {
      border-width: 3px;
    }
  }
}
</style>
