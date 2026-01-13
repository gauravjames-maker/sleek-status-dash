import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BarChart3 } from "lucide-react";

export const AggregateNode = memo(({ data, selected }: NodeProps) => {
  const groupBy = data.groupBy as string[] | undefined;
  
  return (
    <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[140px] ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <p className="font-medium text-sm">{String(data.label || '')}</p>
      </div>
      {groupBy && groupBy.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
          Group by: {groupBy.join(', ')}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
    </div>
  );
});

AggregateNode.displayName = "AggregateNode";
