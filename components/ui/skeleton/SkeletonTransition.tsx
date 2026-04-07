"use client";

import { useEffect, useState } from "react";

/**
 * Delays hiding skeletons so a fade-out animation can play.
 * Returns { showSkeleton, fading }.
 *  - showSkeleton: true while skeletons should be rendered
 *  - fading: true during the fade-out window (apply "skeleton-fade-out" class)
 */
export function useSkeletonTransition(loading: boolean, duration = 350) {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
      setFading(false);
      return;
    }

    // Data arrived — start fade-out, then hide skeleton
    setFading(true);
    const t = setTimeout(() => {
      setFading(false);
      setShowSkeleton(false);
    }, duration);
    return () => clearTimeout(t);
  }, [loading, duration]);

  return { showSkeleton, fading };
}
