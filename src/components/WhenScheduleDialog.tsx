import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";

interface WhenScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WhenScheduleDialog = ({ open, onOpenChange }: WhenScheduleDialogProps) => {
  const [scheduleType, setScheduleType] = useState("unscheduled");
  const [externalLaunchEnabled, setExternalLaunchEnabled] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <DialogTitle className="text-base font-medium">When</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">External launch via API</h3>
              <p className="text-xs text-muted-foreground">Enable to launch campaign via API instead of scheduled delivery</p>
            </div>
            <Switch
              checked={externalLaunchEnabled}
              onCheckedChange={setExternalLaunchEnabled}
            />
          </div>

          <h3 className="text-sm font-medium mb-4">Select a delivery type</h3>
          
          <RadioGroup 
            value={scheduleType} 
            onValueChange={setScheduleType} 
            className="grid grid-cols-3 gap-4"
            disabled={externalLaunchEnabled}
          >
            {/* Unscheduled */}
            <div className="relative">
              <RadioGroupItem
                value="unscheduled"
                id="unscheduled"
                className="peer sr-only"
              />
              <Label
                htmlFor="unscheduled"
                className={`flex flex-col items-start gap-3 rounded-lg border-2 border-border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${externalLaunchEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center peer-data-[state=checked]:border-primary">
                    {scheduleType === "unscheduled" && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <Clock className="h-5 w-5 text-foreground" />
                  <span className="font-medium text-foreground">Unscheduled</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Launch your campaign at any time. No automated launches are scheduled.
                </p>
              </Label>
            </div>

            {/* One-time */}
            <div className="relative">
              <RadioGroupItem
                value="one-time"
                id="one-time"
                className="peer sr-only"
              />
              <Label
                htmlFor="one-time"
                className={`flex flex-col items-start gap-3 rounded-lg border-2 border-border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${externalLaunchEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center peer-data-[state=checked]:border-primary">
                    {scheduleType === "one-time" && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <Calendar className="h-5 w-5 text-foreground" />
                  <span className="font-medium text-foreground">One-time</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scheduled date and time
                </p>
              </Label>
            </div>

            {/* Recurring */}
            <div className="relative">
              <RadioGroupItem
                value="recurring"
                id="recurring"
                className="peer sr-only"
              />
              <Label
                htmlFor="recurring"
                className={`flex flex-col items-start gap-3 rounded-lg border-2 border-border p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${externalLaunchEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center peer-data-[state=checked]:border-primary">
                    {scheduleType === "recurring" && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <RefreshCw className="h-5 w-5 text-foreground" />
                  <span className="font-medium text-foreground">Recurring</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send periodically at specified intervals
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};
