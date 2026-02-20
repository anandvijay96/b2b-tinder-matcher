import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { matches } from './matches';
import { users } from './users';

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  matchId: text('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  senderId: text('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  messageType: text('message_type', {
    enum: [
      'text',
      'rfq_template',
      'capability_deck',
      'meeting_proposal',
      'meeting_accepted',
      'meeting_declined',
    ],
  })
    .notNull()
    .default('text'),
  metadata: text('metadata'),
  readAt: integer('read_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
