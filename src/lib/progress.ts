import { RANKS } from "../constants";
import type { DayProgress } from "../types";

/** Ranks are always shown #5 → #1. */
export function ranksToPlay(): number[] {
  return [...RANKS];
}

export function normalizeKept(kept: number[]): number[] {
  return [...new Set(kept)]
    .filter((rank) => rank >= 1 && rank <= 5)
    .sort((a, b) => b - a);
}

export function nextUnkeptRank(progress: DayProgress): number | null {
  return ranksToPlay().find((rank) => !progress.kept.includes(rank)) ?? null;
}

export function allKept(progress: DayProgress): boolean {
  return ranksToPlay().every((rank) => progress.kept.includes(rank));
}

export function newestKeptFirst(kept: number[]): number[] {
  return normalizeKept(kept).sort((a, b) => b - a);
}
