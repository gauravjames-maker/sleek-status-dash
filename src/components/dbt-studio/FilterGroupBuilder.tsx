import { useState } from "react";
import { Plus, Trash2, ChevronDown, User, Link2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type FilterGroup, type AudienceFilter, type DBTParentModel, type FilterOperator } from "@/types/dbt-studio";
import { cn } from "@/lib/utils";

interface FilterGroupBuilderProps {
  group: FilterGroup;
  parentModel?: DBTParentModel;
  showGroupLogic?: boolean;
  onUpdateGroup: (updates: Partial<FilterGroup>) => void;
  onDeleteGroup: () => void;
  onAddFilter: (filter: AudienceFilter) => void;
  onUpdateFilter: (filterId: string, updates: Partial<AudienceFilter>) => void;
  onDeleteFilter: (filterId: string) => void;
}

const operatorLabels: Record<FilterOperator, string> = {
  equals: 'equals',
  not_equals: 'not equals',
  contains: 'contains',
  not_contains: 'does not contain',
  starts_with: 'starts with',
  ends_with: 'ends with',
  greater_than: 'greater than',
  less_than: 'less than',
  greater_or_equal: '≥',
  less_or_equal: '≤',
  in: 'in list',
  not_in: 'not in list',
  is_set: 'is set',
  is_not_set: 'is not set',
};

export const FilterGroupBuilder = ({
  group,
  parentModel,
  showGroupLogic,
  onUpdateGroup,
  onDeleteGroup,
  onAddFilter,
  onUpdateFilter,
  onDeleteFilter,
}: FilterGroupBuilderProps) => {
  const handleAddPropertyFilter = (column: string) => {
    onAddFilter({
      id: `f-${Date.now()}`,
      type: 'property',
      column,
      operator: 'equals',
      value: '',
    });
  };

  const handleAddRelationFilter = (relationId: string, relationName: string) => {
    onAddFilter({
      id: `f-${Date.now()}`,
      type: 'relation',
      relationId,
      relationName,
      relationOperator: 'has',
      relationFilters: [],
    });
  };

  const handleAddEventFilter = () => {
    onAddFilter({
      id: `f-${Date.now()}`,
      type: 'event',
      eventName: '',
      timeWindow: { value: 30, unit: 'days' },
      eventCount: { operator: 'at_least', value: 1 },
    });
  };

  return (
    <div className="space-y-2">
      {showGroupLogic && (
        <div className="flex items-center justify-center">
          <Select 
            value={group.logic} 
            onValueChange={(v) => onUpdateGroup({ logic: v as 'AND' | 'OR' })}
          >
            <SelectTrigger className="w-20 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {group.logic}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {group.filters.length} filter{group.filters.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Filter
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Properties</DropdownMenuLabel>
                {parentModel?.columns.slice(0, 8).map(col => (
                  <DropdownMenuItem 
                    key={col.name}
                    onClick={() => handleAddPropertyFilter(col.name)}
                  >
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    {col.name}
                  </DropdownMenuItem>
                ))}
                
                {parentModel?.relationships && parentModel.relationships.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Relations</DropdownMenuLabel>
                    {parentModel.relationships.map(rel => (
                      <DropdownMenuItem 
                        key={rel.id}
                        onClick={() => handleAddRelationFilter(rel.id, rel.displayName)}
                      >
                        <Link2 className="w-4 h-4 mr-2 text-muted-foreground" />
                        has {rel.displayName}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Events</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleAddEventFilter}>
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  Event occurred
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDeleteGroup}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2">
          {group.filters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add filters to define this group
            </p>
          ) : (
            group.filters.map((filter, idx) => (
              <div key={filter.id}>
                {idx > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <Badge variant="outline" className="text-xs px-2">
                      {group.logic}
                    </Badge>
                  </div>
                )}
                <FilterRow 
                  filter={filter}
                  parentModel={parentModel}
                  onUpdate={(updates) => onUpdateFilter(filter.id, updates)}
                  onDelete={() => onDeleteFilter(filter.id)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface FilterRowProps {
  filter: AudienceFilter;
  parentModel?: DBTParentModel;
  onUpdate: (updates: Partial<AudienceFilter>) => void;
  onDelete: () => void;
}

const FilterRow = ({ filter, parentModel, onUpdate, onDelete }: FilterRowProps) => {
  if (filter.type === 'property') {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg group">
        <Badge variant="outline" className="shrink-0">
          <User className="w-3 h-3 mr-1" />
          Property
        </Badge>
        
        <Select 
          value={filter.column || ''} 
          onValueChange={(v) => onUpdate({ column: v })}
        >
          <SelectTrigger className="w-36 h-8">
            <SelectValue placeholder="Column" />
          </SelectTrigger>
          <SelectContent>
            {parentModel?.columns.map(col => (
              <SelectItem key={col.name} value={col.name}>
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filter.operator || 'equals'} 
          onValueChange={(v) => onUpdate({ operator: v as FilterOperator })}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(operatorLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filter.operator !== 'is_set' && filter.operator !== 'is_not_set' && (
          <Input 
            value={String(filter.value || '')}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Value..."
            className="flex-1 h-8"
          />
        )}

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (filter.type === 'relation') {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg group">
        <Badge variant="outline" className="shrink-0">
          <Link2 className="w-3 h-3 mr-1" />
          Relation
        </Badge>
        
        <Select 
          value={filter.relationOperator || 'has'} 
          onValueChange={(v) => onUpdate({ relationOperator: v as AudienceFilter['relationOperator'] })}
        >
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="has">has</SelectItem>
            <SelectItem value="has_not">has not</SelectItem>
            <SelectItem value="count_gt">count &gt;</SelectItem>
            <SelectItem value="count_lt">count &lt;</SelectItem>
            <SelectItem value="count_eq">count =</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm font-medium">{filter.relationName}</span>

        {(filter.relationOperator === 'count_gt' || filter.relationOperator === 'count_lt' || filter.relationOperator === 'count_eq') && (
          <Input 
            type="number"
            value={String(filter.value || '')}
            onChange={(e) => onUpdate({ value: parseInt(e.target.value) })}
            placeholder="Count..."
            className="w-20 h-8"
          />
        )}

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (filter.type === 'event') {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg group">
        <Badge variant="outline" className="shrink-0">
          <Calendar className="w-3 h-3 mr-1" />
          Event
        </Badge>
        
        <Input 
          value={filter.eventName || ''}
          onChange={(e) => onUpdate({ eventName: e.target.value })}
          placeholder="Event name..."
          className="w-40 h-8"
        />

        <Select 
          value={filter.eventCount?.operator || 'at_least'} 
          onValueChange={(v) => onUpdate({ 
            eventCount: { 
              operator: v as 'at_least' | 'at_most' | 'exactly', 
              value: filter.eventCount?.value || 1 
            } 
          })}
        >
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="at_least">at least</SelectItem>
            <SelectItem value="at_most">at most</SelectItem>
            <SelectItem value="exactly">exactly</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          type="number"
          value={filter.eventCount?.value || 1}
          onChange={(e) => onUpdate({ 
            eventCount: { 
              operator: filter.eventCount?.operator || 'at_least', 
              value: parseInt(e.target.value) 
            } 
          })}
          className="w-16 h-8"
        />

        <span className="text-sm text-muted-foreground">times in last</span>

        <Input 
          type="number"
          value={filter.timeWindow?.value || 30}
          onChange={(e) => onUpdate({ 
            timeWindow: { 
              value: parseInt(e.target.value), 
              unit: filter.timeWindow?.unit || 'days' 
            } 
          })}
          className="w-16 h-8"
        />

        <Select 
          value={filter.timeWindow?.unit || 'days'} 
          onValueChange={(v) => onUpdate({ 
            timeWindow: { 
              value: filter.timeWindow?.value || 30, 
              unit: v as 'days' | 'weeks' | 'months' 
            } 
          })}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="days">days</SelectItem>
            <SelectItem value="weeks">weeks</SelectItem>
            <SelectItem value="months">months</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return null;
};
