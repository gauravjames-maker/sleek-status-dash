import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowDownUp, Filter, Download, RefreshCw, Briefcase, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    id: "1", startDate: "Mar 10, 2026 06:30 PM EDT", campaignName: "DRZ - 24.2.1",
    jobSize: 6, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "initializing",
  },
  {
    id: "2", startDate: "Mar 10, 2026 06:20 PM EDT", campaignName: "(copy of) Travel In Style",
    jobSize: 0, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "3", startDate: "Mar 10, 2026 05:24 PM EDT", campaignName: "Has",
    jobSize: 4, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "4", startDate: "Mar 10, 2026 05:24 PM EDT", campaignName: "blerg",
    jobSize: 4, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "5", startDate: "Mar 10, 2026 05:24 PM EDT", campaignName: "Does not have",
    jobSize: 4, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "6", startDate: "Mar 10, 2026 10:30 AM EDT", campaignName: "Craig - Wowcher Test",
    jobSize: 1000, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "7", startDate: "Mar 10, 2026 10:30 AM EDT", campaignName: "AC-11000 Validation",
    jobSize: 17, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "8", startDate: "Mar 10, 2026 10:30 AM EDT", campaignName: "(copy of)JC Copy of Welcome Delilah 2...",
    jobSize: 1, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "9", startDate: "Mar 10, 2026 10:30 AM EDT", campaignName: "RT 24.1.1 Regression Marketing Camp...",
    jobSize: 0, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
  {
    id: "10", startDate: "Mar 10, 2026 09:45 AM EDT", campaignName: "[DO NOT TOUCH] Performancer",
    jobSize: 2499885, deliveries: 0, opens: 0, opensPercent: 0, adjustedOpens: 0, adjustedOpensPercent: 0,
    botOpens: 0, botOpensPercent: 0, engagements: 0, engagementsPercent: 0,
    bounces: 0, bouncesPercent: 0, suppressed: 0, suppressedPercent: 0, complaints: 0, complaintsPercent: 0,
    status: "failed",
  },
];

const statusConfig: Record<JobStatus, { dot: string; bg: string; text: string; label: string }> = {
  initializing: { dot: "bg-primary", bg: "bg-[hsl(var(--status-collecting-bg))]", text: "text-primary", label: "Initializing" },
  failed: { dot: "bg-destructive", bg: "bg-[hsl(var(--status-failed-bg))]", text: "text-destructive", label: "Failed" },
  completed: { dot: "bg-[hsl(var(--status-completed))]", bg: "bg-[hsl(var(--status-completed-bg))]", text: "text-[hsl(var(--status-completed))]", label: "Completed" },
  sending: { dot: "bg-[hsl(var(--status-sending))]", bg: "bg-[hsl(var(--status-sending-bg))]", text: "text-[hsl(var(--status-sending))]", label: "Sending" },
  collecting: { dot: "bg-[hsl(var(--status-collecting))]", bg: "bg-[hsl(var(--status-collecting-bg))]", text: "text-[hsl(var(--status-collecting))]", label: "Collecting" },
};

type SortField = "startDate" | "campaignName" | "jobSize" | "status";
type SortDir = "asc" | "desc";

const AnalyticsJobList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const totalItems = 28497;

  const filteredJobs = useMemo(() => {
    let jobs = mockJobs.filter((job) => {
      const matchesSearch = job.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    jobs.sort((a, b) => {
      let cmp = 0;
      if (sortField === "startDate") cmp = a.startDate.localeCompare(b.startDate);
      else if (sortField === "campaignName") cmp = a.campaignName.localeCompare(b.campaignName);
      else if (sortField === "jobSize") cmp = a.jobSize - b.jobSize;
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "desc" ? -cmp : cmp;
    });

    return jobs;
  }, [searchQuery, statusFilter, sortField, sortDir]);

  const formatMetric = (value: number, percent: number) => {
    return `${value} (${percent.toFixed(1)}%)`;
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={cn("font-semibold text-foreground cursor-pointer select-none group", className)}
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {children}
        <ArrowDownUp className={cn(
          "h-3.5 w-3.5 transition-opacity",
          sortField === field ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-50"
        )} />
      </div>
    </TableHead>
  );

  const MetricHeader = ({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) => (
    <TableHead className="font-semibold text-foreground text-center">
      <div className="flex items-center justify-center gap-1">
        <span className="text-xs">{children}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TableHead>
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockJobs.forEach((j) => { counts[j.status] = (counts[j.status] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground leading-tight">Job List</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{totalItems.toLocaleString()} total jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export CSV</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by campaign name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-9 bg-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-44 h-9">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="initializing">Initializing ({statusCounts.initializing || 0})</SelectItem>
                <SelectItem value="completed">Completed ({statusCounts.completed || 0})</SelectItem>
                <SelectItem value="sending">Sending ({statusCounts.sending || 0})</SelectItem>
                <SelectItem value="collecting">Collecting ({statusCounts.collecting || 0})</SelectItem>
                <SelectItem value="failed">Failed ({statusCounts.failed || 0})</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => setStatusFilter("all")}>
                Clear filter
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header border-b-2 border-border">
                <SortableHeader field="startDate">Start Date</SortableHeader>
                <SortableHeader field="campaignName">Campaign Name</SortableHeader>
                <SortableHeader field="jobSize" className="text-right">
                  <span className="w-full text-right">Job Size</span>
                </SortableHeader>
                <MetricHeader>Deliveries</MetricHeader>
                <MetricHeader tooltip="Total email opens tracked">Opens</MetricHeader>
                <MetricHeader tooltip="Opens filtered for Apple Mail Privacy Protection">Apple Filtered Opens</MetricHeader>
                <MetricHeader tooltip="Opens identified as automated bot activity">Bot Opens</MetricHeader>
                <MetricHeader tooltip="Clicks and other interactions">Engagements</MetricHeader>
                <MetricHeader>Bounces</MetricHeader>
                <MetricHeader>Suppressed</MetricHeader>
                <MetricHeader>Complaints</MetricHeader>
                <SortableHeader field="status" className="text-right">
                  <span className="w-full text-right">Status</span>
                </SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-40" />
                      <p className="text-sm font-medium">No jobs found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job, idx) => {
                  const status = statusConfig[job.status];
                  return (
                    <TableRow
                      key={job.id}
                      className={cn(
                        "transition-colors cursor-pointer",
                        idx % 2 === 0 ? "bg-card" : "bg-background",
                        "hover:bg-primary/[0.03]",
                        job.status === "failed" && "hover:bg-destructive/[0.04]"
                      )}
                    >
                      <TableCell className="text-foreground whitespace-nowrap text-sm">
                        {job.startDate}
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <span className="font-medium text-foreground text-sm truncate block" title={job.campaignName}>
                          {job.campaignName}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-medium">
                        {job.jobSize.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">{job.deliveries}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.opens, job.opensPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.adjustedOpens, job.adjustedOpensPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.botOpens, job.botOpensPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.engagements, job.engagementsPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.bounces, job.bouncesPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.suppressed, job.suppressedPercent)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                        {formatMetric(job.complaints, job.complaintsPercent)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 gap-1.5 border-0",
                            status.bg, status.text
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border bg-card px-6 py-2.5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems.toLocaleString()}</span> jobs
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rows:</span>
              <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[68px] h-7 text-xs">
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
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground px-2 min-w-[80px] text-center">
                Page {currentPage} of {totalPages.toLocaleString()}
              </span>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsJobList;
