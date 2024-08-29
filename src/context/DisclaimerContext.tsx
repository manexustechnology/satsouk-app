'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface DisclaimerContextProps {
  isAcceptDisclaimerRisk: boolean;
  setIsAcceptDisclaimerRisk: (value: boolean) => void;
}

const DisclaimerContext = createContext<DisclaimerContextProps | undefined>(undefined);

export const DisclaimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAcceptDisclaimerRisk, setIsAcceptDisclaimerRisk] = useState<boolean>(false);

  useEffect(() => {
    const localValue = localStorage.getItem('isAcceptDisclaimerRisk');
    if (localValue !== null) {
      setIsAcceptDisclaimerRisk(localValue === '1' ? true : false);
    }
  }, []);

  const handleAcceptDisclaimerRisk = (value: boolean) => {
    localStorage.setItem('isAcceptDisclaimerRisk', value ? '1' : '0');
    setIsAcceptDisclaimerRisk(value);
  }

  return (
    <DisclaimerContext.Provider
      value={{
        isAcceptDisclaimerRisk,
        setIsAcceptDisclaimerRisk: handleAcceptDisclaimerRisk
      }}
    >
      {children}
    </DisclaimerContext.Provider>
  );
};

export const useDisclaimer = () => {
  const context = useContext(DisclaimerContext);
  if (!context) {
    throw new Error('useDisclaimer must be used within a CryptoProvider');
  }
  return context;
};