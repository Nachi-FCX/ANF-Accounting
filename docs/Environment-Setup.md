# Environment Configuration Guide

This document explains how to use the multi-environment setup for FinCorpX.

## Environment Files

The project supports four different environments, each with its own configuration:

### 1. Development (`.env.development`)
- **Purpose**: Local development
- **API**: `http://localhost:8000/api`
- **Features**: Debug mode enabled, mock data, all beta features
- **Port**: 3001 (Docker)

### 2. Testing (`.env.testing`)
- **Purpose**: Automated testing and QA
- **API**: `https://api-test.fincorpx.com/api`
- **Features**: Test mode enabled, no mock data, limited beta features
- **Port**: 3002 (Docker)

### 3. Demo (`.env.demo`)
- **Purpose**: Client demonstrations and showcases
- **API**: `https://api-demo.fincorpx.com/api`
- **Features**: Sample data enabled, production-like but with demo content
- **Port**: 3003 (Docker)

### 4. Production (`.env.production`)
- **Purpose**: Live production environment
- **API**: `https://api.fincorpx.com/api`
- **Features**: Optimized settings, analytics enabled, error tracking
- **Port**: 3000 (Docker)

## Available Environment Variables

All environment variables are prefixed with `VITE_` to be accessible in the frontend:

```bash
VITE_APP_NAME=FinCorpX                    # Application name
VITE_ENVIRONMENT=development              # Current environment
VITE_APP_VERSION=1.0.0-dev               # Version string
VITE_API_BASE_URL=http://localhost:8000   # Backend API URL
VITE_DEBUG_MODE=true                      # Enable debug logging
VITE_FEATURE_FLAGS={"key":"value"}        # JSON feature flags
VITE_LOG_LEVEL=debug                      # Logging level
VITE_ENABLE_MOCK_DATA=true               # Use mock data
VITE_WEBSOCKET_URL=ws://localhost:8001    # WebSocket URL
VITE_ANALYTICS_ENABLED=false             # Analytics tracking
```

## Development Commands

### Running Development Server

```bash
# Default development mode
npm run dev

# Specific environment modes
npm run dev:testing
npm run dev:demo
npm run dev:production
```

### Building Applications

```bash
# Build specific environment
npm run build:development
npm run build:testing
npm run build:demo
npm run build:production

# Build all environments at once
npm run build:all

# Use the build script (Linux/Mac)
chmod +x scripts/build-all.sh
./scripts/build-all.sh
```

### Build Output

Each environment creates its own build directory:
- `dist-development/`
- `dist-testing/`
- `dist-demo/`
- `dist-production/`

## Docker Commands

### Individual Environment Builds

```bash
# Build specific environment Docker image
docker build --build-arg ENV=development -t fincorpx:dev .
docker build --build-arg ENV=testing -t fincorpx:test .
docker build --build-arg ENV=demo -t fincorpx:demo .
docker build --build-arg ENV=production -t fincorpx:prod .

# Build all Docker images
npm run docker:build:all
```

### Running with Docker Compose

```bash
# Production (default)
docker-compose up --build

# Development
docker-compose -f docker-compose.development.yml up --build

# Testing
docker-compose -f docker-compose.testing.yml up --build

# Demo
docker-compose -f docker-compose.demo.yml up --build
```

### Access URLs

When running with Docker:
- **Production**: http://localhost:3000
- **Development**: http://localhost:3001
- **Testing**: http://localhost:3002
- **Demo**: http://localhost:3003

## Using Environment Variables in Code

### TypeScript Support

The `env.d.ts` file provides full TypeScript support for all environment variables:

```typescript
// Access environment variables with full type safety
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true'
const featureFlags = JSON.parse(import.meta.env.VITE_FEATURE_FLAGS)
```

### Example Usage

```typescript
// src/config/environment.ts
export const config = {
  appName: import.meta.env.VITE_APP_NAME,
  environment: import.meta.env.VITE_ENVIRONMENT,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isDebug: import.meta.env.VITE_DEBUG_MODE === 'true',
  featureFlags: JSON.parse(import.meta.env.VITE_FEATURE_FLAGS || '{}'),
  logLevel: import.meta.env.VITE_LOG_LEVEL,
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
  analyticsEnabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
}

// Usage in components
import { config } from '@/config/environment'

if (config.isDebug) {
  console.log('Debug mode enabled')
}

if (config.featureFlags.newDashboard) {
  // Show new dashboard
}
```

## Best Practices

### 1. Environment-Specific Features

Use feature flags to enable/disable features per environment:

```typescript
const showBetaFeatures = config.featureFlags.betaFeatures
const showDebugPanel = config.featureFlags.debugPanel
```

### 2. API Configuration

Configure different API endpoints for each environment:

```typescript
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.environment === 'development' ? 30000 : 10000
})
```

### 3. Logging

Use environment-specific logging levels:

```typescript
const logger = {
  debug: (msg: string) => config.logLevel === 'debug' && console.log(msg),
  info: (msg: string) => ['debug', 'info'].includes(config.logLevel) && console.info(msg),
  warn: (msg: string) => ['debug', 'info', 'warn'].includes(config.logLevel) && console.warn(msg),
  error: (msg: string) => console.error(msg)
}
```

## Troubleshooting

### Environment Variables Not Loading

1. Ensure the `.env.*` file exists
2. Check that variables are prefixed with `VITE_`
3. Restart the development server after changes
4. Verify the correct mode is being used

### Build Issues

1. Check that all required environment variables are set
2. Ensure API URLs are accessible
3. Verify feature flags are valid JSON
4. Check TypeScript compilation errors

### Docker Issues

1. Ensure the correct environment argument is passed
2. Check that the build context includes all necessary files
3. Verify port conflicts between different environments
4. Check Docker logs for specific error messages

## Security Notes

- Never commit sensitive data to `.env` files
- Use different API keys for each environment
- Ensure production URLs are HTTPS
- Regularly rotate API keys and secrets
- Use environment-specific database connections
