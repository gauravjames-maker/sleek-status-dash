import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Sparkles, SlidersHorizontal } from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { ManualFilterBuilder } from "@/components/audience-studio/ManualFilterBuilder";
import { AIFilterBuilder } from "@/components/audience-studio/AIFilterBuilder";
import { AudiencePreviewPanel } from "@/components/audience-studio/AudiencePreviewPanel";
import { useToast } from "@/hooks/use-toast";
import { sampleParentModels, sampleRelatedModels, type FilterGroup, type ParentModel, type RelatedModel } from "@/types/audience-studio";

const AudienceBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audienceName, setAudienceName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(sampleParentModels[0]?.id || "");
  const [filterMode, setFilterMode] = useState<"manual" | "ai">("manual");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterGroup>({
    id: "root",
    logic: "AND",
    propertyFilters: [],
    eventFilters: [],
    nestedGroups: [],
  });

  const parentModel = sampleParentModels.find(pm => pm.id === selectedParentId) || sampleParentModels[0];
  const relatedModels = sampleRelatedModels.filter(rm => rm.parentModelId === selectedParentId);

  // Debounced refresh
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.propertyFilters.length > 0 || filters.eventFilters.length > 0) {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters]);

  const handleSave = () => {
    if (!audienceName.trim()) {
      toast({ title: "Name required", description: "Please enter an audience name", variant: "destructive" });
      return;
    }
    toast({ title: "Audience saved", description: `"${audienceName}" has been saved successfully.` });
    navigate("/people/audience-studio");
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/people/audience-studio")}><ArrowLeft className="h-4 w-4" /></Button>
              <div>
                <Input value={audienceName} onChange={(e) => setAudienceName(e.target.value)} placeholder="Untitled Audience" className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0" />
                <p className="text-sm text-muted-foreground mt-1">Define your audience using filters</p>
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Save Audience</Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Builder */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl space-y-6">
              {/* Parent Model Selection */}
              <Card className="p-4">
                <label className="text-sm font-medium mb-2 block">Parent Model</label>
                <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                  <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {sampleParentModels.map(pm => (
                      <SelectItem key={pm.id} value={pm.id}>{pm.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              {/* Filter Mode Toggle */}
              <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as "manual" | "ai")}>
                <TabsList className="grid grid-cols-2 w-64">
                  <TabsTrigger value="manual" className="gap-2"><SlidersHorizontal className="w-4 h-4" />Manual</TabsTrigger>
                  <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" />AI Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-4">
                  <ManualFilterBuilder parentModel={parentModel} relatedModels={relatedModels} filters={filters} onFiltersChange={setFilters} />
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                  <AIFilterBuilder parentModel={parentModel} relatedModels={relatedModels} filters={filters} onFiltersChange={setFilters} aiPrompt={aiPrompt} onAiPromptChange={setAiPrompt} onSwitchToManual={() => setFilterMode("manual")} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-96 border-l border-border">
            <AudiencePreviewPanel filters={filters} isLoading={isRefreshing} onRefresh={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceBuilder;
