import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompareContextType {
  compareList: string[];
  addWorker: (id: string) => void;
  removeWorker: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('buildconnect_compare');
      return saved ? JSON.parse(saved) : ['w-1', 'w-2'];
    } catch {
      return ['w-1', 'w-2'];
    }
  });

  useEffect(() => {
    localStorage.setItem('buildconnect_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addWorker = (id: string) => {
    if (compareList.length >= 3) {
      alert('You can compare a maximum of 3 workers at a time.');
      return;
    }
    if (!compareList.includes(id)) {
      setCompareList((prev) => [...prev, id]);
    }
  };

  const removeWorker = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id: string) => compareList.includes(id);

  return (
    <CompareContext.Provider value={{ compareList, addWorker, removeWorker, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
