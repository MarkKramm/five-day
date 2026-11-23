import type { FrameName } from "../types";

/**
 * Washi-tape variants. Each photo frame gets its own tape pattern so the
 * album does not look like the same strip of tape was reused everywhere.
 * Unknown frame names fall back to the plain masking-tape pattern.
 */
export type TapePattern = "plain" | "stripe" | "dot" | "gingham" | "kraft";

const PATTERNS: Record<FrameName, TapePattern> = {
  classic: "plain",
  cream: "stripe",
  rose: "dot",
  sage: "gingham",
  kraft: "kraft",
};

export function tapePattern(frame: FrameName): TapePattern {
  return PATTERNS[frame] ?? "plain";
}
