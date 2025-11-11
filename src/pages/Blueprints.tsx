import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, LayoutGrid, List, MoreVertical, Edit, Users } from "lucide-react";
import { useState } from "react";

const blueprintsData = [
  { id: 1, name: "test inherited", description: "", nodeCount: 0, count: "-", location: "-", user: "System", time: "about 2 hours ago" },
  { id: 2, name: "03/26/2025 8:37:29 (copy of) grandchild inherit", description: "", nodeCount: 2, count: "-", location: "-", user: "System", time: "about 2 hours ago" },
  { id: 3, name: "rebecca child 10/27", description: "", nodeCount: 0, count: "-", location: "-", user: "System", time: "about 2 hours ago" },
  { id: 4, name: "child of test inh copy rebecca", description: "", nodeCount: 2, count: "-", location: "-", user: "System", time: "about 2 hours ago" },
  { id: 5, name: "05/31/2024 4:27:59 (copy of) new child", description: "", nodeCount: 0, count: "21", location: "-", user: "System", time: "about 5 hours ago" },
  { id: 6, name: "carla show n tell 29-01", description: "", nodeCount: 7, count: "-", location: "-", user: "System", time: "about 5 hours ago" },
  { id: 7, name: "Funsies Furniture - Blueprint Snapshot Demo Root BP", description: "DO NOT MODIFY OR DELETE", nodeCount: 4, count: "100K", location: "-", user: "System", time: "about 6 hours ago" },
  { id: 8, name: "Funsies - Credit Card Holders", description: "", nodeCount: 3, count: "88K", location: "-", user: "System", time: "about 6 hours ago" },
  { id: 9, name: "Rocket demo", description: "29/01/25", nodeCount: 0, count: "100K", location: "-", user: "System", time: "about 6 hours ago" },
];

const Blueprints = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredData = blueprintsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      
      <main className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-base">
                <span className="text-muted-foreground">People</span>
                <span className="text-muted-foreground mx-2">/</span>
                <span className="font-semibold">Blueprint</span>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Blueprint
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <span className="text-sm">Show archived</span>
            </div>

            <div className="flex border border-border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className={viewMode === "list" ? "bg-primary/10" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={viewMode === "grid" ? "bg-primary/10" : ""}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="icon">
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-[35%] font-semibold text-foreground h-12">Name / Description</TableHead>
                  <TableHead className="w-[12%] font-semibold text-foreground text-center">Node count</TableHead>
                  <TableHead className="w-[12%] font-semibold text-foreground text-center">Count</TableHead>
                  <TableHead className="w-[12%] font-semibold text-foreground text-center">Location</TableHead>
                  <TableHead className="w-[21%] font-semibold text-foreground">Last modified</TableHead>
                  <TableHead className="w-[8%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((blueprint, index) => (
                  <TableRow 
                    key={blueprint.id} 
                    className="hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                  >
                    <TableCell className="py-4">
                      <div>
                        <div className="text-primary font-medium hover:underline cursor-pointer text-[15px]">
                          {blueprint.name}
                        </div>
                        {blueprint.description && (
                          <div className="text-sm text-muted-foreground mt-0.5">{blueprint.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[15px] font-medium">{blueprint.nodeCount}</span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[15px] font-medium">{blueprint.count}</span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[15px] font-medium text-muted-foreground">{blueprint.location}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          SY
                        </div>
                        <div>
                          <div className="text-[15px] font-semibold">{blueprint.user}</div>
                          <div className="text-xs text-muted-foreground">{blueprint.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 hover:bg-muted transition-colors"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
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

export default Blueprints;
