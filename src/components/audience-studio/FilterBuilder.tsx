import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  valueType?: "text" | "number" | "date";
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

const OPERATORS = [
  { value: "=", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: "<", label: "less than" },
  { value: ">=", label: "greater or equal" },
  { value: "<=", label: "less or equal" },
  { value: "IN", label: "in list" },
  { value: "NOT IN", label: "not in list" },
  { value: "BETWEEN", label: "between" },
  { value: "CONTAINS", label: "contains" },
  { value: "STARTS WITH", label: "starts with" },
  { value: "IS NULL", label: "is empty" },
  { value: "IS NOT NULL", label: "is not empty" },
];

const TIME_OPERATORS = [
  { value: "LAST_DAYS", label: "in last X days" },
  { value: "BETWEEN_DATES", label: "between dates" },
];

const AGGREGATE_OPERATORS = [
  { value: "COUNT >=", label: "count ≥" },
  { value: "COUNT <=", label: "count ≤" },
  { value: "SUM >=", label: "sum ≥" },
  { value: "SUM <=", label: "sum ≤" },
  { value: "AVG >=", label: "avg ≥" },
  { value: "AVG <=", label: "avg ≤" },
];

export const FilterBuilder = ({
  availableFields,
  filterGroups,
  onFilterGroupsChange,
}: FilterBuilderProps) => {
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: generateId(),
      field: "",
      operator: "=",
      value: "",
    };

    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, newCondition] }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );

    onFilterGroupsChange(updateGroups(filterGroups));
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

  const addNestedGroup = (parentId: string) => {
    const newGroup: FilterGroup = {
      id: generateId(),
      logic: "AND",
      conditions: [],
    };

    const updateGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups.map((g) =>
        g.id === parentId
          ? { ...g, groups: [...(g.groups || []), newGroup] }
          : { ...g, groups: g.groups ? updateGroups(g.groups) : undefined }
      );

    onFilterGroupsChange(updateGroups(filterGroups));
  };

  const removeGroup = (groupId: string) => {
    const removeFromGroups = (groups: FilterGroup[]): FilterGroup[] =>
      groups
        .filter((g) => g.id !== groupId)
        .map((g) => ({
          ...g,
          groups: g.groups ? removeFromGroups(g.groups) : undefined,
        }));

    onFilterGroupsChange(removeFromGroups(filterGroups));
  };

  const renderCondition = (
    groupId: string,
    condition: FilterCondition,
    index: number
  ) => (
    <div
      key={condition.id}
      className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
    >
      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

      <Select
        value={condition.field}
        onValueChange={(value) =>
          updateCondition(groupId, condition.id, { field: value })
        }
      >
        <SelectTrigger className="w-[180px] h-8 text-sm">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {availableFields.map((f) => (
            <SelectItem
              key={`${f.table}.${f.column}`}
              value={`${f.table}.${f.column}`}
            >
              {f.table}.{f.column}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(value) =>
          updateCondition(groupId, condition.id, { operator: value })
        }
      >
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Comparison
          </div>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t">
            Time
          </div>
          {TIME_OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t">
            Aggregate
          </div>
          {AGGREGATE_OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!["IS NULL", "IS NOT NULL"].includes(condition.operator) && (
        <Input
          placeholder="Value"
          value={condition.value}
          onChange={(e) =>
            updateCondition(groupId, condition.id, { value: e.target.value })
          }
          className="w-[150px] h-8 text-sm"
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => removeCondition(groupId, condition.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderGroup = (group: FilterGroup, depth: number = 0) => (
    <Card
      key={group.id}
      className={cn(
        "p-4 border-2 border-dashed",
        depth === 0 ? "border-primary/30" : "border-muted-foreground/30",
        depth > 0 && "ml-6 mt-2"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs font-medium",
              group.logic === "AND"
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-orange-500/10 text-orange-500 border-orange-500/30"
            )}
            onClick={() => toggleGroupLogic(group.id)}
          >
            {group.logic}
          </Button>
          <span className="text-xs text-muted-foreground">
            {group.conditions.length} condition
            {group.conditions.length !== 1 ? "s" : ""}
          </span>
        </div>
        {depth > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => removeGroup(group.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition, index) =>
          renderCondition(group.id, condition, index)
        )}
      </div>

      {group.groups?.map((nestedGroup) => renderGroup(nestedGroup, depth + 1))}

      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => addCondition(group.id)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add condition
        </Button>
        {depth < 2 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => addNestedGroup(group.id)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add group
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filter Conditions</h3>
      </div>
      {filterGroups.length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed">
          <p className="text-muted-foreground mb-3">No filters defined yet</p>
          <Button
            onClick={() =>
              onFilterGroupsChange([
                { id: generateId(), logic: "AND", conditions: [] },
              ])
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Filter Group
          </Button>
        </Card>
      ) : (
        filterGroups.map((group) => renderGroup(group))
      )}
    </div>
  );
};
