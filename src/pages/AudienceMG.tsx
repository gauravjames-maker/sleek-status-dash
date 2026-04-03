import { CampaignSidebar } from "@/components/CampaignSidebar";
import { useState, useMemo } from "react";
import { Search, RefreshCw, MoreVertical, Pencil, List, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Audience {
  id: number;
  name: string;
  datasource: string;
  type: string;
  count: string;
  lastCountedDate: string;
  lastCountedTime: string;
  location: string;
  modifiedBy: string;
  modifiedByInitials: string;
  modifiedByColor: string;
  modifiedAgo: string;
}

const mockAudiences: Audience[] = [
  { id: 1, name: "MSJ Regression 26.1.3.1 Reference", datasource: "Snowflake Native", type: "SQL", count: "-", lastCountedDate: "-", lastCountedTime: "", location: "-", modifiedBy: "Michael Jenkins", modifiedByInitials: "MJ", modifiedByColor: "bg-[#6366F1]", modifiedAgo: "4 days ago" },
  { id: 2, name: "JWAIN SNAP FRESH", datasource: "Snowflake Native", type: "SQL", count: "50", lastCountedDate: "Mar 26, 2026, 01:56 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "9 days ago" },
  { id: 3, name: "JWAIN SNAPSHOT AUD", datasource: "Snowflake Native", type: "SQL", count: "50", lastCountedDate: "Mar 26, 2026, 01:26 AM", lastCountedTime: "00:00:01", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "9 days ago" },
  { id: 4, name: "JWAIN E2E testing", datasource: "Snowflake Native", type: "SQL", count: "1", lastCountedDate: "Mar 24, 2026, 03:14 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "11 days ago" },
  { id: 5, name: "JWAIN TESTING JOIN WITH VARS", datasource: "Snowflake Native", type: "SQL", count: "4", lastCountedDate: "Mar 24, 2026, 03:06 AM", lastCountedTime: "00:00:02", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "11 days ago" },
  { id: 6, name: "JWAIN TESTING SQL", datasource: "Snowflake Native", type: "SQL", count: "0", lastCountedDate: "Mar 24, 2026, 03:06 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "System", modifiedByInitials: "SY", modifiedByColor: "bg-[#6B7280]", modifiedAgo: "11 days ago" },
  { id: 7, name: "JWAIN SUBQUERIES WITH VARS", datasource: "Snowflake Native", type: "SQL", count: "2K", lastCountedDate: "Mar 24, 2026, 03:06 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "System", modifiedByInitials: "SY", modifiedByColor: "bg-[#6B7280]", modifiedAgo: "11 days ago" },
  { id: 8, name: "JWAIN VARIABLE EDGE CASE TESTING", datasource: "Snowflake Native", type: "SQL", count: "1", lastCountedDate: "Mar 24, 2026, 03:06 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "System", modifiedByInitials: "SY", modifiedByColor: "bg-[#6B7280]", modifiedAgo: "11 days ago" },
  { id: 9, name: "03/23/2026 4:45:17 (copy of) JWAIN MULTIPLE VAR", datasource: "Snowflake Native", type: "SQL", count: "10K", lastCountedDate: "Mar 24, 2026, 03:05 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "11 days ago" },
  { id: 10, name: "03/23/2026 4:38:48 (copy of) JWAIN window functions", datasource: "Snowflake Native", type: "SQL", count: "15K", lastCountedDate: "Mar 24, 2026, 03:05 AM", lastCountedTime: "00:00:00", location: "-", modifiedBy: "Joshua Wainwright", modifiedByInitials: "JW", modifiedByColor: "bg-[#10B981]", modifiedAgo: "11 days ago" },
];

const AudienceMG = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalItems = 1031;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const filtered = useMemo(() => {
    return mockAudiences.filter((a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(totalPages, 10); i++) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">People / <span className="text-foreground font-medium">Audience</span></div>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create audience
          </Button>
        </div>

        {/* Search & Controls */}
        <div className="flex items-center justify-between px-8 pb-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={showArchived} onCheckedChange={setShowArchived} />
              <span className="text-sm text-muted-foreground">Show archived</span>
            </div>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button className="p-2 bg-primary/10 text-primary">
                <List className="w-4 h-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:bg-muted">
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-8 overflow-auto">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground min-w-[300px]">Name / Datasource</TableHead>
                  <TableHead className="font-semibold text-foreground">Type</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Count</TableHead>
                  <TableHead className="font-semibold text-foreground">Last counted & duration</TableHead>
                  <TableHead className="font-semibold text-foreground">Location</TableHead>
                  <TableHead className="font-semibold text-foreground">Last modified</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((audience) => (
                  <TableRow key={audience.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <a href="#" className="text-primary hover:underline font-medium text-sm">
                          {audience.name}
                        </a>
                        <p className="text-xs text-muted-foreground">{audience.datasource}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{audience.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-sm">{audience.count}</span>
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm">{audience.lastCountedDate}</span>
                        {audience.lastCountedTime && (
                          <p className="text-xs text-primary">{audience.lastCountedTime}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{audience.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${audience.modifiedByColor} text-white text-[10px] font-bold`}>
                            {audience.modifiedByInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-tight">{audience.modifiedBy}</p>
                          <p className="text-xs text-muted-foreground">{audience.modifiedAgo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2">
            <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing 1 to {rowsPerPage} of {totalItems.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded disabled:opacity-30">«</button>
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded disabled:opacity-30">‹</button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 text-sm rounded ${p === currentPage ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded disabled:opacity-30">›</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded disabled:opacity-30">»</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AudienceMG;
