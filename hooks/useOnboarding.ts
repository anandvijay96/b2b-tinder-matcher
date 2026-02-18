import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useCompanyStore } from '@/stores';
import { companyService } from '@/services';
import type { OnboardingDraft } from '@/stores/useCompanyStore';
import type { EmployeeRange, EngagementModel } from '@/models';
import {
  companyBasicsSchema,
  offeringsNeedsSchema,
  dealPreferencesSchema,
  logoReviewSchema,
} from '@/models/onboardingSchemas';

const TOTAL_STEPS = 4;

export function useOnboarding() {
  const router = useRouter();
  const {
    onboardingDraft,
    setOnboardingDraft,
    persistDraft,
    completeOnboarding,
    loadDraft,
    resetOnboardingDraft,
  } = useCompanyStore();

  const updateDraft = useCallback(
    (updates: Partial<OnboardingDraft>) => {
      setOnboardingDraft(updates);
    },
    [setOnboardingDraft]
  );

  const saveDraft = useCallback(async () => {
    await persistDraft();
  }, [persistDraft]);

  const validateStep = useCallback(
    (step: number): { success: boolean; errors: Record<string, string> } => {
      const draft = useCompanyStore.getState().onboardingDraft;
      const errorMap: Record<string, string> = {};

      try {
        switch (step) {
          case 1:
            companyBasicsSchema.parse({
              legalName: draft.legalName,
              website: draft.website || undefined,
              industry: draft.industry,
              employeeRange: draft.employeeRange,
              hqLocation: draft.hqLocation,
            });
            break;
          case 2:
            offeringsNeedsSchema.parse({
              offeringSummary: draft.offeringSummary,
              offerings: draft.offerings,
              needsSummary: draft.needsSummary,
              needs: draft.needs,
            });
            break;
          case 3:
            dealPreferencesSchema.parse({
              dealSizeMin: draft.dealSizeMin,
              dealSizeMax: draft.dealSizeMax,
              geographies: draft.geographies,
              engagementModels: draft.engagementModels,
            });
            break;
          case 4:
            logoReviewSchema.parse({
              logoUrl: draft.logoUrl || undefined,
              description: draft.description,
            });
            break;
        }
        return { success: true, errors: errorMap };
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'issues' in err) {
          const zodErr = err as { issues: Array<{ path: (string | number)[]; message: string }> };
          for (const issue of zodErr.issues) {
            const field = issue.path.join('.');
            if (!errorMap[field]) {
              errorMap[field] = issue.message;
            }
          }
        }
        return { success: false, errors: errorMap };
      }
    },
    []
  );

  const goToStep = useCallback(
    (step: number) => {
      setOnboardingDraft({ currentStep: step });
      router.push(`/(auth)/onboarding/step${step}` as never);
    },
    [router, setOnboardingDraft]
  );

  const nextStep = useCallback(async () => {
    const current = useCompanyStore.getState().onboardingDraft.currentStep;
    const validation = validateStep(current);
    if (!validation.success) {
      return validation;
    }

    if (current < TOTAL_STEPS) {
      const next = current + 1;
      setOnboardingDraft({ currentStep: next });
      await persistDraft();
      router.push(`/(auth)/onboarding/step${next}` as never);
    }
    return validation;
  }, [validateStep, setOnboardingDraft, persistDraft, router]);

  const prevStep = useCallback(() => {
    const current = useCompanyStore.getState().onboardingDraft.currentStep;
    if (current > 1) {
      const prev = current - 1;
      setOnboardingDraft({ currentStep: prev });
      router.back();
    }
  }, [setOnboardingDraft, router]);

  const submitProfile = useCallback(async (): Promise<{
    success: boolean;
    errors: Record<string, string>;
  }> => {
    const validation = validateStep(4);
    if (!validation.success) {
      return validation;
    }

    const draft = useCompanyStore.getState().onboardingDraft;

    try {
      const company = await companyService.createCompany({
        legalName: draft.legalName,
        brandName: draft.legalName,
        website: draft.website || undefined,
        industry: draft.industry,
        employeeRange: draft.employeeRange as EmployeeRange,
        hqLocation: draft.hqLocation,
        offeringSummary: draft.offeringSummary,
        offerings: draft.offerings,
        needsSummary: draft.needsSummary,
        needs: draft.needs,
        dealSizeMin: draft.dealSizeMin,
        dealSizeMax: draft.dealSizeMax,
        geographies: draft.geographies,
        engagementModels: draft.engagementModels as EngagementModel[],
        logoUrl: draft.logoUrl || undefined,
        description: draft.description,
      });

      await completeOnboarding(company);
      return { success: true, errors: {} };
    } catch {
      return {
        success: false,
        errors: { _form: 'Failed to create profile. Please try again.' },
      };
    }
  }, [validateStep, completeOnboarding]);

  return {
    draft: onboardingDraft,
    currentStep: onboardingDraft.currentStep,
    totalSteps: TOTAL_STEPS,
    updateDraft,
    saveDraft,
    validateStep,
    goToStep,
    nextStep,
    prevStep,
    submitProfile,
    loadDraft,
    resetOnboardingDraft,
  };
}
