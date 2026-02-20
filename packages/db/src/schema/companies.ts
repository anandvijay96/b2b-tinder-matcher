import { text, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';

export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(),
  legalName: text('legal_name').notNull(),
  brandName: text('brand_name'),
  website: text('website'),
  hqLocation: text('hq_location').notNull(),
  industry: text('industry').notNull(),
  employeeRange: text('employee_range').notNull(),
  description: text('description').notNull().default(''),
  logoUrl: text('logo_url'),
  offeringSummary: text('offering_summary'),
  offerings: text('offerings').notNull().default('[]'),
  needsSummary: text('needs_summary'),
  needs: text('needs').notNull().default('[]'),
  dealSizeMin: integer('deal_size_min'),
  dealSizeMax: integer('deal_size_max'),
  geographies: text('geographies').notNull().default('[]'),
  engagementModels: text('engagement_models').notNull().default('[]'),
  verificationStatus: text('verification_status', {
    enum: ['unverified', 'pending', 'verified', 'rejected'],
  })
    .notNull()
    .default('unverified'),
  embeddingVector: text('embedding_vector'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
