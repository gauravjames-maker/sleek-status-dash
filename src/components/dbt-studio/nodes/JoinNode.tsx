import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitMerge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const JoinNode = memo(({ data, selected }: NodeProps) => {
  const joinType = data.joinType as string | undefined;
  const joinOn = data.joinOn as { left: string; right: string }[] | undefined;
  
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[140px]
        ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}
      `}
    >
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-primary !border-2 !border-background !top-[30%]" />
      <Handle type="target" position={Position.Left} id="right" className="!w-3 !h-3 !bg-primary !border-2 !border-background !top-[70%]" />
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <GitMerge className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-sm">{String(data.label || '')}</p>
          {joinType && <Badge variant="secondary" className="text-xs mt-1">{joinType.toUpperCase()}</Badge>}
        </div>
      </div>
      
      {joinOn?.[0] && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
          ON {joinOn[0].left} = {joinOn[0].right}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background" />
    </div>
  );
});

JoinNode.displayName = "JoinNode";
