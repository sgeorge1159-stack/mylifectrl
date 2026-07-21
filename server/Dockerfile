FROM oven/bun:1

WORKDIR /app

# Install dependencies
COPY server/package.json server/bun.lock ./
RUN bun install --frozen-lockfile

# Copy server source
COPY server/src ./src
COPY server/tsconfig.json ./

# Copy shared module (used by server via relative imports)
COPY shared /shared

# Build the server
RUN bun run build

# Runtime configuration
EXPOSE 3000
ENV NODE_ENV=production
ENV DATABASE_URL=/data/lifectrl.db
ENV UPLOADS_DIR=/data/uploads

# Create data directories and start
CMD mkdir -p /data/uploads && bun run start
