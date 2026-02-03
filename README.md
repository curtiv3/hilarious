# Hilarious

Multi-tenant SaaS for verifying whether growth experiments increase revenue (MRR/ARR/pipeline) with CFO-grade audit trails.

## Tech Stack
- **Backend**: NestJS + TypeScript + Prisma + Postgres + Redis (BullMQ) + JWT auth
- **Frontend**: Next.js App Router + Tailwind + TanStack Query + Recharts
- **Storage**: S3-compatible (MinIO for dev)
- **Tests**: Vitest (unit/integration), Supertest (API), Playwright (e2e)

## Repo Structure
```
/apps
  /api
  /web
/packages
  /shared
/docker
  minio-init.sh
```

## Setup
### Requirements
- Node 20+
- pnpm
- Docker

### Environment Variables
**API**
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (optional)
- `ENCRYPTION_KEY`
- `CORS_ORIGIN`

**WEB**
- `NEXT_PUBLIC_API_URL`

### Run with Docker
```
cd docker
docker-compose up --build
```

### Local Development
```
pnpm install
pnpm --filter @hilarious/api start:dev
pnpm --filter @hilarious/web dev
pnpm seed
```

## CSV Formats
### Exposures
Columns:
- `subject_id`
- `group` (control/treatment)
- `exposed_at` (ISO)
- `subject_type` (optional)

### Revenue
Columns:
- `occurred_at` (ISO)
- `subject_id`
- `amount_cents`
- `currency`
- `event_type`
- `external_id` (optional)

## Tests
```
pnpm --filter @hilarious/api test
pnpm --filter @hilarious/web test
```

## Seed Demo (coming soon)
Seed script will create DemoCo tenant, demo users, sample experiment, exposures, revenue, and computed snapshot.

## Branch Note
This branch includes a small README edit per request.
