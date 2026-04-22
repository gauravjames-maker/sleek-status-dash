import { useState } from "react";
import { ChevronDown, CircleSlash, SlidersHorizontal } from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ConfigItem {
  label: string;
  active?: boolean;
  enabled?: boolean;
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
];

const requiredMark = <span className="text-destructive">*</span>;

const SystemConfiguration = () => {
  const [items, setItems] = useState(configurationItems);

  const toggleItem = (label: string) => {
    setItems((current) =>
      current.map((item) =>
        item.label === label ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

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
                className={cn(
                  "flex w-full items-center justify-between border-b border-border px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  item.active
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-primary"
                )}
              >
                <span>{item.label}</span>
                {typeof item.enabled === "boolean" && (
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
        </section>
      </main>
    </div>
  );
};

export default SystemConfiguration;