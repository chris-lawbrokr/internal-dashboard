"use client";

type Health = "good" | "fair" | "poor";

const healthConfig: Record<Health, { label: string; sweep: number; color: string }> = {
  good: { label: "Good", sweep: 160, color: "var(--color-chart-sage)" },
  fair: { label: "Fair", sweep: 100, color: "var(--color-chart-gold-light)" },
  poor: { label: "Poor", sweep: 40, color: "var(--color-chart-coral)" },
};

interface HealthGaugeProps {
  title: string;
  health: Health;
  onViewMore?: () => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

export function HealthGauge({ title, health, onViewMore }: HealthGaugeProps) {
  const { label, sweep, color } = healthConfig[health];

  const outerR = 93;
  const innerR = 65.22;
  const cx = 93;
  const cy = 93;
  const width = 186;
  const height = 93;

  // Track: full semicircle annular ring
  const trackPath = [
    `M ${polarToCartesian(cx, cy, outerR, 180).x} ${polarToCartesian(cx, cy, outerR, 180).y}`,
    `A ${outerR} ${outerR} 0 0 1 ${polarToCartesian(cx, cy, outerR, 0).x} ${polarToCartesian(cx, cy, outerR, 0).y}`,
    `L ${polarToCartesian(cx, cy, innerR, 0).x} ${polarToCartesian(cx, cy, innerR, 0).y}`,
    `A ${innerR} ${innerR} 0 0 0 ${polarToCartesian(cx, cy, innerR, 180).x} ${polarToCartesian(cx, cy, innerR, 180).y}`,
    "Z",
  ].join(" ");

  // Value: annular sector from 180° sweeping clockwise by `sweep` degrees
  const endAngle = 180 - sweep;
  const largeArc = sweep > 180 ? 1 : 0;
  const valuePath = [
    `M ${polarToCartesian(cx, cy, outerR, 180).x} ${polarToCartesian(cx, cy, outerR, 180).y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${polarToCartesian(cx, cy, outerR, endAngle).x} ${polarToCartesian(cx, cy, outerR, endAngle).y}`,
    `L ${polarToCartesian(cx, cy, innerR, endAngle).x} ${polarToCartesian(cx, cy, innerR, endAngle).y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${polarToCartesian(cx, cy, innerR, 180).x} ${polarToCartesian(cx, cy, innerR, 180).y}`,
    "Z",
  ].join(" ");

  return (
    <div className="rounded-xl bg-card text-card-foreground shadow-[0px_2px_4px_0px_rgba(59,37,89,0.1),0px_4px_6px_0px_rgba(59,37,89,0.05)] p-5 flex flex-col items-center gap-1">
      <p className="text-sm text-muted-foreground self-start">{title}</p>
      <p className="text-xl font-semibold self-start">{label}</p>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <path d={trackPath} fill="#F2F2F2" />
        <path d={valuePath} fill={color} />
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
