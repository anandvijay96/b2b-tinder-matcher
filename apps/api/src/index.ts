import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { createContext } from './lib/trpc';
import { auth } from './lib/auth';

const app = new Hono();

app.use('*', logger());

app.use(
  '*',
  cors({
    origin: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:8081').split(','),
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

app.get('/health', (c) =>
  c.json({ status: 'ok', version: process.env.npm_package_version ?? '0.0.1' }),
);

app.notFound((c) => c.json({ error: 'Not found' }, 404));

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
};
