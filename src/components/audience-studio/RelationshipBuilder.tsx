import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight, Link2, Trash2, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Get all selected tables (primary + related)
  const allTables = [primaryTable, ...relatedTables];

  const addRelationship = (tableA: string, tableB: string) => {
    // Check if relationship already exists between these two tables
    const existing = relationships.find(
      (r) =>
        (r.leftTable === tableA && r.rightTable === tableB) ||
        (r.leftTable === tableB && r.rightTable === tableA)
    );
    if (existing) return;

    const newRelationship: JoinRelationship = {
      id: generateId(),
      leftTable: tableA,
      leftColumn: "",
      rightTable: tableB,
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

  const swapPrimaryTable = (relationship: JoinRelationship) => {
    updateRelationship(relationship.id, {
      leftTable: relationship.rightTable,
      rightTable: relationship.leftTable,
      leftColumn: relationship.rightColumn,
      rightColumn: relationship.leftColumn,
    });
  };

  const getJoinSummary = (rel: JoinRelationship): string => {
    if (!rel.leftColumn || !rel.rightColumn) return "Select join keys to complete";
    return `${rel.leftTable} ${rel.joinType} JOIN ${rel.rightTable} ON ${rel.leftTable}.${rel.leftColumn} = ${rel.rightTable}.${rel.rightColumn}`;
  };

  // Find relationship for a given table pair
  const findRelationship = (tableA: string, tableB: string) => {
    return relationships.find(
      (r) =>
        (r.leftTable === tableA && r.rightTable === tableB) ||
        (r.leftTable === tableB && r.rightTable === tableA)
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2">Define Relationships</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure joins between your selected tables. For each join, select which table should be the primary (driving) table.
        </p>
      </div>

      {/* Table relationship cards */}
      {relatedTables.map((table) => {
        const relationship = findRelationship(primaryTable, table);
        const isPrimaryForJoin = relationship?.leftTable === table;

        return (
          <Card 
            key={table} 
            className={`p-4 transition-all ${
              isPrimaryForJoin 
                ? 'bg-primary/5 border-primary/30' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{table}</span>
                {relationship && isPrimaryForJoin && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Crown className="w-3 h-3" />
                    Primary for this join
                  </Badge>
                )}
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
                  onClick={() => addRelationship(primaryTable, table)}
                >
                  Configure Join
                </Button>
              )}
            </div>

            {relationship && (
              <div className="space-y-3">
                {/* Primary table selector for this relationship */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <label className="text-xs font-medium text-foreground mb-2 block">
                    Which table should be primary for this join?
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={relationship.leftTable === primaryTable ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (relationship.leftTable !== primaryTable) {
                          swapPrimaryTable(relationship);
                        }
                      }}
                    >
                      {relationship.leftTable === primaryTable && <Crown className="w-3 h-3 mr-1" />}
                      {primaryTable}
                    </Button>
                    <Button
                      variant={relationship.leftTable === table ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (relationship.leftTable !== table) {
                          swapPrimaryTable(relationship);
                        }
                      }}
                    >
                      {relationship.leftTable === table && <Crown className="w-3 h-3 mr-1" />}
                      {table}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The primary table drives the join — all its rows are preserved in LEFT JOINs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Primary (left) table column */}
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-primary" />
                      <span className="font-medium text-primary">{relationship.leftTable}</span>
                      <span className="text-xs">(primary)</span>
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

                  {/* Related (right) table column */}
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      <span className="font-medium">{relationship.rightTable}</span>
                      <span className="ml-1 text-xs">(related)</span>
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
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="INNER">
                        INNER JOIN — Only rows matching in both tables
                      </SelectItem>
                      <SelectItem value="LEFT">
                        LEFT JOIN — Keep all rows from {relationship.leftTable}
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
