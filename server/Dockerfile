FROM oven/bun:1

WORKDIR /app

# Copy server dependency files
COPY server/package.json server/bun.lock ./
RUN bun install --frozen-lockfile

# Copy server source
COPY server/ .

# Copy shared module (relative imports will resolve from /shared/)
COPY shared/ /shared/

# Build the server (Bun bundles all imports including shared/)
RUN bun build src/index.ts --outdir dist --target bun

# Run on port 3000
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
