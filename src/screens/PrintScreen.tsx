import { useCallback, useEffect, useRef, useState } from "react";
import { TIMING } from "../constants";
import { sound } from "../lib/sound";
import { Printer } from "../components/Printer";
import { useTexts } from "../lib/texts";

interface PrintScreenProps {
  rank: number;
  fast: boolean;
  onPrinted: () => void;
}

export function PrintScreen({ rank, fast, onPrinted }: PrintScreenProps) {
  const texts = useTexts();
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [finished, setFinished] = useState(false);
  const [holdHelp, setHoldHelp] = useState(0);
  const progressRef = useRef(0);
  const holdingRef = useRef(false);
  const finishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const downAtRef = useRef(0);
  const quickTapsRef = useRef(0);
  const finishTimerRef = useRef<number | null>(null);
  const holdMs = fast ? TIMING.fastPrintHoldMs : TIMING.printHoldMs;

  const stopHold = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setHolding(false);
    lastFrameRef.current = 0;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sound.stopWhirr();

    const heldFor = performance.now() - downAtRef.current;
    if (heldFor < TIMING.quickTapThresholdMs && progressRef.current < 1) {
      quickTapsRef.current += 1;
      if (quickTapsRef.current >= 2) {
        quickTapsRef.current = 0;
        setHoldHelp((help) => help + 1);
      }
    } else if (heldFor >= TIMING.quickTapThresholdMs) {
      quickTapsRef.current = 0;
    }
  }, []);

  const finishPrint = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    holdingRef.current = false;
    setHolding(false);
    setFinished(true);
    setProgress(1);
    progressRef.current = 1;
    sound.stopWhirr();
    sound.play("printDone");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    finishTimerRef.current = window.setTimeout(onPrinted, TIMING.printFinishDelayMs);
  }, [onPrinted]);

  const frame = useCallback(
    (time: number) => {
      if (!holdingRef.current || finishedRef.current) return;
      if (!lastFrameRef.current) lastFrameRef.current = time;
      const delta = Math.min(52, Math.max(0, time - lastFrameRef.current));
      lastFrameRef.current = time;
      const next = Math.min(1, progressRef.current + delta / holdMs);
      progressRef.current = next;
      setProgress(next);
      if (next >= 1) {
        finishPrint();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [finishPrint, holdMs],
  );

  const startHold = useCallback(() => {
    if (finishedRef.current || holdingRef.current) return;
    holdingRef.current = true;
    setHolding(true);
    downAtRef.current = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastFrameRef.current = 0;
    sound.startWhirr();
    rafRef.current = requestAnimationFrame(frame);
  }, [frame]);

  useEffect(() => {
    if (!holding) return;
    const release = () => stopHold();
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [holding, stopHold]);

  useEffect(
    () => () => {
      holdingRef.current = false;
      sound.stopWhirr();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
    },
    [],
  );

  return (
    <section className={`screen print-screen ${finished ? "is-finished" : ""}`}>
      <div className="print-heading">
        <p className="handwritten print-heading__label">Photo #{rank}</p>
      </div>

      <div className="print-stage">
        <Printer done={finished} progress={progress} holding={holding} />
        <div
          className={`print-clip ${finished ? "is-printed" : ""}`}
          aria-hidden="true"
          style={{ "--print-progress": progress } as React.CSSProperties}
        >
          <div className="blank-polaroid">
            <span className="blank-polaroid__photo" />
            <span className="blank-polaroid__strip" />
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          {finished ? "Print complete" : holding ? "Printing" : progress > 0 ? "Printing paused" : "Ready to print"}
        </span>
        <span className="print-effects" aria-hidden="true">
          {finished && <span className="print-twinkle">✦</span>}
        </span>
      </div>

      <div className={`print-actions ${finished ? "is-gone" : ""}`} aria-hidden={finished}>
        <div className="print-help-window" aria-live="polite">
          {holdHelp > 0 && (
            <p key={holdHelp} className="print-help is-pulsing">
              Press and hold
            </p>
          )}
        </div>
        <button
          type="button"
          className={`hold-button ${holding ? "is-holding" : ""}`}
          onPointerDown={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLButtonElement).focus({ preventScroll: true });
            startHold();
          }}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          onPointerLeave={stopHold}
          onKeyDown={(event) => {
            if ((event.key === " " || event.key === "Enter") && !event.repeat) {
              event.preventDefault();
              startHold();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              stopHold();
            }
          }}
          onBlur={stopHold}
          onContextMenu={(event) => event.preventDefault()}
          aria-label="Hold to print photo"
          data-own-sound="true"
          disabled={finished}
        >
          <span className="hold-button__fill" style={{ width: `${progress * 100}%` }} />
          <span className="hold-button__shine" />
          <span className="hold-button__label">{texts.printButton}</span>
          <span className="hold-button__percent" aria-hidden="true">
            {Math.round(progress * 100)}%
          </span>
        </button>
        <span
          className="sr-only"
          role="progressbar"
          aria-label="Printing progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        />
        <span className="print-ornament" aria-hidden="true">· · ·</span>
      </div>
    </section>
  );
}
