import type { Company, EngagementModel } from '@/models';
import { trpc } from './trpcClient';

function parseJsonArray(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

function toIso(val: Date | string | number | null | undefined): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'number') return new Date(val).toISOString();
  return val;
}

function mapDbCompanyToMobile(db: Record<string, unknown>): Company {
  return {
    id: db.id as string,
    legalName: db.legalName as string,
    brandName: (db.brandName as string) ?? (db.legalName as string),
    website: db.website as string | undefined,
    logoUrl: db.logoUrl as string | undefined,
    hqLocation: db.hqLocation as string,
    industry: db.industry as string,
    employeeRange: (db.employeeRange as Company['employeeRange']) ?? '1-10',
    description: (db.description as string) ?? '',
    offerings: parseJsonArray(db.offerings as string),
    needs: parseJsonArray(db.needs as string),
    offeringSummary: (db.offeringSummary as string) ?? '',
    needsSummary: (db.needsSummary as string) ?? '',
    dealSizeMin: db.dealSizeMin as number | undefined,
    dealSizeMax: db.dealSizeMax as number | undefined,
    geographies: parseJsonArray(db.geographies as string),
    engagementModels: parseJsonArray(db.engagementModels as string) as EngagementModel[],
    certifications: [],
    verificationStatus: (db.verificationStatus as Company['verificationStatus']) ?? 'unverified',
    verificationBadges: [],
    responseSpeed: 'moderate',
    createdAt: toIso(db.createdAt as Date | string | number),
    updatedAt: toIso(db.updatedAt as Date | string | number),
  };
}

export { mapDbCompanyToMobile, parseJsonArray, toIso };

export const companyService = {
  getCompany: async (companyId: string): Promise<Company | null> => {
    try {
      const result = await trpc.company.getById.query({ id: companyId });
      return mapDbCompanyToMobile(result as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  getMyCompany: async (): Promise<Company | null> => {
    try {
      const result = await trpc.company.getMyCompany.query();
      if (!result) return null;
      return mapDbCompanyToMobile(result as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  updateCompany: async (
    companyId: string,
    updates: Partial<Company>,
  ): Promise<Company | null> => {
    try {
      // Strip mobile-only fields not in the API schema
      const {
        id: _id, certifications: _c, verificationBadges: _vb,
        responseSpeed: _rs, createdAt: _ca, updatedAt: _ua,
        verificationStatus: _vs, ...apiFields
      } = updates;
      const result = await trpc.company.update.mutate({
        id: companyId,
        ...(apiFields as unknown as Record<string, unknown>),
      } as Parameters<typeof trpc.company.update.mutate>[0]);
      return mapDbCompanyToMobile(result as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  createCompany: async (data: Partial<Company>): Promise<Company> => {
    const payload = {
      legalName: data.legalName ?? '',
      brandName: data.brandName ?? data.legalName,
      website: data.website,
      hqLocation: data.hqLocation ?? '',
      industry: data.industry ?? '',
      employeeRange: (data.employeeRange ?? '1-10'),
      description: data.description ?? 'No description provided.',
      logoUrl: data.logoUrl,
      offeringSummary: data.offeringSummary,
      offerings: data.offerings ?? [],
      needsSummary: data.needsSummary,
      needs: data.needs ?? [],
      dealSizeMin: data.dealSizeMin,
      dealSizeMax: data.dealSizeMax,
      geographies: data.geographies ?? [],
      engagementModels: (data.engagementModels ?? []),
    };
    const result = await trpc.company.create.mutate(
      payload as unknown as Parameters<typeof trpc.company.create.mutate>[0],
    );
    return mapDbCompanyToMobile(result as unknown as Record<string, unknown>);
  },
};
