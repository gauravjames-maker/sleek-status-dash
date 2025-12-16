import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterBuilder, FilterGroup } from "@/components/audience-studio/FilterBuilder";
import { PreviewPanel } from "@/components/audience-studio/PreviewPanel";
import {
  ArrowLeft,
  Save,
  Eye,
  Database,
  Users,
  RefreshCw,
  Info,
  Tag,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const ENTITIES = [
  { value: "customers", label: "Customers" },
  { value: "users", label: "Users" },
  { value: "contacts", label: "Contacts" },
];

const SCHEMA: Record<string, { name: string; type: string }[]> = {
  customers: [
    { name: "customer_id", type: "INT" },
    { name: "email", type: "VARCHAR" },
    { name: "name", type: "VARCHAR" },
    { name: "created_at", type: "TIMESTAMP" },
    { name: "status", type: "VARCHAR" },
    { name: "total_spend", type: "DECIMAL" },
    { name: "last_order_date", type: "DATE" },
  ],
  users: [
    { name: "user_id", type: "INT" },
    { name: "email", type: "VARCHAR" },
    { name: "name", type: "VARCHAR" },
    { name: "signup_date", type: "TIMESTAMP" },
  ],
  orders: [
    { name: "order_id", type: "INT" },
    { name: "customer_id", type: "INT" },
    { name: "order_date", type: "TIMESTAMP" },
    { name: "total_amount", type: "DECIMAL" },
    { name: "status", type: "VARCHAR" },
  ],
  events: [
    { name: "event_id", type: "INT" },
    { name: "customer_id", type: "INT" },
    { name: "event_type", type: "VARCHAR" },
    { name: "event_date", type: "TIMESTAMP" },
  ],
};

const SAMPLE_DATA = [
  { customer_id: 1001, email: "john@example.com", name: "John Smith", total_spend: 1250.0 },
  { customer_id: 1002, email: "sarah@example.com", name: "Sarah Johnson", total_spend: 890.5 },
  { customer_id: 1003, email: "mike@example.com", name: "Mike Chen", total_spend: 2100.0 },
  { customer_id: 1004, email: "emily@example.com", name: "Emily Davis", total_spend: 450.0 },
  { customer_id: 1005, email: "alex@example.com", name: "Alex Wilson", total_spend: 3200.0 },
];

const TAGS = ["High value", "Engagement", "Churn risk", "New user", "VIP", "Retention"];

const AudienceStudioBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [primaryEntity, setPrimaryEntity] = useState("customers");
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [audienceName, setAudienceName] = useState(isEditing ? "High-value customers" : "");
  const [audienceDescription, setAudienceDescription] = useState(
    isEditing ? "Customers with total order value > $500 in the last 90 days" : ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(isEditing ? ["High value"] : []);
  const [isActive, setIsActive] = useState(isEditing);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const allSelectedTables = [primaryEntity, "orders", "events"];

  const availableFields = allSelectedTables.flatMap((table) =>
    (SCHEMA[table] || []).map((col) => ({
      table,
      column: col.name,
      type: col.type,
    }))
  );

  const handleRefreshPreview = () => {
    setIsPreviewLoading(true);
    setTimeout(() => setIsPreviewLoading(false), 1000);
  };

  const handleSave = () => {
    if (!audienceName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this audience",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEditing ? "Audience updated" : "Audience created",
      description: `"${audienceName}" has been saved successfully`,
    });
    navigate("/people/audience-studio");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const conditionCount = filterGroups.reduce((sum, g) => sum + g.conditions.length, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/people/audience-studio")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {isEditing ? "Edit Audience" : "Create Audience"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Define conditions to build your customer segment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Audience
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Audience Details & Filters */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              {/* Audience Info Card */}
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Audience Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Audience Name *</Label>
                      <Input
                        placeholder="e.g., High-value customers"
                        value={audienceName}
                        onChange={(e) => setAudienceName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Base Entity</Label>
                      <Select value={primaryEntity} onValueChange={setPrimaryEntity}>
                        <SelectTrigger className="mt-1.5">
                          <Database className="w-4 h-4 mr-2 text-muted-foreground" />
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
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      placeholder="Describe this audience segment..."
                      value={audienceDescription}
                      onChange={(e) => setAudienceDescription(e.target.value)}
                      className="mt-1.5 resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TAGS.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80 transition-colors"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                          {selectedTags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Active audiences can be used in campaigns
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Draft</span>
                      <Switch checked={isActive} onCheckedChange={setIsActive} />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Filter Builder Card */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Audience Conditions
                  </h2>
                  {conditionCount > 0 && (
                    <Badge variant="secondary">{conditionCount} condition{conditionCount !== 1 ? "s" : ""}</Badge>
                  )}
                </div>
                <FilterBuilder
                  availableFields={availableFields}
                  filterGroups={filterGroups}
                  onFilterGroupsChange={setFilterGroups}
                />
              </Card>
            </div>
          </div>

          {/* Right Panel - Preview */}
          {showPreview && (
            <div className="w-96 border-l border-border bg-card overflow-auto animate-slide-in-right">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Audience Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshPreview}
                    className="h-8 gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPreviewLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              <PreviewPanel
                audienceSize={1247}
                totalSize={156000}
                sampleData={SAMPLE_DATA}
                isLoading={isPreviewLoading}
                onRefresh={handleRefreshPreview}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AudienceStudioBuilder;
