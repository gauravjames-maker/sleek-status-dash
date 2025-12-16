import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { Plus, Trash2, GripVertical, Users, Search, Zap, Link2, UserCheck, Box, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterCondition {
  id: string;
  type: "property" | "event" | "relation" | "computed";
  field: string;
  operator: string;
  value: string;
  timeConstraint?: string;
}

export interface FilterGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

interface FilterBuilderProps {
  availableFields: { table: string; column: string; type: string }[];
  filterGroups: FilterGroup[];
  onFilterGroupsChange: (groups: FilterGroup[]) => void;
}

const FILTER_TYPES = [
  { id: "property", label: "Property", description: "Filter by field value", icon: Box, color: "bg-purple-500" },
  { id: "event", label: "Event", description: "Filter by actions performed", icon: Zap, color: "bg-blue-500" },
  { id: "relation", label: "Relation", description: "Filter by related records", icon: Link2, color: "bg-green-500" },
  { id: "computed", label: "Computed", description: "Aggregates like count, sum", icon: Hash, color: "bg-amber-500" },
];

const OPERATORS = [
  { value: "=", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: "<", label: "less than" },
  { value: ">=", label: "≥" },
  { value: "<=", label: "≤" },
  { value: "CONTAINS", label: "contains" },
  { value: "IN", label: "in list" },
  { value: "IS NULL", label: "is empty" },
  { value: "IS NOT NULL", label: "has value" },
];

const TIME_CONSTRAINTS = [
  { value: "", label: "Any time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export const FilterBuilder = ({
  availableFields,
  filterGroups,
  onFilterGroupsChange,
}: FilterBuilderProps) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("property");
  const [fieldSearch, setFieldSearch] = useState("");

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addCondition = (type: FilterCondition["type"], field: string) => {
    const newCondition: FilterCondition = {
      id: generateId(),
      type,
      field,
      operator: "=",
      value: "",
    };

    if (filterGroups.length === 0) {
      onFilterGroupsChange([
        { id: generateId(), logic: "AND", conditions: [newCondition] },
      ]);
    } else {
      const updatedGroups = filterGroups.map((g, i) =>
        i === filterGroups.length - 1
          ? { ...g, conditions: [...g.conditions, newCondition] }
          : g
      );
      onFilterGroupsChange(updatedGroups);
    }
    setFilterMenuOpen(false);
    setFieldSearch("");
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter((c) => c.id !== conditionId) }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );
    onFilterGroupsChange(updateGroups(filterGroups));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.map((c) =>
                c.id === conditionId ? { ...c, ...updates } : c
              ),
            }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );
    onFilterGroupsChange(updateGroups(filterGroups));
  };

  const toggleGroupLogic = (groupId: string) => {
    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === groupId
          ? { ...g, logic: g.logic === "AND" ? "OR" : "AND" }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );
    onFilterGroupsChange(updateGroups(filterGroups));
  };

  const filteredFields = availableFields.filter(
    (f) =>
      fieldSearch === "" ||
      f.column.toLowerCase().includes(fieldSearch.toLowerCase()) ||
      f.table.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const config = FILTER_TYPES.find((t) => t.id === type);
    return config?.icon || Box;
  };

  const getTypeColor = (type: string) => {
    const config = FILTER_TYPES.find((t) => t.id === type);
    return config?.color || "bg-gray-500";
  };

  const renderCondition = (group: FilterGroup, condition: FilterCondition, index: number) => {
    const TypeIcon = getTypeIcon(condition.type);

    return (
      <div key={condition.id} className="animate-fade-in">
        {/* AND/OR Connector */}
        {index > 0 && (
          <div className="flex items-center gap-2 py-2 pl-4">
            <button
              onClick={() => toggleGroupLogic(group.id)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
                group.logic === "AND"
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
              )}
            >
              {group.logic}
            </button>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Condition Card */}
        <div className="group relative bg-muted/30 border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <div className="pt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Type indicator */}
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white", getTypeColor(condition.type))}>
              <TypeIcon className="w-4 h-4" />
            </div>

            {/* Condition content */}
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {/* Field */}
              <Badge variant="outline" className="h-8 px-3 font-medium bg-card">
                {condition.field || "Select field"}
              </Badge>

              {/* Operator */}
              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(group.id, condition.id, { operator: value })}
              >
                <SelectTrigger className="w-auto h-8 px-3 text-sm bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value */}
              {!["IS NULL", "IS NOT NULL"].includes(condition.operator) && (
                <Input
                  placeholder="Enter value..."
                  value={condition.value}
                  onChange={(e) => updateCondition(group.id, condition.id, { value: e.target.value })}
                  className="w-40 h-8 text-sm bg-card"
                />
              )}

              {/* Time constraint for events */}
              {condition.type === "event" && (
                <Select
                  value={condition.timeConstraint || ""}
                  onValueChange={(value) => updateCondition(group.id, condition.id, { timeConstraint: value })}
                >
                  <SelectTrigger className="w-auto h-8 px-3 text-sm bg-card border-border">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {TIME_CONSTRAINTS.map((tc) => (
                      <SelectItem key={tc.value} value={tc.value}>
                        {tc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeCondition(group.id, condition.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Conditions */}
      {filterGroups.length > 0 && (
        <div className="space-y-0">
          {filterGroups.map((group) => (
            <div key={group.id} className="space-y-0">
              {group.conditions.map((condition, index) =>
                renderCondition(group, condition, index)
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filterGroups.length === 0 && (
        <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-lg bg-muted/20">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">No conditions defined yet</p>
          <p className="text-xs text-muted-foreground">Add filters to define your audience</p>
        </div>
      )}

      {/* Add filter button */}
      <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 border-dashed">
            <Plus className="w-4 h-4" />
            Add Condition
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0 bg-popover" align="start" sideOffset={8}>
          <div className="flex divide-x divide-border">
            {/* Filter types */}
            <div className="w-48 p-2">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Filter Type
              </p>
              {FILTER_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors",
                      selectedType === type.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded flex items-center justify-center text-white", type.color)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fields list */}
            <div className="flex-1">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search fields..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-auto p-2">
                {filteredFields.length > 0 ? (
                  filteredFields.map((field) => (
                    <button
                      key={`${field.table}.${field.column}`}
                      onClick={() => addCondition(selectedType as FilterCondition["type"], `${field.table}.${field.column}`)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 text-left"
                    >
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{field.table}.</span>
                      <span className="text-sm font-medium">{field.column}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{field.type}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No fields found</p>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
