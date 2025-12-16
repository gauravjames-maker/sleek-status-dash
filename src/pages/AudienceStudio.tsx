import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, MoreHorizontal, Copy, Archive, Edit, Users } from "lucide-react";

interface Audience {
  id: string;
  name: string;
  description: string;
  status: "Draft" | "Active";
  baseEntity: string;
  lastModified: string;
  modifiedBy: string;
  version: number;
}

const MOCK_AUDIENCES: Audience[] = [
  {
    id: "aud-001",
    name: "High-value customers",
    description: "Customers with total order value > $500 in the last 90 days",
    status: "Active",
    baseEntity: "Customers",
    lastModified: "2025-12-15 14:30",
    modifiedBy: "John Smith",
    version: 3,
  },
  {
    id: "aud-002",
    name: "Inactive users (30 days)",
    description: "Users who haven't logged in for 30+ days",
    status: "Active",
    baseEntity: "Customers",
    lastModified: "2025-12-14 09:15",
    modifiedBy: "Sarah Johnson",
    version: 1,
  },
  {
    id: "aud-003",
    name: "New signups - December",
    description: "All users who signed up in December 2025",
    status: "Draft",
    baseEntity: "Customers",
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
    lastModified: "2025-12-12 11:20",
    modifiedBy: "Emily Davis",
    version: 2,
  },
  {
    id: "aud-005",
    name: "Churn risk",
    description: "Active customers showing declining engagement",
    status: "Draft",
    baseEntity: "Customers",
    lastModified: "2025-12-10 08:00",
    modifiedBy: "John Smith",
    version: 1,
  },
];

const AudienceStudio = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [audiences] = useState<Audience[]>(MOCK_AUDIENCES);

  const filteredAudiences = audiences.filter(
    (audience) =>
      audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audience Studio</h1>
            <p className="text-muted-foreground mt-1">
              Define and manage reusable customer segments for the AI SQL Builder
            </p>
          </div>
          <Button onClick={() => navigate("/people/audience-studio/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Audience
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Base Entity</TableHead>
                <TableHead className="font-semibold">Last Modified</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudiences.map((audience) => (
                <TableRow
                  key={audience.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => navigate(`/people/audience-studio/edit/${audience.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      {audience.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[300px] truncate">
                    {audience.description}
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
                  <TableCell>{audience.baseEntity}</TableCell>
                  <TableCell>
                    <div className="text-sm">{audience.lastModified}</div>
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
        </div>
      </main>
    </div>
  );
};

export default AudienceStudio;
