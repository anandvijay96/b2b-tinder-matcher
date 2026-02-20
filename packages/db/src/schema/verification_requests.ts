import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { companies } from './companies';
import { users } from './users';

export const verificationRequests = sqliteTable('verification_requests', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  submittedBy: text('submitted_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  documents: text('documents').notNull().default('[]'),
  status: text('status', {
    enum: ['pending', 'in_review', 'approved', 'rejected'],
  })
    .notNull()
    .default('pending'),
  reviewNotes: text('review_notes'),
  reviewedBy: text('reviewed_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type NewVerificationRequest = typeof verificationRequests.$inferInsert;
