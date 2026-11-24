import { useLayoutEffect, useRef } from "react";
import type { PhotoConfig } from "../types";
import { dayAccent } from "../lib/accents";
import { captionSlice, graphemeCount } from "../lib/text";
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
  const visibleCaption = captionSlice(photo.caption, captionChars);
  const captionLength = graphemeCount(photo.caption);
  const frameClass = `frame-${photo.frame}`;
  const isBack = Math.abs(Math.round(rotation / 180)) % 2 === 1;
  const pattern = tapePattern(photo.frame);
  const backStickers = photo.backStickers ?? [];
  const noteAreaRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  /**
   * The note is centered on the paper like real handwriting: a short line sits
   * in the middle, a long one fills the sheet and only steps down a size when
   * it genuinely would not fit.
   */
  useLayoutEffect(() => {
    const area = noteAreaRef.current;
    const message = messageRef.current;
    if (!area || !message) return;

    const fit = () => {
      // Not laid out yet (hidden screen / zero-height parent): leave it be.
      if (!area.clientHeight) return;
      const max = 22;
      const min = 12;
      let size = max;
      area.style.setProperty("--back-font", `${size}px`);
      while (size > min && message.offsetHeight > area.clientHeight + 1) {
        size = Math.max(min, size - 0.5);
        area.style.setProperty("--back-font", `${size}px`);
      }
      area.classList.toggle("is-cropped", message.offsetHeight > area.clientHeight + 1);
    };

    fit();

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(fit);
      observer.observe(area);
    }
    const fonts = document.fonts;
    if (fonts && fonts.status !== "loaded") {
      fonts.ready.then(fit).catch(() => undefined);
    }

    return () => observer?.disconnect();
  }, [photo.message]);

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
              {photo.border && photo.border !== "none" && (
                <span
                  className={`photo-border photo-border--${photo.border}`}
                  style={{ opacity: Math.min(1, Math.max(0, (reveal - 0.55) / 0.35)) }}
                  aria-hidden="true"
                />
              )}
              {photo.rank === 1 && reveal > 0.94 && (
                <span className="photo-favorite-glow" aria-hidden="true" />
              )}
            </div>
            <div className="polaroid-caption handwritten">
              <span>{visibleCaption}</span>
              {writing && captionChars !== undefined && captionChars < captionLength && (
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
              {backStickers.map((symbol, index) => (
                <span
                  className={`polaroid-back__sticker polaroid-back__sticker--${index + 1}`}
                  key={`${symbol}-${index}`}
                  aria-hidden="true"
                >
                  {symbol}
                </span>
              ))}
              <div className="polaroid-note-area" ref={noteAreaRef}>
                <p className="polaroid-message handwritten" ref={messageRef}>
                  {photo.message}
                </p>
              </div>
              <span className="polaroid-stamp">
                #{photo.rank} of 5 · Day {dayId}
              </span>
              <span
                className={`polaroid-ink-stamp polaroid-ink-stamp--${dayAccent(dayId)}`}
                aria-hidden="true"
              >
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
