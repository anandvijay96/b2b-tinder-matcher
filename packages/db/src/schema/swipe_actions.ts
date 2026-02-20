import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { companies } from './companies';

export const swipeActions = sqliteTable('swipe_actions', {
  id: text('id').primaryKey(),
  swiperId: text('swiper_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  targetId: text('target_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  action: text('action', { enum: ['like', 'pass', 'super_like'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type SwipeAction = typeof swipeActions.$inferSelect;
export type NewSwipeAction = typeof swipeActions.$inferInsert;
