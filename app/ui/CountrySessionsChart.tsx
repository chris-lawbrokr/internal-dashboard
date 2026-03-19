"use client";

import { useEffect, useState, useMemo } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { Card, CardContent } from "@/components/ui/card";
import { chartColors } from "@/lib/chart-colors";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

const sessionData = [
  { name: "United States", coordinates: [-100, 40] as [number, number], sessions: 3856 },
  { name: "Canada", coordinates: [-100, 56] as [number, number], sessions: 2400 },
  { name: "Brazil", coordinates: [-50, -10] as [number, number], sessions: 1200 },
  { name: "United Kingdom", coordinates: [0, 52] as [number, number], sessions: 2800 },
  { name: "France", coordinates: [2, 47] as [number, number], sessions: 3200 },
  { name: "Germany", coordinates: [10, 51] as [number, number], sessions: 2600 },
  { name: "Russia", coordinates: [40, 56] as [number, number], sessions: 1800 },
  { name: "Saudi Arabia", coordinates: [45, 24] as [number, number], sessions: 1500 },
  { name: "India", coordinates: [78, 22] as [number, number], sessions: 900 },
  { name: "China", coordinates: [105, 35] as [number, number], sessions: 2100 },
  { name: "South Korea", coordinates: [127, 36] as [number, number], sessions: 1400 },
  { name: "Japan", coordinates: [138, 36] as [number, number], sessions: 1900 },
  { name: "Australia", coordinates: [134, -25] as [number, number], sessions: 2400 },
  { name: "Indonesia", coordinates: [115, -2] as [number, number], sessions: 1600 },
  { name: "Nigeria", coordinates: [8, 10] as [number, number], sessions: 800 },
  { name: "South Africa", coordinates: [25, -29] as [number, number], sessions: 700 },
];

const maxSessions = Math.max(...sessionData.map((d) => d.sessions));

function markerSize(sessions: number) {
  return 4 + (sessions / maxSessions) * 8;
}

const WIDTH = 500;
const HEIGHT = 240;

const projection = geoEqualEarth()
  .scale(90)
  .center([10, 10])
  .translate([WIDTH / 2, HEIGHT / 2]);

const pathGenerator = geoPath(projection);

export function CountrySessionsChart() {
  const [mounted, setMounted] = useState(false);
  const [landPaths, setLandPaths] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topo: Topology<{ land: GeometryCollection }>) => {
        const land = feature(topo, topo.objects.land) as FeatureCollection<Geometry>;
        const paths = land.features
          .map((f) => pathGenerator(f))
          .filter((d): d is string => d !== null);
        setLandPaths(paths);
      });
  }, []);

  return (
    <Card className="p-4 flex flex-col justify-between h-full">
      <CardContent className="flex flex-col gap-1 p-0">
        <span className="text-sm font-semibold">Country wise sessions</span>
      </CardContent>
      <div className="mt-2 flex-1 min-h-0">
        {mounted ? (
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {landPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={chartColors.indigoLightest}
                stroke={chartColors.indigoStroke}
                strokeWidth={0.5}
              />
            ))}
            {sessionData.map((point) => {
              const coords = projection(point.coordinates);
              if (!coords) return null;
              const r = markerSize(point.sessions);
              return (
                <g key={point.name}>
                  <circle
                    cx={coords[0]}
                    cy={coords[1]}
                    r={r}
                    fill={chartColors.indigoDark}
                    fillOpacity={0.7}
                    stroke={chartColors.indigo}
                    strokeWidth={0.5}
                  />
                  <title>{`${point.name}: ${point.sessions.toLocaleString()} sessions`}</title>
                </g>
              );
            })}
          </svg>
        ) : (
          <div style={{ height: HEIGHT }} />
        )}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <span className="text-xs text-muted-foreground">Last 7 days</span>
        <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">
          Users report &rsaquo;
        </a>
      </div>
    </Card>
  );
}
