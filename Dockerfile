FROM node:18-alpine3.16 AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install --global turbo
COPY . .
RUN turbo prune --scope=@progwise/timebook-web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine3.16 AS installer
ARG NEXTAUTH_URL
RUN apk add --no-cache libc6-compat
RUN apk update
RUN npm install --global pnpm
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/packages/backend/src/prisma/schema.prisma ./packages/backend/src/prisma/schema.prisma
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=@progwise/timebook-web

CMD pnpm run --prefix apps/web start
