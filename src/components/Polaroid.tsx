import type { CSSProperties } from "react";
import type { PhotoConfig } from "../types";
import { tapePattern } from "../lib/tape";
import { PhotoMedia } from "./PhotoMedia";

interface PolaroidProps {
  photo: PhotoConfig;
  tone: "warm" | "none";
  dayId: number;
  dateLabel: string;
  /** Cumulative Y rotation in degrees: odd half-turns show the back. */
  rotation: number;
  /** Disable the 500ms flip easing while a finger is steering the card. */
  instantRotation?: boolean;
  reveal?: number;
  captionChars?: number;
  writing?: boolean;
  showSticker?: boolean;
  showRays?: boolean;
  lazy?: boolean;
}

export function Polaroid({
  photo,
  tone,
  dayId,
  dateLabel,
  rotation,
  instantRotation = false,
  reveal = 1,
  captionChars,
  writing = false,
  showSticker = true,
  showRays = false,
  lazy = false,
}: PolaroidProps) {
  const visibleCaption =
    captionChars === undefined ? photo.caption : photo.caption.slice(0, Math.max(0, captionChars));
  const backSize = photo.message.length > 160 ? 16 : photo.message.length > 110 ? 18 : 21;
  const frameClass = `frame-${photo.frame}`;
  const isBack = Math.abs(Math.round(rotation / 180)) % 2 === 1;
  const pattern = tapePattern(photo.frame);

  return (
    <div className={`polaroid-shell ${showRays ? "polaroid-shell--favorite" : ""}`}>
      {showRays && <span className="favorite-rays" aria-hidden="true" />}
      <div className="polaroid-scene">
        <div
          className={`polaroid-flipper ${instantRotation ? "is-dragging" : ""}`}
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          <article
            className={`polaroid-face polaroid-front ${frameClass}`}
            aria-hidden={isBack}
          >
            {showSticker && (
              <span className="rank-sticker" aria-hidden="true">
                #{photo.rank}
                {photo.rank === 1 && <span className="rank-sticker__star">⭐</span>}
              </span>
            )}
            <div className="polaroid-photo">
              <PhotoMedia photo={photo} tone={tone} reveal={reveal} lazy={lazy} />
              {photo.rank === 1 && reveal > 0.94 && (
                <span className="photo-favorite-glow" aria-hidden="true" />
              )}
            </div>
            <div className="polaroid-caption handwritten">
              <span>{visibleCaption}</span>
              {writing && captionChars !== undefined && captionChars < photo.caption.length && (
                <span className="caption-caret" aria-hidden="true" />
              )}
            </div>
            {photo.frame === "kraft" && (
              <>
                <span className={`tape tape--left tape--${pattern}`} aria-hidden="true" />
                <span className={`tape tape--right tape--${pattern}`} aria-hidden="true" />
              </>
            )}
          </article>

          <article
            className={`polaroid-face polaroid-back ${frameClass}`}
            aria-hidden={!isBack}
          >
            <div className="polaroid-back__inner">
              <span className="polaroid-back__margin" aria-hidden="true" />
              <p
                className="polaroid-message handwritten"
                style={{ "--back-font": `${backSize}px` } as CSSProperties}
              >
                {photo.message}
              </p>
              <span className="polaroid-stamp">
                #{photo.rank} of 5 · Day {dayId}
              </span>
              <span className="polaroid-ink-stamp" aria-hidden="true">
                <span className="polaroid-ink-stamp__ring" />
                <span className="polaroid-ink-stamp__day">DAY {dayId}</span>
                <span className="polaroid-ink-stamp__date handwritten">{dateLabel}</span>
              </span>
            </div>
            <span className={`polaroid-back-tape tape--${pattern}`} aria-hidden="true" />
            <span className="polaroid-peel" aria-hidden="true" />
          </article>
        </div>
      </div>
    </div>
  );
}
