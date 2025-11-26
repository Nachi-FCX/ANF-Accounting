import type { CarouselSlide, PlatformRating } from '../types/carousel-types'

// Carousel slides for signup page
export const authCarouselSlides: CarouselSlide[] = [
  {
    id: 'trusted-by-businesses',
    title: 'Trusted by businesses and CAs',
    description: 'FinCorpX provides world-class financial services at a low price. We have seen a 30% increase in efficiency after moving to FinCorpX',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    testimonial: {
      quote: 'FinCorpX provides world-class services at a low price. We have seen a 30% increase in efficiency after moving to FinCorpX',
      name: 'Abdurahman Chelathur',
      title: 'Commercial Manager',
      company: 'NUBRA GLASS FLY WOODS AND HARDWARE',
      avatar: '/images/testimonials/abdurahman.jpg',
      rating: 5,
      verified: true
    },
    animation: {
      type: 'fade',
      duration: 500,
      easing: 'ease-in-out'
    }
  },
  {
    id: 'financial-management',
    title: 'Complete Financial Management',
    description: 'Streamline your accounting, invoicing, and financial reporting with our comprehensive suite of tools designed for modern businesses.',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: [
      'Automated Invoicing & Billing',
      'Real-time Financial Reports',
      'Tax Compliance Management',
      'Multi-currency Support',
      'Bank Reconciliation',
      'Expense Tracking'
    ],
    animation: {
      type: 'slide',
      duration: 500,
      easing: 'ease-in-out'
    }
  },
  {
    id: 'secure-reliable',
    title: 'Secure & Reliable',
    description: 'Bank-grade security with 99.9% uptime guarantee. Your financial data is always protected and accessible when you need it.',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: [
      'Bank-grade Encryption',
      '99.9% Uptime Guarantee',
      'Regular Data Backups',
      'Compliance Ready',
      '24/7 Security Monitoring',
      'GDPR Compliant'
    ],
    animation: {
      type: 'fade',
      duration: 500,
      easing: 'ease-in-out'
    }
  },
  {
    id: 'growth-analytics',
    title: 'Powerful Analytics & Insights',
    description: 'Make data-driven decisions with advanced analytics and customizable reports that help you understand your business better.',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    testimonial: {
      quote: 'The analytics dashboard has transformed how we make business decisions. We can see trends and opportunities we never noticed before.',
      name: 'Sarah Johnson',
      title: 'CFO',
      company: 'TechStart Solutions',
      avatar: '/images/testimonials/sarah.jpg',
      rating: 5,
      verified: true
    },
    animation: {
      type: 'zoom',
      duration: 500,
      easing: 'ease-in-out'
    }
  }
]

// Platform ratings for the bottom section
export const platformRatings: PlatformRating[] = [
  {
    platform: 'Capterra',
    score: '4.4/5',
    logo: '/images/ratings/capterra.png',
    reviewCount: 1250,
    url: 'https://www.capterra.com/p/fincorpx'
  },
  {
    platform: 'G2',
    score: '4.4/5',
    logo: '/images/ratings/g2.png',
    reviewCount: 890,
    url: 'https://www.g2.com/products/fincorpx'
  },
  {
    platform: 'Google',
    score: '4.7/5',
    logo: '/images/ratings/google.png',
    reviewCount: 2100,
    url: 'https://play.google.com/store/apps/details?id=com.fincorpx'
  },
  {
    platform: 'Trustpilot',
    score: '4.8/5',
    logo: '/images/ratings/trustpilot.png',
    reviewCount: 1680,
    url: 'https://www.trustpilot.com/review/fincorpx.com'
  }
]

// Alternative slides for different contexts
export const signInCarouselSlides: CarouselSlide[] = [
  {
    id: 'welcome-back',
    title: 'Welcome Back!',
    description: 'Continue managing your finances with the tools trusted by thousands of businesses worldwide.',
    backgroundGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    features: [
      'Access your dashboard instantly',
      'View real-time financial data',
      'Manage multiple companies',
      'Secure cloud synchronization'
    ]
  }
]

// Feature highlights for different slides
export const featureHighlights = {
  accounting: [
    {
      icon: 'pi pi-calculator',
      title: 'Smart Accounting',
      description: 'Automated bookkeeping with AI-powered categorization',
      color: '#10b981'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Financial Reports',
      description: 'Generate comprehensive reports in seconds',
      color: '#3b82f6'
    },
    {
      icon: 'pi pi-mobile',
      title: 'Mobile Access',
      description: 'Manage finances on-the-go with our mobile app',
      color: '#8b5cf6'
    }
  ],
  security: [
    {
      icon: 'pi pi-shield',
      title: 'Data Protection',
      description: 'Military-grade encryption for all your data',
      color: '#ef4444'
    },
    {
      icon: 'pi pi-lock',
      title: 'Access Control',
      description: 'Role-based permissions and multi-factor authentication',
      color: '#f59e0b'
    },
    {
      icon: 'pi pi-server',
      title: 'Reliable Infrastructure',
      description: 'Cloud infrastructure with 99.9% uptime SLA',
      color: '#06b6d4'
    }
  ]
}

// Statistics for success stories
export const businessStatistics = [
  {
    value: '10,000+',
    label: 'Active Businesses',
    icon: 'pi pi-building',
    trend: 'up',
    trendValue: '+25%'
  },
  {
    value: '₹50Cr+',
    label: 'Transactions Processed',
    icon: 'pi pi-money-bill',
    trend: 'up',
    trendValue: '+40%'
  },
  {
    value: '99.9%',
    label: 'Uptime Guarantee',
    icon: 'pi pi-check-circle',
    trend: 'stable'
  },
  {
    value: '24/7',
    label: 'Customer Support',
    icon: 'pi pi-headphones',
    trend: 'stable'
  }
]

// Testimonials pool for rotation
export const testimonialPool = [
  {
    quote: 'FinCorpX has revolutionized our financial management. The automation features save us hours every week.',
    name: 'Rajesh Kumar',
    title: 'Founder & CEO',
    company: 'Kumar Enterprises',
    avatar: '/images/testimonials/rajesh.jpg',
    rating: 5,
    verified: true
  },
  {
    quote: 'The reporting capabilities are outstanding. We can now make informed decisions based on real-time data.',
    name: 'Priya Sharma',
    title: 'Finance Director',
    company: 'Sharma & Associates',
    avatar: '/images/testimonials/priya.jpg',
    rating: 5,
    verified: true
  },
  {
    quote: 'Customer support is exceptional. They helped us migrate from our old system seamlessly.',
    name: 'Mohammed Ali',
    title: 'Operations Manager',
    company: 'Ali Trading Co.',
    avatar: '/images/testimonials/mohammed.jpg',
    rating: 5,
    verified: true
  },
  {
    quote: 'The mobile app is fantastic. I can manage my business finances from anywhere.',
    name: 'Anita Patel',
    title: 'Business Owner',
    company: 'Patel Textiles',
    avatar: '/images/testimonials/anita.jpg',
    rating: 5,
    verified: true
  }
]

// Carousel configuration presets
export const carouselConfigs = {
  signup: {
    autoplay: true,
    autoplayInterval: 5000,
    showIndicators: true,
    showNavigators: false,
    circular: true,
    numVisible: 1,
    numScroll: 1,
    page: 0,
    responsiveOptions: [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1
      }
    ]
  },
  signin: {
    autoplay: true,
    autoplayInterval: 7000,
    showIndicators: false,
    showNavigators: false,
    circular: true,
    numVisible: 1,
    numScroll: 1,
    page: 0
  }
}
