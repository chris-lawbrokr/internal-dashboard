import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number | undefined;
  format?: "number" | "percent";
  className?: string;
}

function formatChange(value: number): string {
  const arrow = value >= 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(Math.round(value))}% vs last month`;
}

export function StatCard({
  label,
  value,
  change,
  format = "number",
  className,
}: StatCardProps) {
  const display =
    format === "percent"
      ? `${Number(value).toFixed(1)}%`
      : Number(value).toLocaleString();

  return (
    <Card className={className ?? "p-4"}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{display}</p>
      {change != null && (
        <p className="text-xs text-muted-foreground">
          {formatChange(change)}
        </p>
      )}
    </Card>
  );
}
