import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type JobStatus = "initializing" | "failed" | "completed" | "sending" | "collecting";

interface Job {
  id: string;
  startDate: string;
  campaignName: string;
  jobSize: number;
  deliveries: number;
  opens: number;
  opensPercent: number;
  adjustedOpens: number;
  adjustedOpensPercent: number;
  botOpens: number;
  botOpensPercent: number;
  engagements: number;
  engagementsPercent: number;
  bounces: number;
  bouncesPercent: number;
  suppressed: number;
  suppressedPercent: number;
  complaints: number;
  complaintsPercent: number;
  status: JobStatus;
}

const mockJobs: Job[] = [
  {
    id: "1",
    startDate: "Mar 10, 2026 06:30 PM EDT",
    campaignName: "DRZ - 24.2.1",
    jobSize: 6,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "initializing",
  },
  {
    id: "2",
    startDate: "Mar 10, 2026 06:20 PM EDT",
    campaignName: "(copy of) Travel In Style",
    jobSize: 0,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "3",
    startDate: "Mar 10, 2026 05:24 PM EDT",
    campaignName: "Has",
    jobSize: 4,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "4",
    startDate: "Mar 10, 2026 05:24 PM EDT",
    campaignName: "blerg",
    jobSize: 4,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "5",
    startDate: "Mar 10, 2026 05:24 PM EDT",
    campaignName: "Does not have",
    jobSize: 4,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "6",
    startDate: "Mar 10, 2026 10:30 AM EDT",
    campaignName: "Craig - Wowcher Test",
    jobSize: 1000,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "7",
    startDate: "Mar 10, 2026 10:30 AM EDT",
    campaignName: "AC-11000 Validation",
    jobSize: 17,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "8",
    startDate: "Mar 10, 2026 10:30 AM EDT",
    campaignName: "(copy of)JC Copy of Welcome Delilah 2...",
    jobSize: 1,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "9",
    startDate: "Mar 10, 2026 10:30 AM EDT",
    campaignName: "RT 24.1.1 Regression Marketing Camp...",
    jobSize: 0,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "10",
    startDate: "Mar 10, 2026 09:45 AM EDT",
    campaignName: "[DO NOT TOUCH] Performancer",
    jobSize: 2499885,
    deliveries: 0,
    opens: 0, opensPercent: 0,
    adjustedOpens: 0, adjustedOpensPercent: 0,
    engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0,
    suppressed: 0, suppressedPercent: 0,
    complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
];

const statusConfig: Record<JobStatus, { color: string; label: string }> = {
  initializing: { color: "bg-primary", label: "initializing" },
  failed: { color: "bg-destructive", label: "failed" },
  completed: { color: "bg-[hsl(var(--status-completed))]", label: "completed" },
  sending: { color: "bg-[hsl(var(--status-sending))]", label: "sending" },
  collecting: { color: "bg-[hsl(var(--status-collecting))]", label: "collecting" },
};

const AnalyticsJobList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = 28497;

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) =>
      job.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const formatMetric = (value: number, percent: number) => {
    return `${value} (${percent.toFixed(1)}%)`;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">⊕</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Job List</h1>
            <div className="relative flex-1 max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search All Jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="font-semibold text-destructive">
                  Start Date ↓
                </TableHead>
                <TableHead className="font-semibold text-foreground">Campaign Name</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Job Size</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Deliveries</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Opens</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Apple Filtered Opens</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Bot Opens</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Engagements</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Bounces</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Suppressed</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Complaints</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => {
                const status = statusConfig[job.status];
                return (
                  <TableRow key={job.id} className="hover:bg-table-row-hover transition-colors">
                    <TableCell className="text-foreground whitespace-nowrap">
                      {job.startDate}
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-[220px] truncate">
                      {job.campaignName}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {job.jobSize.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">{job.deliveries}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.opens, job.opensPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.adjustedOpens, job.adjustedOpensPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.botOpens, job.botOpensPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.engagements, job.engagementsPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.bounces, job.bouncesPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.suppressed, job.suppressedPercent)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatMetric(job.complaints, job.complaintsPercent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={cn("w-2.5 h-2.5 rounded-full", status.color)} />
                        <span className={cn(
                          "text-sm",
                          job.status === "failed" && "text-destructive",
                          job.status === "initializing" && "text-primary"
                        )}>
                          {status.label}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-end gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Items per page:</span>
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-muted-foreground">
            {startItem} – {endItem} of {totalItems.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 text-muted-foreground"
            >
              |&lt;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 text-muted-foreground"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 text-muted-foreground"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 text-muted-foreground"
            >
              &gt;|
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsJobList;
