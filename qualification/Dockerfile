FROM node:24.19.0-trixie-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl unzip minisign poppler-utils procps python3 python3-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /bench
COPY . .
RUN npm ci --no-audit --no-fund \
    && node node_modules/playwright/cli.js install-deps chromium \
    && ./setup
ENTRYPOINT ["./run"]
