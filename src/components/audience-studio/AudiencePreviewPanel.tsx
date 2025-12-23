import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  Users, 
  TrendingUp, 
  Loader2, 
  BarChart3,
  Map,
  Code
} from "lucide-react";
import type { FilterGroup, PreviewResult } from "@/types/audience-studio";
import { generateSampleUsers } from "@/types/audience-studio";

interface AudiencePreviewPanelProps {
  filters: FilterGroup;
  isLoading?: boolean;
  onRefresh: () => void;
}

export const AudiencePreviewPanel = ({
  filters,
  isLoading,
  onRefresh,
}: AudiencePreviewPanelProps) => {
  const [previewData, setPreviewData] = useState<PreviewResult>({
    count: 0,
    totalInParent: 125000,
    sampleData: [],
    breakdowns: [],
  });

  // Simulate preview calculation when filters change
  useEffect(() => {
    const hasFilters = filters.propertyFilters.length > 0 || filters.eventFilters.length > 0;
    
    if (hasFilters) {
      // Simulate varying audience sizes based on filter complexity
      const baseSize = 125000;
      const reduction = (filters.propertyFilters.length * 15) + (filters.eventFilters.length * 25);
      const estimatedSize = Math.max(1000, Math.floor(baseSize * (100 - reduction) / 100));
      
      setPreviewData({
        count: estimatedSize + Math.floor(Math.random() * 2000) - 1000,
        totalInParent: baseSize,
        sampleData: generateSampleUsers(10),
        breakdowns: [
          {
            field: "state",
            values: [
              { label: "CA", count: Math.floor(estimatedSize * 0.18), percentage: 18 },
              { label: "NY", count: Math.floor(estimatedSize * 0.14), percentage: 14 },
              { label: "TX", count: Math.floor(estimatedSize * 0.12), percentage: 12 },
              { label: "FL", count: Math.floor(estimatedSize * 0.09), percentage: 9 },
              { label: "Other", count: Math.floor(estimatedSize * 0.47), percentage: 47 },
            ],
          },
          {
            field: "plan_type",
            values: [
              { label: "Enterprise", count: Math.floor(estimatedSize * 0.08), percentage: 8 },
              { label: "Pro", count: Math.floor(estimatedSize * 0.25), percentage: 25 },
              { label: "Starter", count: Math.floor(estimatedSize * 0.35), percentage: 35 },
              { label: "Free", count: Math.floor(estimatedSize * 0.32), percentage: 32 },
            ],
          },
        ],
      });
    } else {
      setPreviewData({
        count: 0,
        totalInParent: 125000,
        sampleData: [],
        breakdowns: [],
      });
    }
  }, [filters]);

  const percentage = previewData.totalInParent > 0 
    ? ((previewData.count / previewData.totalInParent) * 100).toFixed(1) 
    : 0;

  const columns = previewData.sampleData.length > 0 
    ? Object.keys(previewData.sampleData[0]).slice(0, 6) 
    : [];

  // Generate mock SQL
  const generateSQL = () => {
    let sql = `SELECT *\nFROM users u`;
    
    if (filters.eventFilters.length > 0) {
      filters.eventFilters.forEach((ef, i) => {
        const alias = `e${i}`;
        sql += `\n${ef.hasEvent ? "INNER" : "LEFT"} JOIN ${ef.relatedModelName.toLowerCase().replace(/ /g, "_")} ${alias}`;
        sql += ` ON u.user_id = ${alias}.user_id`;
      });
    }

    const conditions: string[] = [];
    
    filters.propertyFilters.forEach((pf) => {
      if (pf.valueType === "text") {
        conditions.push(`u.${pf.field} ${pf.operator} '${pf.value}'`);
      } else {
        conditions.push(`u.${pf.field} ${pf.operator} ${pf.value}`);
      }
    });

    filters.eventFilters.forEach((ef, i) => {
      if (ef.timeWindow.days) {
        const alias = `e${i}`;
        const op = ef.hasEvent ? "IS NOT NULL" : "IS NULL";
        if (!ef.hasEvent) {
          conditions.push(`${alias}.event_id ${op}`);
        } else {
          conditions.push(`${alias}.added_at >= NOW() - INTERVAL '${ef.timeWindow.days} days'`);
        }
      }
    });

    if (conditions.length > 0) {
      sql += `\nWHERE ${conditions.join(`\n  ${filters.logic} `)}`;
    }

    sql += "\nLIMIT 10000;";
    return sql;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Live Preview</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Refresh
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Audience Size Card */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {previewData.count.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated audience size
                </div>
              </div>
            </div>
          </Card>

          {/* Percentage Card */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">
                  {percentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  of {previewData.totalInParent.toLocaleString()} total users
                </div>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(Number(percentage), 100)}%` }}
              />
            </div>
          </Card>

          {/* Tabs for different views */}
          <Tabs defaultValue="sample" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="sample" className="gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                Sample
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="gap-1.5 text-xs">
                <BarChart3 className="w-3.5 h-3.5" />
                Breakdown
              </TabsTrigger>
              <TabsTrigger value="sql" className="gap-1.5 text-xs">
                <Code className="w-3.5 h-3.5" />
                SQL
              </TabsTrigger>
            </TabsList>

            {/* Sample Data */}
            <TabsContent value="sample" className="mt-3">
              <Card className="overflow-hidden">
                {previewData.sampleData.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Add filters to see sample data
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          {columns.map((col) => (
                            <TableHead key={col} className="text-xs font-medium whitespace-nowrap">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.sampleData.slice(0, 10).map((row, idx) => (
                          <TableRow key={idx}>
                            {columns.map((col) => (
                              <TableCell key={col} className="text-xs py-2 whitespace-nowrap">
                                {String(row[col] ?? "-")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Breakdowns */}
            <TabsContent value="breakdown" className="mt-3 space-y-3">
              {previewData.breakdowns.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground text-sm">
                  Add filters to see breakdowns
                </Card>
              ) : (
                previewData.breakdowns.map((breakdown) => (
                  <Card key={breakdown.field} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Map className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm capitalize">{breakdown.field.replace(/_/g, " ")}</span>
                    </div>
                    <div className="space-y-2">
                      {breakdown.values.map((v) => (
                        <div key={v.label} className="flex items-center gap-2">
                          <div className="w-16 text-xs text-muted-foreground">{v.label}</div>
                          <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary/60 rounded-full transition-all"
                              style={{ width: `${v.percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-xs text-right text-muted-foreground">
                            {v.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* SQL Preview */}
            <TabsContent value="sql" className="mt-3">
              <Card className="p-4">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                  {filters.propertyFilters.length > 0 || filters.eventFilters.length > 0 
                    ? generateSQL() 
                    : "-- Add filters to generate SQL"}
                </pre>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
