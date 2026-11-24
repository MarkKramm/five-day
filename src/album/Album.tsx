import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { TIMING } from "../constants";
import { dayAccent } from "../lib/accents";
import { readDayProgress } from "../lib/storage";
import { sound } from "../lib/sound";
import type { AlbumEntry, AppConfig, DayConfig, SavedState } from "../types";
import { CloseIcon } from "../components/Icons";
import { AlbumCover } from "./AlbumCover";
import { AlbumDayPage } from "./AlbumDayPage";
import { AlbumLockedPage } from "./AlbumLockedPage";
import { AlbumViewer } from "./AlbumViewer";
import { AlbumNotePage } from "./AlbumNotePage";
import { AlbumAudioPage } from "./AlbumAudioPage";

interface AlbumProps {
  config: AppConfig;
  openDays: DayConfig[];
  lockedDay: DayConfig | null;
  saved: SavedState;
  initialDayId?: number;
  /** When set, the cover holds for a beat and then slides to this day once. */
  autoAdvanceDayId?: number;
  onClose: () => void;
}

interface ViewerState {
  dayId: number;
  rank: number;
}

export function Album({
  config,
  openDays,
  lockedDay,
  saved,
  initialDayId,
  autoAdvanceDayId,
  onClose,
}: AlbumProps) {
  const pages = useMemo<AlbumEntry[]>(() => {
    const result: AlbumEntry[] = [{ kind: "cover" }];
    openDays.forEach((day) => result.push({ kind: "day", day }));
    config.extraPages
      .filter((extra) => extra.open)
      .forEach((extra) => result.push({ kind: "extra", extra }));
    if (lockedDay) result.push({ kind: "locked", day: lockedDay });
    return result;
  }, [openDays, lockedDay, config.extraPages]);

  const [page, setPage] = useState(() => {
    const index = pages.findIndex((entry) => entry.kind === "day" && entry.day?.id === initialDayId);
    return index >= 0 ? index : 0;
  });
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const [turn, setTurn] = useState<{ key: number; dir: number } | null>(null);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const pageRef = useRef(page);
  const suppressTapUntil = useRef(0);
  const turnTimer = useRef<number | null>(null);

  const movePage = (next: number) => {
    const clamped = Math.max(0, Math.min(pages.length - 1, next));
    if (clamped !== page) {
      sound.play("flip");
      // One fake paper curl per page change: a shadow band and a bright edge
      // sweep across the window while the page track slides.
      setTurn({ key: Date.now(), dir: clamped > page ? 1 : -1 });
      if (turnTimer.current) window.clearTimeout(turnTimer.current);
      turnTimer.current = window.setTimeout(() => setTurn(null), 520);
    }
    setPage(clamped);
  };

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(
    () => () => {
      if (turnTimer.current) window.clearTimeout(turnTimer.current);
    },
    [],
  );

  // The one-time cover beat: hold on the cover, then slide to the day.
  useEffect(() => {
    if (autoAdvanceDayId === undefined) return;
    const index = pages.findIndex(
      (entry) => entry.kind === "day" && entry.day?.id === autoAdvanceDayId,
    );
    if (index <= 0) return;
    const timer = window.setTimeout(() => {
      if (pageRef.current === 0) movePage(index);
    }, TIMING.albumIntroDelayMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvanceDayId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (viewer) setViewer(null);
        else onClose();
      } else if (!viewer && event.key === "ArrowRight") {
        setPage((current) => Math.min(pages.length - 1, current + 1));
      } else if (!viewer && event.key === "ArrowLeft") {
        setPage((current) => Math.max(0, current - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pages.length, viewer]);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (viewer) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (viewer) return;
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= TIMING.albumSwipeThresholdPx && Math.abs(dx) > Math.abs(dy)) {
      suppressTapUntil.current = Date.now() + 360;
      movePage(page + (dx < 0 ? 1 : -1));
    }
  };

  const goToFirstDay = () => {
    if (Date.now() < suppressTapUntil.current || openDays.length === 0) return;
    const firstDayIndex = pages.findIndex((entry) => entry.kind === "day");
    if (firstDayIndex >= 0) movePage(firstDayIndex);
  };

  const openPhoto = (day: DayConfig, rank: number) => {
    if (Date.now() < suppressTapUntil.current) return;
    setViewer({ dayId: day.id, rank });
  };

  const viewerDay = viewer ? config.days.find((day) => day.id === viewer.dayId) : undefined;
  const viewerProgress = viewerDay ? readDayProgress(saved, viewerDay.id) : null;

  return (
    <div className="album-overlay" role="dialog" aria-modal="true" aria-label="Photo album">
      <div className="album-scrim" aria-hidden="true" />
      <button type="button" className="album-close" aria-label="Close album" onClick={onClose}>
        <CloseIcon />
      </button>

      <div className="album-book">
        {page > 0 && (
          <span className="album-ribbon" aria-hidden="true">
            <span className="album-ribbon__tail" />
          </span>
        )}
        <div
          className="album-page-window"
          onPointerDown={pointerDown}
          onPointerUp={pointerUp}
          onPointerCancel={() => (pointer.current = null)}
          onContextMenu={(event) => event.preventDefault()}
        >
          <div
            className="album-pages-track"
            style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
          >
            {pages.map((entry, index) => (
              <div className="album-page-frame" key={`${entry.kind}-${entry.day?.id ?? entry.extra?.id ?? index}`}>
                {entry.kind === "cover" && (
                  <AlbumCover
                    title={config.appTitle}
                    subtitle={config.subtitle}
                    canOpen={openDays.length > 0}
                    onOpen={goToFirstDay}
                  />
                )}
                {entry.kind === "day" && entry.day && (
                  <AlbumDayPage
                    day={entry.day}
                    progress={readDayProgress(saved, entry.day.id)}
                    tone={config.photoTone}
                    active={page === index && !viewer}
                    eager={index === page + 1 && !viewer}
                    onOpenPhoto={(rank) => openPhoto(entry.day as DayConfig, rank)}
                  />
                )}
                {entry.kind === "locked" && entry.day && (
                  <AlbumLockedPage day={entry.day} lockedText={config.lockedText} lockedPrefix={config.texts.lockedPrefix} />
                )}
                {entry.kind === "extra" && entry.extra && (
                  entry.extra.type === "note" ? (
                    <AlbumNotePage page={entry.extra} active={page === index && !viewer} />
                  ) : (
                    <AlbumAudioPage page={entry.extra} active={page === index && !viewer} />
                  )
                )}
                <span className="album-page-stack" aria-hidden="true" />
              </div>
            ))}
          </div>
          {turn && (
            <span
              key={turn.key}
              className={`album-curl ${turn.dir > 0 ? "is-next" : "is-prev"}`}
              aria-hidden="true"
            >
              <span className="album-curl__edge" />
              <span className="album-curl__shadow" />
            </span>
          )}
        </div>

        <nav className="album-nav" aria-label="Album pages">
          {pages.map((entry, index) => {
            const isCover = entry.kind === "cover";
            const isLocked = entry.kind === "locked";
            const isExtra = entry.kind === "extra";
            // Day tabs carry their day's ink accent, like the stamp on the back.
            const accentClass = entry.day ? ` album-nav__tab--${dayAccent(entry.day.id)}` : "";
            const label = isCover
              ? "Cover"
              : isLocked
                ? `🔒 ${entry.day?.id}`
                : isExtra
                  ? entry.extra?.type === "audio" ? "♪" : "✎"
                  : `${entry.day?.id}`;
            return (
              <button
                key={`${entry.kind}-nav-${entry.day?.id ?? entry.extra?.id ?? index}`}
                type="button"
                className={`album-nav__tab${accentClass} ${isLocked ? "is-locked" : ""} ${
                  page === index ? "is-current" : ""
                }`}
                aria-label={
                  isCover
                    ? "Cover"
                    : isLocked
                      ? `Locked day ${entry.day?.id}`
                      : isExtra
                        ? entry.extra?.title || (entry.extra?.type === "audio" ? "Voice note" : "Note")
                        : `Day ${entry.day?.id}`
                }
                aria-current={page === index ? "page" : undefined}
                onClick={() => movePage(index)}
              >
                {isCover ? (
                  <span className="album-nav__book" aria-hidden="true">▤</span>
                ) : isExtra ? (
                  <span className="album-nav__extra" aria-hidden="true">{label}</span>
                ) : (
                  label
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {viewer && viewerDay && viewerProgress && (
        <AlbumViewer
          key={`${viewer.dayId}-${viewer.rank}`}
          day={viewerDay}
          progress={viewerProgress}
          tone={config.photoTone}
          initialRank={viewer.rank}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
