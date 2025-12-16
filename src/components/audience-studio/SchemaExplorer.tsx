import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Table2, Key, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

interface TableSchema {
  name: string;
  columns: Column[];
}

interface SchemaExplorerProps {
  tables: TableSchema[];
  selectedTables: string[];
  onSelectColumn?: (table: string, column: string) => void;
}

export const SchemaExplorer = ({
  tables,
  selectedTables,
  onSelectColumn,
}: SchemaExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTables, setExpandedTables] = useState<string[]>(selectedTables);

  const filteredTables = tables.filter(
    (table) =>
      selectedTables.includes(table.name) &&
      (table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.columns.some((col) =>
          col.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm mb-2">Schema Explorer</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tables & columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredTables.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">
              {selectedTables.length === 0
                ? "Select tables from Step 1"
                : "No matching tables/columns"}
            </p>
          ) : (
            filteredTables.map((table) => (
              <div key={table.name} className="mb-1">
                <button
                  onClick={() => toggleTable(table.name)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors"
                >
                  {expandedTables.includes(table.name) ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <Table2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">{table.name}</span>
                </button>
                {expandedTables.includes(table.name) && (
                  <div className="ml-6 border-l border-border pl-2 mt-1">
                    {table.columns.map((column) => (
                      <button
                        key={`${table.name}.${column.name}`}
                        onClick={() => onSelectColumn?.(table.name, column.name)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted rounded transition-colors text-left",
                          (column.isPrimaryKey || column.isForeignKey) &&
                            "text-primary"
                        )}
                      >
                        {(column.isPrimaryKey || column.isForeignKey) && (
                          <Key className="w-3 h-3" />
                        )}
                        <span className={cn(!column.isPrimaryKey && !column.isForeignKey && "ml-5")}>
                          {column.name}
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          {column.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
