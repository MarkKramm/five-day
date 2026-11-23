import type { DayProgress, SavedState } from "../types";

export const STORAGE_KEY = "fiveADay.v1";

const emptyDay = (): DayProgress => ({ cameraDone: false, kept: [], done: false });

export function emptySavedState(sound = true): SavedState {
  return { sound, days: {} };
}

function safeParse(raw: string | null): { state: SavedState; existed: boolean } {
  if (!raw) return { state: emptySavedState(), existed: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return { state: emptySavedState(), existed: true };
    }
    const record = parsed as Record<string, unknown>;
    const days: Record<string, DayProgress> = {};
    if (typeof record.days === "object" && record.days !== null) {
      for (const [key, value] of Object.entries(record.days as Record<string, unknown>)) {
        if (typeof value !== "object" || value === null) continue;
        const item = value as Record<string, unknown>;
        const kept = Array.isArray(item.kept)
          ? [...new Set(item.kept.filter((rank): rank is number => typeof rank === "number"))]
              .filter((rank) => rank >= 1 && rank <= 5)
              .sort((a, b) => b - a)
          : [];
        days[key] = {
          cameraDone: item.cameraDone === true,
          kept,
          done: item.done === true,
        };
      }
    }
    // First visits default to sound ON; an explicit saved mute still wins.
    return { state: { sound: record.sound !== false, days }, existed: true };
  } catch {
    return { state: emptySavedState(), existed: true };
  }
}

/** Every localStorage call is guarded: private mode / full storage cannot break the page. */
export function loadSavedState(): { state: SavedState; existed: boolean } {
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return { state: emptySavedState(), existed: false };
  }
}

export function saveSavedState(state: SavedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silent by design. The ritual still works, just without saving.
  }
}

export function clearSavedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silent.
  }
}

export function readDayProgress(state: SavedState, dayId: number): DayProgress {
  return state.days[String(dayId)] ?? emptyDay();
}

export function writeDayProgress(
  state: SavedState,
  dayId: number,
  progress: DayProgress,
): SavedState {
  return {
    ...state,
    days: { ...state.days, [String(dayId)]: progress },
  };
}

export { emptyDay };
