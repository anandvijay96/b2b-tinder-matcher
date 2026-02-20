import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { router, protectedProcedure } from '../lib/trpc';
import { db } from '../lib/db';
import { companies } from '@nmq/db';
import { createCompanySchema, updateCompanySchema } from '@nmq/shared';

export const companyRouter = router({
  getMyCompany: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.user.id),
    });
    if (!user?.companyId) return null;

    const company = await db.query.companies.findFirst({
      where: (c, { eq }) => eq(c.id, user.companyId!),
    });
    return company ?? null;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const company = await db.query.companies.findFirst({
        where: (c, { eq }) => eq(c.id, input.id),
      });
      if (!company) throw new TRPCError({ code: 'NOT_FOUND' });
      return company;
    }),

  create: protectedProcedure
    .input(createCompanySchema)
    .mutation(async ({ input, ctx }) => {
      const now = new Date();
      const company = await db
        .insert(companies)
        .values({
          id: nanoid(),
          ...input,
          offerings: JSON.stringify(input.offerings),
          needs: JSON.stringify(input.needs),
          geographies: JSON.stringify(input.geographies),
          engagementModels: JSON.stringify(input.engagementModels),
          verificationStatus: 'unverified',
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return company[0];
    }),

  update: protectedProcedure
    .input(updateCompanySchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const now = new Date();
      const updated = await db
        .update(companies)
        .set({
          ...data,
          offerings: data.offerings ? JSON.stringify(data.offerings) : undefined,
          needs: data.needs ? JSON.stringify(data.needs) : undefined,
          geographies: data.geographies ? JSON.stringify(data.geographies) : undefined,
          engagementModels: data.engagementModels
            ? JSON.stringify(data.engagementModels)
            : undefined,
          updatedAt: now,
        })
        .where(eq(companies.id, id))
        .returning();

      if (!updated[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return updated[0];
    }),

  getCandidates: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, ctx.user.id),
      });
      if (!user?.companyId) throw new TRPCError({ code: 'PRECONDITION_FAILED' });

      // TODO Phase 8: Replace with Vertex AI vector similarity search
      const results = await db.query.companies.findMany({
        where: (c, { ne }) => ne(c.id, user.companyId!),
        limit: input.limit,
      });

      return { items: results, nextCursor: null };
    }),
});
