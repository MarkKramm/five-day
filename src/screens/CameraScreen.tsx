import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TIMING } from "../constants";
import { useTexts } from "../lib/texts";
import { sound, vibrate } from "../lib/sound";

interface CameraScreenProps {
  onFilmLoaded: () => void;
  onComplete: () => void;
}

export function CameraScreen({ onFilmLoaded, onComplete }: CameraScreenProps) {
  const texts = useTexts();
  const [film, setFilm] = useState(0);
  const [full, setFull] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [irisKey, setIrisKey] = useState(0);
  const [shaking, setShaking] = useState(false);
  const filmRef = useRef(0);
  const lastTapRef = useRef(-10000);
  const completeRef = useRef(false);
  const finishTimer = useRef<number | null>(null);
  const shakeTimer = useRef<number | null>(null);
  const lensRef = useRef<HTMLSpanElement | null>(null);

  useEffect(
    () => () => {
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current);
    },
    [],
  );

  const tapShutter = () => {
    if (completeRef.current) return;
    const now = performance.now();
    /**
     * The 250ms constant is documented in constants.ts, but a long lock would
     * swallow genuinely fast human taps (acceptance requires five quick taps
     * to count). We only collapse pointerdown events that arrive within 45ms,
     * which stops accidental duplicate firings without losing a real tap.
     */
    const duplicateGuardMs = Math.min(45, TIMING.shutterDebounceMs);
    if (now - lastTapRef.current < duplicateGuardMs) return;
    lastTapRef.current = now;

    const next = Math.min(5, filmRef.current + 1);
    filmRef.current = next;
    setFilm(next);
    setFlashKey((key) => key + 1);
    setIrisKey((key) => key + 1);
    setShaking(true);
    if (shakeTimer.current) window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => setShaking(false), 140);
    sound.play("shutter");
    vibrate(15);

    if (next >= 5) {
      completeRef.current = true;
      setFull(true);
      onFilmLoaded();
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
      finishTimer.current = window.setTimeout(onComplete, TIMING.cameraCompleteDelayMs);
    }
  };

  return (
    <section className="screen camera-screen">
      <div className="film-counter-wrap" aria-live="polite" aria-atomic="true">
        <div className="film-counter">
          <span className="film-counter__reel" aria-hidden="true">🎞</span>
          <span key={film} className="film-counter__count">{film}/5</span>
        </div>
        <div className="film-frames" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index} className={`film-frame ${index < film ? "is-filled" : ""}`} />
          ))}
        </div>
      </div>

      <div className="camera-stage">
        <div className={`camera ${shaking ? "is-shaking" : ""}`} aria-hidden="true">
          <div className="camera__toprow">
            <span className="camera__shutter-stud" />
            <span className="camera__viewfinder-bump">
              <span className="camera__viewfinder-slot" />
            </span>
            <span className="camera__topspacer" />
          </div>
          <div className="camera__body">
            <span className="camera__band">
              <span className="camera__stitching" />
            </span>
            <span className="camera__strap" />
            <span className="camera__flash-window">
              <span className="camera__flash-highlight" />
            </span>
            <span className="camera__topright">
              <span className={`camera__indicator ${full ? "is-full" : ""}`} />
              <span className="camera__sensor" />
            </span>
            <span className="camera__lens" ref={lensRef}>
              <span className="camera__lens-brass" />
              <span className="camera__lens-glass">
                <span className="camera__lens-glint" />
                {irisKey > 0 && <span key={irisKey} className="camera__iris" aria-hidden="true" />}
              </span>
            </span>
            <span className="camera__sticker" aria-hidden="true">✦</span>
            <span className="camera__badge">
              five a day <span aria-hidden="true">✦</span>
            </span>
          </div>
        </div>
        <span className="camera-shadow" aria-hidden="true" />
      </div>

      <div className="camera-actions">
        <p className="hint camera-hint" aria-live="polite">
          {full ? texts.cameraDone : texts.cameraHint}
        </p>
        <button
          type="button"
          className="shutter-button"
          aria-label={`Take photo ${Math.min(film + 1, 5)} of 5`}
          aria-disabled={full}
          onPointerDown={(event) => {
            event.preventDefault();
            tapShutter();
          }}
          onClick={(event) => {
            if (event.detail === 0) tapShutter();
          }}
          onContextMenu={(event) => event.preventDefault()}
          data-own-sound="true"
        >
          <span key={film} className="shutter-button__ring" style={{ transform: `rotate(${film * 72}deg)` }} />
          <span key={`dot-${film}`} className="shutter-button__dot" />
          {film > 0 && <span key={`ripple-${film}`} className="shutter-button__ripple" />}
        </button>
      </div>

      {flashKey > 0 &&
        createPortal(
          <span key={flashKey} className="camera-flash" aria-hidden="true" />,
          document.body,
        )}
    </section>
  );
}
