import { useEffect, useMemo, useRef, useState } from "react";
import { loadConfig } from "./config/loadConfig";
import { TIMING } from "./constants";
import { parseTestOptions } from "./lib/query";
import { allKept, nextUnkeptRank, normalizeKept } from "./lib/progress";
import { sound, vibrate } from "./lib/sound";
import {
  loadSavedState,
  readDayProgress,
  saveSavedState,
  writeDayProgress,
} from "./lib/storage";
import type { DayConfig, DayProgress, RitualState, SavedState } from "./types";
import { Background } from "./components/Background";
import { TopBar } from "./components/TopBar";
import { TapFeedback } from "./components/TapFeedback";
import { IntroScreen } from "./screens/IntroScreen";
import { CameraScreen } from "./screens/CameraScreen";
import { PrintScreen } from "./screens/PrintScreen";
import { DevelopScreen } from "./screens/DevelopScreen";
import { FlipScreen } from "./screens/FlipScreen";
import { DayCompleteScreen } from "./screens/DayCompleteScreen";
import { Album } from "./album/Album";
import { TextProvider } from "./lib/texts";

/** Both are read once per page load. The external config can change without a rebuild. */
const CONFIG = loadConfig();
const TESTS = parseTestOptions();

export default function App() {
  const [initialLoad] = useState(loadSavedState);
  const [saved, setSaved] = useState<SavedState>(initialLoad.state);
  const [state, setState] = useState<RitualState>("INTRO");
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumInitialDayId, setAlbumInitialDayId] = useState<number | undefined>(undefined);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [bounceKey, setBounceKey] = useState(0);
  const albumIconRef = useRef<HTMLButtonElement | null>(null);
  const toastTimer = useRef<number | null>(null);

  const forcedDay = useMemo(
    () => CONFIG.days.find((day) => day.id === TESTS.forcedDay),
    [],
  );
  const effectiveOpenDays = useMemo(
    () =>
      CONFIG.days
        .filter((day) => day.open || TESTS.unlockAll || day.id === TESTS.forcedDay)
        .sort((a, b) => a.id - b.id),
    [],
  );
  const unfinishedOpenDays = effectiveOpenDays.filter(
    (day) => !readDayProgress(saved, day.id).done,
  );
  const activeDay =
    forcedDay ?? unfinishedOpenDays[0] ?? null;
  const allOpenDaysDone = unfinishedOpenDays.length === 0;

  const initialDayId =
    forcedDay?.id ??
    activeDay?.id ??
    effectiveOpenDays[effectiveOpenDays.length - 1]?.id ??
    CONFIG.days[0]?.id ??
    1;
  const [currentDayId, setCurrentDayId] = useState(initialDayId);
  const currentDay: DayConfig =
    CONFIG.days.find((day) => day.id === currentDayId) ?? CONFIG.days[0];
  const currentProgress = readDayProgress(saved, currentDay.id);
  const nextRank = nextUnkeptRank(currentProgress);
  const nextPhoto =
    currentDay.photos.find((photo) => photo.rank === nextRank) ?? currentDay.photos[0];
  const introDay =
    activeDay ??
    effectiveOpenDays[effectiveOpenDays.length - 1] ??
    currentDay;
  const lockedDay =
    TESTS.unlockAll
      ? null
      : CONFIG.days.find(
          (day) => !effectiveOpenDays.some((openDay) => openDay.id === day.id),
        ) ?? null;

  useEffect(() => {
    sound.setEnabledSilently(saved.sound);
  }, [saved.sound]);

  useEffect(() => {
    // iPhone will not start Web Audio without a gesture. The first touch
    // anywhere (including Start Day) unlocks it for the rest of the visit.
    // If the first visit arrived without a saved preference, sound is ON and
    // we persist that now so an explicit later mute can win on the next load.
    const unlock = () => {
      void sound.unlock();
      if (!initialLoad.existed) {
        setSaved((previous) => {
          const next = { ...previous, sound: previous.sound };
          saveSavedState(next);
          return previous;
        });
      }
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    return () => document.removeEventListener("pointerdown", unlock);
  }, [initialLoad.existed]);

  useEffect(() => {
    if (!currentDay) return;
    // Preload all five current-day photos, hidden in memory, for instant printing.
    currentDay.photos.forEach((photo) => {
      const image = new Image();
      image.decoding = "async";
      image.src = photo.src;
    });
  }, [currentDay]);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (state !== "DAY_COMPLETE") return;
    const progress = readDayProgress(saved, currentDay.id);
    if (!progress.done) {
      updateSaved((previous) => {
        const latest = readDayProgress(previous, currentDay.id);
        return writeDayProgress(previous, currentDay.id, { ...latest, done: true });
      });
    }
    // Mark exactly when the completion screen is entered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentDay.id]);

  function updateSaved(updater: (previous: SavedState) => SavedState) {
    setSaved((previous) => {
      const next = updater(previous);
      saveSavedState(next);
      return next;
    });
  }

  function showToast(text: string) {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), TIMING.toastMs);
  }

  function toggleSound() {
    const next = !saved.sound;
    void sound.unlock();
    sound.setEnabled(next);
    updateSaved((previous) => ({ ...previous, sound: next }));
  }

  function openAlbumFor(dayId?: number) {
    setAlbumInitialDayId(dayId ?? effectiveOpenDays[effectiveOpenDays.length - 1]?.id);
    setAlbumOpen(true);
  }

  function openMostRecentAlbumPage() {
    if (state === "DAY_COMPLETE") {
      openAlbumFor(currentDay.id);
      return;
    }
    const recent = effectiveOpenDays[effectiveOpenDays.length - 1];
    openAlbumFor(recent?.id ?? currentDay.id);
  }

  function startDay() {
    void sound.unlock();
    if (!activeDay) {
      openMostRecentAlbumPage();
      return;
    }
    setCurrentDayId(activeDay.id);
    const progress = readDayProgress(saved, activeDay.id);
    if (!progress.cameraDone) {
      setState("CAMERA");
    } else if (nextUnkeptRank(progress) === null) {
      setState("DAY_COMPLETE");
    } else {
      setState("PRINT");
    }
  }

  function handleFilmLoaded() {
    updateSaved((previous) => {
      const progress = readDayProgress(previous, currentDay.id);
      return writeDayProgress(previous, currentDay.id, { ...progress, cameraDone: true });
    });
  }

  function handleKeepComplete() {
    const rank = nextRank;
    if (rank === null) {
      setState("DAY_COMPLETE");
      return;
    }
    const progress = readDayProgress(saved, currentDay.id);
    const kept = normalizeKept([...progress.kept, rank]);
    const updated: DayProgress = {
      ...progress,
      kept,
      done: allKept({ ...progress, kept }),
    };
    updateSaved((previous) => writeDayProgress(previous, currentDay.id, updated));

    sound.play("plop");
    vibrate(20);
    setBounceKey((value) => value + 1);
    showToast(CONFIG.texts.toast);

    if (updated.done) setState("DAY_COMPLETE");
    else setState("PRINT");
  }

  function flipCard() {
    if (state === "FRONT") {
      sound.play("flip");
      setState("BACK");
    } else if (state === "BACK") {
      sound.play("flip");
      setState("FRONT");
    }
  }

  return (
    <TextProvider texts={CONFIG.texts}>
    <div className={`app-shell state-${state.toLowerCase()}`}>
      <Background />
      <TapFeedback />
      <TopBar
        dayNumber={currentDay.id}
        totalDays={CONFIG.totalDays}
        keptCount={currentProgress.kept.length}
        soundOn={saved.sound}
        onToggleSound={toggleSound}
        onOpenAlbum={openMostRecentAlbumPage}
        albumIconRef={albumIconRef}
        bounceKey={bounceKey}
        albumHidden={state === "DAY_COMPLETE"}
      />

      <main className="app-main">
        {state === "INTRO" && (
          <IntroScreen
            day={introDay}
            allOpenDaysDone={allOpenDaysDone}
            totalDays={CONFIG.totalDays}
            title={CONFIG.appTitle}
            subtitle={CONFIG.subtitle}
            note={CONFIG.introNote}
            finishedLine={CONFIG.finishedLine}
            onStart={startDay}
            onOpenAlbum={openMostRecentAlbumPage}
          />
        )}

        {state === "CAMERA" && (
          <CameraScreen
            onFilmLoaded={handleFilmLoaded}
            onComplete={() => setState("PRINT")}
          />
        )}

        {state === "PRINT" && nextPhoto && nextRank !== null && (
          <PrintScreen
            key={`print-${currentDay.id}-${nextRank}`}
            rank={nextRank}
            fast={TESTS.fast}
            onPrinted={() => setState("DEVELOP")}
          />
        )}

        {state === "DEVELOP" && nextPhoto && (
          <DevelopScreen
            key={`develop-${currentDay.id}-${nextPhoto.rank}`}
            day={currentDay}
            photo={nextPhoto}
            tone={CONFIG.photoTone}
            fast={TESTS.fast}
            onComplete={() => setState("FRONT")}
          />
        )}

        {(state === "FRONT" || state === "BACK" || state === "KEEPING") && nextPhoto && (
          <FlipScreen
            day={currentDay}
            photo={nextPhoto}
            tone={CONFIG.photoTone}
            keeping={state === "KEEPING"}
            albumIconRef={albumIconRef}
            onFlip={flipCard}
            onKeep={() => setState("KEEPING")}
            onFlightDone={handleKeepComplete}
          />
        )}

        {state === "DAY_COMPLETE" && (
          <DayCompleteScreen
            day={currentDay}
            onOpenAlbum={() => openAlbumFor(currentDay.id)}
          />
        )}

        {(state === "PRINT" || state === "DEVELOP") && (nextPhoto === undefined || nextRank === null) && (
          <button type="button" className="btn btn-primary" onClick={() => setState("DAY_COMPLETE")}>
            Open album
          </button>
        )}

        {toast && (
          <div key={toast.id} className="toast" role="status">
            {toast.text}
          </div>
        )}
      </main>

      {albumOpen && (
        <Album
          config={CONFIG}
          openDays={effectiveOpenDays}
          lockedDay={lockedDay}
          saved={saved}
          initialDayId={albumInitialDayId}
          onClose={() => setAlbumOpen(false)}
        />
      )}

      {TESTS.debug && (
        <div className="debug-overlay" aria-hidden="true">
          <span>{albumOpen ? "ALBUM" : state}</span>
          <span>day {currentDay.id}</span>
        </div>
      )}

      <div className="rotate-overlay" role="status">
        <span>Turn your phone upright 📱</span>
      </div>
    </div>
    </TextProvider>
  );
}
