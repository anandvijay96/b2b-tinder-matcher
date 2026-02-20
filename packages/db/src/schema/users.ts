import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { companies } from './companies';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  companyId: text('company_id').references(() => companies.id, {
    onDelete: 'set null',
  }),
  role: text('role', { enum: ['owner', 'member', 'admin'] })
    .notNull()
    .default('owner'),
  pushToken: text('push_token'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
