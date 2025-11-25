import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, List, Grid, MoreVertical, Edit, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  template: string;
  audience: string;
  audienceSize: number;
  location: string;
  lastModified: string;
  lastModifiedBy: {
    name: string;
    initials: string;
    color: string;
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: "671310",
    name: "GJ - 101",
    template: "Gaurav<>Content",
    audience: "GJ BP - 1",
    audienceSize: 50,
    location: "-",
    lastModified: "11 minutes ago",
    lastModifiedBy: { name: "Gaurav James", initials: "GJ", color: "#10B981" },
  },
  {
    id: "2",
    name: "in app cam",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "about 3 hours ago",
    lastModifiedBy: { name: "Carla Pinsach", initials: "CP", color: "#10B981" },
  },
  {
    id: "3",
    name: "carla test (copy of) Mark...",
    description: "test",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "about 3 hours ago",
    lastModifiedBy: { name: "Carla Pinsach", initials: "CP", color: "#10B981" },
  },
  {
    id: "4",
    name: "Marketing Campaign As...",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "about 6 hours ago",
    lastModifiedBy: { name: "Mayank Sharma", initials: "MS", color: "#8B5CF6" },
  },
  {
    id: "5",
    name: "Test campaign For In Ap...",
    description: "Test",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "1 day ago",
    lastModifiedBy: { name: "Faizan Ali", initials: "FA", color: "#3B82F6" },
  },
  {
    id: "6",
    name: "Test campaign",
    description: "test",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "1 day ago",
    lastModifiedBy: { name: "Faizan Ali", initials: "FA", color: "#3B82F6" },
  },
  {
    id: "7",
    name: "travel camp",
    template: "-",
    audience: "-",
    audienceSize: 0,
    location: "-",
    lastModified: "1 day ago",
    lastModifiedBy: { name: "Carla Pinsach", initials: "CP", color: "#10B981" },
  },
];

const MarketingCampaigns = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const handleRowClick = (campaignId: string) => {
    navigate(`/campaigns/marketing/overview/${campaignId}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Campaigns</span>
                  <span>/</span>
                  <span className="font-semibold text-foreground">Marketing campaigns</span>
                </div>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Create Marketing campaign
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <Label htmlFor="show-archived" className="text-sm font-normal cursor-pointer">
                  Show archived
                </Label>
              </div>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Name / Description</TableHead>
                <TableHead className="font-semibold">Template</TableHead>
                <TableHead className="font-semibold">Audience</TableHead>
                <TableHead className="font-semibold">Audience size</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Last modified</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(campaign.id)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">{campaign.name}</span>
                      {campaign.description && (
                        <span className="text-sm text-muted-foreground">{campaign.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.template !== "-" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded border border-border flex items-center justify-center">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-primary">{campaign.template}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={campaign.audience !== "-" ? "text-primary" : "text-muted-foreground"}>
                      {campaign.audience}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{campaign.audienceSize}</span>
                      {campaign.audienceSize > 0 && (
                        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{campaign.location}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback 
                          className="text-xs font-semibold text-white"
                          style={{ backgroundColor: campaign.lastModifiedBy.color }}
                        >
                          {campaign.lastModifiedBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm text-primary font-medium">
                          {campaign.lastModifiedBy.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.lastModified}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaigns;
