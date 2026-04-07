"use client";

type Health = "good" | "fair" | "poor";

const healthConfig: Record<Health, { label: string; angle: number; color: string; trackColor: string }> = {
  good: { label: "Good", angle: 160, color: "#22c55e", trackColor: "#e5e7eb" },
  fair: { label: "Fair", angle: 100, color: "#d97706", trackColor: "#e5e7eb" },
  poor: { label: "Poor", angle: 40, color: "#ef4444", trackColor: "#e5e7eb" },
};

interface HealthGaugeProps {
  title: string;
  health: Health;
  onViewMore?: () => void;
}

export function HealthGauge({ title, health, onViewMore }: HealthGaugeProps) {
  const { label, angle, color, trackColor } = healthConfig[health];

  // SVG semicircle gauge
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;

  // Arc from 180° to 0° (left to right across the top)
  const startAngle = 180;
  const endAngle = 0;
  const totalSweep = 180;
  const valueSweep = (angle / totalSweep) * 180;

  function polarToCartesian(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  }

  const trackStart = polarToCartesian(startAngle);
  const trackEnd = polarToCartesian(endAngle);
  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${radius} ${radius} 0 0 1 ${trackEnd.x} ${trackEnd.y}`;

  const valueEndAngle = startAngle - valueSweep;
  const valueEnd = polarToCartesian(valueEndAngle);
  const largeArc = valueSweep > 180 ? 1 : 0;
  const valuePath = `M ${trackStart.x} ${trackStart.y} A ${radius} ${radius} 0 ${largeArc} 1 ${valueEnd.x} ${valueEnd.y}`;

  return (
    <div className="rounded-xl bg-card text-card-foreground shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.05)] p-5 flex flex-col items-center gap-1">
      <p className="text-sm text-muted-foreground self-start">{title}</p>
      <p className="text-xl font-semibold self-start">{label}</p>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 25}`}>
        <path d={trackPath} fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={valuePath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
      {onViewMore && (
        <button
          type="button"
          onClick={onViewMore}
          className="text-sm font-medium text-foreground hover:underline cursor-pointer self-end flex items-center gap-1"
        >
          View More <span aria-hidden>&#8250;</span>
        </button>
      )}
    </div>
  );
}
