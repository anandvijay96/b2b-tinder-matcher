export interface SwipeAction {
  id: string;
  swiperCompanyId: string;
  targetCompanyId: string;
  direction: SwipeDirection;
  createdAt: string;
}

export type SwipeDirection = 'left' | 'right' | 'super_like';

export interface SwipeCandidate {
  company: CandidateCompany;
  matchReasons: CandidateMatchReason[];
  matchScore: number;
}

export interface CandidateCompany {
  id: string;
  brandName: string;
  legalName: string;
  logoUrl?: string;
  industry: string;
  hqLocation: string;
  employeeRange: string;
  description: string;
  offerings: string[];
  needs: string[];
  offeringSummary: string;
  needsSummary: string;
  verificationBadges: string[];
  responseSpeed: string;
  geographies: string[];
}

export interface CandidateMatchReason {
  icon: string;
  label: string;
  description: string;
}
