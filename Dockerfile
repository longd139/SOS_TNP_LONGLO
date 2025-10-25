# Multi-stage build: build React app, then serve with Nginx

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Run stage ---
FROM nginx:alpine

# Use custom Nginx config (listens on 8881 and serves SPA)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8881

CMD ["nginx", "-g", "daemon off;"]

