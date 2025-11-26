/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_FEATURE_FLAGS: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_ANALYTICS_ENABLED: string
  readonly VITE_TEST_MODE?: string
  readonly VITE_DEMO_MODE?: string
  readonly VITE_SAMPLE_DATA?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GTM_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
