# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY . .

# Environment variables must be redefined at run time
ARG NEXTAUTH_SECRET=adb6e96b7ec73026c7562eff5f8b95ee
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV DATABASE_TYPE=postgresql
ARG DATABASE_URL=
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ARG SELF_HOSTED_USERNAME=penx
ENV SELF_HOSTED_USERNAME=${SELF_HOSTED_USERNAME}
ARG SELF_HOSTED_PASSWORD=123456
ENV SELF_HOSTED_PASSWORD=${SELF_HOSTED_PASSWORD}

# First install the dependencies (as they change less often)
RUN pnpm install

RUN turbo run build --filter=@penx/db
RUN npx turbo run build --filter=web...

FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Environment variables must be redefined at run time
ARG NEXTAUTH_SECRET=adb6e96b7ec73026c7562eff5f8b95ee
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG DATABASE_URL=
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ARG SELF_HOSTED_USERNAME=penx
ENV SELF_HOSTED_USERNAME=${SELF_HOSTED_USERNAME}
ARG SELF_HOSTED_PASSWORD=123456
ENV SELF_HOSTED_PASSWORD=${SELF_HOSTED_PASSWORD}

CMD node apps/web/server.js
