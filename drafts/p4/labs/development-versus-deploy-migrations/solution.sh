# Local disposable dev database: author/review migrations first.
npx prisma migrate dev --name add_task_tenant
npx prisma generate
# In a controlled deployment environment with reviewed SQL:
npx prisma migrate deploy
