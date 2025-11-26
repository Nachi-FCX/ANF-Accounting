// Carousel Types for Auth Pages

export interface CarouselSlide {
  id: string
  title: string
  description: string
  backgroundImage?: string
  backgroundGradient?: string
  testimonial?: Testimonial
  features?: string[]
  cta?: CallToAction
  animation?: SlideAnimation
}

export interface Testimonial {
  quote: string
  name: string
  title: string
  company: string
  avatar: string
  rating?: number
  verified?: boolean
}

export interface CallToAction {
  text: string
  action: string
  variant?: 'primary' | 'secondary' | 'outline'
  icon?: string
}

export interface SlideAnimation {
  type: 'fade' | 'slide' | 'zoom' | 'flip'
  duration: number
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface PlatformRating {
  platform: string
  score: string
  logo: string
  reviewCount?: number
  url?: string
}

export interface CarouselConfiguration {
  autoplay: boolean
  autoplayInterval: number
  showIndicators: boolean
  showNavigators: boolean
  circular: boolean
  numVisible: number
  numScroll: number
  responsiveOptions?: CarouselResponsiveOption[]
}

export interface CarouselResponsiveOption {
  breakpoint: string
  numVisible: number
  numScroll: number
}

export interface CarouselState {
  currentSlide: number
  totalSlides: number
  isPlaying: boolean
  direction: 'forward' | 'backward'
}

// Predefined slide types for different auth pages
export type AuthSlideType = 
  | 'welcome'
  | 'features'
  | 'testimonial'
  | 'security'
  | 'pricing'
  | 'success-stories'

export interface AuthSlideTemplate {
  type: AuthSlideType
  template: CarouselSlide
  variants?: CarouselSlide[]
}

// Feature highlight interface
export interface FeatureHighlight {
  icon: string
  title: string
  description: string
  color?: string
}

// Statistics interface for slides
export interface Statistic {
  value: string
  label: string
  icon?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}

export interface StatisticsSlide extends Omit<CarouselSlide, 'features'> {
  statistics: Statistic[]
}
