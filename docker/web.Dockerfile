FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install -g pnpm
RUN pnpm install --filter @hilarious/web... --filter @hilarious/shared...
COPY apps/web apps/web
COPY packages/shared packages/shared
WORKDIR /app/apps/web
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "dev"]
