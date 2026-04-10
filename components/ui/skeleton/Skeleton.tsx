function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

const CARD = "skeleton-shimmer rounded-xl";
/** Base pulse block */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton-shimmer rounded-md", className)} />
  );
}

/** MetricCard */
export function SkeletonMetricCard({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, "p-4", className)}>
      <p className="text-sm invisible">Label</p>
      <p className="text-2xl font-bold invisible">0,000</p>
      <p className="text-xs invisible">↑ 0% vs last month</p>
    </div>
  );
}

/** LeadsChart */
export function SkeletonChart({ className }: { className?: string }) {
  return <div className={cn(CARD, "p-4 min-w-0", className)}>&nbsp;</div>;
}

/** ConversionRateChart */
export function SkeletonRadialChart({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, "p-4 flex items-center justify-center", className)}>
      <div className="w-full">
        <p className="text-sm invisible">Conversion Rate</p>
        <p className="text-2xl font-bold invisible">0%</p>
        <p className="text-xs invisible">↑ 0% vs last month</p>
      </div>
      <div className="invisible w-[140px] h-[140px]" />
    </div>
  );
}

/** HealthGauge */
export function SkeletonGauge() {
  return (
    <div className={cn(CARD, "p-5 flex flex-col items-center gap-1")}>
      <p className="text-sm self-start invisible">Health Label</p>
      <p className="text-xl font-semibold self-start invisible">Good</p>
      <div className="invisible w-[186px] h-[93px]" />
      <p className="text-sm self-end invisible">View More ›</p>
    </div>
  );
}

/** Small status card */
export function SkeletonStatusCard() {
  return (
    <div className={cn(CARD, "p-4")}>
      <p className="text-sm invisible">Label</p>
      <div className="mt-2 invisible inline-flex h-6 w-16 rounded-md" />
    </div>
  );
}

/** Value card */
export function SkeletonValueCard() {
  return (
    <div className={cn(CARD, "p-4")}>
      <p className="text-sm invisible">Label</p>
      <p className="text-2xl font-bold invisible">000</p>
    </div>
  );
}

/** Table */
export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn(CARD, "w-full min-w-0", className)}>
      <div className="p-4 pb-0">
        <div className="invisible h-5">Title</div>
      </div>
      <div className="px-4 py-4">
        <div className="invisible h-10" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="invisible h-12" />
        ))}
      </div>
      <div className="p-4 pt-2">
        <div className="invisible h-8" />
      </div>
    </div>
  );
}

/** Onboarding checklist */
export function SkeletonChecklist() {
  return (
    <div className={cn(CARD, "p-5")}>
      <div className="invisible text-base font-semibold mb-2">Onboarding Checklist</div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="invisible py-2 border-b border-transparent">
          <span className="text-sm">Checklist item placeholder text</span>
        </div>
      ))}
    </div>
  );
}
