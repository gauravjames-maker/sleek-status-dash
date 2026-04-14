import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Search, Filter, Pencil, MoreVertical, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

interface Journey {
  id: number;
  name: string;
  status: "Draft" | "Live" | "Paused" | "Finished";
}

const journeys: Journey[] = [
  { id: 1, name: "Test-journey-Template", status: "Draft" },
  { id: 2, name: "MSJ Test 4/10", status: "Draft" },
  { id: 3, name: "DCT Test 2", status: "Draft" },
  { id: 4, name: "DCT Test 1", status: "Draft" },
  { id: 5, name: "DCT Test", status: "Draft" },
  { id: 6, name: "JMCG Journey Statuses", status: "Finished" },
  { id: 7, name: "Alan Paused", status: "Paused" },
  { id: 8, name: "Alan Live", status: "Live" },
];

const statusColors: Record<Journey["status"], string> = {
  Draft: "bg-muted text-foreground",
  Live: "bg-green-100 text-green-700",
  Paused: "bg-orange-100 text-orange-600",
  Finished: "bg-blue-100 text-blue-600",
};

const statusDots: Record<Journey["status"], string> = {
  Draft: "bg-gray-500",
  Live: "bg-green-500",
  Paused: "bg-orange-500",
  Finished: "bg-blue-500",
};

const Journeys = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sortField, setSortField] = useState<"name" | "status" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: "name" | "status") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = journeys.filter((j) =>
      j.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortField) {
      list = [...list].sort((a, b) => {
        const valA = a[sortField].toLowerCase();
        const valB = b[sortField].toLowerCase();
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return list;
  }, [searchQuery, sortField, sortDir]);

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-primary" />
            <span className="text-lg text-muted-foreground">Campaigns /</span>
            <span className="text-lg font-bold">Journey</span>
          </div>
          <Button className="bg-primary text-primary-foreground font-semibold px-5">
            Create journey
          </Button>
        </div>

        <div className="px-8 py-6 space-y-4">
          {/* Search + Show archived */}
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showArchived} onCheckedChange={setShowArchived} />
              <span className="text-sm text-muted-foreground">Show archived</span>
            </div>
          </div>

          {/* Add filter */}
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <Filter className="w-3.5 h-3.5" />
            Add filter
          </Button>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1.5">
                      Name
                      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-1.5">
                      Status
                      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((journey) => (
                  <TableRow key={journey.id}>
                    <TableCell>
                      <span className="text-primary font-medium cursor-pointer hover:underline">
                        {journey.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[journey.status]}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusDots[journey.status]}`} />
                        {journey.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
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
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      No journeys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journeys;
