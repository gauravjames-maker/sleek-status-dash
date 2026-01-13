import { useState } from "react";
import { Search, Database, Table2, Key, Link2, GitMerge, Filter, BarChart3, FileOutput } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type WarehouseTable } from "@/types/dbt-studio";
import { cn } from "@/lib/utils";

interface DBTSourcesSidebarProps {
  tables: WarehouseTable[];
}

export const DBTSourcesSidebar = ({ tables }: DBTSourcesSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSchemas, setExpandedSchemas] = useState<string[]>(["ecommerce"]);

  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.schema.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTables = filteredTables.reduce((acc, table) => {
    if (!acc[table.schema]) acc[table.schema] = [];
    acc[table.schema].push(table);
    return acc;
  }, {} as Record<string, WarehouseTable[]>);

  const toggleSchema = (schema: string) => {
    setExpandedSchemas(prev => 
      prev.includes(schema) ? prev.filter(s => s !== schema) : [...prev, schema]
    );
  };

  const handleDragStart = (event: React.DragEvent, type: string, table?: WarehouseTable) => {
    event.dataTransfer.setData("application/reactflow-type", type);
    if (table) {
      event.dataTransfer.setData("application/reactflow-table", JSON.stringify(table));
    }
    event.dataTransfer.effectAllowed = "move";
  };

  const operators = [
    { type: "join", label: "Join", icon: GitMerge, description: "Combine tables" },
    { type: "filter", label: "Filter", icon: Filter, description: "Filter rows" },
    { type: "aggregate", label: "Aggregate", icon: BarChart3, description: "Group & aggregate" },
    { type: "output", label: "Output", icon: FileOutput, description: "Final model" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Data Sources
          </p>
          
          {Object.entries(groupedTables).map(([schema, schemaTables]) => (
            <Collapsible 
              key={schema}
              open={expandedSchemas.includes(schema)}
              onOpenChange={() => toggleSchema(schema)}
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>{schema}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {schemaTables.length}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 space-y-1">
                {schemaTables.map((table) => (
                  <div
                    key={table.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, "source", table)}
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

        <Separator className="my-2" />

        <div className="p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Operators
          </p>
          <div className="space-y-1">
            {operators.map((op) => (
              <div
                key={op.type}
                draggable
                onDragStart={(e) => handleDragStart(e, op.type)}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-grab",
                  "hover:bg-accent transition-colors border border-transparent",
                  "active:cursor-grabbing active:border-primary"
                )}
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <op.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{op.label}</p>
                  <p className="text-xs text-muted-foreground">{op.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
