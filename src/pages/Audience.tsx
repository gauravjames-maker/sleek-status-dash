import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CampaignSidebar } from "@/components/CampaignSidebar";

// Mock audience data
const mockAudiences = [
  {
    id: "1",
    name: "High Value Customers",
    type: "Dynamic",
    count: 12543,
    lastUpdated: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Abandoned Cart Users",
    type: "Static",
    count: 8234,
    lastUpdated: "2024-01-14",
    status: "Active",
  },
  {
    id: "3",
    name: "Newsletter Subscribers",
    type: "Dynamic",
    count: 45632,
    lastUpdated: "2024-01-10",
    status: "Active",
  },
  {
    id: "4",
    name: "Inactive 90 Days",
    type: "Dynamic",
    count: 3421,
    lastUpdated: "2024-01-08",
    status: "Processing",
  },
];

const Audience = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAudiences = mockAudiences.filter((audience) =>
    audience.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Audiences</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage your audience segments
              </p>
            </div>
            <Button onClick={() => navigate("/people/audience/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Audience
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudiences.map((audience) => (
                  <TableRow 
                    key={audience.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => navigate(`/people/audience/${audience.id}`)}
                  >
                    <TableCell className="font-medium">{audience.name}</TableCell>
                    <TableCell>{audience.type}</TableCell>
                    <TableCell>{audience.count.toLocaleString()}</TableCell>
                    <TableCell>{audience.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge variant={audience.status === "Active" ? "default" : "secondary"}>
                        {audience.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Audience;
