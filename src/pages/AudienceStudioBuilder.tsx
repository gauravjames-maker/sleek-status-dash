import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBuilder, FilterGroup } from "@/components/audience-studio/FilterBuilder";
import {
  ArrowLeft,
  Users,
  BarChart2,
  MoreHorizontal,
  Undo,
  Redo,
  ChevronDown,
  PenLine,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const ENTITIES = [
  { value: "users", label: "users" },
  { value: "customers", label: "customers" },
  { value: "contacts", label: "contacts" },
];

const SCHEMA: Record<string, { name: string; type: string; isPrimaryKey?: boolean; isForeignKey?: boolean }[]> = {
  users: [
    { name: "user_id", type: "INT", isPrimaryKey: true },
    { name: "email", type: "VARCHAR" },
    { name: "name", type: "VARCHAR" },
    { name: "created_at", type: "TIMESTAMP" },
    { name: "status", type: "VARCHAR" },
    { name: "industry", type: "VARCHAR" },
  ],
  customers: [
    { name: "customer_id", type: "INT", isPrimaryKey: true },
    { name: "email", type: "VARCHAR" },
    { name: "name", type: "VARCHAR" },
    { name: "total_spend", type: "DECIMAL" },
    { name: "last_order_date", type: "DATE" },
  ],
  orders: [
    { name: "order_id", type: "INT", isPrimaryKey: true },
    { name: "customer_id", type: "INT", isForeignKey: true },
    { name: "order_date", type: "TIMESTAMP" },
    { name: "total_amount", type: "DECIMAL" },
  ],
  events: [
    { name: "event_id", type: "INT", isPrimaryKey: true },
    { name: "user_id", type: "INT", isForeignKey: true },
    { name: "event_type", type: "VARCHAR" },
    { name: "event_date", type: "TIMESTAMP" },
  ],
};

const AudienceStudioBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [audienceName, setAudienceName] = useState(isEditing ? "Purchase Last 30 Days" : "New audience");
  const [audienceDescription, setAudienceDescription] = useState("");
  const [parentModel, setParentModel] = useState("users");
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [activeTab, setActiveTab] = useState("definition");
  const [isEditingName, setIsEditingName] = useState(false);

  const allSelectedTables = [parentModel, "orders", "events"];

  const availableFields = allSelectedTables.flatMap((table) =>
    (SCHEMA[table] || []).map((col) => ({
      table,
      column: col.name,
      type: col.type,
    }))
  );

  const handleSave = () => {
    toast({
      title: isEditing ? "Audience updated" : "Audience created",
      description: `"${audienceName}" has been saved successfully`,
    });
    navigate("/people/audience-studio");
  };

  return (
    <div className="flex min-h-screen bg-[hsl(210,20%,98%)]">
      <CampaignSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/people/audience-studio")}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                {/* Editable title */}
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <Input
                      value={audienceName}
                      onChange={(e) => setAudienceName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                      className="text-2xl font-semibold h-auto py-0 px-1 border-0 border-b-2 border-primary rounded-none focus-visible:ring-0"
                      autoFocus
                    />
                  ) : (
                    <h1 
                      className="text-2xl font-semibold cursor-pointer hover:text-muted-foreground flex items-center gap-2"
                      onClick={() => setIsEditingName(true)}
                    >
                      {audienceName}
                      <PenLine className="w-4 h-4 text-muted-foreground" />
                    </h1>
                  )}
                </div>
                {/* Description */}
                <Input
                  placeholder="Add a description..."
                  value={audienceDescription}
                  onChange={(e) => setAudienceDescription(e.target.value)}
                  className="mt-1 text-sm text-muted-foreground border-0 p-0 h-auto shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
                />
                {/* Parent model info */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs">❄</span>
                  </div>
                  <Select value={parentModel} onValueChange={setParentModel}>
                    <SelectTrigger className="w-auto h-auto border-0 p-0 shadow-none focus:ring-0 text-[hsl(162,72%,40%)] font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {ENTITIES.map((entity) => (
                        <SelectItem key={entity.value} value={entity.value}>
                          {entity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">Last updated: 12/15/25 by</span>
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">JS</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <Button className="bg-[hsl(162,72%,40%)] hover:bg-[hsl(162,72%,35%)]" onClick={handleSave}>
                Add sync
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="h-auto p-0 bg-transparent border-0 gap-6">
                <TabsTrigger 
                  value="definition" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(162,72%,40%)] rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Definition
                </TabsTrigger>
                <TabsTrigger 
                  value="splits" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(162,72%,40%)] rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Splits
                </TabsTrigger>
                <TabsTrigger 
                  value="syncs" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(162,72%,40%)] rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Syncs
                </TabsTrigger>
                <TabsTrigger 
                  value="traits" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(162,72%,40%)] rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Traits
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[hsl(162,72%,40%)] rounded-none text-muted-foreground data-[state=active]:text-foreground"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Action bar */}
        <div className="bg-white border-b border-border px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 gap-2">
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="h-9 gap-2">
              <Users className="w-4 h-4" />
              Calculate size
            </Button>
            <Button variant="outline" className="h-9 gap-2">
              <BarChart2 className="w-4 h-4" />
              Show insights
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl">
            <FilterBuilder
              availableFields={availableFields}
              filterGroups={filterGroups}
              onFilterGroupsChange={setFilterGroups}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-border px-6 py-4 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/people/audience-studio")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
          <Button 
            className="bg-[hsl(162,72%,40%)] hover:bg-[hsl(162,72%,35%)] gap-2"
            onClick={handleSave}
          >
            Continue
            <span className="ml-1">→</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AudienceStudioBuilder;
