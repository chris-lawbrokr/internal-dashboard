"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

interface GaugeChartProps {
  title: string;
  label: string;
  value: number; // 0-100
  color: string;
  href?: string;
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = {
    x: cx + r * Math.cos((Math.PI * startAngle) / 180),
    y: cy + r * Math.sin((Math.PI * startAngle) / 180),
  };
  const end = {
    x: cx + r * Math.cos((Math.PI * endAngle) / 180),
    y: cy + r * Math.sin((Math.PI * endAngle) / 180),
  };
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function GaugeChart({ title, label, value, color, href }: GaugeChartProps) {
  const t = useTranslations("common");
  const cx = 100;
  const cy = 90;
  const r = 70;
  const strokeWidth = 18;

  // Full arc goes from 180° to 360° (left to right, bottom half of circle = top visually since SVG y is flipped)
  const trackPath = describeArc(cx, cy, r, 180, 360);
  // Value arc: map 0-100 to 180°-360°
  const endAngle = 180 + (value / 100) * 180;
  const valuePath = value > 0 ? describeArc(cx, cy, r, 180, endAngle) : "";

  return (
    <Card className="flex-1 min-w-0 p-4">
      <CardContent className="flex flex-col">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex justify-center py-4">
          <svg viewBox="0 0 200 100" className="w-full max-w-[240px]">
            <path
              d={trackPath}
              fill="none"
              stroke="var(--color-border-light)"
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
            />
            {value > 0 && (
              <path
                d={valuePath}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
              />
            )}
          </svg>
        </div>
        {href && (
          <div className="flex justify-end">
            <Link
              href={href}
              className="text-sm hover:underline flex items-center gap-0.5"
            >
              {t("viewMore")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
