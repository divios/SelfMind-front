# Stage 1: Builder
FROM oven/bun:1.1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

# Add build argument for environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN bun run build 

# Stage 2: Runner
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]