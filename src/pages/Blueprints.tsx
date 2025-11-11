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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name / Description</TableHead>
                <TableHead className="w-[15%]">Node count</TableHead>
                <TableHead className="w-[15%]">Count</TableHead>
                <TableHead className="w-[15%]">Location</TableHead>
                <TableHead className="w-[15%]">Last modified</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((blueprint) => (
                <TableRow key={blueprint.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="text-primary font-medium hover:underline cursor-pointer">
                        {blueprint.name}
                      </div>
                      {blueprint.description && (
                        <div className="text-sm text-muted-foreground">{blueprint.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{blueprint.nodeCount}</TableCell>
                  <TableCell>{blueprint.count}</TableCell>
                  <TableCell>{blueprint.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        SY
                      </div>
                      <div>
                        <div className="text-sm font-medium">{blueprint.user}</div>
                        <div className="text-xs text-muted-foreground">{blueprint.time}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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

export default Blueprints;
