import { router } from '../lib/trpc';
import { authRouter } from './auth';
import { companyRouter } from './company';
import { matchRouter } from './match';
import { messageRouter } from './message';
import { schedulingRouter } from './scheduling';

export const appRouter = router({
  auth: authRouter,
  company: companyRouter,
  match: matchRouter,
  message: messageRouter,
  scheduling: schedulingRouter,
});

export type AppRouter = typeof appRouter;
