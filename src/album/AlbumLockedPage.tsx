import type { DayConfig } from "../types";
import { LockGlyph } from "../components/Icons";

interface AlbumLockedPageProps {
  day: DayConfig;
  lockedText: string;
  lockedPrefix: string;
}

export function AlbumLockedPage({ day, lockedText, lockedPrefix }: AlbumLockedPageProps) {
  return (
    <div className="album-page album-locked-page">
      <span className="album-locked__grain" aria-hidden="true" />
      <div className="locked-sky" aria-hidden="true">
        <span className="locked-moon">☾</span>
        <span className="locked-star locked-star--one">✦</span>
        <span className="locked-star locked-star--two">✧</span>
        <span className="locked-star locked-star--three">✦</span>
      </div>
      <div className="locked-developing" aria-hidden="true">
        <span className="locked-developing__photo">
          <span className="locked-q locked-q--a handwritten">?</span>
          <span className="locked-q locked-q--b handwritten">?</span>
          <span className="locked-q locked-q--c handwritten">?</span>
          <span className="locked-q locked-q--d handwritten">?</span>
          <span className="locked-badge">
            <LockGlyph className="locked-badge__icon" />
          </span>
        </span>
        <span className="locked-developing__strip handwritten">? ? ?</span>
      </div>
      <p className="locked-title handwritten">
        {lockedPrefix.replace("{n}", String(day.id))} {lockedText}
      </p>
    </div>
  );
}
