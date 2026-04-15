"use client";

import { ErrorState } from "@/components/ui/error-state/ErrorState";

export default function Error() {
  return (
    <div className="h-screen w-full">
      <ErrorState status={500} />
    </div>
  );
}
