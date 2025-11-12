import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, ChevronLeft, Search, RefreshCw } from "lucide-react";

const audienceData = [
  { id: 1, name: "SingleStore Large Audience All Types", datasource: "SingleStore QA", type: "SQL", count: "-", user: "Miles Thomason", time: "13 hours ago" },
  { id: 2, name: "Rebecca Tuesday", datasource: "BigQuery Native", type: "Drag and Drop", count: "5", user: "System", time: "14 hours ago" },
  { id: 3, name: "Manu audience test inapp", datasource: "(copy of) (copy of) BigQuery Native", type: "SQL", count: "-", user: "Manuel Aguilera", time: "14 hours ago" },
  { id: 4, name: "Manu with DGDV Football Recipients", datasource: "mysql rds - different push app", type: "SQL", count: "6", user: "Manuel Aguilera", time: "14 hours ago" },
  { id: 5, name: "Manu Cross Channel Swrve", datasource: "mysql rds - different push app", type: "SQL", count: "6", user: "Manuel Aguilera", time: "14 hours ago" },
  { id: 6, name: "LRC just me", datasource: "mysql rds", type: "SQL", count: "100", user: "Lucas Combs", time: "a day ago" },
  { id: 7, name: "MSJ Athena 10M", datasource: "Athena T2 - Static Creds", type: "SQL", count: "10M", user: "Mike Jenkins", time: "2 days ago" },
  { id: 8, name: "test brands 2", datasource: "Snowflake Native", type: "Drag and Drop", count: "-", user: "Carla Pinasci", time: "5 days ago" },
];

const BlueprintAudience = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintDesc, setBlueprintDesc] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<number | null>(null);

  const filteredData = audienceData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBlueprint = () => {
    if (selectedAudience) {
      navigate(`/people/blueprints/builder/new`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      
      <main className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 -ml-2 mb-4"
              onClick={() => navigate("/people/blueprints/new")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Blueprints
            </Button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="click to add name"
                  value={blueprintName}
                  onChange={(e) => setBlueprintName(e.target.value)}
                  className="text-primary font-medium mb-1 border-0 px-0 h-auto text-base focus-visible:ring-0"
                />
                <Input
                  placeholder="click to add description"
                  value={blueprintDesc}
                  onChange={(e) => setBlueprintDesc(e.target.value)}
                  className="text-muted-foreground text-sm border-0 px-0 h-auto focus-visible:ring-0"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!selectedAudience}
                  onClick={handleCreateBlueprint}
                >
                  Create Blueprint
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">Choose an Audience</h2>

          <div className="relative w-64 mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Audiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead className="w-[20%]">Datasource</TableHead>
                  <TableHead className="w-[15%]">Type</TableHead>
                  <TableHead className="w-[10%] text-center">Count</TableHead>
                  <TableHead className="w-[20%]">Last Modified</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((audience) => (
                  <TableRow
                    key={audience.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedAudience === audience.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedAudience(audience.id)}
                  >
                    <TableCell className="font-medium">{audience.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{audience.datasource}</TableCell>
                    <TableCell className="text-sm">{audience.type}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{audience.count}</span>
                        <RefreshCw className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {audience.user.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium">Modified By {audience.user}</div>
                          <div className="text-xs text-muted-foreground">{audience.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center">
                        {selectedAudience === audience.id && (
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              Items per page: 
              <select className="border border-border rounded px-2 py-1 bg-background">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>1 – 10 of 892</span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlueprintAudience;
