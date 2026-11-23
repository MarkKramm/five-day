import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { TIMING } from "../constants";
import { playEffect, prefersReducedMotion } from "../lib/effects";
import { sound } from "../lib/sound";
import type { DayConfig, PhotoConfig } from "../types";
import { Polaroid } from "../components/Polaroid";
import { SwayGlyph } from "../components/Icons";
import { useTexts } from "../lib/texts";

/** Sway tuning: tweak these only. */
const SWAY = {
  x: 14, // px sideways at full slider
  y: 5, // dvh: drag right = up, drag left = down
  rotate: 4, // deg
  scale: 0.04, // right = bigger, left = smaller
};

interface DevelopScreenProps {
  day: DayConfig;
  photo: PhotoConfig;
  tone: "warm" | "none";
  fast: boolean;
  onComplete: () => void;
}

interface DragState {
  pointerId: number;
  startX: number;
  startOffset: number;
  /** Finger coordinate where the current one-way leg began. */
  legStartFinger: number;
  lastFinger: number;
  /** 1 = right, -1 = left, 0 = no meaningful movement yet. */
  direction: number;
  legDistance: number;
  countedThisLeg: boolean;
  /** Movement against the current direction while waiting for hysteresis. */
  reversalDistance: number;
}

export function DevelopScreen({ day, photo, tone, fast, onComplete }: DevelopScreenProps) {
  const texts = useTexts();
  const requiredStrokes = fast ? TIMING.fastDevelopStrokes : TIMING.developStrokes;
  const [strokes, setStrokes] = useState(0);
  const [reveal, setReveal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [complete, setComplete] = useState(false);
  const [captionChars, setCaptionChars] = useState(0);
  const [nudging, setNudging] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [interactionKey, setInteractionKey] = useState(0);
  const [nextDirection, setNextDirection] = useState<"left" | "right" | null>(null);
  const [maxOffset, setMaxOffset] = useState(1);
  const captionTimers = useRef<number[]>([]);
  /** Direction of the last counted stroke; survives lifting the finger. */
  const lastCountedDirection = useRef<1 | -1 | 0>(0);

  const strokesRef = useRef(0);
  const completeRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLButtonElement | null>(null);
  const effectLayerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRefs = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = () => {
    timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
    timeoutRefs.current = [];
    captionTimers.current.forEach((timer) => window.clearTimeout(timer));
    captionTimers.current = [];
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => () => clearTimers(), []);

  const finishDevelop = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    setComplete(true);
    setReveal(1);
    setStrokes(requiredStrokes);
    strokesRef.current = requiredStrokes;
    setNudging(false);
    setShowFallback(false);
    setDragging(false);
    setOffset(0);
    dragRef.current = null;
    playEffect(effectLayerRef.current, photo.effect);
    sound.play("chime");

    let written = 0;
    intervalRef.current = window.setInterval(() => {
      written += 1;
      setCaptionChars(Math.min(photo.caption.length, written));
      if (written >= photo.caption.length && intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, Math.max(18, TIMING.captionWriteMs / Math.max(1, photo.caption.length)));
    // Guarantee the full caption is present even if the last interval tick is late.
    captionTimers.current.push(
      window.setTimeout(() => setCaptionChars(photo.caption.length), TIMING.captionWriteMs + 40),
    );

    const timer = window.setTimeout(onComplete, TIMING.developToFrontDelayMs);
    timeoutRefs.current.push(timer);
  }, [onComplete, photo.caption.length, photo.effect, requiredStrokes]);

  useEffect(() => {
    if (complete || dragging) return;
    setNudging(false);
    setShowFallback(false);
    const nudgeTimer = window.setTimeout(() => setNudging(true), TIMING.developKnobNudgeMs);
    const fallbackTimer = window.setTimeout(
      () => setShowFallback(true),
      TIMING.developTapFallbackMs,
    );
    return () => {
      window.clearTimeout(nudgeTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [complete, dragging, interactionKey]);

  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (completeRef.current) return;
    event.preventDefault();
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;
    const usableCenter = Math.max(1, (track.getBoundingClientRect().width - 12) / 2);
    setMaxOffset(usableCenter);
    const nextOffset = Math.max(-usableCenter, Math.min(usableCenter, offset));
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: nextOffset,
      legStartFinger: event.clientX,
      lastFinger: event.clientX,
      direction: 0,
      legDistance: 0,
      countedThisLeg: false,
      reversalDistance: 0,
    };
    setDragging(true);
    setNudging(false);
    setShowFallback(false);
    setInteractionKey((key) => key + 1);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is a nicety; the drag still works without it.
    }
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !track || !knob || completeRef.current) return;
    event.preventDefault();
    const trackWidth = track.getBoundingClientRect().width;

    /**
     * STROKE COUNTER: a stroke counts only when the knob reaches the far end of
     * the track, and the next one must reach the opposite end.
     */
    const maxFingerTravel = trackWidth - 12;
    const fingerTravel = event.clientX - drag.startX;
    const nextOffset = Math.max(
      -maxFingerTravel / 2,
      Math.min(maxFingerTravel / 2, drag.startOffset + fingerTravel),
    );
    setOffset(nextOffset);

    // A stroke only counts when the knob reaches the far end of the track,
    // and the next one must reach the opposite end.
    const tNow = nextOffset / Math.max(1, maxFingerTravel / 2);
    const last = lastCountedDirection.current;
    const reached = Math.abs(tNow) >= 0.94;
    const side = tNow > 0 ? 1 : -1;
    const alternates = last === 0 || side !== last;

    if (alternates && !reached) {
      const towardExpected = last === 0 ? Math.abs(tNow) : Math.max(0, -tNow * last);
      const partial = Math.min(1, towardExpected);
      setReveal((current) =>
        Math.max(current, Math.min(1, (strokesRef.current + partial * 0.9) / requiredStrokes)),
      );
      return;
    }
    if (!alternates || !reached) return;

    lastCountedDirection.current = side as 1 | -1;
    strokesRef.current += 1;
    setStrokes(strokesRef.current);
    setNextDirection(side === 1 ? "left" : "right");
    setReveal(Math.max(0, Math.min(1, strokesRef.current / requiredStrokes)));
    if (strokesRef.current >= requiredStrokes) finishDevelop();
  };

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
      setOffset(0);
      setInteractionKey((key) => key + 1);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Already released.
      }
    }
  };

  const t = complete ? 0 : Math.max(-1, Math.min(1, offset / Math.max(1, maxOffset)));
  // Drag left -> card tilts left, drops to bottom-left and shrinks a little.
  // Drag right -> tilts right, rises to upper-right and grows a little.
  const sway = prefersReducedMotion()
    ? `rotate(${(t * 3).toFixed(2)}deg)`
    : `translate3d(${(t * SWAY.x).toFixed(2)}px, ${(-t * SWAY.y).toFixed(2)}dvh, 0) rotate(${(t * SWAY.rotate).toFixed(2)}deg) scale(${(1 + t * SWAY.scale).toFixed(3)})`;
  const fillPercent = Math.max(0, Math.min(100, ((offset / Math.max(1, maxOffset)) + 1) * 50));

  return (
    <section className="screen develop-screen">
      <div className={`develop-stage ${dragging ? "is-dragging" : ""}`} style={{ transform: sway }}>
        <Polaroid
          photo={photo}
          tone={tone}
          dayId={day.id}
          dateLabel={day.dateLabel}
          rotation={0}
          reveal={reveal}
          captionChars={complete ? captionChars : 0}
          writing={complete}
          showRays={photo.rank === 1 && complete}
          showSticker={reveal >= 1}
        />
        <div className="effect-layer" ref={effectLayerRef} aria-hidden="true" />
      </div>

      <div className={`develop-controls ${complete ? "is-complete" : ""}`}>
        <div className="develop-heading">
          <p className="hint develop-hint">
            <span className="develop-hint__main">{texts.developMain}</span>
            <span className="develop-hint__sub">{texts.developSub}</span>
          </p>
          <div className="develop-dots-wrap">
            <div className="develop-dots" aria-label={`${strokes} of ${requiredStrokes} strokes`}>
              {Array.from({ length: TIMING.developStrokes }).map((_, index) => (
                <span
                  key={index}
                  className={`develop-dot ${
                    index < Math.round((strokes / requiredStrokes) * TIMING.developStrokes)
                      ? "is-filled"
                      : ""
                  }`}
                />
              ))}
            </div>
            {!complete && strokes > 0 && (
              <span className="develop-ellipsis" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
        </div>

        <div className="develop-track-wrap">
          <div className="develop-track" ref={trackRef} aria-hidden="true" style={{ "--knob-fill": `${fillPercent}%` } as React.CSSProperties}>
            <span className="develop-track__fill" />
            <span className="develop-track__perfs" />
            <span className="develop-track__chevron develop-track__chevron--left">‹</span>
            <span className="develop-track__chevron develop-track__chevron--right">›</span>
          </div>
          <button
            ref={knobRef}
            type="button"
            className={`develop-knob ${dragging ? "is-dragging" : ""} ${
              nudging && !showFallback ? "is-nudging" : ""
            }`}
            style={{ "--knob-offset": `${offset}px`, "--knob-rotation": `${offset * 0.22}deg` } as React.CSSProperties}
            aria-label={
              nextDirection
                ? `Drag ${nextDirection} to continue developing the photo`
                : "Drag side to side to develop the photo"
            }
            onPointerDown={beginDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onContextMenu={(event) => event.preventDefault()}
            disabled={complete}
            data-own-sound="true"
          >
            <span className="develop-knob__trail" aria-hidden="true" />
            <span className="develop-knob__grip" aria-hidden="true">
              <SwayGlyph className="develop-knob__icon" />
            </span>
          </button>
        </div>

        <div className="develop-fallback-window">
          {showFallback && !complete && (
            <button type="button" className="develop-fallback" onClick={finishDevelop}>
              {texts.developFallback}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
