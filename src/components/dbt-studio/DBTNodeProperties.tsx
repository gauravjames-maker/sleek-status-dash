import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import type { Node } from "@xyflow/react";

interface DBTNodePropertiesProps {
  node: Node;
  onUpdate: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

export const DBTNodeProperties = ({ node, onUpdate, onClose }: DBTNodePropertiesProps) => {
  const renderSourceProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Table Name</Label>
        <Input value={node.data.tableName || ''} disabled className="bg-muted" />
      </div>
      <div className="space-y-2">
        <Label>Schema</Label>
        <Input value={node.data.schema || ''} disabled className="bg-muted" />
      </div>
      {node.data.columns && (
        <div className="space-y-2">
          <Label>Selected Columns</Label>
          <ScrollArea className="h-40 border rounded-md p-2">
            {node.data.columns.map((col: { name: string; type: string; selected?: boolean }) => (
              <div key={col.name} className="flex items-center gap-2 py-1">
                <Checkbox 
                  id={col.name}
                  checked={col.selected !== false}
                  onCheckedChange={(checked) => {
                    const updatedColumns = node.data.columns.map((c: { name: string }) => 
                      c.name === col.name ? { ...c, selected: checked } : c
                    );
                    onUpdate({ columns: updatedColumns });
                  }}
                />
                <label htmlFor={col.name} className="text-sm flex-1 cursor-pointer">
                  {col.name}
                </label>
                <span className="text-xs text-muted-foreground">{col.type}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </>
  );

  const renderJoinProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Join Type</Label>
        <Select
          value={node.data.joinType || 'inner'}
          onValueChange={(value) => onUpdate({ joinType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inner">Inner Join</SelectItem>
            <SelectItem value="left">Left Join</SelectItem>
            <SelectItem value="right">Right Join</SelectItem>
            <SelectItem value="full">Full Outer Join</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Join Condition</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="Left column" 
            value={node.data.joinOn?.[0]?.left || ''}
            onChange={(e) => onUpdate({ 
              joinOn: [{ 
                left: e.target.value, 
                right: node.data.joinOn?.[0]?.right || '' 
              }] 
            })}
          />
          <Input 
            placeholder="Right column" 
            value={node.data.joinOn?.[0]?.right || ''}
            onChange={(e) => onUpdate({ 
              joinOn: [{ 
                left: node.data.joinOn?.[0]?.left || '', 
                right: e.target.value 
              }] 
            })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Connect two source nodes to enable auto-detection
        </p>
      </div>
    </>
  );

  const renderFilterProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Filter Column</Label>
        <Input 
          placeholder="e.g., total_amount"
          value={node.data.filters?.[0]?.column || ''}
          onChange={(e) => onUpdate({
            filters: [{
              column: e.target.value,
              operator: node.data.filters?.[0]?.operator || 'equals',
              value: node.data.filters?.[0]?.value || ''
            }]
          })}
        />
      </div>
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select
          value={node.data.filters?.[0]?.operator || 'equals'}
          onValueChange={(value) => onUpdate({
            filters: [{
              column: node.data.filters?.[0]?.column || '',
              operator: value,
              value: node.data.filters?.[0]?.value || ''
            }]
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="not_equals">Not Equals</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="in">In List</SelectItem>
            <SelectItem value="is_null">Is Null</SelectItem>
            <SelectItem value="is_not_null">Is Not Null</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Value</Label>
        <Input 
          placeholder="e.g., 100"
          value={node.data.filters?.[0]?.value || ''}
          onChange={(e) => onUpdate({
            filters: [{
              column: node.data.filters?.[0]?.column || '',
              operator: node.data.filters?.[0]?.operator || 'equals',
              value: e.target.value
            }]
          })}
        />
      </div>
    </>
  );

  const renderAggregateProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Group By Columns</Label>
        <Input 
          placeholder="e.g., customer_id, category"
          value={node.data.groupBy?.join(', ') || ''}
          onChange={(e) => onUpdate({ 
            groupBy: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
          })}
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated list of columns
        </p>
      </div>
      <div className="space-y-2">
        <Label>Aggregations</Label>
        <div className="space-y-2">
          <Select
            value={node.data.aggregations?.[0]?.function || 'count'}
            onValueChange={(value) => onUpdate({
              aggregations: [{
                column: node.data.aggregations?.[0]?.column || '*',
                function: value,
                alias: node.data.aggregations?.[0]?.alias || ''
              }]
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select function" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">COUNT</SelectItem>
              <SelectItem value="sum">SUM</SelectItem>
              <SelectItem value="avg">AVG</SelectItem>
              <SelectItem value="min">MIN</SelectItem>
              <SelectItem value="max">MAX</SelectItem>
              <SelectItem value="count_distinct">COUNT DISTINCT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const renderOutputProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Model Name</Label>
        <Input 
          placeholder="e.g., high_value_customers"
          value={node.data.outputName || ''}
          onChange={(e) => onUpdate({ outputName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Materialization</Label>
        <Select
          value={node.data.materializationType || 'table'}
          onValueChange={(value) => onUpdate({ materializationType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="table">Table</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="incremental">Incremental</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          How the model should be materialized in dbt
        </p>
      </div>
    </>
  );

  const getTitle = () => {
    switch (node.type) {
      case 'source': return 'Source Table';
      case 'join': return 'Join Configuration';
      case 'filter': return 'Filter Configuration';
      case 'aggregate': return 'Aggregate Configuration';
      case 'output': return 'Output Model';
      default: return 'Node Properties';
    }
  };

  const renderProperties = () => {
    switch (node.type) {
      case 'source': return renderSourceProperties();
      case 'join': return renderJoinProperties();
      case 'filter': return renderFilterProperties();
      case 'aggregate': return renderAggregateProperties();
      case 'output': return renderOutputProperties();
      default: return <p className="text-muted-foreground">No properties available</p>;
    }
  };

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">{getTitle()}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {renderProperties()}
        </div>
      </ScrollArea>
    </aside>
  );
};
