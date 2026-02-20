import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { companies } from './companies';

export const intents = sqliteTable('intents', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['offering', 'need'] }).notNull(),
  tags: text('tags').notNull().default('[]'),
  description: text('description').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type Intent = typeof intents.$inferSelect;
export type NewIntent = typeof intents.$inferInsert;
