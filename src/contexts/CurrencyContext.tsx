import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'NPR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => number;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'kb-currency';

// Conversion rates (base: USD)
const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  NPR: 133.5, // 1 USD = ~133.5 NPR (approximate rate)
};

const CURRENCY_CONFIG: Record<Currency, { symbol: string; name: string; locale: string }> = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  NPR: {
    symbol: 'रू',
    name: 'Nepali Rupee',
    locale: 'ne-NP',
  },
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && (saved === 'USD' || saved === 'NPR')) {
          setCurrencyState(saved as Currency);
        }
      } catch (error) {
        console.error('Failed to load currency preference:', error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save to localStorage whenever currency changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, currency);
      } catch (error) {
        console.error('Failed to save currency preference:', error);
      }
    }
  }, [currency, isLoaded]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const convertAmount = (amount: number): number => {
    return amount * CONVERSION_RATES[currency];
  };

  const formatCurrency = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    const config = CURRENCY_CONFIG[currency];

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'NPR' ? 0 : 2,
      maximumFractionDigits: currency === 'NPR' ? 0 : 2,
    }).format(convertedAmount);
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    convertAmount,
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export { CURRENCY_CONFIG };
