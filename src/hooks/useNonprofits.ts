import { useState, useCallback } from 'react';
import { Nonprofit } from '@/context/DonationContext';

export type Category =
  | 'animal'
  | 'education'
  | 'human'
  | 'society'
  | 'arts';

// NTEE codes for each category
const CATEGORY_NTEE_CODES: Record<Category, string[]> = {
  animal: ['D', 'C'],
  education: ['B', 'W'],
  human: ['P', 'E', 'F', 'G', 'H'],
  society: ['X', 'Y', 'Z'],
  arts: ['A'],
};

interface UseNonprofitsResult {
  nonprofits: Nonprofit[];
  loading: boolean;
  error: string | null;
  fetchNonprofits: (
    zipCode: string,
    category: Category,
    radius: number
  ) => Promise<void>;
}

export function useNonprofits(): UseNonprofitsResult {
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNonprofits = useCallback(
    async (zipCode: string, category: Category, radius: number) => {
      setLoading(true);
      setError(null);

      // Helper to pick the first array in API response
      const extractOrganizations = (data: any): any[] => {
        if (!data || typeof data !== 'object') return [];
        const possibleKeys = ['organizations', 'results', 'data', 'items'];
        for (const key of possibleKeys) {
          if (Array.isArray(data[key])) return data[key];
        }
        return Array.isArray(data) ? data : [];
      };

      try {
        const nteeCodes = CATEGORY_NTEE_CODES[category];
        const allNonprofits: Nonprofit[] = [];

        for (const nteeCode of nteeCodes) {
          try {
            const res = await fetch(
              `/api/nonprofits?zip=${zipCode}&ntee=${nteeCode}&radius=${radius}&page=0`
            );

            if (!res.ok) {
              console.warn(`API call failed for NTEE code: ${nteeCode}`);
              continue;
            }

            const data = await res.json();
            const orgs = extractOrganizations(data);

            if (orgs.length) {
              allNonprofits.push(
                ...orgs.map((org: any) => ({
                  ein: org.ein,
                  name: org.name,
                  city: org.city,
                  state: org.state,
                  ntee_code: org.ntee_code,
                  income_amount: org.income_amount,
                  asset_amount: org.asset_amount,
                }))
              );
            }
          } catch (innerErr) {
            console.error(`Failed fetching NTEE code ${nteeCode}:`, innerErr);
          }
        }

        const uniqueNonprofits = Array.from(
          new Map(allNonprofits.map(np => [np.ein, np])).values()
        ).slice(0, 20);

        setNonprofits(uniqueNonprofits);
        if (!uniqueNonprofits.length) {
          setError('No nonprofits found for the given criteria.');
        }
      } catch (err) {
        console.error('Unexpected error fetching nonprofits:', err);
        setError('Failed to load nonprofit data.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    nonprofits,
    loading,
    error,
    fetchNonprofits,
  };
}
