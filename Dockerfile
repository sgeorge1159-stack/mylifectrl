FROM oven/bun:1

WORKDIR /app

# Copy server dependency files
COPY server/package.json server/bun.lock ./
RUN bun install --frozen-lockfile

# Copy server source
COPY server/src ./src
COPY server/tsconfig.json ./

# Copy shared module 
COPY shared/ /shared/

# Build
RUN bun build src/index.ts --outdir dist --target bun

ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
