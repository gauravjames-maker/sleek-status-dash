import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Copy, Archive, Edit, Users, TrendingUp, Clock, AlertCircle, Filter, SlidersHorizontal } from "lucide-react";

interface Audience {
  id: string;
  name: string;
  description: string;
  status: "Draft" | "Active";
  baseEntity: string;
  size: number | null;
  lastModified: string;
  modifiedBy: string;
  version: number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

const MOCK_AUDIENCES: Audience[] = [
  {
    id: "aud-001",
    name: "High-value customers",
    description: "Customers with total order value > $500 in the last 90 days",
    status: "Active",
    baseEntity: "Customers",
    size: 1247,
    lastModified: "2025-12-15 14:30",
    modifiedBy: "John Smith",
    version: 3,
    trend: "up",
    trendValue: "+12%",
  },
  {
    id: "aud-002",
    name: "Inactive users (30 days)",
    description: "Users who haven't logged in for 30+ days",
    status: "Active",
    baseEntity: "Customers",
    size: 3420,
    lastModified: "2025-12-14 09:15",
    modifiedBy: "Sarah Johnson",
    version: 1,
    trend: "down",
    trendValue: "-5%",
  },
  {
    id: "aud-003",
    name: "New signups - December",
    description: "All users who signed up in December 2025",
    status: "Draft",
    baseEntity: "Customers",
    size: null,
    lastModified: "2025-12-13 16:45",
    modifiedBy: "Mike Chen",
    version: 1,
  },
  {
    id: "aud-004",
    name: "Frequent buyers",
    description: "Customers with 5+ orders in the last 60 days",
    status: "Active",
    baseEntity: "Customers",
    size: 755,
    lastModified: "2025-12-12 11:20",
    modifiedBy: "Emily Davis",
    version: 2,
    trend: "stable",
    trendValue: "0%",
  },
  {
    id: "aud-005",
    name: "Churn risk",
    description: "Active customers showing declining engagement",
    status: "Draft",
    baseEntity: "Customers",
    size: null,
    lastModified: "2025-12-10 08:00",
    modifiedBy: "John Smith",
    version: 1,
  },
];

const AudienceStudio = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [audiences] = useState<Audience[]>(MOCK_AUDIENCES);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAudiences = audiences.filter((audience) => {
    const matchesSearch =
      audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || audience.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: audiences.length,
    active: audiences.filter((a) => a.status === "Active").length,
    draft: audiences.filter((a) => a.status === "Draft").length,
    totalReach: audiences.reduce((sum, a) => sum + (a.size || 0), 0),
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audience Studio</h1>
            <p className="text-muted-foreground mt-1">
              Build and manage reusable customer segments
            </p>
          </div>
          <Button onClick={() => navigate("/people/audience-studio/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Audience
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Audiences</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-[hsl(var(--status-completed))]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--status-completed-bg))] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--status-completed))]" />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-[hsl(var(--status-sending))]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--status-sending-bg))] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[hsl(var(--status-sending))]" />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalReach.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search audiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Audience</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold">Base Entity</TableHead>
                <TableHead className="font-semibold">Last Modified</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudiences.map((audience) => (
                <TableRow
                  key={audience.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => navigate(`/people/audience-studio/edit/${audience.id}`)}
                >
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {audience.name}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {audience.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={audience.status === "Active" ? "default" : "secondary"}
                      className={
                        audience.status === "Active"
                          ? "bg-[hsl(var(--status-completed))] hover:bg-[hsl(var(--status-completed))]"
                          : ""
                      }
                    >
                      {audience.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {audience.size ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {audience.size.toLocaleString()}
                        </span>
                        {audience.trend && (
                          <span
                            className={`text-xs ${
                              audience.trend === "up"
                                ? "text-[hsl(var(--status-completed))]"
                                : audience.trend === "down"
                                ? "text-[hsl(var(--status-failed))]"
                                : "text-muted-foreground"
                            }`}
                          >
                            {audience.trendValue}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {audience.baseEntity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{audience.lastModified.split(" ")[0]}</div>
                    <div className="text-xs text-muted-foreground">
                      by {audience.modifiedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/people/audience-studio/edit/${audience.id}`);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          className="text-destructive"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Empty State */}
        {filteredAudiences.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No audiences found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search or filters" : "Create your first audience to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/people/audience-studio/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Audience
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AudienceStudio;
