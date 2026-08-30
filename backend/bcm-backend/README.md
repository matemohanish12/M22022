BCM Backend (NestJS) — Local Dev Instructions

Overview
- Backend scaffold for Business Continuity Management & Resilience Platform
- Tech: NestJS, TypeORM, PostgreSQL

Local setup
1. Start Postgres (Docker):
   docker run -d --name bcm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bcm -p 5432:5432 postgres:15

2. Configure env (.env exists sample):
   Copy .env and update as needed. Important vars: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, SKIP_DB, DEV_SYNC

3. Install deps:
   npm install --legacy-peer-deps

4. Start dev server (with DB sync for dev only):
   $env:SKIP_DB='false'; $env:DEV_SYNC='true'; npm run start:dev

Migrations
- Generated SQL migration: migrations/20260829-initial.sql
- To apply using psql on host (if psql installed):
  $env:DB_HOST='localhost'; $env:DB_PORT='5432'; $env:DB_USER='postgres'; $env:DB_PASS='postgres'; $env:DB_NAME='bcm'
  npm run migrate:sql

- Or stream into container:
  type .\migrations\20260829-initial.sql | docker exec -i bcm-postgres psql -U postgres -d bcm -f -

TypeORM migrations (from entities)
- A data-source scaffold is provided at src/data-source.ts. To generate a migration from entities (requires TypeORM CLI):
  npm run typeorm:generate -- -n initial_from_entities

- Run generated migrations:
  npm run typeorm:run

Seeding sample data
- A PowerShell seed script is at seed.ps1. Run:
  pwsh -ExecutionPolicy Bypass -File .\seed.ps1

CI / Production notes
- Never enable TypeORM synchronize=true in production. Use migrations instead.
- Example GitHub Actions step to run SQL migration (add to your workflow):

  - name: Apply DB migration
    env:
      DB_HOST: ${{ secrets.DB_HOST }}
      DB_PORT: ${{ secrets.DB_PORT }}
      DB_USER: ${{ secrets.DB_USER }}
      DB_PASS: ${{ secrets.DB_PASS }}
      DB_NAME: ${{ secrets.DB_NAME }}
    run: |
      type migrations/20260829-initial.sql | docker exec -i ${{ env.DB_CONTAINER_NAME }} psql -U ${{ env.DB_USER }} -d ${{ env.DB_NAME }} -f -

Backup
- Quick DB dump (host machine with psql):
  pg_dump "postgresql://postgres:postgres@localhost:5432/bcm" -F c -b -v -f backup_bcm_$(Get-Date -Format yyyyMMddHHmmss).dump

Security & Hardening
- Set DEV_SYNC=false for production. Use migrations.
- Configure Azure Entra ID / OAuth for auth. Store secrets in environment/KeyVault.
- Ensure backups and replica for high availability.

Contact
- For questions, open an issue or ask the maintainer.
