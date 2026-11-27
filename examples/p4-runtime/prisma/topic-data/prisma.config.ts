import { defineConfig } from 'prisma/config';
import { pgConfig } from '../../guard.mjs';
export default defineConfig({schema:'schema.prisma',datasource:{url:pgConfig()}});
