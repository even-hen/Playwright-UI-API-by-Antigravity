# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS base

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

# Install Node dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# ─── Run Stage ────────────────────────────────────────────────────────────────
FROM base AS runner

# Set environment to CI mode for Playwright (no retries popup, consistent output)
ENV CI=true

# Default command: run all tests
CMD ["npx", "playwright", "test"]
