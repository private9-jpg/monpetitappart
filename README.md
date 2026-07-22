This is a [Next.js](https://nextjs.org) project.

## Getting Started

1. Copy `.env.example` to `.env.local`.
2. Update the example values if needed.
3. Start the infrastructure locally with:

```bash
docker compose up -d
```

4. Run database migrations:

```bash
npx prisma migrate deploy
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Infrastructure

The project is containerized with Docker and Compose:

- `postgres` — PostgreSQL 16 on port 5432
- `redis` — Redis 7 on port 6379
- `adminer` — database admin UI on port 8080
- `app` — Next.js app on port 3000
- `payload` — Payload CMS admin on port 3001
- `backup` — daily PostgreSQL backup to `./backups`

## Monitoring

Health check endpoint: `GET /api/health`
Cron endpoint: `POST /api/cron`

## CI/CD

GitHub Actions runs lint, typecheck, tests, and build on every push and PR to `private`.

## Observability

- **Sentry**: error tracking enabled in production via `@sentry/nextjs`
- **Logs**: structured JSON logs through `lib/logger.ts`
- **Backups**: automatic daily SQL dumps stored in `./backups`
