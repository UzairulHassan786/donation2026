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
  "animal": [
    {
      "ein": "310806170",
      "name": "KENTON COUNTY ANIMAL SHELTER",
      "city": "FT WRIGHT",
      "state": "KY",
      "ntee_code": "D20",
      "income_amount": 0
    },
    {
      "ein": "581951933",
      "name": "FUR KIDS ANIMAL RESCUE AND SHELTER INC",
      "city": "ALPHARETTA",
      "state": "GA",
      "ntee_code": "D20",
      "income_amount": 0
    },
    {
      "ein": "581880238",
      "name": "SOUTHSIDE ANIMAL LEAGUE INC",
      "city": "LOVEJOY",
      "state": "GA",
      "ntee_code": "D20",
      "income_amount": 0
    }
  ],
  "education": [
    {
      "ein": "581915247",
      "name": "NORTH FULTON COMMUNITY CHARITIES INC",
      "city": "ALPHARETTA",
      "state": "GA",
      "ntee_code": "P60",
      "income_amount": 0
    },
    {
      "ein": "581887625",
      "name": "WESLEY INTERNATIONAL ACADEMY INC",
      "city": "ATLANTA",
      "state": "GA",
      "ntee_code": "B29",
      "income_amount": 0
    },
    {
      "ein": "112553208",
      "name": "MEDGAR EVERS COLLEGE",
      "city": "BROOKLYN",
      "state": "NY",
      "ntee_code": "B40",
      "income_amount": 0
    }
  ],
  "human": [
    {
      "ein": "133334403",
      "name": "THE BOWERY MISSION",
      "city": "NEW YORK",
      "state": "NY",
      "ntee_code": "L41",
      "income_amount": 0
    },
    {
      "ein": "521390444",
      "name": "CAPITAL AREA FOOD BANK",
      "city": "WASHINGTON",
      "state": "DC",
      "ntee_code": "K31",
      "income_amount": 0
    },
    {
      "ein": "042677103",
      "name": "GREATER BOSTON FOOD BANK INC",
      "city": "BOSTON",
      "state": "MA",
      "ntee_code": "K31",
      "income_amount": 0
    }
  ],
  "society": [
    {
      "ein": "521332175",
      "name": "SOME SO OTHERS MIGHT EAT INC",
      "city": "WASHINGTON",
      "state": "DC",
      "ntee_code": "K30",
      "income_amount": 0
    },
    {
      "ein": "113172119",
      "name": "JEWISH COMMUNITY COUNCIL OF GRAVESEND",
      "city": "BROOKLYN",
      "state": "NY",
      "ntee_code": "P20",
      "income_amount": 0
    },
    {
      "ein": "112707390",
      "name": "BROOKLYN PERCUSSION ARTS INC",
      "city": "BROOKLYN",
      "state": "NY",
      "ntee_code": "A68",
      "income_amount": 0
    }
  ],
  "arts": [
    {
      "ein": "113172662",
      "name": "CHILDRENS ARTS & SCIENCE WORKSHOPS INC",
      "city": "ASTORIA",
      "state": "NY",
      "ntee_code": "A23",
      "income_amount": 0
    },
    {
      "ein": "132998151",
      "name": "BROOKLYN ACADEMY OF MUSIC INC",
      "city": "BROOKLYN",
      "state": "NY",
      "ntee_code": "A61",
      "income_amount": 0
    },
    {
      "ein": "112459366",
      "name": "BROOKLYN BOTANIC GARDEN CORPORATION",
      "city": "BROOKLYN",
      "state": "NY",
      "ntee_code": "C41",
      "income_amount": 0
    }
  ]
}
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
