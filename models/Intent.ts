export interface Intent {
  id: string;
  companyId: string;
  type: IntentType;
  title: string;
  description: string;
  categories: string[];
  budgetRange?: BudgetRange;
  geographies: string[];
  urgency: IntentUrgency;
  isActive: boolean;
  embeddingVector?: number[];
  createdAt: string;
  updatedAt: string;
}

export type IntentType = 'offer' | 'need';

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export type IntentUrgency = 'low' | 'medium' | 'high' | 'urgent';
