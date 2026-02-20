import { z } from 'zod';

export const matchStatusSchema = z.enum([
  'new',
  'chatting',
  'meeting_scheduled',
  'completed',
  'declined',
]);

export const swipeActionSchema = z.enum(['like', 'pass', 'super_like']);

export const recordSwipeSchema = z.object({
  targetCompanyId: z.string(),
  action: swipeActionSchema,
});

export const matchSchema = z.object({
  id: z.string(),
  companyAId: z.string(),
  companyBId: z.string(),
  status: matchStatusSchema,
  matchScore: z.number().min(0).max(100),
  matchReasons: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const matchListItemSchema = matchSchema.extend({
  partnerCompany: z.object({
    id: z.string(),
    legalName: z.string(),
    industry: z.string(),
    logoUrl: z.string().url().nullable(),
    verificationStatus: z.string(),
  }),
  lastMessagePreview: z.string().nullable(),
  unreadCount: z.number().int().nonnegative(),
});

export type MatchStatus = z.infer<typeof matchStatusSchema>;
export type SwipeAction = z.infer<typeof swipeActionSchema>;
export type RecordSwipeInput = z.infer<typeof recordSwipeSchema>;
export type Match = z.infer<typeof matchSchema>;
export type MatchListItem = z.infer<typeof matchListItemSchema>;
