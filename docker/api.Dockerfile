FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install -g pnpm
RUN pnpm install --filter @hilarious/api... --filter @hilarious/shared...
COPY apps/api apps/api
COPY packages/shared packages/shared
WORKDIR /app/apps/api
RUN pnpm install
EXPOSE 4000
CMD ["pnpm", "start"]
