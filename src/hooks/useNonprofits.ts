import { useState, useCallback } from 'react';
import { Nonprofit } from '@/context/DonationContext';
import { supabase } from '@/integrations/supabase/client';

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
  isUsingDemoData: boolean;
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
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  const fetchNonprofits = useCallback(
    async (zipCode: string, category: Category, radius: number) => {
      setLoading(true);
      setError(null);
      setIsUsingDemoData(false);

      try {
        const nteeCodes = CATEGORY_NTEE_CODES[category];
        const allNonprofits: Nonprofit[] = [];

        for (const nteeCode of nteeCodes) {
          try {
            const { data, error: fnError } = await supabase.functions.invoke('search-nonprofits', {
              body: { zipCode, nteeCode, page: 0 }
            });

            if (fnError) {
              console.warn(`Edge function error for NTEE code ${nteeCode}:`, fnError);
              continue;
            }

            const orgs = data?.organizations || [];
            
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

        if (!uniqueNonprofits.length) {
          setError('No nonprofits found for this ZIP code. Try a US ZIP code like 10001 or 90210.');
        }
        
        setNonprofits(uniqueNonprofits);
      } catch (err) {
        console.error('Unexpected error fetching nonprofits:', err);
        setError('Failed to load nonprofit data. Please try again.');
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
    isUsingDemoData,
    fetchNonprofits,
  };
}
