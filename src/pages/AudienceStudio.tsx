import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Search, MoreHorizontal, Copy, Archive, Edit, Users, ChevronRight, ChevronLeft, Folder, Filter } from "lucide-react";

interface Audience {
  id: string;
  name: string;
  description: string;
  status: "Draft" | "Active";
  baseEntity: string;
  size: number | null;
  syncingTo: string[];
  lastSyncRun: string | null;
  lastModified: string;
  modifiedBy: string;
  version: number;
  isRealtime?: boolean;
}

const MOCK_AUDIENCES: Audience[] = [
  {
    id: "aud-001",
    name: "High-value customers",
    description: "Customers with total order value > $500 in the last 90 days",
    status: "Active",
    baseEntity: "Customers",
    size: 1247,
    syncingTo: ["facebook", "google"],
    lastSyncRun: "2 hours ago",
    lastModified: "2025-12-15 14:30",
    modifiedBy: "JS",
    version: 3,
  },
  {
    id: "aud-002",
    name: "Inactive users (30 days)",
    description: "Users who haven't logged in for 30+ days",
    status: "Active",
    baseEntity: "Customers",
    size: 3420,
    syncingTo: [],
    lastSyncRun: null,
    lastModified: "2025-12-14 09:15",
    modifiedBy: "SJ",
    version: 1,
    isRealtime: true,
  },
  {
    id: "aud-003",
    name: "New signups - December",
    description: "All users who signed up in December 2025",
    status: "Draft",
    baseEntity: "Customers",
    size: null,
    syncingTo: [],
    lastSyncRun: null,
    lastModified: "2025-12-13 16:45",
    modifiedBy: "MC",
    version: 1,
  },
  {
    id: "aud-004",
    name: "Frequent buyers",
    description: "Customers with 5+ orders in the last 60 days",
    status: "Active",
    baseEntity: "Customers",
    size: 755,
    syncingTo: ["braze"],
    lastSyncRun: "5 days ago",
    lastModified: "2025-12-12 11:20",
    modifiedBy: "ED",
    version: 2,
  },
  {
    id: "aud-005",
    name: "Churn risk",
    description: "Active customers showing declining engagement",
    status: "Draft",
    baseEntity: "Customers",
    size: null,
    syncingTo: [],
    lastSyncRun: null,
    lastModified: "2025-12-10 08:00",
    modifiedBy: "JS",
    version: 1,
  },
];

const FOLDERS = [
  { name: "All audiences", count: 5 },
];

const FILTER_OPTIONS = [
  { label: "Parent model", options: ["Customers", "Users", "Contacts"] },
  { label: "Source", options: ["Snowflake", "BigQuery", "Redshift"] },
  { label: "Created by", options: ["John Smith", "Sarah Johnson", "Mike Chen"] },
  { label: "Labels", options: ["High value", "Engagement", "Churn risk"] },
];

const AudienceStudio = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [audiences] = useState<Audience[]>(MOCK_AUDIENCES);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

  const filteredAudiences = audiences.filter(
    (audience) =>
      audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    all: audiences.length,
    recentlyCreated: audiences.filter(a => a.lastModified > "2025-12-13").length,
    recentlySynced: audiences.filter(a => a.lastSyncRun).length,
    unhealthySyncs: 0,
    inactive: audiences.filter(a => a.status === "Draft").length,
  };

  const toggleFilter = (label: string) => {
    setExpandedFilters(prev =>
      prev.includes(label)
        ? prev.filter(f => f !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h1 className="text-2xl font-semibold text-foreground">All audiences</h1>
          <Button onClick={() => navigate("/people/audience-studio/create")} className="bg-[hsl(162,72%,40%)] hover:bg-[hsl(162,72%,35%)]">
            Add audience
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="px-6 pb-4">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
            <div className="px-4 py-2 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground">All audiences</div>
              <div className="text-xl font-semibold text-foreground">{stats.all}</div>
            </div>
            <div className="w-px bg-border" />
            <div className="px-4 py-2 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground">Recently created</div>
              <div className="text-xl font-semibold text-[hsl(162,72%,40%)]">{stats.recentlyCreated}</div>
            </div>
            <div className="w-px bg-border" />
            <div className="px-4 py-2 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground">Recently synced</div>
              <div className="text-xl font-semibold text-[hsl(162,72%,40%)]">{stats.recentlySynced}</div>
            </div>
            <div className="w-px bg-border" />
            <div className="px-4 py-2 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground">With unhealthy syncs</div>
              <div className="text-xl font-semibold text-foreground">{stats.unhealthySyncs}</div>
            </div>
            <div className="w-px bg-border" />
            <div className="px-4 py-2 text-center min-w-[120px]">
              <div className="text-xs text-muted-foreground">Inactive</div>
              <div className="text-xl font-semibold text-foreground">{stats.inactive}</div>
            </div>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex-1 flex px-6 pb-6 gap-0">
          {/* Left Sidebar - Filters */}
          <div className={`border border-border bg-card rounded-l-lg transition-all ${sidebarCollapsed ? 'w-0 overflow-hidden border-0' : 'w-64'}`}>
            {!sidebarCollapsed && (
              <div className="p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>

                {/* Folders */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Folders</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs">New folder</Button>
                  </div>
                  <div className="space-y-1">
                    {FOLDERS.map(folder => (
                      <div key={folder.name} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[hsl(162,72%,95%)] text-[hsl(162,72%,30%)]">
                        <Users className="w-4 h-4" />
                        <span className="text-sm flex-1">{folder.name}</span>
                        <span className="text-xs bg-white/50 px-1.5 py-0.5 rounded">{folder.count}</span>
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground px-2 py-1">No folders</div>
                  </div>
                </div>

                {/* Saved Filters */}
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Saved Filters</div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Default</span>
                  </div>
                </div>

                {/* Filter By */}
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Filter By</div>
                  <div className="space-y-1">
                    {FILTER_OPTIONS.map(filter => (
                      <Collapsible
                        key={filter.label}
                        open={expandedFilters.includes(filter.label)}
                        onOpenChange={() => toggleFilter(filter.label)}
                      >
                        <CollapsibleTrigger className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-muted/50 rounded text-sm">
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedFilters.includes(filter.label) ? 'rotate-90' : ''}`} />
                          {filter.label}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-6 space-y-1 py-1">
                          {filter.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 px-2 py-1 hover:bg-muted/30 rounded cursor-pointer text-sm text-muted-foreground">
                              <Checkbox className="h-4 w-4" />
                              {opt}
                            </label>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-6 bg-card border-y border-border hover:bg-muted/50"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Table */}
          <div className="flex-1 bg-card border border-l-0 border-border rounded-r-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-10">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Size</TableHead>
                  <TableHead className="font-medium">Syncing to</TableHead>
                  <TableHead className="font-medium">Last sync run</TableHead>
                  <TableHead className="font-medium">Last updated ↓</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudiences.map((audience) => (
                  <TableRow
                    key={audience.id}
                    className="cursor-pointer hover:bg-muted/20"
                    onClick={() => navigate(`/people/audience-studio/edit/${audience.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{audience.name}</span>
                          {audience.isRealtime && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-[hsl(162,72%,95%)] text-[hsl(162,72%,30%)] border-[hsl(162,72%,80%)]">
                              ⚡ Realtime audience
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {audience.size ? audience.size.toLocaleString() : "--"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {audience.syncingTo.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {audience.syncingTo.map((sync) => (
                            <div key={sync} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              {sync[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No syncs</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {audience.lastSyncRun || "--"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{audience.lastModified.split(" ")[0]}</span>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {audience.modifiedBy}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AudienceStudio;
