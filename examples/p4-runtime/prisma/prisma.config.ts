import { defineConfig } from 'prisma/config';
import { pgConfig } from '../guard.mjs';
export default defineConfig({schema:'prisma/schema.prisma',migrations:{path:'prisma/migrations'},datasource:{url:pgConfig()}});
