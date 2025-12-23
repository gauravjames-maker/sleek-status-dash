import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Eye, 
  Filter, 
  Calendar, 
  Hash, 
  Type, 
  ToggleLeft,
  Database,
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import type { ParentModel, RelatedModel } from "@/types/audience-studio";
import { mockWarehouseTables } from "@/types/audience-studio";

interface SchemaPreviewPanelProps {
  parentModels: ParentModel[];
  relatedModels: RelatedModel[];
  selectedParentId?: string;
  onSelectParent?: (id: string) => void;
}

// Mock data for preview
const generateMockPreviewData = (parentModel: ParentModel, relatedModels: RelatedModel[]) => {
  const table = mockWarehouseTables.find(t => t.name === parentModel.tableName);
  const sampleSize = Math.floor(Math.random() * 50000) + 10000;
  
  const sampleRecords = [
    { id: "usr_001", name: "John Doe", email: "john@example.com", state: "CA", created: "2024-01-15" },
    { id: "usr_002", name: "Jane Smith", email: "jane@example.com", state: "NY", created: "2024-02-20" },
    { id: "usr_003", name: "Bob Wilson", email: "bob@example.com", state: "TX", created: "2024-03-10" },
    { id: "usr_004", name: "Alice Brown", email: "alice@example.com", state: "FL", created: "2024-04-05" },
    { id: "usr_005", name: "Charlie Davis", email: "charlie@example.com", state: "WA", created: "2024-05-12" },
  ];

  const breakdowns = [
    { label: "California", count: Math.floor(sampleSize * 0.25), percentage: 25 },
    { label: "New York", count: Math.floor(sampleSize * 0.18), percentage: 18 },
    { label: "Texas", count: Math.floor(sampleSize * 0.15), percentage: 15 },
    { label: "Florida", count: Math.floor(sampleSize * 0.12), percentage: 12 },
    { label: "Others", count: Math.floor(sampleSize * 0.30), percentage: 30 },
  ];

  return { sampleSize, sampleRecords, breakdowns, columns: table?.columns || [] };
};

const getColumnIcon = (type: string) => {
  switch (type) {
    case "timestamp": return <Calendar className="h-3 w-3" />;
    case "number": return <Hash className="h-3 w-3" />;
    case "boolean": return <ToggleLeft className="h-3 w-3" />;
    default: return <Type className="h-3 w-3" />;
  }
};

export const SchemaPreviewPanel = ({
  parentModels,
  relatedModels,
  selectedParentId,
  onSelectParent,
}: SchemaPreviewPanelProps) => {
  const [previewParentId, setPreviewParentId] = useState(selectedParentId || parentModels[0]?.id || "");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewData, setPreviewData] = useState<ReturnType<typeof generateMockPreviewData> | null>(null);

  const selectedParent = parentModels.find(p => p.id === previewParentId);
  const parentRelatedModels = relatedModels.filter(rm => rm.parentModelId === previewParentId);

  useEffect(() => {
    if (selectedParent) {
      refreshPreview();
    }
  }, [previewParentId, selectedParent]);

  const refreshPreview = () => {
    if (!selectedParent) return;
    setIsRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setPreviewData(generateMockPreviewData(selectedParent, parentRelatedModels));
      setIsRefreshing(false);
    }, 500);
  };

  const handleParentChange = (id: string) => {
    setPreviewParentId(id);
    onSelectParent?.(id);
  };

  if (parentModels.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No parent models configured yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add a parent model to see live preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Live Audience Preview</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshPreview}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parent Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Select Parent Model</label>
          <Select value={previewParentId} onValueChange={handleParentChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a parent model" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {parentModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {model.displayName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedParent && previewData && (
          <>
            <Separator />

            {/* Audience Size */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Audience Size</p>
                  <p className="text-2xl font-bold text-primary">
                    {previewData.sampleSize.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">of total</p>
                  <p className="text-lg font-semibold text-foreground">100%</p>
                </div>
              </div>
            </div>

            {/* Available Properties */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Available Properties</p>
                <Badge variant="secondary" className="text-xs">
                  {previewData.columns.length} columns
                </Badge>
              </div>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-1.5">
                  {previewData.columns.map((col) => (
                    <Badge 
                      key={col.name} 
                      variant="outline" 
                      className="text-xs gap-1 py-1"
                    >
                      {getColumnIcon(col.type)}
                      {col.name}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Related Models for Events */}
            {parentRelatedModels.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Event Filters Available</p>
                  <Badge variant="secondary" className="text-xs">
                    {parentRelatedModels.length} events
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {parentRelatedModels.map((rm) => {
                    const rmTable = mockWarehouseTables.find(t => t.name === rm.tableName);
                    return (
                      <div 
                        key={rm.id} 
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="h-3 w-3 text-primary" />
                          <span className="font-medium">{rm.displayName}</span>
                          <Badge variant="outline" className="text-[10px]">{rm.joinType}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span>{rmTable?.columns.length || 0} props</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Sample Records */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Sample Records</p>
              <ScrollArea className="h-36">
                <div className="space-y-1">
                  {previewData.sampleRecords.map((record, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-muted/20 rounded text-xs"
                    >
                      <span className="text-muted-foreground w-16 truncate">{record.id}</span>
                      <span className="font-medium flex-1 truncate">{record.name}</span>
                      <span className="text-muted-foreground truncate">{record.email}</span>
                      <Badge variant="outline" className="text-[10px]">{record.state}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Breakdown by State</p>
              <div className="space-y-1.5">
                {previewData.breakdowns.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
