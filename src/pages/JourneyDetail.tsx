import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Info, SlidersHorizontal, ArrowDownRight, ArrowUpRight, Undo2, Redo2, ZoomIn, ZoomOut, Search, Cloud, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

// Mini icon sidebar (left)
const iconSidebarItems = [
  { icon: "grid", color: "text-primary" },
  { icon: "people", color: "text-green-500" },
  { icon: "image", color: "text-red-500" },
  { icon: "send", color: "text-blue-500" },
  { icon: "chart", color: "text-yellow-500" },
  { icon: "settings", color: "text-purple-500" },
];

const JourneyDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"canvas" | "analytics">("canvas");

  return (
    <div className="flex h-screen bg-background">
      {/* Mini icon sidebar */}
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-3 gap-1">
        <div className="flex gap-0.5 mb-4">
          <div className="w-1.5 h-4 bg-[#C1554D] rounded-[1px]" />
          <div className="w-1.5 h-4 bg-[#C1554D] rounded-[1px]" />
          <div className="w-1.5 h-4 bg-[#C1554D] rounded-[1px]" />
          <div className="w-1.5 h-4 bg-[#C1554D] rounded-[1px]" />
        </div>
        {iconSidebarItems.map((item, i) => (
          <button key={i} className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted ${item.color}`}>
            <div className="w-5 h-5 rounded bg-current opacity-20" />
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <div className="border-b border-border">
          <div className="px-6 py-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/campaigns/journeys")}>Journeys</span>
              <span>›</span>
              <span>Create journey</span>
            </div>
          </div>
          <div className="px-6 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Welcome series</h1>
              <button className="p-1 text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Pause</Button>
              <Button variant="destructive">End</Button>
            </div>
          </div>
          {/* Tabs */}
          <div className="px-6 flex gap-6">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "canvas" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Canvas
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "analytics" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Campaign analytics
            </button>
          </div>
        </div>

        {/* Body: metrics panel + canvas */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left metrics panel */}
          <div className="w-72 border-r border-border overflow-y-auto p-5 space-y-5">
            {/* Journey metrics header */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 4 4-8" />
              </svg>
              <span className="font-semibold text-sm">Journey metrics</span>
            </div>

            {/* Toggle: Live metrics / Select date range */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button className="flex-1 py-2 text-xs font-medium bg-primary text-primary-foreground">Live metrics</button>
              <button className="flex-1 py-2 text-xs font-medium text-muted-foreground hover:bg-muted">Select date range</button>
            </div>

            <p className="text-xs text-muted-foreground">Start date: 10 Jan, 2026 12:00PM</p>

            <div>
              <h3 className="font-semibold text-sm mb-3">Journey overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    Entered
                  </div>
                  <p className="text-lg font-bold">100,000</p>
                </div>
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <span className="text-xs">⏳</span>
                    In Progress
                  </div>
                  <p className="text-lg font-bold">520</p>
                </div>
              </div>
            </div>

            {/* Exited */}
            <div className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Exited
              </div>
              <p className="text-lg font-bold">27,440</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exited early</span>
                  <span className="font-medium">27,000</span>
                </div>
                <div className="flex justify-between pl-3">
                  <span className="text-muted-foreground text-xs">Missing profile</span>
                  <span className="text-xs">0</span>
                </div>
                <div className="flex justify-between pl-3">
                  <span className="text-muted-foreground text-xs">Missed scheduled progression</span>
                  <span className="text-xs">0</span>
                </div>
                <div className="flex justify-between pl-3">
                  <span className="text-muted-foreground text-xs">Node deleted</span>
                  <span className="text-xs">0</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">🏁 Finished the journey</span>
                <span className="font-medium text-sm">440</span>
              </div>
            </div>

            {/* Conversions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">Conversions</span>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Customize
                </button>
              </div>
              <div className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  🛒 Purchase
                </div>
                <p className="text-lg font-bold">21,460</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">$775,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average order value</span>
                    <span className="font-medium">$7.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas area */}
          <div className="flex-1 relative overflow-auto" style={{ background: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div className="p-8 min-w-[600px]">
              {/* Flow nodes */}
              <div className="flex flex-col items-center gap-0">
                {/* Entry node */}
                <FlowNode
                  type="entry"
                  title="Entry"
                  subtitle="Set entry criteria"
                  color="bg-green-500"
                  cloudSynced
                  details={[
                    { label: "Audience", value: "New Customers Fall 2025", isLink: true },
                    { label: "User profile", value: "User profile" },
                    { label: "Re-evaluation frequency", value: "Every 15 minutes" },
                    { label: "Re-entry", value: "Unlimited" },
                  ]}
                />
                <Connector />

                {/* Wait 15 minutes */}
                <FlowNode
                  type="delay"
                  title="Wait 15 minutes"
                  subtitle="Time delay"
                  color="bg-yellow-500"
                  cloudSynced
                  metrics={[
                    { label: "Entered", value: "96,500" },
                    { label: "In progress", value: "100" },
                  ]}
                />
                <Connector />

                {/* General offer */}
                <FlowNode
                  type="channel"
                  title="General offer"
                  subtitle="Multi channel"
                  color="bg-yellow-500"
                  cloudSynced
                  hasRecipientPreference
                  metrics={[
                    { label: "Entrants", value: "25,815" },
                    { label: "Recipients", value: "25,815", pct: "100%" },
                    { label: "Deliveries", value: "25,815", pct: "100%" },
                    { label: "Opens", value: "14,454", pct: "56%" },
                    { label: "Clicks", value: "2,580", pct: "10%" },
                    { label: "Purchases", value: "1,955", pct: "7.5%" },
                  ]}
                />
                <Connector />

                {/* Wait 1 hour */}
                <FlowNode
                  type="delay"
                  title="Wait 1 hour"
                  subtitle="Time delay"
                  color="bg-blue-500"
                  metrics={[
                    { label: "Entered", value: "96,500" },
                    { label: "In progress", value: "100" },
                  ]}
                />
                <Connector />

                {/* Segment split */}
                <FlowNode
                  type="split"
                  title="3 segments"
                  subtitle="Segment split"
                  color="bg-purple-500"
                />

                {/* Split branches */}
                <div className="flex items-start gap-4 mt-2">
                  <BranchCard label="Colorado region" pct="24%" count="24,000" channelTitle="Colorado offer" />
                  <BranchCard label="Georgia region" pct="35%" count="38,000" channelTitle="Georgia offer" />
                  <BranchCard label="Everyone else" pct="26%" count="25,815" channelTitle="General offer" />
                </div>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-card border border-border rounded-lg shadow-lg px-2 py-1.5">
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Undo2 className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Redo2 className="w-4 h-4" /></button>
              <div className="w-px h-5 bg-border mx-1" />
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-xs font-medium px-2">100%</span>
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><ZoomIn className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Search className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connector line between nodes
const Connector = () => (
  <div className="w-px h-8 bg-border" />
);

// Flow node component
interface FlowNodeProps {
  type: "entry" | "delay" | "channel" | "split";
  title: string;
  subtitle: string;
  color: string;
  details?: { label: string; value: string; isLink?: boolean }[];
  metrics?: { label: string; value: string; pct?: string }[];
  hasRecipientPreference?: boolean;
  cloudSynced?: boolean;
}

const FlowNode = ({ type, title, subtitle, color, details, metrics, hasRecipientPreference, cloudSynced }: FlowNodeProps) => (
  <div className={`bg-card border rounded-xl shadow-sm w-[280px] overflow-hidden relative ${cloudSynced ? "border-primary/30 ring-1 ring-primary/10" : "border-border"}`}>
    {/* Cloud synced badge */}
    {cloudSynced && (
      <div className="absolute -top-2.5 -right-2.5 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full pl-1.5 pr-2.5 py-0.5 cursor-default shadow-sm">
              <div className="relative">
                <Cloud className="w-3.5 h-3.5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="text-[9px] font-semibold text-primary">Cloud</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <div className="space-y-1">
              <p className="font-semibold text-xs">Cloud-synced data</p>
              <p className="text-[11px] text-muted-foreground">This node's data is fetched live from Lovable Cloud and stays in sync automatically.</p>
              <div className="flex items-center gap-1 text-[10px] text-green-600 pt-0.5">
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Live • Last synced just now</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    )}

    {/* Header */}
    <div className="px-4 py-2.5 flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
        {type === "entry" && <ArrowDownRight className="w-4 h-4 text-white" />}
        {type === "delay" && <span className="text-white text-xs">⏱</span>}
        {type === "channel" && <span className="text-white text-xs">📧</span>}
        {type === "split" && <span className="text-white text-xs">🔀</span>}
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
        <p className="text-sm font-semibold leading-tight">{title}</p>
      </div>
    </div>

    {/* Details for entry node */}
    {details && (
      <div className="px-4 pb-3 space-y-1">
        {details.map((d, i) => (
          <div key={i}>
            <p className="text-[10px] font-medium text-foreground">{d.label}</p>
            <p className={`text-[10px] ${d.isLink ? "text-primary" : "text-muted-foreground"}`}>{d.value}</p>
          </div>
        ))}
      </div>
    )}

    {/* Metrics */}
    {metrics && (
      <div className="border-t border-border">
        {hasRecipientPreference && (
          <div className="px-4 py-1.5 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">📧</span>
              <span className="text-xs">📋</span>
            </div>
            <span className="text-[10px] text-primary cursor-pointer">Recipient preference</span>
          </div>
        )}
        <div className="px-4 py-2 space-y-0.5">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{m.label}</span>
              <div className="flex items-center gap-2">
                {m.pct && <span className="text-muted-foreground">{m.pct}</span>}
                <span className="font-medium w-14 text-right">{m.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Branch card for segment split
interface BranchCardProps {
  label: string;
  pct: string;
  count: string;
  channelTitle: string;
}

const BranchCard = ({ label, pct, count, channelTitle }: BranchCardProps) => (
  <div className="flex flex-col items-center gap-2">
    {/* Branch label */}
    <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1">
      <span className="w-2 h-2 rounded-full bg-primary" />
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] text-muted-foreground">{pct}</span>
      <span className="text-xs font-medium">{count}</span>
    </div>
    <div className="w-px h-4 bg-border" />
    {/* Channel card */}
    <div className="bg-card border border-border rounded-xl shadow-sm w-[220px] overflow-hidden">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center">
          <span className="text-white text-[10px]">📧</span>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground">Multi channel</p>
          <p className="text-xs font-semibold">{channelTitle}</p>
        </div>
        <div className="ml-auto flex gap-1">
          <div className="w-5 h-3 bg-primary/20 rounded" />
          <div className="w-5 h-3 bg-primary/20 rounded" />
        </div>
      </div>
      <div className="border-t border-border px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-[10px]">📧</span>
          <span className="text-[10px]">📋</span>
        </div>
        <span className="text-[9px] text-primary">Recipient preference</span>
      </div>
      <div className="px-3 pb-2 space-y-0.5">
        {[
          { label: "Entrants", value: count },
          { label: "Recipients", value: count, pct: "100%" },
          { label: "Deliveries", value: count, pct: "100%" },
          { label: "Opens", pct: "56%" },
          { label: "Clicks", pct: "10%" },
        ].map((m, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">{m.label}</span>
            <div className="flex gap-2">
              {m.pct && <span className="text-muted-foreground">{m.pct}</span>}
              {m.value && <span className="font-medium">{m.value}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default JourneyDetail;
