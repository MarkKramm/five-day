import { useEffect, useRef, useState } from "react";
import type { ExtraPage } from "../types";

interface AlbumAudioPageProps {
  page: ExtraPage;
  active: boolean;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** A calm cassette-style player. It is independent of the effects mute. */
export function AlbumAudioPage({ page, active }: AlbumAudioPageProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);

  useEffect(() => {
    if (!active) {
      audioRef.current?.pause();
      setPlaying(false);
    }
    return () => audioRef.current?.pause();
  }, [active]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || failed) return;
    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setFailed(true);
    }
  };

  const seek = (fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const next = Math.min(audio.duration - 0.05, Math.max(0, fraction * audio.duration));
    audio.currentTime = next;
    setTime(next);
  };

  const currentCaption = [...page.captions]
    .sort((a, b) => a.t - b.t)
    .filter((caption) => caption.t <= time + 0.15)
    .pop();
  const fraction = duration > 0 ? time / duration : 0;
  const reels = playing && !failed;

  return (
    <div className="album-page album-extra-page album-audio-page">
      <span className="album-extra__spark" aria-hidden="true">♪</span>
      {page.title && <h3 className="album-extra__title handwritten">{page.title}</h3>}
      <span className="album-extra__rule" aria-hidden="true" />

      <div className={`cassette ${playing && !failed ? "is-playing" : ""} ${failed ? "is-failed" : ""}`}>
        <div className="cassette__window">
          <span className={`cassette__reel cassette__reel--left ${reels ? "is-spinning" : ""}`}>
            <i />
          </span>
          <span className="cassette__tape-line" />
          <span className={`cassette__reel cassette__reel--right ${reels ? "is-spinning" : ""}`}>
            <i />
          </span>
        </div>
        <span className="cassette__label handwritten">✦ five a day</span>
        <span className="cassette__screw cassette__screw--one" aria-hidden="true" />
        <span className="cassette__screw cassette__screw--two" aria-hidden="true" />
        <span className="cassette__screw cassette__screw--three" aria-hidden="true" />
        <span className="cassette__screw cassette__screw--four" aria-hidden="true" />
      </div>

      {failed ? (
        <p className="audio-placeholder handwritten">audio goes here</p>
      ) : (
        <>
          {page.src ? (
            <audio
              ref={audioRef}
              src={page.src}
              preload="metadata"
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onEnded={() => { setPlaying(false); setTime(0); }}
              onError={() => setFailed(true)}
            />
          ) : (
            <span className="audio-placeholder handwritten">audio goes here</span>
          )}
          <div className="cassette-controls">
            <button
              type="button"
              className="cassette-play"
              aria-label={playing ? "Pause voice note" : "Play voice note"}
              onClick={() => void toggle()}
              disabled={!page.src}
            >
              <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            </button>
            <div className="cassette-progress-wrap">
              <div
                className="cassette-progress-shell"
                onPointerDown={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  if (rect.width > 0) {
                    seek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
                  }
                }}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  if (rect.width > 0) {
                    seek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
                  }
                }}
              >
                <span className="cassette-progress-rail">
                  <span className="cassette-progress-fill" style={{ width: `${fraction * 100}%` }} />
                </span>
                <span className="cassette-progress-thumb" style={{ left: `${fraction * 100}%` }} aria-hidden="true" />
                <button
                  type="button"
                  className="cassette-progress-hit"
                  role="slider"
                  aria-label="Audio progress"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuenow={Math.round(time)}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    const rect = event.currentTarget.getBoundingClientRect();
                    if (rect.width > 0) {
                      seek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
                    }
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    const rect = event.currentTarget.getBoundingClientRect();
                    if (rect.width > 0 && event.detail !== 0) {
                      seek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight") seek(Math.min(1, fraction + 0.05));
                    if (event.key === "ArrowLeft") seek(Math.max(0, fraction - 0.05));
                  }}
                />
              </div>
              <span className="cassette-times">
                <span>{formatTime(time)}</span>
                <span>{formatTime(duration)}</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="captions-toggle"
            aria-pressed={captionsOn}
            onClick={() => setCaptionsOn((value) => !value)}
          >
            captions {captionsOn ? "on" : "off"}
          </button>
          <div className="audio-caption-window" aria-live="polite">
            {captionsOn && currentCaption && (
              <p className="audio-caption handwritten" key={currentCaption.t + currentCaption.text}>
                {currentCaption.text}
              </p>
            )}
          </div>
        </>
      )}

      {page.note && <p className="album-extra__note handwritten">{page.note}</p>}
    </div>
  );
}
