import type { CSSProperties } from "react";
import { RANKS } from "../constants";
import type { DayConfig, DayProgress, PhotoConfig } from "../types";
import { PhotoMedia } from "../components/PhotoMedia";
import { CameraGlyph } from "../components/Icons";
import { PageDoodles } from "../components/PageDoodles";
import { dayAccent } from "../lib/accents";

const TILTS = [-3, 2, 1.5, -2, 0];

interface AlbumDayPageProps {
  day: DayConfig;
  progress: DayProgress;
  tone: "warm" | "none";
  /** The page currently under the reader's eye: replays the settle moment. */
  active?: boolean;
  onOpenPhoto: (rank: number) => void;
}

function MiniPolaroid({
  photo,
  tone,
  index,
  favorite,
  accent,
}: {
  photo: PhotoConfig;
  tone: "warm" | "none";
  index: number;
  favorite: boolean;
  accent: string;
}) {
  return (
    <div
      className={`mini-shell ${favorite ? "mini-shell--favorite" : ""}`}
      style={{ "--tilt": `${TILTS[index]}deg`, "--settle-i": index } as CSSProperties}
    >
      {favorite && <span className="mini-sunburst" aria-hidden="true" />}
      <div className={`mini-polaroid frame-${photo.frame}`}>
        <div className="mini-photo">
          <PhotoMedia photo={photo} tone={tone} lazy />
          <span className={`mini-mounts mini-mounts--${accent}`} aria-hidden="true" />
        </div>
        <span className="mini-polaroid__strip" aria-hidden="true" />
        <span
          className={`mini-tape mini-tape--left tape-color-${index % 3}`}
          aria-hidden="true"
        />
        <span
          className={`mini-tape mini-tape--right tape-color-${(index + 1) % 3}`}
          aria-hidden="true"
        />
        {favorite && (
          <span className="mini-star" aria-hidden="true">
            ⭐
          </span>
        )}
      </div>
    </div>
  );
}

export function AlbumDayPage({ day, progress, tone, active = false, onOpenPhoto }: AlbumDayPageProps) {
  const accent = dayAccent(day.id);
  return (
    <div className={`album-page album-day-page ${active ? "is-settling" : ""}`}>
      <PageDoodles seed={day.id} />
      <header className="album-day-header">
        <span
          className={`album-washi album-washi--${(day.id % 3) + 1}`}
          aria-hidden="true"
        />
        <p className="album-day-title handwritten">
          Day {day.id} <span aria-hidden="true">·</span> {day.dateLabel}
        </p>
        <span className="album-day-stitch" aria-hidden="true" />
      </header>

      <div className="album-grid">
        {RANKS.map((rank, index) => {
          const kept = progress.kept.includes(rank);
          const photo = day.photos.find((item) => item.rank === rank);
          const favorite = rank === 1;
          return (
            <div
              className={`album-slot ${favorite ? "album-slot--favorite" : ""}`}
              key={rank}
            >
              {kept && photo ? (
                <button
                  type="button"
                  className="slot-hit"
                  onClick={() => onOpenPhoto(rank)}
                  aria-label={`View photo number ${rank}`}
                >
                  <MiniPolaroid
                    photo={photo}
                    tone={tone}
                    index={index}
                    favorite={favorite}
                    accent={accent}
                  />
                </button>
              ) : (
                <div
                  className="mini-empty"
                  style={{ "--tilt": `${TILTS[index]}deg` } as CSSProperties}
                  aria-hidden="true"
                >
                  <span className="mini-empty__frame">
                    <span className="mini-empty__ghost">
                      <CameraGlyph className="mini-empty__icon" />
                    </span>
                    <span className="mini-empty__waiting handwritten">waiting</span>
                  </span>
                  <span className="mini-empty__tape mini-empty__tape--left" />
                  <span className="mini-empty__tape mini-empty__tape--right" />
                </div>
              )}
              <span className={`slot-rank handwritten ${favorite ? "slot-rank--favorite" : ""}`}>
                #{rank}
              </span>
            </div>
          );
        })}
      </div>

      {progress.done && day.outro && (
        <p className="album-outro handwritten">{day.outro}</p>
      )}
    </div>
  );
}
