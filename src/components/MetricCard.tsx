import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard = ({ title, value, subtitle, trend }: MetricCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
      {/* Blue left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      
      <div className="pl-3">
        <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
        <div className="text-2xl font-bold text-foreground mb-1">{value.toLocaleString()}</div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{subtitle}</span>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.isPositive ? "text-status-completed" : "text-status-failed"
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
