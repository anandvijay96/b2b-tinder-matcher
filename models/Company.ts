export interface Company {
  id: string;
  legalName: string;
  brandName: string;
  website?: string;
  logoUrl?: string;
  hqLocation: string;
  industry: string;
  employeeRange: EmployeeRange;
  description: string;
  offerings: string[];
  needs: string[];
  offeringSummary: string;
  needsSummary: string;
  dealSizeMin?: number;
  dealSizeMax?: number;
  geographies: string[];
  engagementModels: EngagementModel[];
  certifications: string[];
  verificationStatus: VerificationStatus;
  verificationBadges: VerificationBadge[];
  responseSpeed: ResponseSpeed;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeRange =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5000+';

export type EngagementModel =
  | 'project-based'
  | 'retainer'
  | 'full-time'
  | 'partnership'
  | 'licensing'
  | 'consulting';

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected';

export type VerificationBadge =
  | 'identity-verified'
  | 'documents-verified'
  | 'premium-verified';

export type ResponseSpeed = 'fast' | 'moderate' | 'slow';
