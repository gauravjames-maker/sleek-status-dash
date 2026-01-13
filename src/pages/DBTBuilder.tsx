import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Sparkles,
  Code,
  Eye,
  Loader2,
  Users,
  Plus,
  Trash2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { FilterGroupBuilder } from "@/components/dbt-studio/FilterGroupBuilder";
import { DBTAICopilot } from "@/components/dbt-studio/DBTAICopilot";
import { 
  mockParentModels, 
  type DBTParentModel, 
  type DBTAudience,
  type FilterGroup,
  type AudienceFilter,
  type AudiencePreview 
} from "@/types/dbt-studio";

const DBTBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const audienceId = searchParams.get('id');
  
  const [parentModels] = useState<DBTParentModel[]>(mockParentModels);
  const [selectedParentId, setSelectedParentId] = useState<string>(parentModels[0]?.id || "");
  const [audienceName, setAudienceName] = useState(audienceId ? "High Value Customers" : "");
  const [audienceDescription, setAudienceDescription] = useState("");
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    { id: 'fg-1', logic: 'AND', filters: [] }
  ]);
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [showSQL, setShowSQL] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedParent = parentModels.find(p => p.id === selectedParentId);

  // Preview data
  const preview: AudiencePreview = useMemo(() => {
    const hasFilters = filterGroups.some(fg => fg.filters.length > 0);
    const baseCount = 150000;
    const filteredCount = hasFilters ? Math.floor(baseCount * 0.08) : baseCount;
    
    return {
      count: filteredCount,
      totalInParent: baseCount,
      percentage: (filteredCount / baseCount) * 100,
      sampleData: [
        { customer_id: 'C001', email: 'john@gmail.com', lifetime_value: 2450, loyalty_tier: 'Gold' },
        { customer_id: 'C002', email: 'jane@company.com', lifetime_value: 1890, loyalty_tier: 'Silver' },
        { customer_id: 'C003', email: 'bob@gmail.com', lifetime_value: 4520, loyalty_tier: 'Platinum' },
        { customer_id: 'C004', email: 'alice@startup.io', lifetime_value: 3100, loyalty_tier: 'Gold' },
        { customer_id: 'C005', email: 'charlie@gmail.com', lifetime_value: 890, loyalty_tier: 'Bronze' },
      ],
      breakdowns: [
        { 
          field: 'loyalty_tier', 
          values: [
            { label: 'Platinum', count: 1245, percentage: 10 },
            { label: 'Gold', count: 4980, percentage: 40 },
            { label: 'Silver', count: 3735, percentage: 30 },
            { label: 'Bronze', count: 2490, percentage: 20 },
          ]
        },
        { 
          field: 'state', 
          values: [
            { label: 'California', count: 3110, percentage: 25 },
            { label: 'New York', count: 2488, percentage: 20 },
            { label: 'Texas', count: 1866, percentage: 15 },
            { label: 'Other', count: 4986, percentage: 40 },
          ]
        },
      ],
    };
  }, [filterGroups]);

  // Generate SQL
  const generatedSQL = useMemo(() => {
    if (!selectedParent) return "";
    
    let sql = `-- DBT Model: ${audienceName || 'new_audience'}\n`;
    sql += `{{ config(materialized='table') }}\n\n`;
    sql += `WITH base AS (\n`;
    sql += `  SELECT *\n`;
    sql += `  FROM {{ ref('${selectedParent.schema}.${selectedParent.tableName}') }}\n`;
    sql += `)\n\n`;

    const conditions: string[] = [];
    
    filterGroups.forEach(fg => {
      fg.filters.forEach(filter => {
        if (filter.type === 'property' && filter.column && filter.operator && filter.value !== undefined) {
          const op = filter.operator === 'greater_than' ? '>' 
            : filter.operator === 'less_than' ? '<'
            : filter.operator === 'contains' ? 'LIKE'
            : filter.operator === 'equals' ? '='
            : '=';
          
          const val = filter.operator === 'contains' 
            ? `'%${filter.value}%'`
            : typeof filter.value === 'string' ? `'${filter.value}'` : filter.value;
          
          conditions.push(`${filter.column} ${op} ${val}`);
        }
      });
    });

    if (conditions.length > 0) {
      sql += `SELECT *\n`;
      sql += `FROM base\n`;
      sql += `WHERE ${conditions.join('\n  AND ')}\n`;
    } else {
      sql += `SELECT * FROM base\n`;
    }

    return sql;
  }, [selectedParent, filterGroups, audienceName]);

  const handleAddFilterGroup = () => {
    setFilterGroups(prev => [...prev, { id: `fg-${Date.now()}`, logic: 'AND', filters: [] }]);
  };

  const handleUpdateFilterGroup = (groupId: string, updates: Partial<FilterGroup>) => {
    setFilterGroups(prev => prev.map(fg => 
      fg.id === groupId ? { ...fg, ...updates } : fg
    ));
  };

  const handleDeleteFilterGroup = (groupId: string) => {
    setFilterGroups(prev => prev.filter(fg => fg.id !== groupId));
  };

  const handleAddFilter = (groupId: string, filter: AudienceFilter) => {
    setFilterGroups(prev => prev.map(fg => 
      fg.id === groupId 
        ? { ...fg, filters: [...fg.filters, filter] }
        : fg
    ));
  };

  const handleUpdateFilter = (groupId: string, filterId: string, updates: Partial<AudienceFilter>) => {
    setFilterGroups(prev => prev.map(fg => 
      fg.id === groupId 
        ? { ...fg, filters: fg.filters.map(f => f.id === filterId ? { ...f, ...updates } : f) }
        : fg
    ));
  };

  const handleDeleteFilter = (groupId: string, filterId: string) => {
    setFilterGroups(prev => prev.map(fg => 
      fg.id === groupId 
        ? { ...fg, filters: fg.filters.filter(f => f.id !== filterId) }
        : fg
    ));
  };

  const handleAIGenerate = useCallback((prompt: string) => {
    // Simulate AI-generated filters
    setFilterGroups([{
      id: 'fg-ai',
      logic: 'AND',
      filters: [
        { id: 'f-ai-1', type: 'property', column: 'lifetime_value', operator: 'greater_than', value: 1000 },
        { id: 'f-ai-2', type: 'property', column: 'email', operator: 'contains', value: '@gmail.com' },
      ],
    }]);
    setAudienceName(prompt.slice(0, 50));
    setShowAICopilot(false);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/people/audience-studio-dbt")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <Input
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
                  placeholder="Audience name..."
                  className="w-64 font-semibold border-0 px-0 text-lg h-8 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAICopilot(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Copilot
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSQL(!showSQL)}
              >
                {showSQL ? <Eye className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                {showSQL ? 'Preview' : 'SQL'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button 
                size="sm"
                onClick={handleRun}
                disabled={isRunning || !audienceName}
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                Run
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content - Filter Builder */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Parent Model Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Parent Model</CardTitle>
                  <CardDescription>Select the base model for this audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a parent model" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{model.displayName}</span>
                            <span className="text-muted-foreground">({model.schema}.{model.tableName})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={audienceDescription}
                    onChange={(e) => setAudienceDescription(e.target.value)}
                    placeholder="Describe this audience segment..."
                    rows={2}
                  />
                </CardContent>
              </Card>

              {/* Filter Groups */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="outline" size="sm" onClick={handleAddFilterGroup}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Group
                  </Button>
                </div>

                {filterGroups.map((group, idx) => (
                  <FilterGroupBuilder
                    key={group.id}
                    group={group}
                    parentModel={selectedParent}
                    showGroupLogic={idx > 0}
                    onUpdateGroup={(updates) => handleUpdateFilterGroup(group.id, updates)}
                    onDeleteGroup={() => handleDeleteFilterGroup(group.id)}
                    onAddFilter={(filter) => handleAddFilter(group.id, filter)}
                    onUpdateFilter={(filterId, updates) => handleUpdateFilter(group.id, filterId, updates)}
                    onDeleteFilter={(filterId) => handleDeleteFilter(group.id, filterId)}
                  />
                ))}

                {filterGroups.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">No filters added yet</p>
                      <Button variant="outline" onClick={handleAddFilterGroup}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Filter Group
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview/SQL */}
          <aside className="w-96 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">
                {showSQL ? 'Generated SQL' : 'Preview'}
              </h3>
            </div>

            {showSQL ? (
              <ScrollArea className="flex-1 p-4">
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                  {generatedSQL}
                </pre>
              </ScrollArea>
            ) : (
              <ScrollArea className="flex-1">
                {/* Audience Size */}
                <div className="p-4 border-b border-border">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{preview.count.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {preview.percentage.toFixed(1)}% of {preview.totalInParent.toLocaleString()} total
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="sample" className="flex-1">
                  <TabsList className="mx-4 mt-4 w-auto">
                    <TabsTrigger value="sample" className="text-xs">Sample</TabsTrigger>
                    <TabsTrigger value="breakdown" className="text-xs">Breakdown</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sample" className="p-4 pt-2">
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(preview.sampleData[0] || {}).map((key) => (
                              <TableHead key={key} className="text-xs whitespace-nowrap py-2">
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preview.sampleData.map((row, idx) => (
                            <TableRow key={idx}>
                              {Object.values(row).map((val, vidx) => (
                                <TableCell key={vidx} className="text-xs py-1.5">
                                  {typeof val === 'number' 
                                    ? val.toLocaleString() 
                                    : String(val)
                                  }
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Sample data (LIMIT 5)
                    </p>
                  </TabsContent>

                  <TabsContent value="breakdown" className="p-4 pt-2 space-y-4">
                    {preview.breakdowns.map((breakdown) => (
                      <div key={breakdown.field}>
                        <p className="text-sm font-medium mb-2 capitalize">{breakdown.field.replace('_', ' ')}</p>
                        <div className="space-y-2">
                          {breakdown.values.map((val) => (
                            <div key={val.label} className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>{val.label}</span>
                                  <span className="text-muted-foreground">{val.count.toLocaleString()} ({val.percentage}%)</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${val.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            )}
          </aside>
        </div>
      </div>

      <DBTAICopilot 
        open={showAICopilot} 
        onOpenChange={setShowAICopilot}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
};

export default DBTBuilder;
