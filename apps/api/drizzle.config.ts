import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../../packages/db/src/schema/*',
  out: '../../packages/db/src/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
