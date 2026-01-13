import { useState } from "react";
import { 
  Plus, 
  Database, 
  Table2, 
  Link2, 
  Pencil, 
  Trash2, 
  ChevronRight,
  Key,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DBTParentModel, type DBTRelationship, type WarehouseTable } from "@/types/dbt-studio";
import { cn } from "@/lib/utils";

interface ParentModelSetupProps {
  parentModels: DBTParentModel[];
  warehouseTables: WarehouseTable[];
  onSaveModel: (model: DBTParentModel) => void;
  onDeleteModel: (id: string) => void;
}

export const ParentModelSetup = ({
  parentModels,
  warehouseTables,
  onSaveModel,
  onDeleteModel,
}: ParentModelSetupProps) => {
  const [expandedSchemas, setExpandedSchemas] = useState<string[]>(["ecommerce"]);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [showRelationDialog, setShowRelationDialog] = useState(false);
  const [editingModel, setEditingModel] = useState<DBTParentModel | null>(null);
  const [selectedTable, setSelectedTable] = useState<WarehouseTable | null>(null);
  const [selectedModel, setSelectedModel] = useState<DBTParentModel | null>(null);

  // Form state
  const [modelName, setModelName] = useState("");
  const [modelDisplayName, setModelDisplayName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelPrimaryKey, setModelPrimaryKey] = useState("");

  // Relation form state
  const [relationName, setRelationName] = useState("");
  const [relationTable, setRelationTable] = useState("");
  const [relationJoinType, setRelationJoinType] = useState<"one_to_one" | "one_to_many" | "many_to_one">("one_to_many");
  const [relationForeignKey, setRelationForeignKey] = useState("");
  const [relationRelatedKey, setRelationRelatedKey] = useState("");

  const groupedTables = warehouseTables.reduce((acc, table) => {
    if (!acc[table.schema]) acc[table.schema] = [];
    acc[table.schema].push(table);
    return acc;
  }, {} as Record<string, WarehouseTable[]>);

  const toggleSchema = (schema: string) => {
    setExpandedSchemas(prev => 
      prev.includes(schema) ? prev.filter(s => s !== schema) : [...prev, schema]
    );
  };

  const handleDragStart = (e: React.DragEvent, table: WarehouseTable) => {
    e.dataTransfer.setData("table", JSON.stringify(table));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tableData = e.dataTransfer.getData("table");
    if (tableData) {
      const table = JSON.parse(tableData) as WarehouseTable;
      setSelectedTable(table);
      setModelName(table.name);
      setModelDisplayName(table.name.charAt(0).toUpperCase() + table.name.slice(1));
      setModelPrimaryKey(table.columns.find(c => c.isPrimaryKey)?.name || "");
      setShowModelDialog(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleSaveModel = () => {
    if (!selectedTable) return;

    const newModel: DBTParentModel = {
      id: editingModel?.id || `pm-${Date.now()}`,
      name: modelName,
      displayName: modelDisplayName,
      tableName: selectedTable.name,
      schema: selectedTable.schema,
      primaryKey: modelPrimaryKey,
      description: modelDescription,
      columns: selectedTable.columns,
      relationships: editingModel?.relationships || [],
      status: 'draft',
      createdAt: editingModel?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveModel(newModel);
    resetForm();
    setShowModelDialog(false);
  };

  const handleAddRelation = () => {
    if (!selectedModel || !relationTable) return;

    const relatedTableData = warehouseTables.find(t => t.name === relationTable);
    if (!relatedTableData) return;

    const newRelation: DBTRelationship = {
      id: `rel-${Date.now()}`,
      name: relationName || relationTable,
      displayName: relationName || relationTable.charAt(0).toUpperCase() + relationTable.slice(1),
      relatedTable: relationTable,
      relatedSchema: relatedTableData.schema,
      joinType: relationJoinType,
      foreignKey: relationForeignKey,
      relatedKey: relationRelatedKey,
      columns: relatedTableData.columns,
    };

    const updatedModel = {
      ...selectedModel,
      relationships: [...selectedModel.relationships, newRelation],
      updatedAt: new Date().toISOString(),
    };

    onSaveModel(updatedModel);
    resetRelationForm();
    setShowRelationDialog(false);
  };

  const handleDeleteRelation = (model: DBTParentModel, relationId: string) => {
    const updatedModel = {
      ...model,
      relationships: model.relationships.filter(r => r.id !== relationId),
      updatedAt: new Date().toISOString(),
    };
    onSaveModel(updatedModel);
  };

  const resetForm = () => {
    setModelName("");
    setModelDisplayName("");
    setModelDescription("");
    setModelPrimaryKey("");
    setSelectedTable(null);
    setEditingModel(null);
  };

  const resetRelationForm = () => {
    setRelationName("");
    setRelationTable("");
    setRelationJoinType("one_to_many");
    setRelationForeignKey("");
    setRelationRelatedKey("");
    setSelectedModel(null);
  };

  const openAddRelation = (model: DBTParentModel) => {
    setSelectedModel(model);
    setRelationForeignKey(model.primaryKey);
    setShowRelationDialog(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Warehouse Tables Sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Sources
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Drag tables to create parent models</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="px-4 pb-4">
                {Object.entries(groupedTables).map(([schema, tables]) => (
                  <Collapsible 
                    key={schema}
                    open={expandedSchemas.includes(schema)}
                    onOpenChange={() => toggleSchema(schema)}
                  >
                    <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors">
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSchemas.includes(schema) && "rotate-90"
                      )} />
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>{schema}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {tables.length}
                      </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      {tables.map((table) => (
                        <div
                          key={table.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, table)}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-grab",
                            "hover:bg-accent transition-colors border border-transparent",
                            "active:cursor-grabbing active:border-primary"
                          )}
                        >
                          <Table2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 truncate">{table.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {table.rowCount?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Parent Models */}
      <div 
        className="lg:col-span-3"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Parent Models</h2>
          <Button variant="outline" onClick={() => {
            resetForm();
            setShowModelDialog(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Model
          </Button>
        </div>

        {parentModels.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Parent Models</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                Drag a table from the data sources panel or click "Add Model" to create your first parent model.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parentModels.map((model) => (
              <Card key={model.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {model.displayName}
                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {model.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {model.schema}.{model.tableName}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingModel(model);
                          setSelectedTable(warehouseTables.find(t => t.name === model.tableName) || null);
                          setModelName(model.name);
                          setModelDisplayName(model.displayName);
                          setModelDescription(model.description || "");
                          setModelPrimaryKey(model.primaryKey);
                          setShowModelDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteModel(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <Key className="w-3 h-3" />
                      {model.primaryKey}
                    </Badge>
                    <span className="text-muted-foreground">{model.columns.length} columns</span>
                  </div>

                  {/* Relationships */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Relationships</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs px-2"
                        onClick={() => openAddRelation(model)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <ScrollArea className="max-h-24">
                      <div className="space-y-1">
                        {model.relationships.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic py-1">No relationships</p>
                        ) : (
                          model.relationships.map((rel) => (
                            <div 
                              key={rel.id} 
                              className="flex items-center justify-between p-2 bg-muted/30 rounded-md group/item hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <Link2 className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium">{rel.displayName}</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {rel.joinType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/item:opacity-100 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteRelation(model, rel.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {model.description && (
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Model Dialog */}
      <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit' : 'Create'} Parent Model</DialogTitle>
            <DialogDescription>
              Define a parent model that audiences can be built from
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!selectedTable && !editingModel && (
              <div className="space-y-2">
                <Label>Source Table</Label>
                <Select onValueChange={(value) => {
                  const table = warehouseTables.find(t => t.id === value);
                  if (table) {
                    setSelectedTable(table);
                    setModelName(table.name);
                    setModelDisplayName(table.name.charAt(0).toUpperCase() + table.name.slice(1));
                    setModelPrimaryKey(table.columns.find(c => c.isPrimaryKey)?.name || "");
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseTables.map(table => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.schema}.{table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedTable && (
              <>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{selectedTable.schema}.{selectedTable.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedTable.columns.length} columns • {selectedTable.rowCount?.toLocaleString()} rows</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model Name</Label>
                    <Input 
                      value={modelName} 
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="e.g., users"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input 
                      value={modelDisplayName} 
                      onChange={(e) => setModelDisplayName(e.target.value)}
                      placeholder="e.g., Users"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Key</Label>
                  <Select value={modelPrimaryKey} onValueChange={setModelPrimaryKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary key" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTable.columns.map(col => (
                        <SelectItem key={col.name} value={col.name}>
                          {col.name} ({col.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea 
                    value={modelDescription} 
                    onChange={(e) => setModelDescription(e.target.value)}
                    placeholder="Describe this parent model..."
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setShowModelDialog(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveModel} disabled={!selectedTable || !modelName || !modelPrimaryKey}>
              {editingModel ? 'Update' : 'Create'} Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Relationship Dialog */}
      <Dialog open={showRelationDialog} onOpenChange={setShowRelationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Relationship</DialogTitle>
            <DialogDescription>
              Connect "{selectedModel?.displayName}" to a related table
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Related Table</Label>
              <Select value={relationTable} onValueChange={(value) => {
                setRelationTable(value);
                setRelationName(value);
                const table = warehouseTables.find(t => t.name === value);
                if (table) {
                  const fk = table.columns.find(c => c.name === selectedModel?.primaryKey || c.isForeignKey);
                  setRelationRelatedKey(fk?.name || "");
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {warehouseTables
                    .filter(t => t.name !== selectedModel?.tableName)
                    .map(table => (
                      <SelectItem key={table.id} value={table.name}>
                        {table.schema}.{table.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Relationship Name</Label>
              <Input 
                value={relationName} 
                onChange={(e) => setRelationName(e.target.value)}
                placeholder="e.g., orders"
              />
            </div>

            <div className="space-y-2">
              <Label>Join Type</Label>
              <Select value={relationJoinType} onValueChange={(v) => setRelationJoinType(v as typeof relationJoinType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_to_one">One to One</SelectItem>
                  <SelectItem value="one_to_many">One to Many</SelectItem>
                  <SelectItem value="many_to_one">Many to One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Foreign Key (on {selectedModel?.tableName})</Label>
                <Select value={relationForeignKey} onValueChange={setRelationForeignKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedModel?.columns.map(col => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Related Key (on {relationTable || '...'})</Label>
                <Select value={relationRelatedKey} onValueChange={setRelationRelatedKey} disabled={!relationTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseTables
                      .find(t => t.name === relationTable)
                      ?.columns.map(col => (
                        <SelectItem key={col.name} value={col.name}>
                          {col.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetRelationForm(); setShowRelationDialog(false); }}>
              Cancel
            </Button>
            <Button onClick={handleAddRelation} disabled={!relationTable || !relationForeignKey || !relationRelatedKey}>
              Add Relationship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
