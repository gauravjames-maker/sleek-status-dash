import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link2, ArrowRight, Clock } from "lucide-react";
import type { RelatedModel, ParentModel } from "@/types/audience-studio";
import { mockWarehouseTables } from "@/types/audience-studio";

interface RelatedModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentModel: ParentModel;
  model?: RelatedModel | null;
  onSave: (model: Omit<RelatedModel, "id">) => void;
}

export const RelatedModelDialog = ({
  open,
  onOpenChange,
  parentModel,
  model,
  onSave,
}: RelatedModelDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    tableName: "",
    joinType: "1:many" as "1:1" | "1:many" | "many:many",
    joinColumn: "",
    parentJoinColumn: parentModel.primaryKey,
    timestampColumn: "",
    description: "",
  });

  const selectedTable = mockWarehouseTables.find(t => t.name === formData.tableName);
  const parentTable = mockWarehouseTables.find(t => t.name === parentModel.tableName);

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        displayName: model.displayName,
        tableName: model.tableName,
        joinType: model.joinType,
        joinColumn: model.joinColumn,
        parentJoinColumn: model.parentJoinColumn,
        timestampColumn: model.timestampColumn || "",
        description: model.description,
      });
    } else {
      setFormData({
        name: "",
        displayName: "",
        tableName: "",
        joinType: "1:many",
        joinColumn: "",
        parentJoinColumn: parentModel.primaryKey,
        timestampColumn: "",
        description: "",
      });
    }
  }, [model, open, parentModel]);

  const handleTableSelect = (tableName: string) => {
    const table = mockWarehouseTables.find(t => t.name === tableName);
    const fk = table?.columns.find(c => c.isForeignKey)?.name || "";
    const ts = table?.columns.find(c => c.type === "timestamp" && c.name !== "created_at")?.name || "";
    
    setFormData(prev => ({
      ...prev,
      tableName,
      name: tableName,
      displayName: tableName.charAt(0).toUpperCase() + tableName.slice(1).replace(/_/g, " "),
      joinColumn: fk,
      timestampColumn: ts,
    }));
  };

  const handleSave = () => {
    onSave({
      parentModelId: parentModel.id,
      ...formData,
    });
    onOpenChange(false);
  };

  const isValid = formData.tableName && formData.joinColumn && formData.displayName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            {model ? "Edit Related Model" : "Add Related Model"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Parent info */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Linking to parent model:</p>
            <p className="font-medium text-foreground">{parentModel.displayName} ({parentModel.tableName})</p>
          </div>

          {/* Table Selection */}
          <div className="space-y-2">
            <Label>Event/Related Table</Label>
            <Select value={formData.tableName} onValueChange={handleTableSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table to link" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {mockWarehouseTables
                  .filter(t => t.name !== parentModel.tableName)
                  .map((table) => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show columns preview */}
          {selectedTable && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2">Table Columns</p>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2">
                  {selectedTable.columns.map((col) => (
                    <Badge 
                      key={col.name} 
                      variant={col.isForeignKey ? "default" : "outline"}
                      className="text-xs"
                    >
                      {col.name}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Display Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="e.g., Purchases"
              />
            </div>
            <div className="space-y-2">
              <Label>Join Type</Label>
              <Select 
                value={formData.joinType} 
                onValueChange={(v: "1:1" | "1:many" | "many:many") => setFormData(prev => ({ ...prev, joinType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="1:1">One-to-One</SelectItem>
                  <SelectItem value="1:many">One-to-Many (Events)</SelectItem>
                  <SelectItem value="many:many">Many-to-Many</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Join Configuration */}
          <div className="space-y-2">
            <Label>Join Keys</Label>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{parentModel.tableName}</p>
                <Select 
                  value={formData.parentJoinColumn} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, parentJoinColumn: v }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {parentTable?.columns.map((col) => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{formData.tableName || "Select table"}</p>
                <Select 
                  value={formData.joinColumn} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, joinColumn: v }))}
                  disabled={!selectedTable}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select join key" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {selectedTable?.columns.map((col) => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timestamp Column */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Timestamp Column (for time-based filters)
            </Label>
            <Select 
              value={formData.timestampColumn} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, timestampColumn: v }))}
              disabled={!selectedTable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional: select timestamp column" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">None</SelectItem>
                {selectedTable?.columns
                  .filter(c => c.type === "timestamp")
                  .map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this event/relationship..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {model ? "Save Changes" : "Add Related Model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
