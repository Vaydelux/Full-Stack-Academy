// Incorrect v7 configuration: DB URL embedded in the model schema.
// datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
export const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
