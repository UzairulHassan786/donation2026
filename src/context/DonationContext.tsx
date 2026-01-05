import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface Nonprofit {
  ein: string;
  name: string;
  city: string;
  state: string;
  ntee_code: string;
  income_amount?: number;
  asset_amount?: number;
}

export interface DonationItem {
  nonprofit: Nonprofit;
  amount: number;
}

interface DonationContextType {
  donations: Map<string, DonationItem>;
  addDonation: (nonprofit: Nonprofit, amount: number) => void;
  removeDonation: (ein: string) => void;
  updateDonationAmount: (ein: string, amount: number) => void;
  clearDonations: () => void;
  totalAmount: number;
  donationCount: number;
  getDonationAmount: (ein: string) => number;
  isSelected: (ein: string) => boolean;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<Map<string, DonationItem>>(new Map());

  const addDonation = useCallback((nonprofit: Nonprofit, amount: number) => {
    setDonations(prev => {
      const next = new Map(prev);
      next.set(nonprofit.ein, { nonprofit, amount });
      return next;
    });
  }, []);

  const removeDonation = useCallback((ein: string) => {
    setDonations(prev => {
      const next = new Map(prev);
      next.delete(ein);
      return next;
    });
  }, []);

  const updateDonationAmount = useCallback((ein: string, amount: number) => {
    setDonations(prev => {
      const next = new Map(prev);
      const item = next.get(ein);
      if (item) {
        next.set(ein, { ...item, amount });
      }
      return next;
    });
  }, []);

  const clearDonations = useCallback(() => {
    setDonations(new Map());
  }, []);

  const totalAmount = useMemo(() => {
    let total = 0;
    donations.forEach(item => {
      total += item.amount;
    });
    return total;
  }, [donations]);

  const donationCount = useMemo(() => donations.size, [donations]);

  const getDonationAmount = useCallback((ein: string) => {
    return donations.get(ein)?.amount || 0;
  }, [donations]);

  const isSelected = useCallback((ein: string) => {
    return donations.has(ein);
  }, [donations]);

  return (
    <DonationContext.Provider
      value={{
        donations,
        addDonation,
        removeDonation,
        updateDonationAmount,
        clearDonations,
        totalAmount,
        donationCount,
        getDonationAmount,
        isSelected,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
}
