import { Card } from "@/components/ui/card";
import { SparklineChart } from "./SparklineChart";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number | undefined;
  format?: "number" | "percent";
  sparkline?: number[] | undefined;
  sparklineColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  format = "number",
  sparkline,
  sparklineColor = "#bcbc95",
  className,
}: StatCardProps) {
  const display =
    format === "percent"
      ? `${Number(value).toFixed(1)}%`
      : Number(value).toLocaleString();

  const isPositive = change != null && change >= 0;

  return (
    <Card className={`p-4 @container/stat ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{display}</p>
          {change != null && (
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  isPositive
                    ? "text-status-success-border"
                    : "text-status-error-border"
                }
              >
                {isPositive ? "↑" : "↓"} {Math.abs(Math.round(change))}%
              </span>{" "}
              vs last month
            </p>
          )}
        </div>
        {sparkline && sparkline.length > 0 && (
          <div className="hidden @[200px]/stat:block">
            <SparklineChart data={sparkline} color={sparklineColor} />
          </div>
        )}
      </div>
    </Card>
  );
}
