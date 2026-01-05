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
  animal: ['D', 'C'], // Animal-Related, Environment
  education: ['B', 'W'], // Education, Public & Societal Benefit
  human: ['P', 'E', 'F', 'G', 'H'], // Human Services, Health, Mental Health
  society: ['X', 'Y', 'Z'], // Religion, Mutual Benefit
  arts: ['A'], // Arts, Culture, Humanities
};

interface UseNonprofitsResult {
  nonprofits: Nonprofit[];
  loading: boolean;
  error: string | null;
  fetchNonprofits: (zipCode: string, category: Category, radius: number) => Promise<void>;
}

export function useNonprofits(): UseNonprofitsResult {
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNonprofits = useCallback(async (zipCode: string, category: Category, radius: number) => {
    setLoading(true);
    setError(null);

    try {
      const nteeCodes = CATEGORY_NTEE_CODES[category];
      const allNonprofits: Nonprofit[] = [];

      // Fetch for each NTEE code in the category
      for (const nteeCode of nteeCodes) {
        const url = `https://projects.propublica.org/nonprofits/api/v2/search.json?q=${zipCode}&ntee%5Bid%5D=${nteeCode}&page=0`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch nonprofits');
        }

        const data = await response.json();
        
        if (data.organizations) {
          allNonprofits.push(...data.organizations.map((org: any) => ({
            ein: org.ein,
            name: org.name,
            city: org.city,
            state: org.state,
            ntee_code: org.ntee_code,
            income_amount: org.income_amount,
            asset_amount: org.asset_amount,
          })));
        }
      }

      // Remove duplicates and limit results
      const uniqueNonprofits = Array.from(
        new Map(allNonprofits.map(np => [np.ein, np])).values()
      ).slice(0, 20);

      setNonprofits(uniqueNonprofits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setNonprofits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { nonprofits, loading, error, fetchNonprofits };
}
