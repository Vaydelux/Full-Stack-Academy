# Never mutate prod while investigating.
npx prisma migrate status
# On disposable local dev: inspect drift and generate a reviewed repair.
npx prisma migrate dev --create-only --name reconcile_schema
# Review SQL and match the intended checked-in schema.
npx prisma generate
# Test the reviewed migration against a fresh disposable database.
