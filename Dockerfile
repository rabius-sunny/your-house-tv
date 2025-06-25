FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ---------------------
#       BUILDER
# ---------------------
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Accept DATABASE_URL as build argument
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Accept ImageKit build arguments for Next.js build
ARG NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY
ARG NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
ARG NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL
ARG NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME
ARG NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY
ARG NEXT_PUBLIC_BUNNY_PULL_ZONE_URL
ARG AUTH_SECRET
ARG SKIP_API

# Set ImageKit environment variables from build arguments
ENV NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=$NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY
ENV NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=$NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
ENV NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=$NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV SKIP_API=$SKIP_API
ENV NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL=$NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL
ENV NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=$NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME
ENV NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY=$NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY
ENV NEXT_PUBLIC_BUNNY_PULL_ZONE_URL=$NEXT_PUBLIC_BUNNY_PULL_ZONE_URL
ENV AUTH_SECRET=$AUTH_SECRET

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before building
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm prisma generate

# Build the application
# We don't need to copy .env file, environment variables will be provided in docker-compose
ENV NODE_ENV=production
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application
# COPY --from=builder /app/public ./public

# Set proper permissions for the public directory
# RUN chown -R nextjs:nodejs ./public

# Copy .next directory and standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Also copy package.json for any runtime dependencies
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3004

ENV PORT 3004
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
