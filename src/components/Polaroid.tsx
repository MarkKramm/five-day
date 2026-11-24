import { useLayoutEffect, useRef } from "react";
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
  const frameClass = `frame-${photo.frame}`;
  const isBack = Math.abs(Math.round(rotation / 180)) % 2 === 1;
  const pattern = tapePattern(photo.frame);
  const backStickers = photo.backStickers ?? [];
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  /**
   * The back is a sheet of paper: the note should fill it and only step down a
   * size when it genuinely would not fit. Measuring beats guessing from length.
   */
  useLayoutEffect(() => {
    const element = messageRef.current;
    if (!element) return;

    const fit = () => {
      // Not laid out yet (hidden screen / zero-height parent): leave it be.
      if (!element.clientHeight) return;
      const max = 22;
      const min = 12;
      let size = max;
      element.style.setProperty("--back-font", `${size}px`);
      while (size > min && element.scrollHeight > element.clientHeight + 1) {
        size = Math.max(min, size - 0.5);
        element.style.setProperty("--back-font", `${size}px`);
      }
      const overflows = element.scrollHeight > element.clientHeight + 1;
      element.classList.toggle("is-cropped", overflows);
    };

    fit();

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(fit);
      observer.observe(element);
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
              {backStickers.map((symbol, index) => (
                <span
                  className={`polaroid-back__sticker polaroid-back__sticker--${index + 1}`}
                  key={`${symbol}-${index}`}
                  aria-hidden="true"
                >
                  {symbol}
                </span>
              ))}
              <p className="polaroid-message handwritten" ref={messageRef}>
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
