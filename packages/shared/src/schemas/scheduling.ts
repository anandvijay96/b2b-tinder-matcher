import { z } from 'zod';

export const meetingSlotStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'cancelled',
]);

export const proposeMeetingSchema = z.object({
  matchId: z.string(),
  slots: z.array(z.string().datetime()).min(1).max(3),
  durationMinutes: z.number().int().positive().default(30),
  timezone: z.string().default('UTC'),
  notes: z.string().max(500).optional(),
});

export const respondMeetingSchema = z.object({
  meetingSlotId: z.string(),
  action: z.enum(['accept', 'decline']),
  selectedSlot: z.string().datetime().optional(),
});

export const meetingSlotSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  proposedBy: z.string(),
  slots: z.array(z.string().datetime()),
  selectedSlot: z.string().datetime().nullable(),
  status: meetingSlotStatusSchema,
  durationMinutes: z.number().int().positive(),
  timezone: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type MeetingSlotStatus = z.infer<typeof meetingSlotStatusSchema>;
export type ProposeMeetingInput = z.infer<typeof proposeMeetingSchema>;
export type RespondMeetingInput = z.infer<typeof respondMeetingSchema>;
export type MeetingSlot = z.infer<typeof meetingSlotSchema>;
