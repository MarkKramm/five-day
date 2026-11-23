import type { DayConfig } from "../types";
import { CameraGlyph, BookGlyph } from "../components/Icons";
import { IntroFilmStrip } from "../components/IntroFilmStrip";
import type { IntroStripDay } from "../components/IntroFilmStrip";
import { useTexts, fillText } from "../lib/texts";

interface IntroScreenProps {
  day: DayConfig | null;
  allOpenDaysDone: boolean;
  totalDays: number;
  title: string;
  subtitle: string;
  note: string;
  finishedLine: string;
  strip: IntroStripDay[];
  onStart: () => void;
  onOpenAlbum: () => void;
}

export function IntroScreen({
  day,
  allOpenDaysDone,
  totalDays,
  title,
  subtitle,
  note,
  finishedLine,
  strip,
  onStart,
  onOpenAlbum,
}: IntroScreenProps) {
  const texts = useTexts();
  const showAlbum = allOpenDaysDone || !day;

  return (
    <section className="screen intro-screen">
      <div className="intro-block">
        <div className="intro-art" aria-hidden="true">
        <div className="intro-glow" />
        <div className="polaroid-stack">
          <div className="stack-card stack-card--back">
            <span className="stack-tape" />
          </div>
          <div className="stack-card stack-card--middle">
            <span className="stack-tape" />
          </div>
          <div className="stack-card stack-card--front">
            <span className="stack-card__photo" />
            <span className="stack-card__strip" />
            <span className="stack-tape" />
          </div>
          <span className="intro-spark intro-spark--one">✦</span>
          <span className="intro-spark intro-spark--two">✧</span>
        </div>
      </div>

        <div className="intro-copy">
        <h1 className="intro-title handwritten is-writing">
          <span className="intro-title__ink">{title}</span>
        </h1>
        <p className="intro-subtitle">
          Day {day?.id ?? totalDays} of {totalDays} · {subtitle}
        </p>
        <p className="intro-note">{note}</p>
        </div>

        <IntroFilmStrip items={strip} currentId={day?.id} />
      </div>

      <div className="intro-actions">
        {showAlbum ? (
          <>
            <p className="intro-arrive">{finishedLine}</p>
            <button className="btn btn-primary intro-button intro-button--special" type="button" onClick={onOpenAlbum}>
              <span className="btn-shine" aria-hidden="true" />
              <BookGlyph className="intro-button__icon" />
              <span className="intro-button__label">{texts.openAlbum}</span>
            </button>
          </>
        ) : (
          <button className="btn btn-primary intro-button intro-button--special" type="button" onClick={onStart}>
            <span className="btn-shine" aria-hidden="true" />
            <CameraGlyph className="intro-button__icon" />
            <span className="intro-button__label">{fillText(texts.startDay, { n: day.id })}</span>
          </button>
        )}
        <span className="intro-footnote" aria-hidden="true">
          ✦
        </span>
      </div>
    </section>
  );
}
