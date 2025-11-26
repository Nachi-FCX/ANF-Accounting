# Multi-stage build for Vue.js application

# Build stage
FROM node:20-alpine AS build-stage

# Set working directory
WORKDIR /app

# Accept build argument for environment
ARG ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application for specific environment
RUN npm run build:${ENV}

# Copy the correct dist folder based on environment
RUN if [ "$ENV" = "production" ]; then \
      cp -r dist-production dist; \
    elif [ "$ENV" = "development" ]; then \
      cp -r dist-development dist; \
    elif [ "$ENV" = "testing" ]; then \
      cp -r dist-testing dist; \
    elif [ "$ENV" = "demo" ]; then \
      cp -r dist-demo dist; \
    else \
      cp -r dist-production dist; \
    fi

# Production stage
FROM nginx:alpine AS production-stage

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
