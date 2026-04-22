import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  Download,
  PauseCircle,
  PlayCircle,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ConfigItem {
  label: string;
  active?: boolean;
  enabled?: boolean;
}

interface JobItem {
  id: string;
  name: string;
  campaignType: "Marketing" | "Transactional" | "Experiments" | "External";
  campaignName: string;
  owner: string;
  progress: string;
  decision: "Allowed to complete" | "Overridden and paused";
  status: "Processing" | "Paused" | "Completed";
}

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

const runningJobs: JobItem[] = [
  {
    id: "JOB-8421",
    name: "Spring sale audience refresh",
    campaignType: "Marketing",
    campaignName: "Spring Sale 2026",
    owner: "Marketing Ops",
    progress: "72% complete",
    decision: "Allowed to complete",
    status: "Processing",
  },
  {
    id: "JOB-8425",
    name: "Daily campaign engagement rollup",
    campaignType: "Transactional",
    campaignName: "Order Confirmation Series",
    owner: "Analytics",
    progress: "41% complete",
    decision: "Allowed to complete",
    status: "Processing",
  },
  {
    id: "JOB-8430",
    name: "Journey eligibility sync",
    campaignType: "Experiments",
    campaignName: "Offer Timing A/B Test",
    owner: "Journeys",
    progress: "18% complete",
    decision: "Allowed to complete",
    status: "Processing",
  },
];

const requiredMark = <span className="text-destructive">*</span>;

const SystemConfiguration = () => {
  const [items, setItems] = useState(configurationItems);
  const [activeLabel, setActiveLabel] = useState("AWS Data Encryption");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [reviewingMaintenance, setReviewingMaintenance] = useState(false);
  const [jobs, setJobs] = useState<JobItem[]>(runningJobs);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>(runningJobs.map((job) => job.id));
  const [notificationEmail, setNotificationEmail] = useState("ops-team@company.com");

  const toggleItem = (label: string) => {
    if (label === "Maintenance mode") {
      if (maintenanceMode) {
        setMaintenanceMode(false);
        setReviewingMaintenance(false);
        setItems((current) =>
          current.map((item) =>
            item.label === label ? { ...item, enabled: false } : item
          )
        );
      } else {
        setReviewingMaintenance(true);
      }
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.label === label ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const activateMaintenance = (overrideRunningJobs: boolean) => {
    const nextJobs = jobs.map((job) => ({
      ...job,
      decision: overrideRunningJobs && selectedJobIds.includes(job.id) ? "Overridden and paused" : "Allowed to complete",
      status: overrideRunningJobs && selectedJobIds.includes(job.id) ? "Paused" : job.status,
      progress: overrideRunningJobs && selectedJobIds.includes(job.id) ? "Paused by admin" : job.progress,
    })) as JobItem[];

    setJobs(nextJobs);
    setMaintenanceMode(true);
    setReviewingMaintenance(false);
    setItems((current) =>
      current.map((item) =>
        item.label === "Maintenance mode" ? { ...item, enabled: true } : item
      )
    );
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    );
  };

  const toggleAllJobs = () => {
    setSelectedJobIds((current) =>
      current.length === processingJobs.length ? [] : processingJobs.map((job) => job.id)
    );
  };

  const relaunchJob = (jobId: string) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Processing",
              progress: "Queued for relaunch",
              decision: "Allowed to complete",
            }
          : job
      )
    );
  };

  const downloadJobsCsv = () => {
    const header = ["Job ID", "Job Name", "Owner", "Status", "Progress", "Maintenance Decision"];
    const rows = jobs.map((job) => [
      job.id,
      job.name,
      job.owner,
      job.status,
      job.progress,
      job.decision,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance-mode-jobs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const pausedJobs = jobs.filter((job) => job.status === "Paused");
  const processingJobs = jobs.filter((job) => job.status === "Processing");
  const allProcessingSelected = processingJobs.length > 0 && selectedJobIds.length === processingJobs.length;

  return (
    <div className="flex h-screen bg-background text-foreground">
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
          {maintenanceMode && (
            <div className="flex items-center gap-3 border-b border-border bg-destructive/10 px-6 py-3 text-sm font-semibold text-destructive">
              <Wrench className="h-4 w-4" />
              Maintenance mode is active. No new jobs will run until it is disabled.
            </div>
          )}

          {activeLabel === "Maintenance mode" ? (
            <>
              <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold">Maintenance mode</h2>
                  <p className="text-sm text-muted-foreground">
                    Pause new job execution safely while current work is reviewed.
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
                    <div className="text-sm text-muted-foreground">Running jobs now</div>
                    <div className="mt-2 text-3xl font-bold">{processingJobs.length}</div>
                  </div>
                  <div className="border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm text-muted-foreground">Paused by override</div>
                    <div className="mt-2 text-3xl font-bold">{pausedJobs.length}</div>
                  </div>
                  <div className="border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm text-muted-foreground">Notification contact</div>
                    <input
                      value={notificationEmail}
                      onChange={(event) => setNotificationEmail(event.target.value)}
                      className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {reviewingMaintenance && (
                  <div className="border border-primary/30 bg-primary/5 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Bell className="mt-0.5 h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-bold">{processingJobs.length} jobs are currently running</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Select the running jobs you want to override and pause now. Unselected jobs will finish first, and we will notify {notificationEmail} when maintenance mode becomes active.
                        </p>
                        <div className="mt-4 overflow-hidden border border-border bg-card">
                          <label className="flex cursor-pointer items-center gap-3 border-b border-border bg-secondary px-4 py-3 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={allProcessingSelected}
                              onChange={toggleAllJobs}
                              className="h-4 w-4 accent-primary"
                            />
                            Select all running jobs
                          </label>
                          {processingJobs.map((job) => (
                            <label
                              key={job.id}
                              className="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedJobIds.includes(job.id)}
                                onChange={() => toggleJobSelection(job.id)}
                                className="h-4 w-4 accent-primary"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold">{job.name}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {job.id} • {job.owner} • {job.progress}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button onClick={() => activateMaintenance(false)}>
                            <CheckCircle2 className="h-4 w-4" /> Allow jobs to complete
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => activateMaintenance(true)}
                            disabled={selectedJobIds.length === 0}
                          >
                            <PauseCircle className="h-4 w-4" /> Pause selected jobs
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {pausedJobs.length > 0 && !maintenanceMode && (
                  <div className="border border-destructive/30 bg-destructive/5 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                      <div>
                        <h3 className="font-bold">Paused jobs need attention</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Maintenance mode is off. Relaunch any jobs that were overridden and paused.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-border bg-card shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <h3 className="font-bold">Job review</h3>
                    <Button variant="secondary" onClick={downloadJobsCsv}>
                      <Download className="h-4 w-4" /> Download CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary text-muted-foreground">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Job</th>
                          <th className="px-5 py-3 font-semibold">Owner</th>
                          <th className="px-5 py-3 font-semibold">Progress</th>
                          <th className="px-5 py-3 font-semibold">Decision</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job.id} className="border-t border-border">
                            <td className="px-5 py-4">
                              <div className="font-semibold">{job.name}</div>
                              <div className="text-xs text-muted-foreground">{job.id}</div>
                            </td>
                            <td className="px-5 py-4">{job.owner}</td>
                            <td className="px-5 py-4">{job.progress}</td>
                            <td className="px-5 py-4">{job.decision}</td>
                            <td className="px-5 py-4">
                              <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", job.status === "Paused" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {job.status === "Paused" && !maintenanceMode ? (
                                <Button size="sm" onClick={() => relaunchJob(job.id)}>
                                  <PlayCircle className="h-4 w-4" /> Relaunch
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">No action</span>
                              )}
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
    </div>
  );
};

export default SystemConfiguration;