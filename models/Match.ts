export interface Match {
  id: string;
  companyAId: string;
  companyBId: string;
  matchedCompany: MatchedCompanyPreview;
  matchReasons: MatchReason[];
  matchScore: number;
  status: MatchStatus;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchedCompanyPreview {
  id: string;
  brandName: string;
  logoUrl?: string;
  industry: string;
  hqLocation: string;
  offeringSummary: string;
  needsSummary: string;
  verificationBadges: string[];
}

export interface MatchReason {
  icon: string;
  label: string;
  description: string;
}

export type MatchStatus =
  | 'new'
  | 'chatting'
  | 'meeting_scheduled'
  | 'completed'
  | 'declined';
