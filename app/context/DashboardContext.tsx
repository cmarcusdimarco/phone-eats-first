import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  isStale: boolean;
  markAsStale: () => void;
  markAsFresh: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isStale, setIsStale] = useState(false);

  const markAsStale = () => {
    console.log('Dashboard marked as stale');
    setIsStale(true);
  };
  
  const markAsFresh = () => {
    console.log('Dashboard marked as fresh');
    setIsStale(false);
  };

  // Log when the isStale value changes
  React.useEffect(() => {
    console.log('Dashboard state changed:', { isStale });
  }, [isStale]);

  return (
    <DashboardContext.Provider value={{ isStale, markAsStale, markAsFresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 