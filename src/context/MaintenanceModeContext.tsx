import { createContext, useContext, useState, ReactNode } from "react";

interface MaintenanceModeContextValue {
  maintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;
  autoDisableOnRestart: boolean;
  setAutoDisableOnRestart: (value: boolean) => void;
}

const MaintenanceModeContext = createContext<MaintenanceModeContextValue | undefined>(undefined);

export const MaintenanceModeProvider = ({ children }: { children: ReactNode }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoDisableOnRestart, setAutoDisableOnRestart] = useState(true);

  return (
    <MaintenanceModeContext.Provider
      value={{ maintenanceMode, setMaintenanceMode, autoDisableOnRestart, setAutoDisableOnRestart }}
    >
      {children}
    </MaintenanceModeContext.Provider>
  );
};

export const useMaintenanceMode = () => {
  const ctx = useContext(MaintenanceModeContext);
  if (!ctx) throw new Error("useMaintenanceMode must be used within MaintenanceModeProvider");
  return ctx;
};
