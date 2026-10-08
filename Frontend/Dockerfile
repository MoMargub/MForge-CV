FROM node:22-slim

# ── System dependencies (Puppeteer / Chromium) ────────────────────────────────
# Cached permanently — only re-runs if this RUN instruction itself changes.
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── npm dependencies ──────────────────────────────────────────────────────────
# IMPORTANT: Copy package files FIRST (before source code).
# Docker caches this layer. npm install only re-runs when package.json changes.
COPY package*.json ./
RUN npm install

# ── Application source ────────────────────────────────────────────────────────
# Copying source code here — after npm install.
# Changing .ts/.tsx files only invalidates THIS layer and below, NOT npm install.
COPY . .

# ── Next.js production build ──────────────────────────────────────────────────
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start-next"]
