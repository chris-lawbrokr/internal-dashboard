/**
 * Chart color constants for use in ApexCharts and SVG contexts.
 * ApexCharts requires hex values (cannot resolve CSS custom properties),
 * so these mirror the --chart-* variables defined in globals.css.
 */
export const chartColors = {
  primary: "#3b2559",
  tan: "#c9955e",
  gold: "#e8b86d",
  goldLight: "#ecc58e",
  sage: "#d3d3ad",
  coral: "#e2816b",

  indigo: "#312e81",
  indigoMedium: "#6366f1",
  indigoLight: "#a5b4fc",
  indigoLightest: "#e0e7ff",
  indigoDark: "#4f46e5",
  indigoStroke: "#c7d2fe",

  purple: "#a78bfa",
  purpleDark: "#7c3aed",
  purpleMedium: "#a855f7",
  purpleLight: "#d8b4fe",
  purpleTrack: "#ede9fe",
  lavender: "#b6b2d3",

  gray: "#374151",
  label: "#9ca3af",
  grid: "#f3f4f6",

  amber: "#d97706",
  green: "#22c55e",

  mutedForeground: "#777777",
  background: "#f2f2f2",
  borderLight: "#e8e8e8",
} as const;
