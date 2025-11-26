# Docker Setup for FinCorpX

This document explains how to build and run the FinCorpX Vue.js application using Docker.

## Files Created

- `Dockerfile` - Multi-stage build configuration
- `nginx.conf` - Nginx configuration for SPA routing
- `.dockerignore` - Files to exclude from Docker build context
- `docker-compose.yml` - Docker Compose configuration for production
- `docker-compose.development.yml` - Docker Compose configuration for development
- `docker-compose.testing.yml` - Docker Compose configuration for testing
- `docker-compose.demo.yml` - Docker Compose configuration for demo

## Building and Running

### Option 1: Using Docker Compose (Recommended)

#### Production Environment
```bash
# Build and start the production application
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop the application
docker-compose down
```
The application will be available at: http://localhost:3000

#### Development Environment
```bash
# Build and start the development application
docker-compose -f docker-compose.development.yml up --build

# Run in detached mode (background)
docker-compose -f docker-compose.development.yml up -d --build

# Stop the development application
docker-compose -f docker-compose.development.yml down
```
The application will be available at: http://localhost:3001

#### Testing Environment
```bash
# Build and start the testing application
docker-compose -f docker-compose.testing.yml up -d --build

# Stop the testing application
docker-compose -f docker-compose.testing.yml down
```

#### Demo Environment
```bash
# Build and start the demo application
docker-compose -f docker-compose.demo.yml up -d --build

# Stop the demo application
docker-compose -f docker-compose.demo.yml down
```

### Option 2: Using Docker Commands

#### Build for Specific Environment
```bash
# Build development image
docker build --build-arg ENV=development -t fincorpx:dev .

# Build testing image
docker build --build-arg ENV=testing -t fincorpx:test .

# Build demo image
docker build --build-arg ENV=demo -t fincorpx:demo .

# Build production image
docker build --build-arg ENV=production -t fincorpx:prod .

# Build all environments at once
npm run docker:build:all
```

#### Run Containers
```bash
# Run development container
docker run -d -p 3001:80 --name fincorpx-dev fincorpx:dev

# Run production container
docker run -d -p 3000:80 --name fincorpx-prod fincorpx:prod

# Stop and remove containers
docker stop fincorpx-dev fincorpx-prod
docker rm fincorpx-dev fincorpx-prod
```

## Environment Configuration

| Environment | Port | Docker Compose File | Build Command |
|-------------|------|-------------------|---------------|
| Development | 3001 | `docker-compose.development.yml` | `--build-arg ENV=development` |
| Testing | 3002 | `docker-compose.testing.yml` | `--build-arg ENV=testing` |
| Demo | 3003 | `docker-compose.demo.yml` | `--build-arg ENV=demo` |
| Production | 3000 | `docker-compose.yml` | `--build-arg ENV=production` |

## Docker Configuration Details

### Multi-Stage Build

The Dockerfile uses a multi-stage build approach:

1. **Build Stage**: Uses Node.js 20 Alpine to build the Vue.js application
2. **Production Stage**: Uses Nginx Alpine to serve the built static files

### Nginx Configuration

The `nginx.conf` includes:
- SPA routing support (handles Vue Router client-side routes)
- Gzip compression for better performance
- Static asset caching with long expiration times
- Security headers
- Optimized for serving Vue.js applications

### Port Configuration

- Container exposes port 80 (Nginx default)
- Docker Compose maps it to localhost:3000
- You can change the external port in `docker-compose.yml`

## Customization

### Changing the Port

Edit `docker-compose.yml` and modify the ports mapping:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Environment Variables

Add environment variables in `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - API_URL=https://your-api-url.com
```

### Custom Nginx Configuration

Modify `nginx.conf` to customize server behavior, add SSL, or change caching rules.

## Troubleshooting

### Common Build Issues

#### Case Sensitivity Errors
If you encounter errors like `ENOENT: no such file or directory` during build:
```bash
# Example error:
# Could not load /app/src/assets/img/mainasset/Fcxlogo.png
```
**Solution**: Ensure all asset imports match the exact case of filenames:
- Use `fcxlogo.png` not `Fcxlogo.png`
- Use `fcxname.svg` not `Fcxname.svg`

Check and fix case sensitivity in:
- `src/components/layout/sidebar/Sidebar.vue`
- `src/views/auth/components/AuthLayoutCentered.vue`

#### Nginx Configuration Errors
If container fails to start with nginx errors:
```bash
# Example error:
# nginx: [emerg] invalid value "must-revalidate" in /etc/nginx/conf.d/default.conf:11
```
**Solution**: Check `nginx.conf` for invalid directives. Valid `gzip_proxied` values are:
```nginx
gzip_proxied expired no-cache no-store private auth;
```

#### Build Dependencies Issues
- Ensure all dependencies are properly listed in `package.json`
- Check that the build command `npm run build` works locally
- Verify Node.js version compatibility (using Node.js 20 Alpine)

### Runtime Issues

#### Container Not Starting
```bash
# Check container logs
docker-compose logs fincorpx-dev

# For specific environment
docker-compose -f docker-compose.development.yml logs fincorpx-dev
```

#### Port Conflicts
```bash
# Check if port is already in use
netstat -an | grep 3000
lsof -i :3000

# Use different port in docker-compose.yml
ports:
  - "3002:80"  # Change external port
```

#### Nginx Configuration Test
```bash
# Test nginx config inside container
docker exec -it fincorpx-dev nginx -t

# Reload nginx if config changes
docker exec -it fincorpx-dev nginx -s reload
```

### SPA Routing Issues
- Ensure `nginx.conf` includes the `try_files` directive
- Check that Vue Router is configured for history mode
- Verify all routes work when accessing directly via URL

### Security Vulnerabilities
If npm audit shows vulnerabilities:
```bash
# Run audit and fix
npm audit
npm audit fix

# For Docker builds, rebuild after fixing
docker build --no-cache --build-arg ENV=production -t fincorpx:prod .
```

### Performance Issues
```bash
# Check container resource usage
docker stats

# Monitor container logs for errors
docker logs -f fincorpx-dev
```

## Verification Commands

### Test All Environments
```bash
# Build all environments
npm run docker:build:all

# Test each environment
curl -I http://localhost:3000  # Production
curl -I http://localhost:3001  # Development  
curl -I http://localhost:3002  # Testing
curl -I http://localhost:3003  # Demo
```

### Health Checks
```bash
# Check if containers are running
docker ps

# Check container health
docker inspect fincorpx-dev --format='{{.State.Status}}'

# Check nginx status inside container
docker exec fincorpx-dev ps aux | grep nginx
```

## Production Deployment

For production deployment:

1. Update `nginx.conf` with your domain name
2. Add SSL configuration
3. Configure environment-specific variables
4. Set up proper logging and monitoring
5. Consider using a reverse proxy (like Traefik or nginx-proxy)

## Performance Optimization

The current setup includes:
- Gzip compression
- Static asset caching
- Optimized Docker image layers
- Multi-stage build to reduce final image size

For further optimization:
- Enable HTTP/2 in Nginx
- Add CDN for static assets
- Implement proper cache headers for API calls
- Consider using nginx-brotli for better compression

## Quick Reference

### Most Common Commands

```bash
# Development workflow
docker-compose -f docker-compose.development.yml up -d --build
docker-compose -f docker-compose.development.yml logs -f
docker-compose -f docker-compose.development.yml down

# Production deployment
docker-compose up -d --build
docker-compose logs -f
docker-compose down

# Build specific environment
docker build --build-arg ENV=development -t fincorpx:dev .
docker run -d -p 3001:80 --name fincorpx-dev fincorpx:dev

# Debugging
docker exec -it fincorpx-dev /bin/sh
docker logs fincorpx-dev
curl -I http://localhost:3001
```

### Environment URLs

- **Development**: http://localhost:3001
- **Testing**: http://localhost:3002  
- **Demo**: http://localhost:3003
- **Production**: http://localhost:3000

### Important Files

- `Dockerfile` - Multi-stage build configuration
- `nginx.conf` - Web server configuration  
- `.dockerignore` - Build context exclusions
- `docker-compose*.yml` - Environment-specific configurations
- `package.json` - Contains `docker:build:all` script

---

*Last updated: November 4, 2025*  
*Docker setup verified and tested for all environments*
