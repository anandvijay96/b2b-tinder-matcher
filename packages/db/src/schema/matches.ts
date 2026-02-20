import { text, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { companies } from './companies';

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  companyAId: text('company_a_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  companyBId: text('company_b_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  status: text('status', {
    enum: ['new', 'chatting', 'meeting_scheduled', 'completed', 'declined'],
  })
    .notNull()
    .default('new'),
  matchScore: real('match_score').notNull().default(0),
  matchReasons: text('match_reasons').notNull().default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
