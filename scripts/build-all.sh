#!/bin/bash

# Build All Environments Script for FinCorpX
# This script builds the application for all environments

set -e  # Exit on any error

echo "🚀 Starting build process for all environments..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist-*

# Build for each environment
environments=("development" "testing" "demo" "production")

for env in "${environments[@]}"; do
    print_status "Building for $env environment..."
    
    if npm run build:$env; then
        print_success "✅ $env build completed successfully"
    else
        print_error "❌ $env build failed"
        exit 1
    fi
done

# Create build summary
print_status "Creating build summary..."

echo ""
echo "📊 Build Summary:"
echo "=================="

for env in "${environments[@]}"; do
    if [ -d "dist-$env" ]; then
        size=$(du -sh "dist-$env" | cut -f1)
        files=$(find "dist-$env" -type f | wc -l)
        echo "• $env: $size ($files files)"
    else
        print_warning "⚠️  dist-$env directory not found"
    fi
done

print_success "🎉 All builds completed successfully!"

echo ""
echo "📁 Output directories:"
for env in "${environments[@]}"; do
    echo "  • dist-$env/"
done

echo ""
echo "🐳 To build Docker images for all environments:"
echo "   npm run docker:build:all"
echo ""
echo "🚀 To run specific environment:"
echo "   docker-compose -f docker-compose.development.yml up"
echo "   docker-compose -f docker-compose.testing.yml up"
echo "   docker-compose -f docker-compose.demo.yml up"
echo "   docker-compose up  # for production"
