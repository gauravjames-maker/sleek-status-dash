import { Wrench } from "lucide-react";
import { useMaintenanceMode } from "@/context/MaintenanceModeContext";

export const MaintenanceModeBanner = () => {
  const { maintenanceMode } = useMaintenanceMode();
  if (!maintenanceMode) return null;
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 bg-destructive/10 px-6 text-xs font-semibold text-destructive">
      <Wrench className="h-3.5 w-3.5" />
      Maintenance mode is active. No new scheduled work will run until it is disabled.
    </div>
  );
};
