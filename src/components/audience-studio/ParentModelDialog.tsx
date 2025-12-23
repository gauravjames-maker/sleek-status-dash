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
import { Database, Key, Tag } from "lucide-react";
import type { ParentModel } from "@/types/audience-studio";
import { mockWarehouseTables } from "@/types/audience-studio";

interface ParentModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: ParentModel | null;
  onSave: (model: Omit<ParentModel, "id" | "createdAt" | "updatedAt">) => void;
}

export const ParentModelDialog = ({
  open,
  onOpenChange,
  model,
  onSave,
}: ParentModelDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    tableName: "",
    primaryKey: "",
    displayLabel: "",
    description: "",
  });

  const selectedTable = mockWarehouseTables.find(t => t.name === formData.tableName);

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        displayName: model.displayName,
        tableName: model.tableName,
        primaryKey: model.primaryKey,
        displayLabel: model.displayLabel,
        description: model.description,
      });
    } else {
      setFormData({
        name: "",
        displayName: "",
        tableName: "",
        primaryKey: "",
        displayLabel: "",
        description: "",
      });
    }
  }, [model, open]);

  const handleTableSelect = (tableName: string) => {
    const table = mockWarehouseTables.find(t => t.name === tableName);
    const pk = table?.columns.find(c => c.isPrimaryKey)?.name || "";
    setFormData(prev => ({
      ...prev,
      tableName,
      name: tableName,
      displayName: tableName.charAt(0).toUpperCase() + tableName.slice(1).replace(/_/g, " "),
      primaryKey: pk,
      displayLabel: table?.columns.find(c => c.name === "email" || c.name === "name")?.name || pk,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const isValid = formData.tableName && formData.primaryKey && formData.displayName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            {model ? "Edit Parent Model" : "Create Parent Model"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Table Selection */}
          <div className="space-y-2">
            <Label>Warehouse Table</Label>
            <Select value={formData.tableName} onValueChange={handleTableSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table from your warehouse" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {mockWarehouseTables.map((table) => (
                  <SelectItem key={table.name} value={table.name}>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      {table.name}
                      <span className="text-muted-foreground text-xs">
                        ({table.columns.length} columns)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show columns preview */}
          {selectedTable && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm font-medium mb-2">Table Columns</p>
              <ScrollArea className="h-32">
                <div className="flex flex-wrap gap-2">
                  {selectedTable.columns.map((col) => (
                    <Badge 
                      key={col.name} 
                      variant={col.isPrimaryKey ? "default" : "outline"}
                      className="text-xs gap-1"
                    >
                      {col.isPrimaryKey && <Key className="w-3 h-3" />}
                      {col.name}
                      <span className="text-muted-foreground ml-1">{col.type}</span>
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
                placeholder="e.g., Users"
              />
            </div>
            <div className="space-y-2">
              <Label>Internal Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., users"
              />
            </div>
          </div>

          {/* Primary Key & Display Label */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                Primary Key
              </Label>
              <Select 
                value={formData.primaryKey} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, primaryKey: v }))}
                disabled={!selectedTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary key" />
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
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Display Label
              </Label>
              <Select 
                value={formData.displayLabel} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, displayLabel: v }))}
                disabled={!selectedTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Column shown in previews" />
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

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this model represents..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {model ? "Save Changes" : "Create Model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
