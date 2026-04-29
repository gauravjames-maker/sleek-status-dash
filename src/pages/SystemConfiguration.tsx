import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  CircleSlash,
  Download,
  SlidersHorizontal,
  Wrench,
  AlertTriangle,
  CalendarIcon,
  Clock,
  Power,
} from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMaintenanceMode } from "@/context/MaintenanceModeContext";

type AutoOffMode = "duration" | "datetime" | "manual";
const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "240", label: "4 hours" },
  { value: "480", label: "8 hours" },
  { value: "manual", label: "Until I turn it off" },
];

interface ConfigItem {
  label: string;
  active?: boolean;
  enabled?: boolean;
}

type ProcessType = "Job" | "Hosted Data" | "Snapshot" | "Journey";

interface ProcessItem {
  id: string;
  name: string;
  startTime: string;
  processType: ProcessType;
  campaignType: "Marketing" | "Transactional" | "Experiments" | "External";
  campaignName: string;
  owner: string;
  progress: string;
  status: "Processing" | "Completed";
}

const PROCESS_TYPES: ProcessType[] = ["Job", "Hosted Data", "Snapshot", "Journey"];

const configurationItems: ConfigItem[] = [
  { label: "AWS Data Encryption", active: true, enabled: true },
  { label: "SAML 2.0", enabled: true },
  { label: "System Defaults" },
  { label: "Job Options" },
  { label: "Email Editor Settings" },
  { label: "Mobile Push Settings", enabled: true },
  { label: "Push Testing Devices" },
  { label: "SMS Settings" },
  { label: "Local Seedlists" },
  { label: "Destinations" },
  { label: "File Storage" },
  { label: "Fast Cache Settings", enabled: false },
  { label: "Blueprint Snapshot Settings" },
  { label: "Vendor API" },
  { label: "Maintenance mode", enabled: false },
];

const inFlightProcesses: ProcessItem[] = [
  {
    id: "JOB-8421",
    name: "Spring sale audience refresh",
    startTime: "Apr 22, 2026 1:18 PM",
    processType: "Job",
    campaignType: "Marketing",
    campaignName: "Spring Sale 2026",
    owner: "Priya Sharma",
    progress: "72% complete",
    status: "Processing",
  },
  {
    id: "JOB-8425",
    name: "Daily campaign engagement rollup",
    startTime: "Apr 22, 2026 1:34 PM",
    processType: "Job",
    campaignType: "Transactional",
    campaignName: "Order Confirmation Series",
    owner: "Daniel Chen",
    progress: "41% complete",
    status: "Processing",
  },
  {
    id: "PD-3310",
    name: "Inbound CRM events batch",
    startTime: "Apr 22, 2026 1:40 PM",
    processType: "Hosted Data",
    campaignType: "External",
    campaignName: "CRM Sync",
    owner: "Marcus Reilly",
    progress: "Receiving payload",
    status: "Processing",
  },
  {
    id: "PD-3312",
    name: "Loyalty tier updates",
    startTime: "Apr 22, 2026 1:52 PM",
    processType: "Hosted Data",
    campaignType: "External",
    campaignName: "Loyalty Sync",
    owner: "Sofia Alvarez",
    progress: "Validating records",
    status: "Processing",
  },
  {
    id: "SNAP-921",
    name: "Blueprint snapshot - Active subscribers",
    startTime: "Apr 22, 2026 1:30 PM",
    processType: "Snapshot",
    campaignType: "Marketing",
    campaignName: "Subscriber Blueprint",
    owner: "Hannah Patel",
    progress: "55% complete",
    status: "Processing",
  },
  {
    id: "SNAP-924",
    name: "VIP segment snapshot",
    startTime: "Apr 22, 2026 2:01 PM",
    processType: "Snapshot",
    campaignType: "Marketing",
    campaignName: "VIP Blueprint",
    owner: "Liam O'Connor",
    progress: "27% complete",
    status: "Processing",
  },
  {
    id: "JRY-208",
    name: "Welcome journey eligibility tick",
    startTime: "Apr 22, 2026 1:47 PM",
    processType: "Journey",
    campaignType: "Experiments",
    campaignName: "Welcome Journey",
    owner: "Emma Whitfield",
    progress: "Step 3 of 6",
    status: "Processing",
  },
  {
    id: "JRY-211",
    name: "Cart recovery journey send",
    startTime: "Apr 22, 2026 2:06 PM",
    processType: "Journey",
    campaignType: "Marketing",
    campaignName: "Cart Recovery",
    owner: "Noah Becker",
    progress: "Step 2 of 4",
    status: "Processing",
  },
];

const requiredMark = <span className="text-destructive">*</span>;

const SystemConfiguration = () => {
  const [items, setItems] = useState(configurationItems);
  const [activeLabel, setActiveLabel] = useState("AWS Data Encryption");
  const { maintenanceMode, setMaintenanceMode, autoDisableOnRestart, setAutoDisableOnRestart } =
    useMaintenanceMode();
  const [processes] = useState<ProcessItem[]>(inFlightProcesses);
  const [notificationEmail, setNotificationEmail] = useState("ops-team@company.com");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(notificationEmail);
  const [autoOffCategory, setAutoOffCategory] = useState<"time" | "event">("time");
  const [autoOffMode, setAutoOffMode] = useState<AutoOffMode>("duration");
  const [autoOffDuration, setAutoOffDuration] = useState<string>("60");
  const [autoOffDate, setAutoOffDate] = useState<Date | undefined>(undefined);
  const [autoOffTime, setAutoOffTime] = useState<string>("23:00");
  const [autoRulesOpen, setAutoRulesOpen] = useState(false);

  const autoRulesSummary = (() => {
    if (autoOffCategory === "event") {
      return autoDisableOnRestart ? "On system restart" : "Event-based (none selected)";
    }
    if (autoOffMode === "duration") {
      const opt = DURATION_OPTIONS.find((o) => o.value === autoOffDuration);
      return opt ? `After ${opt.label}` : "After a duration";
    }
    if (autoOffMode === "datetime") {
      return autoOffDate ? `At ${format(autoOffDate, "PP")} ${autoOffTime}` : "At a specific time";
    }
    return "Manual only";
  })();

  const requestEnableMaintenance = () => {
    setPendingEmail(notificationEmail);
    setConfirmOpen(true);
  };

  const confirmEnableMaintenance = () => {
    setNotificationEmail(pendingEmail);
    setMaintenanceMode(true);
    setItems((current) =>
      current.map((item) =>
        item.label === "Maintenance mode" ? { ...item, enabled: true } : item
      )
    );
    setConfirmOpen(false);
  };

  const toggleItem = (label: string) => {
    if (label === "Maintenance mode") {
      if (!maintenanceMode) {
        requestEnableMaintenance();
        return;
      }
      setMaintenanceMode(false);
      setItems((current) =>
        current.map((item) => (item.label === label ? { ...item, enabled: false } : item))
      );
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.label === label ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const downloadProcessesCsv = () => {
    const header = ["Process ID", "Start Time", "Type", "Owner", "Status"];
    const rows = processes.map((p) => [
      p.id,
      p.startTime,
      p.processType,
      p.owner,
      p.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance-mode-processes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const inFlightCount = processes.filter((p) => p.status === "Processing").length;

  return (
    <div className="flex h-full bg-background text-foreground">
      <CampaignSidebar />
      <main className="flex min-w-0 flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-border bg-card">
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h1 className="text-base font-bold">System Configuration</h1>
          </div>

          <nav className="px-5 py-4">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveLabel(item.label)}
                className={cn(
                  "flex w-full items-center justify-between border-b border-border px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  activeLabel === item.label
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-primary"
                )}
              >
                <span>{item.label}</span>
                {item.label !== "Maintenance mode" && typeof item.enabled === "boolean" && (
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={() => toggleItem(item.label)}
                    onClick={(event) => event.stopPropagation()}
                    className="h-4 w-8 data-[state=checked]:bg-primary"
                  />
                )}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 overflow-auto">
          {activeLabel === "Maintenance mode" ? (
            <>
              <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold">Maintenance mode</h2>
                  <p className="text-sm text-muted-foreground">
                    Block new scheduled work safely. In-flight processes finish naturally.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" onClick={() => setAutoRulesOpen(true)}>
                    <Clock className="h-4 w-4" /> Auto-disable rules
                  </Button>
                  <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2">
                    <span className="text-sm font-semibold">
                      {maintenanceMode ? "Active" : "Off"}
                    </span>
                    <Switch
                      checked={maintenanceMode}
                      onCheckedChange={() => toggleItem("Maintenance mode")}
                    />
                  </div>
                </div>
              </header>

              <div className="space-y-6 p-7">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm text-muted-foreground">In-flight processes</div>
                    <div className="mt-2 text-3xl font-bold">{inFlightCount}</div>
                  </div>
                  <div className="border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm text-muted-foreground">Notification contact</div>
                    <input
                      value={notificationEmail}
                      onChange={(event) => setNotificationEmail(event.target.value)}
                      className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm text-muted-foreground">Affected process types</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {PROCESS_TYPES.map((t) => (
                        <span
                          key={t}
                          className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>


                <div className="border border-border bg-card shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <h3 className="font-bold">In-flight scheduled work</h3>
                    <Button variant="secondary" onClick={downloadProcessesCsv}>
                      <Download className="h-4 w-4" /> Download CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary text-muted-foreground">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Process</th>
                          <th className="px-5 py-3 font-semibold">Start time</th>
                          <th className="px-5 py-3 font-semibold">Type</th>
                          
                          <th className="px-5 py-3 font-semibold">Owner</th>
                          
                          <th className="px-5 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processes.map((p) => (
                          <tr key={p.id} className="border-t border-border">
                            <td className="px-5 py-4">
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.id}</div>
                            </td>
                            <td className="px-5 py-4">{p.startTime}</td>
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                                {p.processType}
                              </span>
                            </td>
                            <td className="px-5 py-4">{p.owner}</td>
                            
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
                <h2 className="text-lg font-bold">
                  AWS Identity and Access Management (IAM) Configuration Details
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="font-semibold">
                    Test Credentials
                  </Button>
                  <Button className="font-semibold">Save</Button>
                </div>
              </header>

              <div className="p-7">
                <div className="border border-border bg-card shadow-sm">
                  <button className="flex w-full items-center justify-between border-b border-border px-6 py-4 text-left">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        AWS KMS Region {requiredMark}
                      </div>
                      <div className="text-sm font-medium">US East 1</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-foreground" />
                  </button>

                  <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                    <label className="block bg-background px-4 py-3">
                      <span className="block text-sm text-muted-foreground">
                        Access Key {requiredMark}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        AKIAIT6PKCABIST26RIQ
                      </span>
                    </label>

                    <label className="block bg-background px-4 py-3">
                      <span className="block text-sm text-muted-foreground">
                        Secret Key {requiredMark}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        L8H0hKSb/QcwzeibEzLoAVDw5zxN2LPKXiw+BP
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
                  <CircleSlash className="mt-0.5 h-4 w-4" />
                  <p>
                    Credentials are shown in a read-only style to mirror the current admin
                    configuration workflow.
                  </p>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <Dialog open={autoRulesOpen} onOpenChange={setAutoRulesOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Auto-disable rules
            </DialogTitle>
            <DialogDescription>
              Choose how Maintenance Mode should turn itself off so it never gets left on by accident.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Pick either a time-based rule or an event-based rule — only one category can be active at a time.
            </p>

            {/* Time-based category */}
            <div
              className={cn(
                "rounded-md border border-border p-4 space-y-4",
                autoOffCategory !== "time" && "opacity-60"
              )}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="autoOffCategory"
                  checked={autoOffCategory === "time"}
                  onChange={() => setAutoOffCategory("time")}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Time-based
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/50">
                <input
                  type="radio"
                  name="autoOffModeModal"
                  className="mt-1"
                  checked={autoOffCategory === "time" && autoOffMode === "duration"}
                  onChange={() => setAutoOffMode("duration")}
                  disabled={autoOffCategory !== "time"}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="h-4 w-4" /> Auto-disable after a duration
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Catches the "forgot to turn it off" case. Default 1 hour covers most maintenance windows.
                  </p>
                  <Select
                    value={autoOffDuration}
                    onValueChange={setAutoOffDuration}
                    disabled={autoOffCategory !== "time" || autoOffMode !== "duration"}
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/50">
                <input
                  type="radio"
                  name="autoOffModeModal"
                  className="mt-1"
                  checked={autoOffCategory === "time" && autoOffMode === "datetime"}
                  onChange={() => setAutoOffMode("datetime")}
                  disabled={autoOffCategory !== "time"}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarIcon className="h-4 w-4" /> Auto-disable at a specific time
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Useful for scheduled deploy windows ("disable at 11pm tonight").
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={autoOffCategory !== "time" || autoOffMode !== "datetime"}
                          className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !autoOffDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {autoOffDate ? format(autoOffDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={autoOffDate}
                          onSelect={setAutoOffDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={autoOffTime}
                      onChange={(e) => setAutoOffTime(e.target.value)}
                      disabled={autoOffCategory !== "time" || autoOffMode !== "datetime"}
                      className="w-32"
                    />
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/50">
                <input
                  type="radio"
                  name="autoOffModeModal"
                  className="mt-1"
                  checked={autoOffCategory === "time" && autoOffMode === "manual"}
                  onChange={() => setAutoOffMode("manual")}
                  disabled={autoOffCategory !== "time"}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Until I turn it off</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No automatic time-based disable. Use only if you actively monitor the window.
                  </p>
                </div>
              </label>
            </div>

            {/* Event-based category */}
            <div
              className={cn(
                "rounded-md border border-border p-4 space-y-4",
                autoOffCategory !== "event" && "opacity-60"
              )}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="autoOffCategory"
                  checked={autoOffCategory === "event"}
                  onChange={() => setAutoOffCategory("event")}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Event-based
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/50">
                <Checkbox
                  checked={autoDisableOnRestart}
                  onCheckedChange={(v) => setAutoDisableOnRestart(Boolean(v))}
                  disabled={autoOffCategory !== "event"}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Power className="h-4 w-4" /> Auto-disable on system restart
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    When the platform restarts, Maintenance Mode turns itself off so the system doesn't
                    stay gated through an unintended outage.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAutoRulesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAutoRulesOpen(false)}>Save rules</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Enable maintenance mode?
            </DialogTitle>
            <DialogDescription>
              New scheduled work will be blocked until maintenance mode is disabled.
              In-flight processes will be allowed to finish naturally.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border border-border bg-secondary/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Currently running
              </div>
              <div className="mt-1 text-2xl font-bold">
                {inFlightCount} {inFlightCount === 1 ? "process" : "processes"}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                A completion notification will be emailed once all of these finish.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notify-email">Notification email</Label>
              <Input
                id="notify-email"
                type="email"
                value={pendingEmail}
                onChange={(event) => setPendingEmail(event.target.value)}
                placeholder="ops-team@company.com"
              />
              <p className="text-xs text-muted-foreground">
                This address will receive the all-clear notification.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmEnableMaintenance}
              disabled={!pendingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pendingEmail)}
            >
              Confirm &amp; enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemConfiguration;
