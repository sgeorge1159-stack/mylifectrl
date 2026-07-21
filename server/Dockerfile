FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the server
RUN bun build src/index.ts --outdir dist --target bun

# Run on port 3000
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
