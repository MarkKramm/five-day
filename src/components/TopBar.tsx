
import type { RefObject } from "react";
import { AlbumIcon } from "./Icons";

interface TopBarProps {
  dayNumber: number;
  totalDays: number;
  keptCount: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenAlbum: () => void;
  albumIconRef: RefObject<HTMLButtonElement | null>;
  bounceKey: number;
  albumHidden?: boolean;
}

export function TopBar({
  dayNumber,
  totalDays,
  keptCount,
  soundOn,
  onToggleSound,
  onOpenAlbum,
  albumIconRef,
  bounceKey,
  albumHidden = false,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar__side top-bar__side--left">
        <button
          className="icon-button sound-button"
          type="button"
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={soundOn}
          onClick={onToggleSound}
        >
          <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
        </button>
      </div>

      <p className="top-bar__day">
        Day {dayNumber} <span className="top-bar__day-of">of {totalDays}</span>
      </p>

      <div className="top-bar__side top-bar__side--right">
        <button
          ref={albumIconRef}
          type="button"
          className={`icon-button album-button ${albumHidden ? "is-hidden" : ""}`}
          aria-label={`Open album, ${keptCount} photos kept today`}
          onClick={onOpenAlbum}
          aria-hidden={albumHidden}
          tabIndex={albumHidden ? -1 : 0}
        >
          <span key={bounceKey} className={bounceKey > 0 ? "album-button__icon is-bouncing" : "album-button__icon"}>
            <AlbumIcon className="album-icon" />
          </span>
          <span className="album-badge" aria-hidden="true">
            {keptCount}
          </span>
        </button>
      </div>
    </header>
  );
}
