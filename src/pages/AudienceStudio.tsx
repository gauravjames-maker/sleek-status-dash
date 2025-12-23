import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Database, Users, Settings, Pencil, Trash2 } from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { ParentModelCard } from "@/components/audience-studio/ParentModelCard";
import { ParentModelDialog } from "@/components/audience-studio/ParentModelDialog";
import { RelatedModelDialog } from "@/components/audience-studio/RelatedModelDialog";
import { SchemaGraph } from "@/components/audience-studio/SchemaGraph";
import { sampleParentModels, sampleRelatedModels, sampleAudiences, type ParentModel, type RelatedModel, type AudienceDefinition } from "@/types/audience-studio";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const AudienceStudio = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("audiences");
  const [searchQuery, setSearchQuery] = useState("");
  const [parentModels, setParentModels] = useState<ParentModel[]>(sampleParentModels);
  const [relatedModels, setRelatedModels] = useState<RelatedModel[]>(sampleRelatedModels);
  const [audiences] = useState<AudienceDefinition[]>(sampleAudiences);
  const [showParentDialog, setShowParentDialog] = useState(false);
  const [showRelatedDialog, setShowRelatedDialog] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentModel | null>(null);
  const [editingParent, setEditingParent] = useState<ParentModel | null>(null);
  const [editingRelated, setEditingRelated] = useState<RelatedModel | null>(null);

  const filteredAudiences = audiences.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveParentModel = (data: Omit<ParentModel, "id" | "createdAt" | "updatedAt">) => {
    if (editingParent) {
      // Update existing model
      setParentModels(prev => prev.map(m => 
        m.id === editingParent.id 
          ? { ...m, ...data, updatedAt: new Date().toISOString() }
          : m
      ));
      setEditingParent(null);
    } else {
      // Create new model
      const newModel: ParentModel = {
        ...data,
        id: `pm-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setParentModels(prev => [...prev, newModel]);
    }
  };

  const handleSaveRelatedModel = (data: Omit<RelatedModel, "id">) => {
    if (editingRelated) {
      // Update existing related model
      setRelatedModels(prev => prev.map(m =>
        m.id === editingRelated.id ? { ...m, ...data } : m
      ));
      setEditingRelated(null);
    } else {
      // Create new related model
      const newModel: RelatedModel = { ...data, id: `rm-${Date.now()}` };
      setRelatedModels(prev => [...prev, newModel]);
    }
  };

  const handleEditRelated = (model: RelatedModel) => {
    setEditingRelated(model);
    setShowRelatedDialog(true);
  };

  const handleDeleteRelated = (modelId: string) => {
    setRelatedModels(prev => prev.filter(m => m.id !== modelId));
  };

  const handleCloseRelatedDialog = (open: boolean) => {
    setShowRelatedDialog(open);
    if (!open) {
      setEditingRelated(null);
    }
  };

  const handleAddRelatedModel = (parent: ParentModel) => {
    setSelectedParent(parent);
    setEditingRelated(null);
    setShowRelatedDialog(true);
  };

  const handleEditParent = (model: ParentModel) => {
    setEditingParent(model);
    setShowParentDialog(true);
  };

  const handleCloseParentDialog = (open: boolean) => {
    setShowParentDialog(open);
    if (!open) {
      setEditingParent(null);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Audience Studio</h1>
              <p className="text-sm text-muted-foreground mt-1">Define reusable audience segments with visual filters</p>
            </div>
            <Button onClick={() => navigate("/people/audience-studio/builder")}>
              <Plus className="h-4 w-4 mr-2" />
              New Audience
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="audiences" className="gap-2"><Users className="w-4 h-4" />Audiences</TabsTrigger>
              <TabsTrigger value="schema" className="gap-2"><Database className="w-4 h-4" />Schema Config</TabsTrigger>
            </TabsList>

            <TabsContent value="audiences">
              <div className="mb-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search audiences..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Parent Model</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudiences.map((audience) => (
                      <TableRow key={audience.id} className="cursor-pointer hover:bg-accent" onClick={() => navigate(`/people/audience-studio/builder?id=${audience.id}`)}>
                        <TableCell className="font-medium">{audience.name}</TableCell>
                        <TableCell>{audience.parentModelName}</TableCell>
                        <TableCell><Badge variant="outline">{audience.filterMode}</Badge></TableCell>
                        <TableCell>{audience.estimatedSize.toLocaleString()}</TableCell>
                        <TableCell><Badge variant={audience.status === "active" ? "default" : "secondary"}>{audience.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="schema">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Parent Models</h2>
                <Button onClick={() => setShowParentDialog(true)}><Plus className="w-4 h-4 mr-2" />Add Parent Model</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {parentModels.map((model) => {
                  const modelRelatedModels = relatedModels.filter(rm => rm.parentModelId === model.id);
                  return (
                    <Card key={model.id} className="relative group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{model.displayName}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">{model.tableName}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditParent(model)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Badge variant="outline" className="text-xs">PK: {model.primaryKey}</Badge>
                          <span>{modelRelatedModels.length} related models</span>
                        </div>
                        
                        {/* Related Models List */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Related Models</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs px-2"
                              onClick={() => handleAddRelatedModel(model)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <ScrollArea className="max-h-32">
                            <div className="space-y-1">
                              {modelRelatedModels.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic py-2">No related models yet</p>
                              ) : (
                                modelRelatedModels.map((rm) => (
                                  <div 
                                    key={rm.id} 
                                    className="flex items-center justify-between p-2 bg-muted/30 rounded-md group/item hover:bg-muted/50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Database className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs font-medium">{rm.displayName}</span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {rm.joinType}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => handleEditRelated(rm)}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteRelated(rm.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3 text-xs"
                          onClick={() => setSelectedParent(model)}
                        >
                          View Relationship Graph
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {selectedParent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{selectedParent.displayName} - Relationships</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleAddRelatedModel(selectedParent)}>
                        <Plus className="w-4 h-4 mr-2" />Add Related Model
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedParent(null)}>Close</Button>
                    </div>
                  </div>
                  <SchemaGraph parentModel={selectedParent} relatedModels={relatedModels.filter(rm => rm.parentModelId === selectedParent.id)} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ParentModelDialog open={showParentDialog} onOpenChange={handleCloseParentDialog} model={editingParent} onSave={handleSaveParentModel} />
      {selectedParent && (
        <RelatedModelDialog 
          open={showRelatedDialog} 
          onOpenChange={handleCloseRelatedDialog} 
          parentModel={selectedParent} 
          model={editingRelated}
          onSave={handleSaveRelatedModel} 
        />
      )}
    </div>
  );
};

export default AudienceStudio;
