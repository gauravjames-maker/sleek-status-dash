import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeNotificationBannerProps {
  version: string;
  highlights: string[];
  onDismiss: () => void;
  onSeeWhatsNew: () => void;
  className?: string;
}

export const UpgradeNotificationBanner = ({
  version,
  highlights,
  onDismiss,
  onSeeWhatsNew,
  className,
}: UpgradeNotificationBannerProps) => {
  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4 shadow-sm",
        className
      )}
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 hover:bg-background/50 rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              You've been upgraded to version {version}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here's what's new in this release:
            </p>
          </div>

          <ul className="space-y-1.5">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 pt-1">
            <Button onClick={onSeeWhatsNew} size="sm" variant="default">
              See what's new
            </Button>
            <Button onClick={onDismiss} size="sm" variant="ghost">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};