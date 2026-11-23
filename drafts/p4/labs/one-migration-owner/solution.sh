# Choose one reviewed DDL owner for each schema/table.
# Option A: Prisma-owned app tables
npx prisma migrate dev --name task_state
# Review generated SQL, then in an approved release:
npx prisma migrate deploy
# Option B: Supabase-managed auth/storage/policies:
supabase migration --help
# Generate reviewed migrations using the installed CLI.
