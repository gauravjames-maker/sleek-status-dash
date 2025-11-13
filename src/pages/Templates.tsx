import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, LayoutList, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  description?: string;
  status: "Draft" | "Approved";
  channel?: "email" | "sms";
  location: string;
  lastModified: string;
  author: string;
  authorInitials: string;
  thumbnail?: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "KF for Ugo",
    status: "Draft",
    location: "-",
    lastModified: "about 17 hours ago",
    author: "Kevin Freeman",
    authorInitials: "KF",
  },
  {
    id: "2",
    name: "Animesh_test_inbox",
    description: "testing for inbox notification",
    status: "Draft",
    location: "-",
    lastModified: "1 day ago",
    author: "Animesh Karma",
    authorInitials: "AK",
  },
  {
    id: "3",
    name: "Gaurav<>Content",
    status: "Draft",
    channel: "email",
    location: "-",
    lastModified: "1 day ago",
    author: "Gaurav James",
    authorInitials: "GJ",
    thumbnail: "user-uploads://Screenshot_2025-11-13_at_6.28.01 PM.png",
  },
  {
    id: "4",
    name: "John Hannah Group Test",
    status: "Approved",
    channel: "email",
    location: "-",
    lastModified: "1 day ago",
    author: "John Hanner",
    authorInitials: "JH",
  },
  {
    id: "5",
    name: "CP Push App Selection Test",
    status: "Draft",
    channel: "email",
    location: "-",
    lastModified: "2 days ago",
    author: "System",
    authorInitials: "SY",
  },
  {
    id: "6",
    name: "test brand123",
    status: "Draft",
    location: "-",
    lastModified: "2 days ago",
    author: "Carla Pinsach",
    authorInitials: "CP",
  },
];

const Templates = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      
      <main className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Content / Templates</h1>
              </div>
            </div>
            
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create template
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Search and filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 bg-card border-border"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <span className="text-sm text-foreground">Show archived</span>
              </div>
              
              <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-foreground">Filter:</span>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md bg-card hover:bg-accent">
              Status
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-sm text-primary hover:underline">
              Clear filters
            </button>
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      Name / Description
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      Status
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Channel(s)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      Last modified
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockTemplates.map((template, index) => (
                  <tr
                    key={template.id}
                    onClick={() => navigate(`/content/templates/${template.id}`)}
                    className="border-b border-border hover:bg-table-row-hover cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded border border-border flex items-center justify-center overflow-hidden">
                          {template.thumbnail ? (
                            <div className="w-full h-full bg-muted" />
                          ) : (
                            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-primary hover:underline">
                            {template.name}
                          </div>
                          {template.description && (
                            <div className="text-sm text-muted-foreground">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${template.status === "Draft" ? "bg-muted-foreground" : "bg-primary"}`} />
                        <span className="text-sm text-foreground">{template.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {template.channel === "email" && (
                        <div className="w-5 h-5 text-muted-foreground">
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">{template.location}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${template.authorInitials === "KF" ? "[#059669]" : template.authorInitials === "AK" ? "[#059669]" : template.authorInitials === "GJ" ? "[#059669]" : template.authorInitials === "JH" ? "[#059669]" : template.authorInitials === "SY" ? "[#059669]" : "[#059669]"} flex items-center justify-center text-xs font-semibold text-white`}>
                          {template.authorInitials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">{template.author}</div>
                          <div className="text-xs text-muted-foreground">{template.lastModified}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button className="p-1 hover:bg-accent rounded">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted-foreground">
                          <circle cx="8" cy="3" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
