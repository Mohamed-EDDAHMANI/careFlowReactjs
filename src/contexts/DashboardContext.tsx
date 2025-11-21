import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  return (
    <DashboardContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};