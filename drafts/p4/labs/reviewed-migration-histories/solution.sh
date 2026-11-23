# Generate in a dedicated development database.
npx prisma migrate dev --name add_task_state
# Inspect and commit the generated SQL under prisma/migrations.
npx prisma migrate status
npx prisma generate
# In a separately approved test/release database:
npx prisma migrate deploy
