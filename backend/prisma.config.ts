import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// https://www.youtube.com/watch?v=ruC2epbZgEM for prisma 7 only
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
