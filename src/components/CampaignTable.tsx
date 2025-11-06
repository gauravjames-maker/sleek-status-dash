import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip, type CampaignStatus } from "./StatusChip";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Campaign {
  id: string;
  name: string;
  date: string;
  recipients: number;
  deliveries: number;
  opens: number;
  opensPercent: number;
  adjustedOpens: number;
  adjustedOpensPercent: number;
  clicks: number;
  clicksPercent: number;
  bounces: number;
  bouncesPercent: number;
  suppressed: number;
  suppressedPercent: number;
  complaints: number;
  complaintsPercent: number;
  status: CampaignStatus;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "RT BP Snapshot Refresh test 2",
    date: "Oct 29, 2025 07:19 PM EST",
    recipients: 2,
    deliveries: 0,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 2,
    bouncesPercent: 100,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "2",
    name: "Austin experiment",
    date: "Oct 06, 2025 11:18 PM EST",
    recipients: 5,
    deliveries: 0,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "collecting",
  },
  {
    id: "3",
    name: "(copy of) Rebecca exp from scra...",
    date: "Sep 30, 2025 02:23 AM EST",
    recipients: 10,
    deliveries: 10,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "4",
    name: "Experiment from simple sql",
    date: "Sep 30, 2025 01:42 AM EST",
    recipients: 11,
    deliveries: 8,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "5",
    name: "Rebecca exp from scratch 9/29",
    date: "Sep 30, 2025 02:20 AM EST",
    recipients: 25,
    deliveries: 21,
    opens: 1,
    opensPercent: 4.8,
    adjustedOpens: 1,
    adjustedOpensPercent: 4.8,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "6",
    name: "(copy of) Rebecca copy settings ...",
    date: "Sep 30, 2025 01:12 AM EST",
    recipients: 4,
    deliveries: 4,
    opens: 2,
    opensPercent: 50,
    adjustedOpens: 2,
    adjustedOpensPercent: 50,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "7",
    name: "Rebecca TEST BP DV Multivariate",
    date: "Aug 18, 2025 06:05 PM EST",
    recipients: 234,
    deliveries: 0,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 122,
    bouncesPercent: 52.14,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "8",
    name: "DRZ - Simultaneous -",
    date: "Aug 13, 2025 11:25 PM EST",
    recipients: 19,
    deliveries: 19,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "9",
    name: "ASD - Regression 25.3.1 test",
    date: "Jul 08, 2025 10:18 PM EST",
    recipients: 6,
    deliveries: 1,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 2,
    bouncesPercent: 33.33,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "completed",
  },
  {
    id: "10",
    name: "JH Test for Snowflake Conversion",
    date: "Jul 01, 2025 10:19 PM EST",
    recipients: 1,
    deliveries: 0,
    opens: 0,
    opensPercent: 0,
    adjustedOpens: 0,
    adjustedOpensPercent: 0,
    clicks: 0,
    clicksPercent: 0,
    bounces: 0,
    bouncesPercent: 0,
    suppressed: 0,
    suppressedPercent: 0,
    complaints: 0,
    complaintsPercent: 0,
    status: "failed",
  },
];

export const CampaignTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const formatMetric = (value: number, percent: number) => {
    if (value === 0) return `${value} (${percent.toFixed(2)}%)`;
    return `${value} (${percent.toFixed(2)}%)`;
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Experiment campaign List</h1>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <span>📦</span>
            <span>Show Archived</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search All Campaigns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="collecting">Collecting Data</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="font-semibold text-foreground">Campaign Name / Last Send Time</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Recipients</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Deliveries</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Opens</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Adjusted Opens</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Clicks</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Bounces</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Suppressed</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Complaints</TableHead>
              <TableHead className="font-semibold text-foreground">Last Job Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className={cn(
                  "hover:bg-table-row-hover transition-colors",
                  campaign.status === "failed" && "row-failed bg-table-row-failed"
                )}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{campaign.name}</span>
                    <span className="text-xs text-primary">{campaign.date}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{campaign.recipients}</TableCell>
                <TableCell className="text-center">{campaign.deliveries}</TableCell>
                <TableCell className="text-center">
                  {campaign.opens > 0 && (
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm">
                      {formatMetric(campaign.opens, campaign.opensPercent)}
                    </span>
                  )}
                  {campaign.opens === 0 && formatMetric(campaign.opens, campaign.opensPercent)}
                </TableCell>
                <TableCell className="text-center">
                  {campaign.adjustedOpens > 0 && (
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm">
                      {formatMetric(campaign.adjustedOpens, campaign.adjustedOpensPercent)}
                    </span>
                  )}
                  {campaign.adjustedOpens === 0 &&
                    formatMetric(campaign.adjustedOpens, campaign.adjustedOpensPercent)}
                </TableCell>
                <TableCell className="text-center">
                  {formatMetric(campaign.clicks, campaign.clicksPercent)}
                </TableCell>
                <TableCell className="text-center">
                  {campaign.bounces > 0 && (
                    <span className="bg-metric-warning px-2 py-1 rounded text-sm">
                      {formatMetric(campaign.bounces, campaign.bouncesPercent)}
                    </span>
                  )}
                  {campaign.bounces === 0 && formatMetric(campaign.bounces, campaign.bouncesPercent)}
                </TableCell>
                <TableCell className="text-center">
                  {formatMetric(campaign.suppressed, campaign.suppressedPercent)}
                </TableCell>
                <TableCell className="text-center">
                  {formatMetric(campaign.complaints, campaign.complaintsPercent)}
                </TableCell>
                <TableCell>
                  <StatusChip status={campaign.status} showTooltip={campaign.status === "completed"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
