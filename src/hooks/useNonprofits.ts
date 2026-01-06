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

// Demo data fallback
const DEMO_NONPROFITS: Record<Category, Nonprofit[]> = {
  animal: [
    { ein: '13-1740011', name: 'American Society for Prevention of Cruelty to Animals', city: 'New York', state: 'NY', ntee_code: 'D20', income_amount: 250000000 },
    { ein: '53-0259060', name: 'The Humane Society of the United States', city: 'Washington', state: 'DC', ntee_code: 'D20', income_amount: 130000000 },
    { ein: '94-1156347', name: 'Best Friends Animal Society', city: 'Kanab', state: 'UT', ntee_code: 'D20', income_amount: 95000000 },
  ],
  education: [
    { ein: '13-1623829', name: 'DonorsChoose', city: 'New York', state: 'NY', ntee_code: 'B82', income_amount: 120000000 },
    { ein: '94-3296338', name: 'Khan Academy', city: 'Mountain View', state: 'CA', ntee_code: 'B60', income_amount: 85000000 },
    { ein: '52-1693387', name: 'Teach For America', city: 'New York', state: 'NY', ntee_code: 'B82', income_amount: 290000000 },
  ],
  human: [
    { ein: '13-5562351', name: 'Feeding America', city: 'Chicago', state: 'IL', ntee_code: 'P30', income_amount: 3500000000 },
    { ein: '13-1685039', name: 'Habitat for Humanity International', city: 'Atlanta', state: 'GA', ntee_code: 'P30', income_amount: 350000000 },
    { ein: '53-0242652', name: 'American Red Cross', city: 'Washington', state: 'DC', ntee_code: 'P30', income_amount: 2900000000 },
  ],
  society: [
    { ein: '13-1644147', name: 'United Way Worldwide', city: 'Alexandria', state: 'VA', ntee_code: 'X20', income_amount: 150000000 },
    { ein: '36-2167940', name: 'Rotary Foundation', city: 'Evanston', state: 'IL', ntee_code: 'Y40', income_amount: 320000000 },
    { ein: '52-0974831', name: 'Catholic Charities USA', city: 'Alexandria', state: 'VA', ntee_code: 'X20', income_amount: 180000000 },
  ],
  arts: [
    { ein: '13-1624100', name: 'The Metropolitan Museum of Art', city: 'New York', state: 'NY', ntee_code: 'A50', income_amount: 360000000 },
    { ein: '13-6162659', name: 'Lincoln Center for the Performing Arts', city: 'New York', state: 'NY', ntee_code: 'A60', income_amount: 85000000 },
    { ein: '94-1156340', name: 'San Francisco Symphony', city: 'San Francisco', state: 'CA', ntee_code: 'A60', income_amount: 75000000 },
  ],
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

        if (!uniqueNonprofits.length) {
          console.log('No live nonprofits found, using demo data');
          setNonprofits(DEMO_NONPROFITS[category]);
          setIsUsingDemoData(true);
        } else {
          setNonprofits(uniqueNonprofits);
        }
      } catch (err) {
        console.error('Unexpected error fetching nonprofits:', err);
        setNonprofits(DEMO_NONPROFITS[category]);
        setIsUsingDemoData(true);
        setError('Failed to load live nonprofit data');
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
