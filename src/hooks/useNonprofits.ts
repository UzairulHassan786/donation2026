import { useState, useCallback } from 'react';
import { Nonprofit } from '@/context/DonationContext';

const PROPUBLICA_API_KEY = process.env.NEXT_PUBLIC_PROPUBLICA_KEY;
const BASE_URL = 'https://projects.propublica.org/nonprofits/api/v2';

export type Category = 'animal' | 'education' | 'human' | 'society' | 'arts';

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
  fetchNonprofits: (category: Category, state?: string) => Promise<void>;
}

export function useNonprofits(): UseNonprofitsResult {
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNonprofits = useCallback(async (category: Category, state?: string) => {
    setLoading(true);
    setError(null);

    const nteeCodes = CATEGORY_NTEE_CODES[category];
    const allNonprofits: Nonprofit[] = [];

    try {
      for (const ntee of nteeCodes) {
        const url = `${BASE_URL}/search.json?state=${state || ''}&ntee=${ntee}`;
        const res = await fetch(url, {
          headers: { 'X-API-Key': PROPUBLICA_API_KEY },
        });

        if (!res.ok) {
          console.warn(`Failed to fetch NTEE ${ntee}: ${res.statusText}`);
          continue;
        }

        const data = await res.json();
        if (Array.isArray(data.organizations)) {
          allNonprofits.push(
            ...data.organizations.map((org: any) => ({
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
      }

      // Remove duplicates by EIN
      const uniqueNonprofits = Array.from(new Map(allNonprofits.map(np => [np.ein, np])).values());
      setNonprofits(uniqueNonprofits.slice(0, 50)); // limit to 50 for performance
    } catch (err) {
      console.error('Error fetching nonprofits:', err);
      setError('Failed to fetch nonprofits from ProPublica API');
    } finally {
      setLoading(false);
    }
  }, []);

  return { nonprofits, loading, error, fetchNonprofits };
}
