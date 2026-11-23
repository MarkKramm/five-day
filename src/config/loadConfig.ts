import { RANKS } from "../constants";
import type {
  AppConfig,
  AppTexts,
  Caption,
  DayConfig,
  EffectConfig,
  ExtraPage,
  FrameName,
  MotionName,
  PhotoConfig,
} from "../types";
import { defaultConfig } from "./defaultConfig";

const VALID_FRAMES: FrameName[] = ["classic", "cream", "rose", "sage", "kraft"];
const VALID_MOTIONS: MotionName[] = ["rise", "fall", "burst", "drift"];

const EFFECT_BY_RANK: Record<number, EffectConfig> = {
  5: { motion: "rise", emojis: ["✨", "🌙"], count: 18 },
  4: { motion: "fall", emojis: ["🍂"], count: 16 },
  3: { motion: "burst", emojis: ["⭐", "✨"], count: 14 },
  2: { motion: "drift", emojis: ["🌟"], count: 12 },
  1: { motion: "burst", emojis: ["⭐", "✨"], count: 24 },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback;

const wholeNumber = (value: unknown, fallback: number): number => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
};

function normalizeEffect(value: unknown, rank: number): EffectConfig {
  const base = EFFECT_BY_RANK[rank] ?? EFFECT_BY_RANK[5];
  if (!isRecord(value)) return { ...base };
  const motion = VALID_MOTIONS.includes(value.motion as MotionName)
    ? (value.motion as MotionName)
    : "rise";
  const emojis =
    Array.isArray(value.emojis) && value.emojis.some((item) => typeof item === "string")
      ? value.emojis.filter((item): item is string => typeof item === "string").slice(0, 8)
      : base.emojis;
  const count = Math.max(0, Math.min(40, wholeNumber(value.count, base.count)));
  return { motion, emojis, count };
}

function normalizePhoto(raw: unknown, dayId: number, rank: number): PhotoConfig {
  const source = isRecord(raw) ? raw : {};
  const frameValue = source.frame as FrameName;
  return {
    rank,
    src: text(source.src, `photos/d${dayId}-${rank}.jpg`),
    caption: text(source.caption, `caption ${rank}`),
    message: text(source.message, `message ${rank}`),
    frame: VALID_FRAMES.includes(frameValue) ? frameValue : "classic",
    focus: text(source.focus, "50% 50%"),
    effect: normalizeEffect(source.effect, rank),
  };
}

function normalizeDay(raw: unknown, fallbackId: number): DayConfig {
  const source = isRecord(raw) ? raw : {};
  const id = wholeNumber(source.id, fallbackId);
  const rawPhotos = Array.isArray(source.photos) ? source.photos : [];

  const supplied: PhotoConfig[] = [];
  const seen = new Set<number>();
  for (const row of rawPhotos) {
    if (!isRecord(row)) continue;
    const rank = wholeNumber(row.rank, 0);
    if (!RANKS.includes(rank as (typeof RANKS)[number]) || seen.has(rank)) continue;
    seen.add(rank);
    supplied.push(normalizePhoto(row, id, rank));
  }

  // Missing photo rows are still playable: they become warm placeholders.
  for (const rank of RANKS) {
    if (!seen.has(rank)) supplied.push(normalizePhoto(null, id, rank));
  }

  return {
    id,
    open: source.open === true,
    dateLabel: text(source.dateLabel, ""),
    outro: text(source.outro, ""),
    photos: supplied.sort((a, b) => b.rank - a.rank),
  };
}

function normalizeTexts(value: unknown): AppTexts {
  const base = defaultConfig.texts;
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(
    Object.keys(base).map((key) => [key, text(source[key], base[key as keyof AppTexts])]),
  ) as unknown as AppTexts;
}

function normalizeExtraPages(value: unknown): ExtraPage[] {
  if (!Array.isArray(value)) return [];
  const pages: ExtraPage[] = [];
  const seen = new Set<string>();
  value.forEach((raw, index) => {
    if (!isRecord(raw)) return;
    const type = raw.type === "audio" ? "audio" : raw.type === "note" ? "note" : null;
    if (!type) return;
    const id = text(raw.id, `extra-${index + 1}`);
    if (seen.has(id)) return;
    seen.add(id);
    const body = Array.isArray(raw.body)
      ? raw.body.filter((item): item is string => typeof item === "string")
      : [];
    const captions: Caption[] = Array.isArray(raw.captions)
      ? raw.captions
          .filter(isRecord)
          .map((item) => ({ t: Math.max(0, Number(item.t) || 0), text: text(item.text, "") }))
          .filter((item) => item.text.length > 0)
      : [];
    pages.push({
      id,
      type,
      title: text(raw.title, ""),
      open: raw.open === true,
      body,
      src: text(raw.src, ""),
      captions,
      note: text(raw.note, ""),
    });
  });
  return pages;
}

export function normalizeConfig(raw: unknown): AppConfig {
  const source = isRecord(raw) ? raw : defaultConfig;
  const rawDays = Array.isArray(source.days) ? source.days : defaultConfig.days;
  const days = rawDays.map((day, index) => normalizeDay(day, index + 1));
  const totalDays = Math.max(
    1,
    Math.min(days.length || defaultConfig.totalDays, wholeNumber(source.totalDays, defaultConfig.totalDays)),
  );

  return {
    appTitle: text(source.appTitle, defaultConfig.appTitle),
    subtitle: text(source.subtitle, defaultConfig.subtitle),
    totalDays,
    photoTone: source.photoTone === "none" ? "none" : "warm",
    lockedText: text(source.lockedText, defaultConfig.lockedText),
    introNote: text(source.introNote, defaultConfig.introNote),
    finishedLine: text(source.finishedLine, defaultConfig.finishedLine),
    texts: normalizeTexts(source.texts),
    extraPages: normalizeExtraPages(source.extraPages),
    days: days.length ? days : defaultConfig.days.map((day, i) => normalizeDay(day, i + 1)),
  };
}

/** Loads the external, owner-editable public/config.js and normalizes it. */
export function loadConfig(): AppConfig {
  const candidate = (window as Window & { FIVE_A_DAY_CONFIG?: unknown }).FIVE_A_DAY_CONFIG;
  try {
    return normalizeConfig(candidate ?? defaultConfig);
  } catch {
    return normalizeConfig(defaultConfig);
  }
}

export function findDay(config: AppConfig, dayId: number | undefined): DayConfig | undefined {
  if (dayId === undefined) return undefined;
  return config.days.find((day) => day.id === dayId);
}
