import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { router, protectedProcedure } from '../lib/trpc';
import { db } from '../lib/db';
import { messages, matches } from '@nmq/db';
import { sendMessageSchema } from '@nmq/shared';

export const messageRouter = router({
  listByMatch: protectedProcedure
    .input(z.object({ matchId: z.string(), limit: z.number().int().min(1).max(100).default(50) }))
    .query(async ({ input }) => {
      const result = await db.query.messages.findMany({
        where: (m, { eq }) => eq(m.matchId, input.matchId),
        orderBy: (m, { asc }) => [asc(m.createdAt)],
        limit: input.limit,
      });
      return result;
    }),

  send: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ input, ctx }) => {
      const match = await db.query.matches.findFirst({
        where: (m, { eq }) => eq(m.id, input.matchId),
      });
      if (!match) throw new TRPCError({ code: 'NOT_FOUND', message: 'Match not found' });

      const now = new Date();
      const inserted = await db
        .insert(messages)
        .values({
          id: nanoid(),
          matchId: input.matchId,
          senderId: ctx.user.id,
          content: input.content,
          messageType: input.messageType ?? 'text',
          metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          createdAt: now,
        })
        .returning();

      await db
        .update(matches)
        .set({ status: 'chatting', updatedAt: now })
        .where(eq(matches.id, input.matchId));

      return inserted[0];
    }),

  markRead: protectedProcedure
    .input(z.object({ messageIds: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const now = new Date();
      for (const id of input.messageIds) {
        await db.update(messages).set({ readAt: now }).where(eq(messages.id, id));
      }
      return { updated: input.messageIds.length };
    }),
});
