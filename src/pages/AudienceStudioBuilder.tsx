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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchemaExplorer } from "@/components/audience-studio/SchemaExplorer";
import { FilterBuilder, FilterGroup } from "@/components/audience-studio/FilterBuilder";
import { RelationshipBuilder, JoinRelationship } from "@/components/audience-studio/RelationshipBuilder";
import { PreviewPanel } from "@/components/audience-studio/PreviewPanel";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Link2,
  Filter,
  Eye,
  Settings,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const ENTITIES = [
  { value: "customers", label: "Customers" },
  { value: "users", label: "Users" },
  { value: "contacts", label: "Contacts" },
];

const RELATED_TABLES = [
  { value: "orders", label: "Orders" },
  { value: "events", label: "Events" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "products", label: "Products" },
  { value: "payments", label: "Payments" },
];

const SCHEMA: Record<string, { name: string; type: string; isPrimaryKey?: boolean; isForeignKey?: boolean }[]> = {
  customers: [
    { name: "customer_id", type: "INT", isPrimaryKey: true },
    { name: "email", type: "VARCHAR" },
    { name: "name", type: "VARCHAR" },
    { name: "created_at", type: "TIMESTAMP" },
    { name: "status", type: "VARCHAR" },
    { name: "total_spend", type: "DECIMAL" },
    { name: "last_order_date", type: "DATE" },
  ],
  orders: [
    { name: "order_id", type: "INT", isPrimaryKey: true },
    { name: "customer_id", type: "INT", isForeignKey: true },
    { name: "order_date", type: "TIMESTAMP" },
    { name: "total_amount", type: "DECIMAL" },
    { name: "status", type: "VARCHAR" },
    { name: "items_count", type: "INT" },
  ],
  events: [
    { name: "event_id", type: "INT", isPrimaryKey: true },
    { name: "customer_id", type: "INT", isForeignKey: true },
    { name: "event_type", type: "VARCHAR" },
    { name: "event_date", type: "TIMESTAMP" },
    { name: "properties", type: "JSON" },
  ],
  subscriptions: [
    { name: "subscription_id", type: "INT", isPrimaryKey: true },
    { name: "customer_id", type: "INT", isForeignKey: true },
    { name: "plan_name", type: "VARCHAR" },
    { name: "start_date", type: "DATE" },
    { name: "end_date", type: "DATE" },
    { name: "status", type: "VARCHAR" },
  ],
  products: [
    { name: "product_id", type: "INT", isPrimaryKey: true },
    { name: "name", type: "VARCHAR" },
    { name: "category", type: "VARCHAR" },
    { name: "price", type: "DECIMAL" },
  ],
  payments: [
    { name: "payment_id", type: "INT", isPrimaryKey: true },
    { name: "customer_id", type: "INT", isForeignKey: true },
    { name: "amount", type: "DECIMAL" },
    { name: "payment_date", type: "TIMESTAMP" },
    { name: "method", type: "VARCHAR" },
  ],
};

const SAMPLE_DATA = [
  { customer_id: 1001, email: "john@example.com", name: "John Smith", total_spend: 1250.00, last_order_date: "2025-12-10" },
  { customer_id: 1002, email: "sarah@example.com", name: "Sarah Johnson", total_spend: 890.50, last_order_date: "2025-12-08" },
  { customer_id: 1003, email: "mike@example.com", name: "Mike Chen", total_spend: 2100.00, last_order_date: "2025-12-12" },
  { customer_id: 1004, email: "emily@example.com", name: "Emily Davis", total_spend: 450.00, last_order_date: "2025-11-28" },
  { customer_id: 1005, email: "alex@example.com", name: "Alex Wilson", total_spend: 3200.00, last_order_date: "2025-12-14" },
];

const TAGS = ["High value", "Engagement", "Churn risk", "New user", "VIP", "Retention"];

const AudienceStudioBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [primaryEntity, setPrimaryEntity] = useState("customers");
  const [relatedTables, setRelatedTables] = useState<string[]>([]);
  const [relationships, setRelationships] = useState<JoinRelationship[]>([]);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [audienceName, setAudienceName] = useState("");
  const [audienceDescription, setAudienceDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const steps = [
    { id: "entity", label: "Data Sources", icon: Database },
    { id: "relationships", label: "Relationships", icon: Link2 },
    { id: "filters", label: "Filters", icon: Filter },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "metadata", label: "Save", icon: Settings },
  ];

  const allSelectedTables = [primaryEntity, ...relatedTables];

  const availableColumns = Object.fromEntries(
    allSelectedTables.map((t) => [t, SCHEMA[t]?.map((c) => c.name) || []])
  );

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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return Boolean(primaryEntity);
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return Boolean(audienceName.trim());
      default:
        return true;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card">
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
                Define your customer segment step by step
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!audienceName.trim()}>
            <Check className="w-4 h-4 mr-2" />
            Save Audience
          </Button>
        </div>

        {/* Steps */}
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Schema Explorer (visible on filter step) */}
          {currentStep === 2 && (
            <div className="w-64 border-r border-border bg-card flex-shrink-0">
              <SchemaExplorer
                tables={allSelectedTables.map((t) => ({
                  name: t,
                  columns: SCHEMA[t] || [],
                }))}
                selectedTables={allSelectedTables}
              />
            </div>
          )}

          {/* Center: Main content */}
          <div className="flex-1 overflow-auto p-8">
            <div className={`mx-auto ${currentStep === 2 ? "" : "max-w-2xl"}`}>
              {/* Step 1: Data Sources */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Select Data Sources
                    </h2>
                    <p className="text-muted-foreground">
                      Choose the primary entity and any related tables for your
                      audience
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Primary Entity</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        The main entity your audience is based on
                      </p>
                      <Select
                        value={primaryEntity}
                        onValueChange={setPrimaryEntity}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select primary entity" />
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

                    <div>
                      <Label className="text-sm font-medium">
                        Related Tables (Optional)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Add related tables to enrich your audience filters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {RELATED_TABLES.map((table) => (
                          <Badge
                            key={table.value}
                            variant={
                              relatedTables.includes(table.value)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer hover:bg-primary/80"
                            onClick={() =>
                              setRelatedTables((prev) =>
                                prev.includes(table.value)
                                  ? prev.filter((t) => t !== table.value)
                                  : [...prev, table.value]
                              )
                            }
                          >
                            {table.label}
                            {relatedTables.includes(table.value) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Schema Preview */}
                  <Card className="p-4">
                    <h3 className="text-sm font-medium mb-3">Selected Schema</h3>
                    <div className="space-y-3">
                      {allSelectedTables.map((table) => (
                        <div key={table} className="text-sm">
                          <div className="font-medium text-primary">{table}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {SCHEMA[table]?.map((c) => c.name).join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 2: Relationships */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Define Relationships
                    </h2>
                    <p className="text-muted-foreground">
                      Configure how tables connect to each other
                    </p>
                  </div>
                  <RelationshipBuilder
                    primaryTable={primaryEntity}
                    relatedTables={relatedTables}
                    availableColumns={availableColumns}
                    relationships={relationships}
                    onRelationshipsChange={setRelationships}
                  />
                </div>
              )}

              {/* Step 3: Filters */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Build Filters</h2>
                    <p className="text-muted-foreground">
                      Define conditions to segment your audience
                    </p>
                  </div>
                  <FilterBuilder
                    availableFields={availableFields}
                    filterGroups={filterGroups}
                    onFilterGroupsChange={setFilterGroups}
                  />
                </div>
              )}

              {/* Step 4: Preview */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Preview Results</h2>
                    <p className="text-muted-foreground">
                      Review your audience before saving
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h3 className="font-medium mb-4">Audience Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Primary Entity:
                          </span>
                          <span className="font-medium">{primaryEntity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Related Tables:
                          </span>
                          <span className="font-medium">
                            {relatedTables.length || "None"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Filter Groups:
                          </span>
                          <span className="font-medium">
                            {filterGroups.length || "None"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total Conditions:
                          </span>
                          <span className="font-medium">
                            {filterGroups.reduce(
                              (sum, g) => sum + g.conditions.length,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                    </Card>
                    <Card className="overflow-hidden">
                      <PreviewPanel
                        audienceSize={1247}
                        totalSize={156000}
                        sampleData={SAMPLE_DATA}
                        isLoading={isPreviewLoading}
                        onRefresh={handleRefreshPreview}
                      />
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 5: Metadata */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Save Audience</h2>
                    <p className="text-muted-foreground">
                      Add metadata and save your audience
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Audience Name *
                      </Label>
                      <Input
                        value={audienceName}
                        onChange={(e) => setAudienceName(e.target.value)}
                        placeholder="e.g., High-value customers"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        value={audienceDescription}
                        onChange={(e) => setAudienceDescription(e.target.value)}
                        placeholder="Describe this audience segment..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Add tags to organize your audiences
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              selectedTags.includes(tag) ? "default" : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Active audiences can be used in the AI SQL Builder
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {isActive ? "Active" : "Draft"}
                        </span>
                        <Switch
                          checked={isActive}
                          onCheckedChange={setIsActive}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview Panel (visible on filter step) */}
          {currentStep === 2 && (
            <div className="w-80 border-l border-border bg-card flex-shrink-0">
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

        {/* Footer Navigation */}
        <div className="border-t border-border p-4 flex justify-between bg-card">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() =>
                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
              }
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!audienceName.trim()}>
              <Check className="w-4 h-4 mr-2" />
              Save Audience
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AudienceStudioBuilder;
