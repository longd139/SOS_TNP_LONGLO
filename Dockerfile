# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# ✅ Build ARG: Jenkins sẽ truyền file .env vào đây
ARG BUILD_ENV_FILE
RUN if [ -f "$BUILD_ENV_FILE" ]; then \
      echo "📄 Using build env from $BUILD_ENV_FILE"; \
      cp "$BUILD_ENV_FILE" .env; \
    elif [ -f build.env ]; then \
      echo "⚠️ No Jenkins env, fallback to local build.env"; \
      cp build.env .env; \
    else \
      echo "⚠️ No env file found at build time, using default"; \
    fi

# ✅ React build (đọc biến REACT_APP_* từ .env)
RUN npm run Build

# --- Run stage ---
FROM nginx:alpine

# Use custom Nginx config (listens on 8881 and serves SPA)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8881

CMD ["nginx", "-g", "daemon off;"]

