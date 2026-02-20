import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { matches } from './matches';
import { users } from './users';

export const meetingSlots = sqliteTable('meeting_slots', {
  id: text('id').primaryKey(),
  matchId: text('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  proposedBy: text('proposed_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  slots: text('slots').notNull().default('[]'),
  selectedSlot: text('selected_slot'),
  status: text('status', {
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
  })
    .notNull()
    .default('pending'),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  timezone: text('timezone').notNull().default('UTC'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type MeetingSlot = typeof meetingSlots.$inferSelect;
export type NewMeetingSlot = typeof meetingSlots.$inferInsert;
