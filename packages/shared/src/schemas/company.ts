import { z } from 'zod';

export const employeeRangeSchema = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
]);

export const engagementModelSchema = z.enum([
  'Project-based',
  'Retainer',
  'Revenue share',
  'Joint venture',
  'Distribution',
  'White-label',
  'Licensing',
]);

export const verificationStatusSchema = z.enum([
  'unverified',
  'pending',
  'verified',
  'rejected',
]);

export const createCompanySchema = z.object({
  legalName: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  brandName: z.string().max(100).optional(),
  website: z.string().url('Invalid website URL').optional(),
  hqLocation: z.string().min(2, 'Location is required').max(100),
  industry: z.string().min(2, 'Industry is required').max(50),
  employeeRange: employeeRangeSchema,
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  logoUrl: z.string().url().optional(),
  offeringSummary: z.string().max(500).optional(),
  offerings: z.array(z.string()).max(10),
  needsSummary: z.string().max(500).optional(),
  needs: z.array(z.string()).max(10),
  dealSizeMin: z.number().int().nonnegative().optional(),
  dealSizeMax: z.number().int().nonnegative().optional(),
  geographies: z.array(z.string()).max(10),
  engagementModels: z.array(engagementModelSchema).max(5),
});

export const updateCompanySchema = createCompanySchema.partial();

export const companyProfileSchema = createCompanySchema.extend({
  id: z.string(),
  verificationStatus: verificationStatusSchema,
  matchScore: z.number().min(0).max(100).optional(),
  matchReasons: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EmployeeRange = z.infer<typeof employeeRangeSchema>;
export type EngagementModel = z.infer<typeof engagementModelSchema>;
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyProfile = z.infer<typeof companyProfileSchema>;
