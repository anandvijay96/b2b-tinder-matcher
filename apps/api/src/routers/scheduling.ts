import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { router, protectedProcedure } from '../lib/trpc';
import { db } from '../lib/db';
import { meetingSlots } from '@nmq/db';
import { proposeMeetingSchema, respondMeetingSchema } from '@nmq/shared';

export const schedulingRouter = router({
  listByMatch: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      return db.query.meetingSlots.findMany({
        where: (m, { eq }) => eq(m.matchId, input.matchId),
        orderBy: (m, { desc }) => [desc(m.createdAt)],
      });
    }),

  propose: protectedProcedure
    .input(proposeMeetingSchema)
    .mutation(async ({ input, ctx }) => {
      const now = new Date();
      const inserted = await db
        .insert(meetingSlots)
        .values({
          id: nanoid(),
          matchId: input.matchId,
          proposedBy: ctx.user.id,
          slots: JSON.stringify(input.slots),
          durationMinutes: input.durationMinutes ?? 30,
          timezone: input.timezone ?? 'UTC',
          notes: input.notes ?? null,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return inserted[0];
    }),

  respond: protectedProcedure
    .input(respondMeetingSchema)
    .mutation(async ({ input }) => {
      const status = input.action === 'accept' ? 'accepted' : 'declined';
      const updated = await db
        .update(meetingSlots)
        .set({
          status,
          selectedSlot: input.action === 'accept' ? (input.selectedSlot ?? null) : null,
          updatedAt: new Date(),
        })
        .where(eq(meetingSlots.id, input.meetingSlotId))
        .returning();

      if (!updated[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return updated[0];
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await db
        .update(meetingSlots)
        .set({ status: 'cancelled', updatedAt: new Date() })
        .where(eq(meetingSlots.id, input.id))
        .returning();
      if (!updated[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return updated[0];
    }),
});
