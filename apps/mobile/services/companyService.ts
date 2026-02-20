import type { Company, EngagementModel } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const companyService = {
  getCompany: async (_companyId: string): Promise<Company | null> => {
    await delay(500);
    return null;
  },

  updateCompany: async (
    _companyId: string,
    _updates: Partial<Company>
  ): Promise<Company | null> => {
    await delay(600);
    return null;
  },

  createCompany: async (data: Partial<Company>): Promise<Company> => {
    await delay(800);
    const now = new Date().toISOString();
    const company: Company = {
      id: `company_${Date.now()}`,
      legalName: data.legalName ?? '',
      brandName: data.brandName ?? data.legalName ?? '',
      website: data.website,
      logoUrl: data.logoUrl,
      hqLocation: data.hqLocation ?? '',
      industry: data.industry ?? '',
      employeeRange: data.employeeRange ?? '1-10',
      description: data.description ?? '',
      offerings: data.offerings ?? [],
      needs: data.needs ?? [],
      offeringSummary: data.offeringSummary ?? '',
      needsSummary: data.needsSummary ?? '',
      dealSizeMin: data.dealSizeMin,
      dealSizeMax: data.dealSizeMax,
      geographies: data.geographies ?? [],
      engagementModels: (data.engagementModels ?? []) as EngagementModel[],
      certifications: [],
      verificationStatus: 'unverified',
      verificationBadges: [],
      responseSpeed: 'moderate',
      createdAt: now,
      updatedAt: now,
    };
    return company;
  },
};
