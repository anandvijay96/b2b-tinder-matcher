import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/*',
  out: './src/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
