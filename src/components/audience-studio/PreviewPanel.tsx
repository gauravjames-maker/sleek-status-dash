import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Users, TrendingUp, Loader2 } from "lucide-react";

interface PreviewPanelProps {
  audienceSize: number;
  totalSize: number;
  sampleData: Record<string, unknown>[];
  isLoading?: boolean;
  onRefresh: () => void;
}

export const PreviewPanel = ({
  audienceSize,
  totalSize,
  sampleData,
  isLoading,
  onRefresh,
}: PreviewPanelProps) => {
  const percentage = totalSize > 0 ? ((audienceSize / totalSize) * 100).toFixed(1) : 0;
  const columns = sampleData.length > 0 ? Object.keys(sampleData[0]) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Live Preview</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          )}
          Refresh
        </Button>
      </div>

      <div className="p-3 space-y-3">
        {/* Audience Size Card */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {audienceSize.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Estimated audience size
              </div>
            </div>
          </div>
        </Card>

        {/* Percentage Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {percentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                of {totalSize.toLocaleString()} total customers
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(Number(percentage), 100)}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Sample Data Table */}
      <div className="flex-1 flex flex-col min-h-0 px-3 pb-3">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Sample Data ({Math.min(sampleData.length, 20)} rows)
        </div>
        <Card className="flex-1 overflow-hidden">
          {sampleData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Add filters to see preview data
            </div>
          ) : (
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {columns.slice(0, 5).map((col) => (
                      <TableHead key={col} className="text-xs font-medium">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.slice(0, 20).map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.slice(0, 5).map((col) => (
                        <TableCell key={col} className="text-xs py-2">
                          {String(row[col] ?? "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
};
