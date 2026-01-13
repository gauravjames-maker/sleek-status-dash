import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileOutput } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  const outputName = data.outputName as string | undefined;
  const materializationType = data.materializationType as string | undefined;
  
  return (
    <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[160px] ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <FileOutput className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="font-medium text-sm">{String(data.label || '')}</p>
          {outputName && <p className="text-xs text-muted-foreground">{outputName}</p>}
        </div>
      </div>
      {materializationType && (
        <div className="mt-2 pt-2 border-t border-border">
          <Badge variant="outline" className="text-xs">{materializationType}</Badge>
        </div>
      )}
    </div>
  );
});

OutputNode.displayName = "OutputNode";
