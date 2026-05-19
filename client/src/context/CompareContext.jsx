import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (uni) => {
    setCompareList(prev => {
      const already = prev.some(u => u._id === uni._id);
      if (already) return prev.filter(u => u._id !== uni._id);
      if (prev.length >= 3) return prev;
      return [...prev, uni];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
