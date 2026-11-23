import { clearSavedState } from "./storage";
import type { TestOptions } from "../types";

export function parseTestOptions(): TestOptions {
  if (typeof window === "undefined") {
    return { unlockAll: false, fast: false, debug: false };
  }
  const params = new URLSearchParams(window.location.search);
  const day = Number(params.get("day"));
  return {
    forcedDay: Number.isInteger(day) && day > 0 ? day : undefined,
    unlockAll: params.get("unlock") === "all",
    fast: params.get("fast") === "1",
    debug: params.get("debug") === "1",
  };
}

/**
 * ?reset=1 clears saved data, removes only the reset flag and reloads.
 * Returns true when the page is about to reload.
 */
export function handleResetParam(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") !== "1") return false;
    clearSavedState();
    params.delete("reset");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.location.replace(nextUrl);
    return true;
  } catch {
    return false;
  }
}
