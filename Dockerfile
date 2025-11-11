# Multi-stage build for a Vite + React + TypeScript app
# 1) build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install only production dependencies is insufficient for building (we need dev deps), so install all
COPY package*.json ./
# Use npm ci for deterministic installs. If the project uses yarn/pnpm, update accordingly.
RUN npm ci

# Copy rest of the sources and build
COPY . .
RUN npm run build

# 2) production image
FROM nginx:stable-alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx conf (optional). If you don't provide one, default nginx config will be used.
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
