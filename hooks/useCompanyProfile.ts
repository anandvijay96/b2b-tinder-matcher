import { useCompanyStore } from '@/stores';

export function useCompanyProfile() {
  const { company, isLoading, error, setCompany, updateCompany, clearCompany } =
    useCompanyStore();

  return {
    company,
    isLoading,
    error,
    setCompany,
    updateCompany,
    clearCompany,
  };
}
