import { z } from 'zod';

// --- Step 1: Company Basics ---
export const companyBasicsSchema = z.object({
  legalName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be under 100 characters'),
  website: z
    .string()
    .url('Please enter a valid URL (e.g. https://example.com)')
    .optional()
    .or(z.literal('')),
  industry: z
    .string()
    .min(1, 'Please select an industry'),
  employeeRange: z.enum(
    ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'],
    { message: 'Please select a company size' }
  ),
  hqLocation: z
    .string()
    .min(2, 'Please enter your HQ location')
    .max(100, 'Location must be under 100 characters'),
});

export type CompanyBasicsForm = z.infer<typeof companyBasicsSchema>;

// --- Step 2: Offerings & Needs ---
export const offeringsNeedsSchema = z.object({
  offeringSummary: z
    .string()
    .min(10, 'Please describe your offerings (at least 10 characters)')
    .max(500, 'Offerings summary must be under 500 characters'),
  offerings: z
    .array(z.string())
    .min(1, 'Add at least one offering tag'),
  needsSummary: z
    .string()
    .min(10, 'Please describe what you need (at least 10 characters)')
    .max(500, 'Needs summary must be under 500 characters'),
  needs: z
    .array(z.string())
    .min(1, 'Add at least one need tag'),
});

export type OfferingsNeedsForm = z.infer<typeof offeringsNeedsSchema>;

// --- Step 3: Deal Preferences ---
export const dealPreferencesSchema = z.object({
  dealSizeMin: z
    .number()
    .min(0, 'Minimum deal size cannot be negative')
    .optional(),
  dealSizeMax: z
    .number()
    .min(0, 'Maximum deal size cannot be negative')
    .optional(),
  geographies: z
    .array(z.string())
    .min(1, 'Select at least one geography'),
  engagementModels: z
    .array(
      z.enum([
        'project-based',
        'retainer',
        'full-time',
        'partnership',
        'licensing',
        'consulting',
      ])
    )
    .min(1, 'Select at least one engagement model'),
}).refine(
  (data) => {
    if (data.dealSizeMin !== undefined && data.dealSizeMax !== undefined) {
      return data.dealSizeMax >= data.dealSizeMin;
    }
    return true;
  },
  { message: 'Max deal size must be >= min deal size', path: ['dealSizeMax'] }
);

export type DealPreferencesForm = z.infer<typeof dealPreferencesSchema>;

// --- Step 4: Logo & Review ---
export const logoReviewSchema = z.object({
  logoUrl: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .min(20, 'Company description must be at least 20 characters')
    .max(1000, 'Description must be under 1000 characters'),
});

export type LogoReviewForm = z.infer<typeof logoReviewSchema>;

// --- Deal preferences without refinement (for merging) ---
export const dealPreferencesBaseSchema = z.object({
  dealSizeMin: z
    .number()
    .min(0, 'Minimum deal size cannot be negative')
    .optional(),
  dealSizeMax: z
    .number()
    .min(0, 'Maximum deal size cannot be negative')
    .optional(),
  geographies: z
    .array(z.string())
    .min(1, 'Select at least one geography'),
  engagementModels: z
    .array(
      z.enum([
        'project-based',
        'retainer',
        'full-time',
        'partnership',
        'licensing',
        'consulting',
      ])
    )
    .min(1, 'Select at least one engagement model'),
});

// --- Full onboarding aggregate (all steps combined) ---
export const fullOnboardingSchema = companyBasicsSchema
  .merge(offeringsNeedsSchema)
  .merge(dealPreferencesBaseSchema)
  .merge(logoReviewSchema);

export type FullOnboardingForm = z.infer<typeof fullOnboardingSchema>;

// --- Constants used in forms ---
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance & Banking',
  'Manufacturing',
  'Retail & E-commerce',
  'Energy & Utilities',
  'Real Estate',
  'Transportation & Logistics',
  'Education',
  'Media & Entertainment',
  'Telecommunications',
  'Agriculture',
  'Construction',
  'Legal Services',
  'Consulting',
  'Government & Public Sector',
  'Non-Profit',
  'Other',
] as const;

export const EMPLOYEE_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
] as const;

export const ENGAGEMENT_MODELS = [
  { value: 'project-based', label: 'Project-Based' },
  { value: 'retainer', label: 'Retainer' },
  { value: 'full-time', label: 'Full-Time' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'licensing', label: 'Licensing' },
  { value: 'consulting', label: 'Consulting' },
] as const;

export const GEOGRAPHIES = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Middle East',
  'Africa',
  'Latin America',
  'Global',
] as const;

export const DEAL_SIZE_OPTIONS = [
  { value: 1000, label: '$1K' },
  { value: 5000, label: '$5K' },
  { value: 10000, label: '$10K' },
  { value: 25000, label: '$25K' },
  { value: 50000, label: '$50K' },
  { value: 100000, label: '$100K' },
  { value: 250000, label: '$250K' },
  { value: 500000, label: '$500K' },
  { value: 1000000, label: '$1M+' },
] as const;
