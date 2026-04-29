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
                <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2">
                  <span className="text-sm font-semibold">
                    {maintenanceMode ? "Active" : "Off"}
                  </span>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={() => toggleItem("Maintenance mode")}
                  />
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

                <div className="border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-bold">Behavior</h3>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Automatically disable on system restart</div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        When the platform restarts, Maintenance Mode will turn itself off so the system
                        doesn't stay gated through an unintended outage.
                      </p>
                    </div>
                    <Switch
                      checked={autoDisableOnRestart}
                      onCheckedChange={setAutoDisableOnRestart}
                    />
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
