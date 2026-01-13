import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Filter } from "lucide-react";

export const FilterNode = memo(({ data, selected }: NodeProps) => {
  const filters = data.filters as { column: string; operator: string; value: string | number }[] | undefined;
  
  return (
    <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[140px] ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="font-medium text-sm">{String(data.label || '')}</p>
      </div>
      {filters?.[0] && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
          {filters[0].column} {String(filters[0].operator).replace('_', ' ')} {filters[0].value}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
    </div>
  );
});

FilterNode.displayName = "FilterNode";
