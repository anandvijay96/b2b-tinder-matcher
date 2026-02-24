import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../lib/trpc';
import { requestOtpSchema, verifyOtpSchema } from '@nmq/shared';
import { auth } from '../lib/auth';

export const authRouter = router({
  requestOtp: publicProcedure
    .input(requestOtpSchema)
    .mutation(async ({ input }) => {
      await auth.api.sendVerificationOTP({
        body: { email: input.email, type: 'sign-in' },
      });
      return { success: true };
    }),

  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await auth.api.signInEmailOTP({
        body: { email: input.email, otp: input.otp },
        headers: ctx.req.headers,
      });
      if (!result) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired OTP' });
      }
      return {
        success: true,
        user: result.user,
        token: result.token ?? null,
      };
    }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    await auth.api.signOut({ headers: ctx.req.headers });
    return { success: true };
  }),

  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session ?? null;
  }),
});
