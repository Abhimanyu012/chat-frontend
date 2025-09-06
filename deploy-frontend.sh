#!/bin/bash

# Frontend Deployment Script
# This script builds and prepares the frontend for deployment

echo "🚀 Starting frontend deployment process..."
echo "📂 Working directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "frontend" "package.json"; then
  echo "❌ Error: This script should be run from the frontend directory"
  echo "Please run: cd /path/to/frontend && ./deploy-frontend.sh"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production || { echo "❌ Failed to install dependencies"; exit 1; }

# Create production build
echo "🔨 Creating production build..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Success message
echo "✅ Frontend build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo ""
echo "📋 Deployment Options:"
echo "--------------------------------------------------------"
echo "1️⃣  Static Hosting (Netlify, Vercel, GitHub Pages):"
echo "   - Upload the contents of the 'dist' directory"
echo ""
echo "2️⃣  Traditional Server:"
echo "   - Copy the 'dist' directory to your web server's document root"
echo "   - Example: scp -r dist/* user@your-server:/var/www/html/"
echo ""
echo "3️⃣  Docker Deployment:"
echo "   - Use the Dockerfile in the project root"
echo "   - Run: docker build -t chat-frontend ."
echo "   - Run: docker run -p 80:80 chat-frontend"
echo "--------------------------------------------------------"
echo ""
echo "🔗 Don't forget to set environment variables on your hosting platform:"
echo "   - VITE_API_URL=https://your-backend-domain.com/api"
echo "   - VITE_WS_URL=https://your-backend-domain.com"
