import { z } from 'zod';

export const messageTypeSchema = z.enum([
  'text',
  'rfq_template',
  'capability_deck',
  'meeting_proposal',
  'meeting_accepted',
  'meeting_declined',
]);

export const sendMessageSchema = z.object({
  matchId: z.string(),
  content: z.string().min(1, 'Message cannot be empty').max(4000),
  messageType: messageTypeSchema.default('text'),
  metadata: z.record(z.unknown()).optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  senderId: z.string(),
  content: z.string(),
  messageType: messageTypeSchema,
  metadata: z.record(z.unknown()).nullable(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type MessageType = z.infer<typeof messageTypeSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type Message = z.infer<typeof messageSchema>;
