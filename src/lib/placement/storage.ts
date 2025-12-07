import type { PlacementResult } from "./types";

/**
 * Get placement result from localStorage (client-side only)
 */
export function getPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = window.localStorage.getItem("chessio_placement_v1");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Save placement result to localStorage (client-side only)
 */
export function savePlacementResult(result: PlacementResult): void {
  if (typeof window === "undefined") return;
  
  window.localStorage.setItem("chessio_placement_v1", JSON.stringify(result));
}
