import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight, Link2, Trash2 } from "lucide-react";

export interface JoinRelationship {
  id: string;
  leftTable: string;
  leftColumn: string;
  rightTable: string;
  rightColumn: string;
  joinType: "INNER" | "LEFT";
}

interface RelationshipBuilderProps {
  primaryTable: string;
  relatedTables: string[];
  availableColumns: Record<string, string[]>;
  relationships: JoinRelationship[];
  onRelationshipsChange: (relationships: JoinRelationship[]) => void;
}

export const RelationshipBuilder = ({
  primaryTable,
  relatedTables,
  availableColumns,
  relationships,
  onRelationshipsChange,
}: RelationshipBuilderProps) => {
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addRelationship = (relatedTable: string) => {
    const existing = relationships.find((r) => r.rightTable === relatedTable);
    if (existing) return;

    const newRelationship: JoinRelationship = {
      id: generateId(),
      leftTable: primaryTable,
      leftColumn: "",
      rightTable: relatedTable,
      rightColumn: "",
      joinType: "INNER",
    };

    onRelationshipsChange([...relationships, newRelationship]);
  };

  const updateRelationship = (
    id: string,
    updates: Partial<JoinRelationship>
  ) => {
    onRelationshipsChange(
      relationships.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const removeRelationship = (id: string) => {
    onRelationshipsChange(relationships.filter((r) => r.id !== id));
  };

  const getJoinSummary = (rel: JoinRelationship): string => {
    if (!rel.leftColumn || !rel.rightColumn) return "Select join keys";
    return `${rel.leftTable} ${rel.joinType} JOIN ${rel.rightTable} ON ${rel.leftTable}.${rel.leftColumn} = ${rel.rightTable}.${rel.rightColumn}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2">Define Relationships</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your primary entity ({primaryTable}) to related tables
        </p>
      </div>

      {/* Primary table */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">P</span>
          </div>
          <div>
            <div className="font-medium">{primaryTable}</div>
            <div className="text-xs text-muted-foreground">Primary entity</div>
          </div>
        </div>
      </Card>

      {/* Relationships */}
      {relatedTables.map((table) => {
        const relationship = relationships.find((r) => r.rightTable === table);

        return (
          <Card key={table} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{table}</span>
              </div>
              {relationship ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRelationship(relationship.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addRelationship(table)}
                >
                  Configure Join
                </Button>
              )}
            </div>

            {relationship && (
              <div className="space-y-3">
                {/* Primary table selector for this relationship */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Primary table for this join
                  </label>
                  <Select
                    value={relationship.leftTable}
                    onValueChange={(value) => {
                      // Swap the tables if the user selects the other table as primary
                      if (value === relationship.rightTable) {
                        updateRelationship(relationship.id, {
                          leftTable: relationship.rightTable,
                          rightTable: relationship.leftTable,
                          leftColumn: relationship.rightColumn,
                          rightColumn: relationship.leftColumn,
                        });
                      } else {
                        updateRelationship(relationship.id, { leftTable: value });
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value={primaryTable}>{primaryTable}</SelectItem>
                      <SelectItem value={table}>{table}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {/* Left table column */}
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {relationship.leftTable} column
                    </label>
                    <Select
                      value={relationship.leftColumn}
                      onValueChange={(value) =>
                        updateRelationship(relationship.id, { leftColumn: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {availableColumns[relationship.leftTable]?.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ArrowRight className="w-5 h-5 text-muted-foreground mt-5" />

                  {/* Right table column */}
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {relationship.rightTable} column
                    </label>
                    <Select
                      value={relationship.rightColumn}
                      onValueChange={(value) =>
                        updateRelationship(relationship.id, {
                          rightColumn: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {availableColumns[relationship.rightTable]?.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Join type */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Join type
                  </label>
                  <Select
                    value={relationship.joinType}
                    onValueChange={(value: "INNER" | "LEFT") =>
                      updateRelationship(relationship.id, { joinType: value })
                    }
                  >
                    <SelectTrigger className="h-9 w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="INNER">
                        INNER JOIN (matching only)
                      </SelectItem>
                      <SelectItem value="LEFT">
                        LEFT JOIN (keep all from {relationship.leftTable})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div className="p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                  {getJoinSummary(relationship)}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {relatedTables.length === 0 && (
        <Card className="p-6 text-center border-dashed">
          <p className="text-muted-foreground text-sm">
            Select related tables in Step 1 to define joins
          </p>
        </Card>
      )}
    </div>
  );
};
