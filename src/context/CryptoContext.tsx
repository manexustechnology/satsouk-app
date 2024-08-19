import React, { createContext, useContext, useState, useEffect } from 'react';

interface CryptoContextProps {
  price: number | null;
  error: string | null;
  fetchPrice: (cryptoSymbol: string) => Promise<void>;
}

const CryptoContext = createContext<CryptoContextProps | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const FETCH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  const fetchPrice = async (cryptoSymbol: string) => {
    const now = Date.now();
    if (now - lastFetch < FETCH_INTERVAL_MS) {
      // Prevent fetching too frequently
      return;
    }
    try {
      const response = await fetch(`/api/crypto?symbol=${cryptoSymbol}&vs_currency=usd`);
      const data = await response.json();
      if (response.ok) {
        setPrice(data);
        setError(null);
        setLastFetch(now);
      } else {
        throw new Error(data.error || 'Cryptocurrency not found');
      }
    } catch (err) {
      setError('Failed to fetch cryptocurrency price');
      setPrice(null);
    }
  };

  return (
    <CryptoContext.Provider value={{ price, error, fetchPrice }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
