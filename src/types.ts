export type FrameName = "classic" | "cream" | "rose" | "sage" | "kraft";
export type MotionName = "rise" | "fall" | "burst" | "drift";
export type BorderName = "none" | "stitch" | "corners" | "frame";

export interface EffectConfig {
  motion: MotionName;
  emojis: string[];
  count: number;
}

export interface PhotoConfig {
  rank: number;
  src: string;
  caption: string;
  message: string;
  frame: FrameName;
  focus: string;
  effect: EffectConfig;
  /** Decorative border printed inside the photo window. */
  border?: BorderName;
  /** One emoji in the blank strip under the hanging print on Day Complete. */
  sticker?: string;
  /** Up to two little stickers tucked into the corners of the back. */
  backStickers?: string[];
}

export interface AppTexts {
  startDay: string;
  openAlbum: string;
  cameraHint: string;
  cameraDone: string;
  printButton: string;
  printHelp: string;
  developMain: string;
  developSub: string;
  developFallback: string;
  frontHint: string;
  backHint: string;
  keepButton: string;
  toast: string;
  dayCompleteSub: string;
  lockedPrefix: string;
  viewerHint: string;
  albumButton: string;
}

export interface Caption {
  t: number;
  text: string;
}

export interface ExtraPage {
  id: string;
  type: "note" | "audio";
  title: string;
  open: boolean;
  body: string[];
  src: string;
  captions: Caption[];
  note: string;
}

export interface DayConfig {
  id: number;
  open: boolean;
  dateLabel: string;
  outro: string;
  photos: PhotoConfig[];
}

export interface AppConfig {
  appTitle: string;
  subtitle: string;
  totalDays: number;
  photoTone: "warm" | "none";
  lockedText: string;
  introNote: string;
  finishedLine: string;
  texts: AppTexts;
  extraPages: ExtraPage[];
  days: DayConfig[];
}

export type RitualState =
  | "INTRO"
  | "CAMERA"
  | "PRINT"
  | "DEVELOP"
  | "FRONT"
  | "BACK"
  | "KEEPING"
  | "DAY_COMPLETE";

export interface DayProgress {
  cameraDone: boolean;
  kept: number[];
  done: boolean;
}

export interface SavedState {
  sound: boolean;
  days: Record<string, DayProgress>;
}

export interface TestOptions {
  forcedDay?: number;
  unlockAll: boolean;
  fast: boolean;
  debug: boolean;
}

export interface AlbumEntry {
  kind: "cover" | "day" | "locked" | "extra";
  day?: DayConfig;
  extra?: ExtraPage;
}
