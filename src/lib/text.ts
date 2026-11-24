/**
 * Captions are typed one character at a time, and owners love emoji. Slicing a
 * string by UTF-16 units tears a surrogate pair (or an emoji sequence) in half
 * and flashes a "" replacement glyph. These helpers count and slice by
 * grapheme cluster instead, so an emoji appears whole or not at all.
 */

interface SegmenterLike {
  segment(input: string): Iterable<{ segment: string }>;
}

type SegmenterCtor = new (
  locales?: string | string[],
  options?: { granularity: "grapheme" },
) => SegmenterLike;

const SegmenterClass = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;

const segmenter =
  typeof SegmenterClass === "function"
    ? new SegmenterClass(undefined, { granularity: "grapheme" })
    : null;

export function graphemes(text: string): string[] {
  if (segmenter) {
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

export function graphemeCount(text: string): number {
  return graphemes(text).length;
}

/** Returns the first `count` graphemes, never half an emoji. */
export function captionSlice(text: string, count: number | undefined): string {
  if (count === undefined) return text;
  if (count <= 0) return "";
  const parts = graphemes(text);
  if (count >= parts.length) return text;
  return parts.slice(0, count).join("");
}
