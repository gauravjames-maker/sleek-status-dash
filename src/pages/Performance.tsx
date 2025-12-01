import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Info, Calendar, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { WhatsNewDialog } from "@/components/WhatsNewDialog";
import { UpgradeNotificationBanner } from "@/components/UpgradeNotificationBanner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { date: "Oct 13, 2025", recipients: 2.3, deliveries: 2.1 },
  { date: "Oct 15, 2025", recipients: 2.5, deliveries: 2.3 },
  { date: "Oct 17, 2025", recipients: 3.2, deliveries: 2.9 },
  { date: "Oct 19, 2025", recipients: 2.8, deliveries: 2.5 },
  { date: "Oct 21, 2025", recipients: 5.6, deliveries: 5.1 },
  { date: "Oct 23, 2025", recipients: 2.4, deliveries: 2.2 },
  { date: "Oct 25, 2025", recipients: 2.6, deliveries: 2.4 },
  { date: "Oct 27, 2025", recipients: 2.8, deliveries: 2.6 },
  { date: "Oct 29, 2025", recipients: 3.0, deliveries: 2.8 },
  { date: "Oct 31, 2025", recipients: 2.5, deliveries: 2.3 },
  { date: "Nov 02, 2025", recipients: 3.5, deliveries: 3.2 },
  { date: "Nov 04, 2025", recipients: 3.2, deliveries: 2.9 },
  { date: "Nov 06, 2025", recipients: 3.8, deliveries: 3.5 },
  { date: "Nov 08, 2025", recipients: 3.6, deliveries: 3.3 },
  { date: "Nov 10, 2025", recipients: 4.2, deliveries: 3.8 },
];

const Performance = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "notifications">("overview");
  const [timePeriod, setTimePeriod] = useState("last-30-days");
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Dashboard</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-foreground">Performance</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm flex items-center gap-2"
              onClick={() => setWhatsNewOpen(true)}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              What's new
            </Button>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Account</span>
            <Button variant="ghost" size="sm" className="text-sm">
              All (Aggregated) ▼
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "notifications"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📧 Notifications
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Upgrade Notification Banner */}
        {showUpgradeBanner && (
          <UpgradeNotificationBanner
            version="2025.12"
            highlights={[
              "Campaign API - Launch campaigns programmatically",
              "Enhanced audit logging with before/after views",
              "AI-powered SQL audience builder",
            ]}
            onDismiss={() => setShowUpgradeBanner(false)}
            onSeeWhatsNew={() => {
              setShowUpgradeBanner(false);
              setWhatsNewOpen(true);
            }}
            className="mb-6"
          />
        )}
        {/* Recipients Metrics Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Recipients Metrics</h2>
            <p className="text-sm text-muted-foreground">
              Look into patterns of how your content is being delivered to your customers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Channel</span>
            <Button variant="outline" size="sm" className="text-sm">
              Cross channel ▼
            </Button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground">Metrics</h3>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">View in %</label>
                <input type="checkbox" className="toggle" />
              </div>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>

          {/* Time Period Filters */}
          <div className="flex items-center gap-2 mb-6">
            {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Last 6 months", "Custom"].map(
              (period) => (
                <Button
                  key={period}
                  variant={
                    timePeriod === period.toLowerCase().replace(/\s+/g, "-")
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() => setTimePeriod(period.toLowerCase().replace(/\s+/g, "-"))}
                  className="text-sm"
                >
                  {period}
                </Button>
              )
            )}
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Oct 12, 2025 - Nov 10, 2025</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <MetricCard
              title="Recipients"
              value="67,890,859"
              subtitle="Total users"
              trend={{ value: 6.79, isPositive: false }}
            />
            <MetricCard
              title="Delivery rate"
              value="392,577"
              subtitle="0.58 % of users"
              trend={{ value: 21.11, isPositive: true }}
            />
            <MetricCard
              title="Suppressed rate"
              value="873"
              subtitle="0 % of users"
              trend={{ value: 42.41, isPositive: true }}
            />
            <MetricCard
              title="Bounce rate"
              value="81"
              subtitle="0 % of users"
              trend={{ value: 77.05, isPositive: true }}
            />
            <MetricCard
              title="Unsubscribe rate"
              value="0"
              subtitle="0 % of users"
              trend={{ value: 0, isPositive: true }}
            />
            <MetricCard
              title="Adjusted open rate"
              value="156"
              subtitle="0.04 % of users"
              trend={{ value: 22.00, isPositive: false }}
            />
            <MetricCard
              title="Unique open rate"
              value="78"
              subtitle="0.02 % of users"
              trend={{ value: 1.30, isPositive: true }}
            />
            <MetricCard
              title="Click rate"
              value="8"
              subtitle="0 % of users"
              trend={{ value: 89.74, isPositive: false }}
            />
            <MetricCard
              title="Complaint rate"
              value="0"
              subtitle="0 % of users"
              trend={{ value: 0, isPositive: true }}
            />
            <MetricCard
              title="Content error rate"
              value="16"
              subtitle="0 % of users"
              trend={{ value: 300.00, isPositive: false }}
            />
          </div>
        </div>

        {/* Performance over time */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground">Performance over time</h3>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Customize
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Oct 12, 2025 - Nov 10, 2025</span>
              </div>
            </div>
          </div>

          {/* Time Period Filters */}
          <div className="flex items-center gap-2 mb-6">
            {["Last 7 days", "Last 30 days", "Last 6 months", "Custom"].map((period) => (
              <Button
                key={period}
                variant="ghost"
                size="sm"
                className={
                  period === "Last 30 days" ? "bg-muted text-foreground" : "text-muted-foreground"
                }
              >
                {period}
              </Button>
            ))}
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{ value: "M", position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="recipients"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 3 }}
                name="Recipients"
              />
              <Line
                type="monotone"
                dataKey="deliveries"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: "#EC4899", r: 3 }}
                name="Deliveries"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend Labels */}
          <div className="flex items-center justify-center gap-8 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <span className="font-medium text-foreground">DELIVERABILITY</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                <span>Recipients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
                <span>Deliveries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span>Suppressed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                <span>Bounces</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-medium text-foreground">ENGAGEMENT</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                <span>Adjusted open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span>Clicks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span>Unique opens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recently viewed */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-base font-medium text-foreground mb-4">Recently viewed</h3>
          {/* Add recently viewed content here */}
        </div>
      </div>

      {/* What's New Dialog */}
      <WhatsNewDialog open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />
    </div>
  );
};

export default Performance;
