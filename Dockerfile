# Base image
FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Production stage
FROM base AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy built application
COPY --from=development /app/dist ./dist
COPY --from=development /app/templates ./templates

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]

