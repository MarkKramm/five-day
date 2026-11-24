/**
 * EVERY TUNABLE NUMBER AND COLOUR LIVES HERE.
 * Change a value, save, and run `npm run dev` (or `npm run build`).
 */
export const COLORS = {
  night: "#1E1712",
  wood: "#3A2A1E",
  woodLight: "#4A3626",
  lamp: "rgba(255,217,160,0.20)",
  polaroid: "#FFFDF8",
  paper: "#FFF6E5",
  ink: "#3B2F2A",
  amber: "#F4A94E",
  amberDark: "#C97F2A",
  rose: "#E88A8A",
  sage: "#8FBF9F",
  muted: "#CBB8A3",
  locked: "#6B625B",
  leather: "#5B3A29",
  gold: "#E8C48A",
  // Photo-frame colours
  frameClassic: "#FFFDF8",
  frameCream: "#FFF3DC",
  frameRose: "#FBE3E3",
  frameSage: "#E2F0E6",
  frameKraft: "#D9BF9B",
} as const;

/** Injected onto :root so the CSS and the JS share one source of truth. */
export const COLOR_VARS: Record<string, string> = {
  "--night": COLORS.night,
  "--wood": COLORS.wood,
  "--wood-light": COLORS.woodLight,
  "--lamp": COLORS.lamp,
  "--polaroid": COLORS.polaroid,
  "--paper": COLORS.paper,
  "--ink": COLORS.ink,
  "--amber": COLORS.amber,
  "--amber-dark": COLORS.amberDark,
  "--rose": COLORS.rose,
  "--sage": COLORS.sage,
  "--muted": COLORS.muted,
  "--locked": COLORS.locked,
  "--leather": COLORS.leather,
  "--gold": COLORS.gold,
  "--frame-classic": COLORS.frameClassic,
  "--frame-cream": COLORS.frameCream,
  "--frame-rose": COLORS.frameRose,
  "--frame-sage": COLORS.frameSage,
  "--frame-kraft": COLORS.frameKraft,
};

export const LAYOUT = {
  /** Polaroid width. Height becomes this + 52px, never more than 52dvh. */
  polaroidWidthCss: "min(78vw, 340px, calc(52dvh - 52px))",
  topBarHeight: 52,
  appMaxWidth: 480,
};

export const TIMING = {
  /** A full print needs this much accumulated hold time (milliseconds). */
  printHoldMs: 2500,
  fastPrintHoldMs: 500,
  /** The finished blank print pauses this long before DEVELOP. */
  printFinishDelayMs: 650,
  /** Shutter taps closer together than this are ignored. */
  shutterDebounceMs: 250,
  /** Time to show the full film-roll message before PRINT. */
  cameraCompleteDelayMs: 1200,
  /** Number of develop strokes needed. */
  developStrokes: 5,
  fastDevelopStrokes: 1,
  /**
   * How far the knob must travel, measured against the knob's full left-to-
   * right travel, before a one-way stroke counts. (60% of usable travel.)
   */
  strokeDistanceFraction: 0.6,
  developKnobNudgeMs: 4000,
  developTapFallbackMs: 10000,
  /** Finger travel in the opposite direction required before a leg reverses. */
  strokeReversalPx: 10,
  /** Caption typewriter after the final stroke. */
  captionWriteMs: 600,
  /** Short beat showing the finished print before FRONT. */
  developToFrontDelayMs: 1150,
  flipMs: 500,
  keepFlightMs: 600,
  pageSlideMs: 300,
  /** How long the album sits on its cover before sliding to the day. */
  albumIntroDelayMs: 1000,
  toastMs: 1200,
  flipSwipeThresholdPx: 40,
  albumSwipeThresholdPx: 42,
  soundHintMs: 4000,
  quickTapThresholdMs: 300,
} as const;

/**
 * Pocket-printer geometry. Everything scales from the polaroid width so the
 * printer is always wider than the paper and the slot is never narrower.
 */
export const PRINT_LAYOUT = {
  printerWidthFactor: 1.22,
  printerSlotExtraPx: 14,
  printerHeightCss: "clamp(150px, 25dvh, 215px)",
  /** How much smaller the matching printer on DEVELOP is. */
  compactScale: 0.72,
  headingHeightPx: 27,
  /** Small visible lip of blank paper before the hold starts. */
  paperLipPx: 16,
} as const;

export const EFFECTS = {
  particleCap: 40,
  /** Particles per second for the gentle idle shimmer on FRONT. */
  idleParticlesPerSecond: 1,
  lowEndCoreCount: 4,
} as const;

export const SOUND = {
  maxGain: 0.08,
} as const;

export const RANKS = [5, 4, 3, 2, 1] as const;
export type Rank = (typeof RANKS)[number];
