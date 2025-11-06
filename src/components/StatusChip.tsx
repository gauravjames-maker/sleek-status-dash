import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type CampaignStatus = "collecting" | "completed" | "sending" | "failed";

interface StatusChipProps {
  status: CampaignStatus;
  showTooltip?: boolean;
  tooltipText?: string;
}

const statusConfig: Record<
  CampaignStatus,
  { label: string; className: string; dotColor: string }
> = {
  collecting: {
    label: "initializing",
    className: "bg-status-collecting-bg text-status-collecting",
    dotColor: "bg-status-collecting",
  },
  completed: {
    label: "completed",
    className: "bg-status-completed-bg text-status-completed",
    dotColor: "bg-status-completed",
  },
  sending: {
    label: "sending recipients",
    className: "bg-status-sending-bg text-status-sending",
    dotColor: "bg-status-sending",
  },
  failed: {
    label: "failed",
    className: "bg-status-failed-bg text-status-failed",
    dotColor: "bg-status-failed",
  },
};

export const StatusChip = ({ status, showTooltip = false, tooltipText }: StatusChipProps) => {
  const config = statusConfig[status];

  const chipContent = (
    <div
      className={cn(
        "status-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.className,
        status === "failed" && "status-failed"
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      <span>{config.label}</span>
    </div>
  );

  if (showTooltip && status === "completed") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{chipContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText || "Collecting Data"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return chipContent;
};
