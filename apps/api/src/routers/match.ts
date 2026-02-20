import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, eq, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { router, protectedProcedure } from '../lib/trpc';
import { db } from '../lib/db';
import { matches, swipeActions } from '@nmq/db';
import { recordSwipeSchema } from '@nmq/shared';

export const matchRouter = router({
  listMatches: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.user.id),
    });
    if (!user?.companyId) return [];

    const result = await db.query.matches.findMany({
      where: (m, { or, eq }) =>
        or(eq(m.companyAId, user.companyId!), eq(m.companyBId, user.companyId!)),
      orderBy: (m, { desc }) => [desc(m.updatedAt)],
    });

    return result;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const match = await db.query.matches.findFirst({
        where: (m, { eq }) => eq(m.id, input.id),
      });
      if (!match) throw new TRPCError({ code: 'NOT_FOUND' });
      return match;
    }),

  recordSwipe: protectedProcedure
    .input(recordSwipeSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, ctx.user.id),
      });
      if (!user?.companyId) throw new TRPCError({ code: 'PRECONDITION_FAILED' });

      const now = new Date();

      await db.insert(swipeActions).values({
        id: nanoid(),
        swiperId: user.companyId,
        targetId: input.targetCompanyId,
        action: input.action,
        createdAt: now,
      });

      let newMatch = null;
      if (input.action === 'like' || input.action === 'super_like') {
        const theirSwipe = await db.query.swipeActions.findFirst({
          where: (s, { and, eq }) =>
            and(
              eq(s.swiperId, input.targetCompanyId),
              eq(s.targetId, user.companyId!),
              or(eq(s.action, 'like'), eq(s.action, 'super_like')),
            ),
        });

        if (theirSwipe) {
          const existing = await db.query.matches.findFirst({
            where: (m, { or, and, eq }) =>
              or(
                and(eq(m.companyAId, user.companyId!), eq(m.companyBId, input.targetCompanyId)),
                and(eq(m.companyAId, input.targetCompanyId), eq(m.companyBId, user.companyId!)),
              ),
          });

          if (!existing) {
            const inserted = await db
              .insert(matches)
              .values({
                id: nanoid(),
                companyAId: user.companyId,
                companyBId: input.targetCompanyId,
                status: 'new',
                matchScore: 0,
                matchReasons: '[]',
                createdAt: now,
                updatedAt: now,
              })
              .returning();
            newMatch = inserted[0];
          }
        }
      }

      return { swipeRecorded: true, match: newMatch };
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.enum(['chatting', 'meeting_scheduled', 'completed', 'declined']) }))
    .mutation(async ({ input }) => {
      const updated = await db
        .update(matches)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(matches.id, input.id))
        .returning();
      if (!updated[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return updated[0];
    }),
});
