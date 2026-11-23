import type { CSSProperties } from "react";

export interface IntroStripDay {
  id: number;
  open: boolean;
  done: boolean;
  /** First kept photo of that day, if there is one. */
  thumb?: string;
}

interface IntroFilmStripProps {
  items: IntroStripDay[];
  currentId?: number;
}

/**
 * A strip of film on the intro screen: one frame per day of the week.
 * Filled frames show a kept photo, open-but-empty frames show a dashed
 * waiting frame, and closed days stay dark. It turns the first screen into a
 * progress view without adding a second navigation control.
 */
export function IntroFilmStrip({ items, currentId }: IntroFilmStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="intro-strip" aria-label="Your week so far">
      <span className="intro-strip__perfs intro-strip__perfs--top" aria-hidden="true" />
      <div className="intro-strip__frames">
        {items.map((item, index) => {
          const state = item.thumb ? "filled" : item.open ? "waiting" : "closed";
          return (
            <span
              key={item.id}
              className={`intro-strip__frame is-${state} ${
                item.id === currentId ? "is-current" : ""
              } ${item.done ? "is-done" : ""}`}
              style={{ "--i": index } as CSSProperties}
              title={`Day ${item.id}`}
            >
              {item.thumb ? (
                <img className="intro-strip__thumb" src={item.thumb} alt="" draggable={false} />
              ) : (
                <span className="intro-strip__ghost" aria-hidden="true">
                  {item.open ? item.id : "☾"}
                </span>
              )}
              {item.done && <span className="intro-strip__done" aria-hidden="true">✓</span>}
              <span className="intro-strip__gloss" aria-hidden="true" />
            </span>
          );
        })}
      </div>
      <span className="intro-strip__perfs intro-strip__perfs--bottom" aria-hidden="true" />
    </div>
  );
}
