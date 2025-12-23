import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Search, User, Calendar, Hash, Type, ToggleLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  FilterGroup, 
  PropertyFilter, 
  EventFilter, 
  ParentModel, 
  RelatedModel 
} from "@/types/audience-studio";
import { mockWarehouseTables } from "@/types/audience-studio";

interface ManualFilterBuilderProps {
  parentModel: ParentModel;
  relatedModels: RelatedModel[];
  filters: FilterGroup;
  onFiltersChange: (filters: FilterGroup) => void;
}

const PROPERTY_OPERATORS = [
  { value: "=", label: "equals", icon: "=" },
  { value: "!=", label: "not equals", icon: "≠" },
  { value: ">", label: "greater than", icon: ">" },
  { value: "<", label: "less than", icon: "<" },
  { value: ">=", label: "greater or equal", icon: "≥" },
  { value: "<=", label: "less or equal", icon: "≤" },
  { value: "contains", label: "contains", icon: "∋" },
  { value: "starts_with", label: "starts with", icon: "^" },
  { value: "ends_with", label: "ends with", icon: "$" },
  { value: "is_null", label: "is empty", icon: "∅" },
  { value: "is_not_null", label: "is not empty", icon: "∃" },
];

const TIME_WINDOWS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

export const ManualFilterBuilder = ({
  parentModel,
  relatedModels,
  filters,
  onFiltersChange,
}: ManualFilterBuilderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const parentTable = mockWarehouseTables.find(t => t.name === parentModel.tableName);
  const parentColumns = parentTable?.columns || [];

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const getColumnIcon = (type: string) => {
    switch (type) {
      case "varchar": return <Type className="w-3.5 h-3.5" />;
      case "integer":
      case "decimal": return <Hash className="w-3.5 h-3.5" />;
      case "timestamp": return <Calendar className="w-3.5 h-3.5" />;
      case "boolean": return <ToggleLeft className="w-3.5 h-3.5" />;
      default: return <Type className="w-3.5 h-3.5" />;
    }
  };

  // Add property filter
  const addPropertyFilter = (column: { name: string; type: string }) => {
    const newFilter: PropertyFilter = {
      id: generateId(),
      field: column.name,
      operator: "=",
      value: "",
      valueType: column.type === "integer" || column.type === "decimal" ? "number" : 
                 column.type === "timestamp" ? "date" : 
                 column.type === "boolean" ? "boolean" : "text",
    };
    onFiltersChange({
      ...filters,
      propertyFilters: [...filters.propertyFilters, newFilter],
    });
  };

  // Update property filter
  const updatePropertyFilter = (id: string, updates: Partial<PropertyFilter>) => {
    onFiltersChange({
      ...filters,
      propertyFilters: filters.propertyFilters.map(f => 
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  // Remove property filter
  const removePropertyFilter = (id: string) => {
    onFiltersChange({
      ...filters,
      propertyFilters: filters.propertyFilters.filter(f => f.id !== id),
    });
  };

  // Add event filter
  const addEventFilter = (relatedModel: RelatedModel) => {
    const newFilter: EventFilter = {
      id: generateId(),
      relatedModelId: relatedModel.id,
      relatedModelName: relatedModel.displayName,
      hasEvent: true,
      timeWindow: { type: "last_days", days: 30 },
      properties: [],
    };
    onFiltersChange({
      ...filters,
      eventFilters: [...filters.eventFilters, newFilter],
    });
  };

  // Update event filter
  const updateEventFilter = (id: string, updates: Partial<EventFilter>) => {
    onFiltersChange({
      ...filters,
      eventFilters: filters.eventFilters.map(f => 
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  // Remove event filter
  const removeEventFilter = (id: string) => {
    onFiltersChange({
      ...filters,
      eventFilters: filters.eventFilters.filter(f => f.id !== id),
    });
  };

  // Toggle logic
  const toggleLogic = () => {
    onFiltersChange({
      ...filters,
      logic: filters.logic === "AND" ? "OR" : "AND",
    });
  };

  const filteredColumns = parentColumns.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Parent Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{parentModel.displayName} Properties</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 bg-popover" align="end">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search columns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="h-48">
                <div className="p-1">
                  {filteredColumns.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        addPropertyFilter(col);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-left"
                    >
                      {getColumnIcon(col.type)}
                      <span>{col.name}</span>
                      <span className="text-muted-foreground text-xs ml-auto">{col.type}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        {/* Property Filters */}
        {filters.propertyFilters.length > 0 && (
          <div className="space-y-2">
            {filters.propertyFilters.map((filter, index) => (
              <Card key={filter.id} className="p-3 bg-card">
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-6 px-2 text-xs font-medium",
                        filters.logic === "AND" 
                          ? "bg-primary/10 text-primary border-primary/30" 
                          : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                      )}
                      onClick={toggleLogic}
                    >
                      {filters.logic}
                    </Button>
                  )}
                  
                  <Badge variant="outline" className="font-mono text-xs">
                    {filter.field}
                  </Badge>

                  <Select
                    value={filter.operator}
                    onValueChange={(v) => updatePropertyFilter(filter.id, { operator: v })}
                  >
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {PROPERTY_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!["is_null", "is_not_null"].includes(filter.operator) && (
                    <Input
                      value={String(filter.value)}
                      onChange={(e) => updatePropertyFilter(filter.id, { 
                        value: filter.valueType === "number" ? Number(e.target.value) : e.target.value 
                      })}
                      placeholder="Value"
                      type={filter.valueType === "number" ? "number" : filter.valueType === "date" ? "date" : "text"}
                      className="w-32 h-8 text-sm"
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive ml-auto"
                    onClick={() => removePropertyFilter(filter.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Event Conditions</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add Event
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-popover" align="end">
              <div className="p-1">
                {relatedModels.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => addEventFilter(rm)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-left"
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{rm.displayName}</span>
                  </button>
                ))}
                {relatedModels.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No events configured</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Event Filters */}
        {filters.eventFilters.length > 0 && (
          <div className="space-y-2">
            {filters.eventFilters.map((filter, index) => (
              <Card key={filter.id} className="p-4 bg-card border-l-4 border-l-primary/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {index > 0 && filters.propertyFilters.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-6 px-2 text-xs font-medium",
                          filters.logic === "AND" 
                            ? "bg-primary/10 text-primary border-primary/30" 
                            : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                        )}
                        onClick={toggleLogic}
                      >
                        {filters.logic}
                      </Button>
                    )}
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {filter.relatedModelName}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeEventFilter(filter.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-foreground">User</span>
                  <Select
                    value={filter.hasEvent ? "has" : "has_not"}
                    onValueChange={(v) => updateEventFilter(filter.id, { hasEvent: v === "has" })}
                  >
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="has">has performed</SelectItem>
                      <SelectItem value="has_not">has NOT performed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <span className="text-sm text-muted-foreground">{filter.relatedModelName}</span>
                  
                  <span className="text-sm text-foreground">in</span>
                  
                  <Select
                    value={String(filter.timeWindow.days || "30")}
                    onValueChange={(v) => updateEventFilter(filter.id, { 
                      timeWindow: { type: "last_days", days: parseInt(v) }
                    })}
                  >
                    <SelectTrigger className="w-36 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {TIME_WINDOWS.map((tw) => (
                        <SelectItem key={tw.value} value={tw.value}>
                          {tw.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event property filters (optional) */}
                {filter.properties.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">With properties:</p>
                    {/* Property filter UI would go here */}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {filters.propertyFilters.length === 0 && filters.eventFilters.length === 0 && (
        <Card className="p-8 border-2 border-dashed text-center">
          <p className="text-muted-foreground mb-2">No filters defined</p>
          <p className="text-sm text-muted-foreground">
            Add property filters or event conditions to define your audience
          </p>
        </Card>
      )}
    </div>
  );
};
