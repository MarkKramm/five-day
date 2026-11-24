import { useEffect, useRef } from "react";
import { playEffect } from "../lib/effects";
import { PhotoMedia } from "../components/PhotoMedia";
import { useTexts } from "../lib/texts";
import type { DayConfig } from "../types";

export interface StreakDay {
  id: number;
  done: boolean;
  open: boolean;
}

interface DayCompleteScreenProps {
  day: DayConfig;
  streak: StreakDay[];
  onOpenAlbum: () => void;
}

export function DayCompleteScreen({ day, streak, onOpenAlbum }: DayCompleteScreenProps) {
  const texts = useTexts();
  const confettiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      playEffect(confettiRef.current, {
        motion: "fall",
        emojis: ["🎞", "✨", "⭐", "📷"],
        count: 28,
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, []);

  const ordered = [5, 4, 3, 2, 1]
    .map((rank) => day.photos.find((photo) => photo.rank === rank))
    .filter((photo): photo is NonNullable<typeof photo> => Boolean(photo));

  return (
    <section className="screen day-complete-screen">
      <div className="complete-confetti" ref={confettiRef} aria-hidden="true" />
      <div className="complete-card">
        <span className="complete-tape complete-tape--left" aria-hidden="true" />
        <span className="complete-tape complete-tape--right" aria-hidden="true" />
        <span className="complete-stamp-impact" aria-hidden="true" />
        <span className="complete-stamp">
          DAY {day.id} <span aria-hidden="true">✓</span>
        </span>
        <div className="complete-fan complete-rail" aria-hidden="true">
          <span className="complete-rail__wire" />
          <span className="complete-rail__pin complete-rail__pin--left" />
          <span className="complete-rail__pin complete-rail__pin--right" />
          {ordered.map((photo, index) => (
            <span
              className={`complete-fan__item complete-rail__item complete-rail__item--${index + 1}`}
              key={photo.rank}
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className="complete-rail__clip" aria-hidden="true">
                <span className="complete-rail__clip-hole" />
              </span>
              <span className="complete-fan__photo">
                <PhotoMedia photo={photo} tone="warm" lazy />
              </span>
              {photo.sticker && (
                <span className="complete-fan__sticker" aria-hidden="true">
                  {photo.sticker}
                </span>
              )}
            </span>
          ))}
        </div>
        <h2 className="complete-title handwritten">That's Day {day.id}!</h2>
        <p className="complete-sub">{texts.dayCompleteSub}</p>
        {day.outro && <p className="complete-outro handwritten">{day.outro}</p>}
        <span className="complete-count" aria-label="5 of 5 photos kept">
          {ordered.length}/5 <span aria-hidden="true">🎞</span>
        </span>
        {streak.length > 0 && (
          <div className="streak-row">
            <span className="streak-row__label handwritten">your week</span>
            <div className="streak-row__stamps" aria-hidden="true">
              {streak.map((item) => (
                <span
                  key={item.id}
                  className={`streak-stamp ${item.done ? "is-done" : ""} ${
                    !item.open && !item.done ? "is-closed" : ""
                  } ${item.id === day.id ? "is-current" : ""}`}
                >
                  <span className="streak-stamp__num">{item.id}</span>
                  {item.done && <span className="streak-stamp__check">✓</span>}
                </span>
              ))}
            </div>
          </div>
        )}
        <button type="button" className="btn btn-primary btn-blossom complete-button" onClick={onOpenAlbum}>
          <span className="btn-shine" aria-hidden="true" />
          <span>{texts.openAlbum}</span>
        </button>
      </div>
    </section>
  );
}
