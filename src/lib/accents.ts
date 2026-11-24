export type DayAccent = "rose" | "sage" | "amber";

const ACCENTS: DayAccent[] = ["rose", "sage", "amber"];

/** Days cycle through the three paper accents so each one reads differently. */
export function dayAccent(dayId: number): DayAccent {
  const index = (((Math.trunc(dayId) - 1) % ACCENTS.length) + ACCENTS.length) % ACCENTS.length;
  return ACCENTS[index];
}
