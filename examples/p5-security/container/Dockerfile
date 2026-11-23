# Only for disposable local Academy qualification. No production runtime.
FROM node:24-bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql-client git ca-certificates \
 && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /academy
