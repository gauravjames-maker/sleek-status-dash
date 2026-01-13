import { useState, useMemo } from "react";
import { Code, Table2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Node, Edge } from "@xyflow/react";

interface DBTPreviewPanelProps {
  nodes: Node[];
  edges: Edge[];
  sql: string;
}

export const DBTPreviewPanel = ({ nodes, edges, sql }: DBTPreviewPanelProps) => {
  const [activeTab, setActiveTab] = useState("preview");

  // Generate sample preview data
  const previewData = useMemo(() => {
    if (nodes.length === 0) return [];
    
    // Sample data based on e-commerce schema
    return [
      { customer_id: 'C001', email: 'john@example.com', total_orders: 15, total_amount: 2450.00 },
      { customer_id: 'C002', email: 'jane@example.com', total_orders: 8, total_amount: 1890.50 },
      { customer_id: 'C003', email: 'bob@example.com', total_orders: 23, total_amount: 4520.75 },
      { customer_id: 'C004', email: 'alice@example.com', total_orders: 12, total_amount: 3100.00 },
      { customer_id: 'C005', email: 'charlie@example.com', total_orders: 5, total_amount: 890.25 },
    ];
  }, [nodes]);

  const estimatedCount = useMemo(() => {
    // Simulate count estimation based on filters
    const hasFilter = nodes.some(n => n.type === 'filter');
    return hasFilter ? 12450 : 150000;
  }, [nodes]);

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Preview</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Est. Rows</p>
            <p className="text-xl font-semibold">{estimatedCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nodes</p>
            <p className="text-xl font-semibold">{nodes.length}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 w-auto">
          <TabsTrigger value="preview" className="gap-1.5 text-xs">
            <Table2 className="h-3.5 w-3.5" />
            Sample
          </TabsTrigger>
          <TabsTrigger value="sql" className="gap-1.5 text-xs">
            <Code className="h-3.5 w-3.5" />
            SQL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Add nodes to see preview
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0] || {}).map((key) => (
                        <TableHead key={key} className="text-xs whitespace-nowrap">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.values(row).map((val, vidx) => (
                          <TableCell key={vidx} className="text-xs py-2">
                            {typeof val === 'number' 
                              ? val.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
                              : String(val)
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Showing sample data (LIMIT 5)
            </p>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sql" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {sql ? (
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                {sql}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Add nodes to generate SQL
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Model Info */}
      {nodes.length > 0 && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Model Components</p>
          <div className="flex flex-wrap gap-1">
            {nodes.filter(n => n.type === 'source').length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {nodes.filter(n => n.type === 'source').length} Sources
              </Badge>
            )}
            {nodes.filter(n => n.type === 'join').length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {nodes.filter(n => n.type === 'join').length} Joins
              </Badge>
            )}
            {nodes.filter(n => n.type === 'filter').length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {nodes.filter(n => n.type === 'filter').length} Filters
              </Badge>
            )}
            {nodes.filter(n => n.type === 'aggregate').length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {nodes.filter(n => n.type === 'aggregate').length} Aggregates
              </Badge>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
