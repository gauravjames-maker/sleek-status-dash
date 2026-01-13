import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Table2 } from "lucide-react";

export const SourceNode = memo(({ data, selected }: NodeProps) => {
  const columns = data.columns as { name: string; type: string }[] | undefined;
  
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[160px]
        ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}
      `}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Table2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{String(data.schema || '')}</p>
          <p className="font-medium text-sm">{String(data.label || '')}</p>
        </div>
      </div>
      {columns && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {columns.length} columns
          </p>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
    </div>
  );
});

SourceNode.displayName = "SourceNode";
