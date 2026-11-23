# Wrong: the development migration generator must not run against prod.
npx prisma migrate dev --name production_hotfix
