import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Trash2, X, MoreHorizontal, Users, Globe, Link2, UserCheck, Route, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterCondition {
  id: string;
  type: "property" | "relation" | "event" | "audience" | "journey" | "trait";
  field: string;
  operator: string;
  value: string;
  valueType?: "text" | "number" | "date";
  timeConstraint?: {
    type: "within" | "between";
    value: string;
  };
  frequency?: {
    operator: string;
    value: number;
  };
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
  { id: "all", label: "All filters", description: "View all available filters", icon: Globe, color: "bg-[hsl(162,72%,40%)]" },
  { id: "property", label: "Properties", description: "Filter by a person's attributes", icon: UserCheck, color: "bg-purple-500" },
  { id: "relation", label: "Relations", description: "Filter by a relationship to other entities", icon: Link2, color: "bg-green-500" },
  { id: "event", label: "Events", description: "Filter by an event they've performed", icon: Sparkles, color: "bg-blue-500" },
  { id: "audience", label: "Audiences", description: "Filter by whether they're included in another audience", icon: Users, color: "bg-indigo-500" },
  { id: "journey", label: "Journeys", description: "Filter by whether they're in a journey", icon: Route, color: "bg-cyan-500" },
  { id: "trait", label: "Custom traits", description: "Filter by your organization's custom attributes", icon: Sparkles, color: "bg-amber-500" },
];

const OPERATORS = [
  { value: "=", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: "<", label: "less than" },
  { value: ">=", label: "greater or equal" },
  { value: "<=", label: "less or equal" },
  { value: "IN", label: "in list" },
  { value: "CONTAINS", label: "contains" },
  { value: "IS NULL", label: "is empty" },
  { value: "IS NOT NULL", label: "is not empty" },
];

const FREQUENCY_OPERATORS = [
  { value: "at_least", label: "at least" },
  { value: "at_most", label: "at most" },
  { value: "exactly", label: "exactly" },
];

export const FilterBuilder = ({
  availableFields,
  filterGroups,
  onFilterGroupsChange,
}: FilterBuilderProps) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState("all");
  const [fieldSearch, setFieldSearch] = useState("");

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addCondition = (type: FilterCondition["type"], field: string) => {
    const newCondition: FilterCondition = {
      id: generateId(),
      type,
      field,
      operator: type === "event" ? "at_least" : "=",
      value: type === "event" ? "1" : "",
      frequency: type === "event" ? { operator: "at_least", value: 1 } : undefined,
    };

    if (filterGroups.length === 0) {
      onFilterGroupsChange([
        {
          id: generateId(),
          logic: "AND",
          conditions: [newCondition],
        },
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
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.filter((c) => c.id !== conditionId),
            }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );

    onFilterGroupsChange(updateGroups(filterGroups));
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => {
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

  const filteredFields = availableFields.filter(f =>
    fieldSearch === "" || 
    f.column.toLowerCase().includes(fieldSearch.toLowerCase()) ||
    f.table.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  const getConditionTypeLabel = (type: FilterCondition["type"]) => {
    switch (type) {
      case "event": return "Performed";
      case "property": return "Has property";
      case "relation": return "Has relation";
      case "audience": return "Is in";
      case "journey": return "Is in";
      case "trait": return "Has trait";
      default: return "Has";
    }
  };

  const renderCondition = (
    group: FilterGroup,
    condition: FilterCondition,
    index: number
  ) => {
    const typeConfig = FILTER_TYPES.find(t => t.id === condition.type) || FILTER_TYPES[1];
    const TypeIcon = typeConfig.icon;

    return (
      <div key={condition.id} className="relative">
        {/* AND/OR connector */}
        {index > 0 && (
          <div className="py-2">
            <button
              onClick={() => toggleGroupLogic(group.id)}
              className="px-3 py-1 text-sm font-medium bg-white border border-border rounded shadow-sm hover:bg-muted/50"
            >
              {group.logic}
            </button>
          </div>
        )}

        {/* Filter Card */}
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          {/* Left accent bar */}
          <div className="flex">
            <div className="w-1 bg-[hsl(162,72%,50%)]" />
            <div className="flex-1 p-4">
              {/* Main condition row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{getConditionTypeLabel(condition.type)}</span>
                
                {/* Field badge */}
                <Badge 
                  variant="outline" 
                  className="h-8 px-3 gap-2 bg-white border-border hover:bg-muted/30 cursor-default"
                >
                  <TypeIcon className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{condition.field || "Select field"}</span>
                </Badge>

                {/* Frequency (for events) */}
                {condition.type === "event" && (
                  <Badge 
                    variant="outline" 
                    className="h-8 px-3 bg-white border-border"
                  >
                    <Select
                      value={condition.frequency?.operator || "at_least"}
                      onValueChange={(value) =>
                        updateCondition(group.id, condition.id, {
                          frequency: { ...condition.frequency!, operator: value },
                        })
                      }
                    >
                      <SelectTrigger className="border-0 h-6 w-auto p-0 shadow-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {FREQUENCY_OPERATORS.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={condition.frequency?.value || 1}
                      onChange={(e) =>
                        updateCondition(group.id, condition.id, {
                          frequency: { ...condition.frequency!, value: parseInt(e.target.value) || 1 },
                        })
                      }
                      className="border-0 h-6 w-12 p-0 shadow-none focus-visible:ring-0 text-center"
                    />
                    <span className="text-sm">time</span>
                  </Badge>
                )}

                {/* Operator and value (for properties) */}
                {condition.type === "property" && (
                  <>
                    <Badge 
                      variant="outline" 
                      className="h-8 px-3 bg-white border-border"
                    >
                      <Select
                        value={condition.operator}
                        onValueChange={(value) =>
                          updateCondition(group.id, condition.id, { operator: value })
                        }
                      >
                        <SelectTrigger className="border-0 h-6 w-auto p-0 shadow-none focus:ring-0">
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
                      {!["IS NULL", "IS NOT NULL"].includes(condition.operator) && (
                        <Input
                          placeholder="value"
                          value={condition.value}
                          onChange={(e) =>
                            updateCondition(group.id, condition.id, { value: e.target.value })
                          }
                          className="border-0 h-6 w-32 p-0 shadow-none focus-visible:ring-0"
                        />
                      )}
                    </Badge>
                  </>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive/70 hover:text-destructive"
                    onClick={() => removeCondition(group.id, condition.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Time constraint row */}
              {condition.timeConstraint && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="h-7 px-3 bg-white border-border gap-2"
                  >
                    <span>Within</span>
                    <span className="font-medium">{condition.timeConstraint.value}</span>
                    <button
                      onClick={() =>
                        updateCondition(group.id, condition.id, { timeConstraint: undefined })
                      }
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </div>
              )}

              {/* Additional options */}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                {condition.type === "event" && (
                  <>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <Plus className="w-3.5 h-3.5" />
                      Where event property is...
                    </button>
                    <span className="text-border">|</span>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <span className="text-muted-foreground">≡</span>
                      Then performed...
                    </button>
                  </>
                )}
              </div>

              {/* Calculate size */}
              <div className="mt-3 pt-3 border-t border-border">
                <button className="flex items-center gap-2 text-sm text-[hsl(162,72%,40%)] hover:text-[hsl(162,72%,30%)]">
                  <Users className="w-4 h-4" />
                  Calculate size
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Include in audience if...</h3>
      
      {filterGroups.map((group) => (
        <div key={group.id} className="space-y-0">
          {group.conditions.map((condition, index) =>
            renderCondition(group, condition, index)
          )}
        </div>
      ))}

      {/* Final AND connector and Add filter button */}
      {filterGroups.length > 0 && filterGroups[0].conditions.length > 0 && (
        <div className="py-2">
          <button
            onClick={() => filterGroups[0] && toggleGroupLogic(filterGroups[0].id)}
            className="px-3 py-1 text-sm font-medium bg-white border border-border rounded shadow-sm hover:bg-muted/50"
          >
            {filterGroups[0]?.logic || "AND"}
          </button>
        </div>
      )}

      {/* Add filter button */}
      <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 bg-[hsl(162,72%,95%)] border-[hsl(162,72%,80%)] text-[hsl(162,72%,30%)] hover:bg-[hsl(162,72%,90%)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add filter
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[700px] p-0 bg-popover" 
          align="start"
          sideOffset={8}
        >
          <div className="flex divide-x divide-border">
            {/* Filter types */}
            <div className="w-60 py-2">
              {FILTER_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedFilterType(type.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 text-left",
                      selectedFilterType === type.id && "bg-muted/50"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", type.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={cn("text-sm font-medium", selectedFilterType === type.id && "text-[hsl(162,72%,40%)]")}>
                        {type.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fields list */}
            <div className="flex-1">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search all filters..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="pl-9 h-9 bg-muted/30 border-0"
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-auto py-2">
                {filteredFields.map((field) => (
                  <button
                    key={`${field.table}.${field.column}`}
                    onClick={() => addCondition(
                      selectedFilterType === "all" ? "property" : selectedFilterType as FilterCondition["type"],
                      `${field.table}.${field.column}`
                    )}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 text-left"
                  >
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="text-sm">{field.column.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview panel */}
            <div className="w-60 p-6 flex flex-col items-center justify-center text-center bg-muted/20">
              <div className="mb-4">
                <svg width="120" height="80" viewBox="0 0 120 80" className="text-[hsl(162,72%,80%)]">
                  <rect x="10" y="10" width="40" height="60" rx="4" fill="currentColor" opacity="0.3" />
                  <rect x="55" y="10" width="55" height="15" rx="2" fill="currentColor" opacity="0.5" />
                  <rect x="55" y="30" width="45" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  <rect x="55" y="45" width="50" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  <rect x="55" y="60" width="40" height="10" rx="2" fill="currentColor" opacity="0.3" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Hover on a filter to view its details</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
