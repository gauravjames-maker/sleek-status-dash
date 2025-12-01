import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  dateTime: string;
  user: string;
  action: string;
  summary: string;
  changes?: {
    fieldName: string;
    before: string;
    after: string;
  }[];
}

// Mock data - replace with real data from your backend
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    dateTime: "01 Dec 2025, 09:45 UTC",
    user: "Jane Doe",
    action: "Updated campaign",
    summary: "Updated targeting and send schedule.",
    changes: [
      {
        fieldName: "Targeting segment",
        before: "US_Customers_Active_30d",
        after: "US_Customers_Active_7d"
      },
      {
        fieldName: "Next send time",
        before: "5 Dec 2025, 10:00",
        after: "6 Dec 2025, 15:00"
      }
    ]
  },
  {
    id: "2",
    dateTime: "28 Nov 2025, 14:22 UTC",
    user: "John Smith",
    action: "Launched campaign",
    summary: "Campaign launched for first send.",
    changes: [
      {
        fieldName: "Status",
        before: "Draft",
        after: "Active"
      },
      {
        fieldName: "Launch time",
        before: "-",
        after: "28 Nov 2025, 14:22 UTC"
      }
    ]
  },
  {
    id: "3",
    dateTime: "27 Nov 2025, 11:30 UTC",
    user: "Jane Doe",
    action: "Updated audience rules",
    summary: "Changed audience lookback from 90 days to 30 days.",
    changes: [
      {
        fieldName: "Audience rule",
        before: "last_activity_days <= 90",
        after: "last_activity_days <= 30"
      }
    ]
  },
  {
    id: "4",
    dateTime: "26 Nov 2025, 16:15 UTC",
    user: "John Smith",
    action: "Created campaign",
    summary: "Initial campaign setup with template and audience.",
    changes: [
      {
        fieldName: "Template",
        before: "-",
        after: "Gaurav<>Content"
      },
      {
        fieldName: "Target audience",
        before: "-",
        after: "GJ BP - 1"
      }
    ]
  },
  {
    id: "5",
    dateTime: "25 Nov 2025, 10:05 UTC",
    user: "Jane Doe",
    action: "Updated blueprint node",
    summary: "Edited node SQL; 2 fields changed.",
    changes: [
      {
        fieldName: "Node SQL",
        before: "WHERE last_purchase_date >= CURRENT_DATE - 90",
        after: "WHERE last_purchase_date >= CURRENT_DATE - 30"
      },
      {
        fieldName: "Node name",
        before: "Active Customers 90d",
        after: "Active Customers 30d"
      }
    ]
  }
];

interface AuditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId?: string;
}

export function AuditLogDialog({ open, onOpenChange }: AuditLogDialogProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("");

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Filter logic
  const filteredLogs = mockAuditLogs.filter((log) => {
    if (actionFilter !== "all" && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    if (userFilter && !log.user.toLowerCase().includes(userFilter.toLowerCase())) {
      return false;
    }
    // Add date filtering logic here if needed
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Audit Log</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-end gap-4 pb-4 border-b border-border">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">Date From</label>
            <div className="relative">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">Date To</label>
            <div className="relative">
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">Action</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">User</label>
            <Input
              placeholder="Search by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setActionFilter("all");
              setUserFilter("");
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Audit Log Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-[200px]">Date/Time</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <>
                    <TableRow
                      key={log.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(log.id)}
                    >
                      <TableCell>
                        {expandedRows.has(log.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{log.dateTime}</TableCell>
                      <TableCell className="text-sm">{log.user}</TableCell>
                      <TableCell className="text-sm font-medium">{log.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.summary}</TableCell>
                    </TableRow>
                    
                    {/* Expanded Details Row */}
                    {expandedRows.has(log.id) && log.changes && (
                      <TableRow key={`${log.id}-details`}>
                        <TableCell colSpan={5} className="bg-muted/30 p-6">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold mb-3">Changes</h4>
                            {log.changes.map((change, index) => (
                              <div key={index} className="space-y-2 pb-4 last:pb-0">
                                <div className="text-sm font-medium text-foreground">
                                  {change.fieldName}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">Before</div>
                                    <div className={cn(
                                      "p-3 rounded-md bg-card border border-border",
                                      change.before === "-" && "text-muted-foreground italic"
                                    )}>
                                      {change.before}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">After</div>
                                    <div className="p-3 rounded-md bg-primary/5 border border-primary/20 font-medium">
                                      {change.after}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
