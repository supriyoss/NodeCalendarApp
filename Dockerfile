### Multi-stage Dockerfile for Vite + React app
# Build stage
FROM node:18-alpine AS build-base
WORKDIR /app

# Install build deps first (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

# Build the app
RUN npm run build

# Production stage: serve static files with nginx
FROM nginx:stable-alpine AS deploy

# Remove default nginx content and copy built files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-base /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

