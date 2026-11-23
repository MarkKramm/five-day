import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { TIMING } from "../constants";
import { playEffect, prefersReducedMotion } from "../lib/effects";
import { sound, vibrate } from "../lib/sound";
import type { DayConfig, PhotoConfig } from "../types";
import { Polaroid } from "../components/Polaroid";
import { KeepPolaroidGlyph } from "../components/Icons";
import { useTexts } from "../lib/texts";

interface FlipScreenProps {
  day: DayConfig;
  photo: PhotoConfig;
  tone: "warm" | "none";
  keeping: boolean;
  albumIconRef: RefObject<HTMLButtonElement | null>;
  onFlip: () => void;
  onKeep: () => void;
  onFlightDone: () => void;
}

export function FlipScreen({
  day,
  photo,
  tone,
  keeping,
  albumIconRef,
  onFlip,
  onKeep,
  onFlightDone,
}: FlipScreenProps) {
  const texts = useTexts();
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dragX, setDragX] = useState(0);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const effectLayerRef = useRef<HTMLDivElement | null>(null);
  const flightRef = useRef<HTMLDivElement | null>(null);
  const onFlightDoneRef = useRef(onFlightDone);
  onFlightDoneRef.current = onFlightDone;

  const isBack = Math.abs(Math.round(rotation / 180)) % 2 === 1;

  useEffect(() => {
    if (isBack || keeping) return;
    const interval = window.setInterval(() => {
      playEffect(effectLayerRef.current, photo.effect, 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isBack, keeping, photo.effect]);

  /**
   * KEEP-FLIGHT
   * Measure the card and the album icon at the moment Keep is pressed, then
   * animate the card along the vector between their centres. The cleanup is
   * deliberately symmetrical so React StrictMode's dev remount can safely
   * replay the flight instead of leaving the app stuck in KEEPING.
   */
  useEffect(() => {
    if (!keeping) return;

    const source = flightRef.current;
    const target = albumIconRef.current;
    const reduced = prefersReducedMotion();
    let timer: number | null = null;
    let animation: Animation | null = null;

    if (source && target) {
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      try {
        animation = source.animate(
          [
            { transform: "translate3d(0,0,0) scale(1) rotate(0deg)", opacity: 1 },
            {
              transform: `translate3d(${dx * 0.62}px, ${dy * 0.62}px, 0) scale(.52) rotate(${reduced ? 0 : -5}deg)`,
              opacity: 0.9,
              offset: 0.6,
            },
            {
              transform: `translate3d(${dx}px, ${dy}px, 0) scale(.15) rotate(${reduced ? 0 : -12}deg)`,
              opacity: 0.15,
            },
          ],
          {
            duration: reduced ? 220 : TIMING.keepFlightMs,
            easing: "cubic-bezier(.3,.12,.24,1)",
            fill: "forwards",
          },
        );
        animation.onfinish = () => onFlightDoneRef.current();
      } catch {
        timer = window.setTimeout(
          () => onFlightDoneRef.current(),
          reduced ? 180 : TIMING.keepFlightMs,
        );
      }
    } else {
      timer = window.setTimeout(
        () => onFlightDoneRef.current(),
        reduced ? 180 : TIMING.keepFlightMs,
      );
    }

    return () => {
      animation?.cancel();
      if (timer) window.clearTimeout(timer);
    };
    // The flight starts exactly once per KEEPING state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keeping]);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (keeping) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setDragging(true);
    setDragX(0);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Optional.
    }
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (keeping) return;
    const start = pointerRef.current;
    if (!start || start.id !== event.pointerId) return;
    // The card follows the finger a little, capped well before a full turn.
    setDragX(Math.max(-165, Math.min(165, (event.clientX - start.x) * 0.55)));
  };

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (keeping) return;
    const start = pointerRef.current;
    pointerRef.current = null;
    setDragging(false);
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const passedThreshold =
      Math.abs(dx) >= TIMING.flipSwipeThresholdPx && Math.abs(dx) > Math.abs(dy);
    setDragX(0);
    if (!passedThreshold) return;
    const direction = dx > 0 ? 1 : -1;
    setRotation((previous) => previous + direction * 180);
    sound.play("flip");
    onFlip();
  };

  const handleKeep = () => {
    if (keeping) return;
    sound.play("paperSlide");
    vibrate(20);
    onKeep();
  };

  return (
    <section className={`screen flip-screen ${keeping ? "is-keeping" : ""}`}>
      <div className="flip-stage">
        <div
          className={`flip-gesture-zone ${dragging ? "is-dragging" : ""}`}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          onContextMenu={(event) => event.preventDefault()}
          data-dragging={dragging ? "true" : "false"}
        >
          <div ref={flightRef} className="flight-card">
            <Polaroid
              photo={photo}
              tone={tone}
              dayId={day.id}
              dateLabel={day.dateLabel}
              rotation={rotation + dragX}
              instantRotation={dragging}
              showRays={photo.rank === 1}
              showSticker
            />
          </div>
        </div>
        <div className="effect-layer" ref={effectLayerRef} aria-hidden="true" />
      </div>

      <div className={`flip-actions ${keeping ? "is-gone" : ""}`}>
        {!isBack ? (
          <p className="hint flip-hint">{texts.frontHint}</p>
        ) : (
          <div className="flip-back-actions">
            <p className="hint flip-hint flip-hint--back">{texts.backHint}</p>
            <button
              type="button"
              className="btn btn-primary keep-button"
              onClick={handleKeep}
              disabled={keeping}
              data-own-sound="true"
            >
              <span className="btn-shine" aria-hidden="true" />
              <KeepPolaroidGlyph className="keep-button__icon" />
              <span>{texts.keepButton}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
