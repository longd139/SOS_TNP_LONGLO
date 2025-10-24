# syntax=docker/dockerfile:1.6

# ---- Build stage: compile front-end assets ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN set -eux; \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Optionally mount .env as a build secret so tools like Vite/Next/CRA can read it
# The Jenkinsfile passes --secret id=env,src=.env
RUN --mount=type=secret,id=env,dst=/tmp/.env \
    set -eux; \
    if [ -f /tmp/.env ]; then cp /tmp/.env .env; fi; \
    npm run build || (echo "No build script found; ensure package.json has a build script" && exit 1); \
    rm -f .env || true; \
    mkdir -p /out; \
    if [ -d dist ]; then cp -R dist/* /out/; \
    elif [ -d build ]; then cp -R build/* /out/; \
    elif [ -d public ]; then cp -R public/* /out/; \
    else echo "No build output found (expected dist/ or build/)." && exit 1; fi

# ---- Runtime stage: serve with Nginx ----
FROM nginx:1.25-alpine AS runtime

# Nginx config for SPA/static site
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=builder /out /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

# Default command
CMD ["nginx", "-g", "daemon off;"]

