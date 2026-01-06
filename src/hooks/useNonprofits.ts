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
    { ein: '00-0001001', name: 'Animal Org', city: '', state: '', zip: '10001', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001002', name: 'Animal Org', city: '', state: '', zip: '11101', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001003', name: 'Animal Org', city: '', state: '', zip: '11201', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001004', name: 'Animal Org', city: '', state: '', zip: '21215', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001005', name: 'Animal Org', city: '', state: '', zip: '33311', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001006', name: 'Animal Org', city: '', state: '', zip: '10011', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001007', name: 'Animal Org', city: '', state: '', zip: '30331', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001008', name: 'Animal Org', city: '', state: '', zip: '11211', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001009', name: 'Animal Org', city: '', state: '', zip: '20001', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001010', name: 'Animal Org', city: '', state: '', zip: '30135', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001011', name: 'Animal Org', city: '', state: '', zip: '30024', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001012', name: 'Animal Org', city: '', state: '', zip: '22101', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001013', name: 'Animal Org', city: '', state: '', zip: '10025', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001014', name: 'Animal Org', city: '', state: '', zip: '10003', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001015', name: 'Animal Org', city: '', state: '', zip: '11221', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001016', name: 'Animal Org', city: '', state: '', zip: '30004', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001017', name: 'Animal Org', city: '', state: '', zip: '10002', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001018', name: 'Animal Org', city: '', state: '', zip: '20002', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001019', name: 'Animal Org', city: '', state: '', zip: '32210', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001020', name: 'Animal Org', city: '', state: '', zip: '33142', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001021', name: 'Animal Org', city: '', state: '', zip: '11212', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001022', name: 'Animal Org', city: '', state: '', zip: '41042', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001023', name: 'Animal Org', city: '', state: '', zip: '33023', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001024', name: 'Animal Org', city: '', state: '', zip: '45040', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001025', name: 'Animal Org', city: '', state: '', zip: '30052', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001026', name: 'Animal Org', city: '', state: '', zip: '02155', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001027', name: 'Animal Org', city: '', state: '', zip: '11220', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001028', name: 'Animal Org', city: '', state: '', zip: '33401', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001029', name: 'Animal Org', city: '', state: '', zip: '21234', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001030', name: 'Animal Org', city: '', state: '', zip: '45044', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001031', name: 'Animal Org', city: '', state: '', zip: '10022', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001032', name: 'Animal Org', city: '', state: '', zip: '21224', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001033', name: 'Animal Org', city: '', state: '', zip: '02135', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001034', name: 'Animal Org', city: '', state: '', zip: '11215', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001035', name: 'Animal Org', city: '', state: '', zip: '30213', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001036', name: 'Animal Org', city: '', state: '', zip: '10023', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001037', name: 'Animal Org', city: '', state: '', zip: '32244', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001038', name: 'Animal Org', city: '', state: '', zip: '12550', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001039', name: 'Animal Org', city: '', state: '', zip: '02124', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001040', name: 'Animal Org', city: '', state: '', zip: '33313', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001041', name: 'Animal Org', city: '', state: '', zip: '30101', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001042', name: 'Animal Org', city: '', state: '', zip: '21222', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001043', name: 'Animal Org', city: '', state: '', zip: '30044', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001044', name: 'Animal Org', city: '', state: '', zip: '30253', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001045', name: 'Animal Org', city: '', state: '', zip: '45011', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001046', name: 'Animal Org', city: '', state: '', zip: '11223', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001047', name: 'Animal Org', city: '', state: '', zip: '10013', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001048', name: 'Animal Org', city: '', state: '', zip: '33312', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001049', name: 'Animal Org', city: '', state: '', zip: '30040', ntee_code: 'D20', income_amount: 0 },
    { ein: '00-0001050', name: 'Animal Org', city: '', state: '', zip: '30022', ntee_code: 'D20', income_amount: 0 }
    // Continue the rest similarly for all ZIPs in animal category
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
