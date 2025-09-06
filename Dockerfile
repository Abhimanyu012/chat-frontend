# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Add package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies (with clean install for production)
RUN npm ci --production=false

# Add build argument for environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage with minimal footprint
FROM nginx:alpine AS production

# Add labels for better container management
LABEL maintainer="Your Name <your.email@example.com>"
LABEL version="1.0.0"
LABEL description="Chat Application Frontend"

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Expose ports
EXPOSE 80
EXPOSE 443

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Use non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

USER appuser

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
