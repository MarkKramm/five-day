# PROGRESS — Five a Day

_Last updated: final pass._

## Done

- [x] Vite + React + TypeScript skeleton; static build (`dist/`) with relative runtime config.
- [x] `public/config.js` outside the bundle, fallback to the identical built-in config, tolerant photo/frame/motion normalizer.
- [x] Design tokens (colours, polaroid formula, safe areas), desk background, top bar, sound toggle + remembered setting.
- [x] State machine INTRO → CAMERA → PRINT → DEVELOP → FRONT → BACK → KEEPING → DAY_COMPLETE, with ALBUM as a pausing overlay.
- [x] Camera taps (flash, shake, pop counter, completion copy) and CSS printer with hold-to-print (pause/resume, keyboard, LED, double-tap help).
- [x] Develop drag with stroke counter, spring-back knob, live reveal, nudge, tap fallback, sparkle/caption finish, #1 rays.
- [x] Flip front/back with swipe + button, handwritten note, stamp, date, Keep only on back.
- [x] Keep flight to the album icon, badge bounce, toast, persistence after every Keep.
- [x] Album cover, open-day pages only, locked next page, 2-2-1 mini-polaroids, deterministic tilts, rank labels, favourite rays/star, outro.
- [x] Viewer with enlarged flip polaroid and up/down photo navigation / left/right flip.
- [x] Frames, crop focus, warm tone, one DOM particle effect system, reduced-motion support.
- [x] Synthesised Web Audio sounds, haptics, default-off sound, silent failure.
- [x] Resume, `?day= ?reset= ?unlock=all ?fast= ?debug=` test links.
- [x] Missing-photo placeholder verified in ritual and album, landscape overlay, no scrolling, pointer-event only dragging/holding/swiping.
- [x] README, PROGRESS, BUILD_REPORT.
- [x] Browser-verified ritual at 390×844 and print/intro at 360×640 and 430×932, plus album, persistence, test links and dev StrictMode keep-flight.

## Batch A (v2 mechanics) — done

- [x] A1 fixed handheld pocket printer, fixed stage, photo never wider than slot, matching compact printer on DEVELOP, invalid CSS removed.
- [x] A2 alternating develop strokes with hysteresis and directional knob chevrons.
- [x] A3 cumulative two-way flip in ritual and viewer; all Flip buttons removed; Keep only on back.
- [x] A4 sound ON by default, first-gesture unlock, saved mute wins; one-shot sound hint.
- [x] Verified at 360×640 / 390×844 / 430×932 with screenshots in `test-artifacts/batch-a/`.

## Batch B (v2 layout and look) — done

- [x] B1 compact blank paper stack grouped above the title; balanced intro.
- [x] B2 drawn lamp removed; warm glow kept.
- [x] B3 empty album slots tilted like filled ones, softer placeholder, more visible tape, centered day title, balanced page.
- [x] B4 cream Argon-style camera, plain film counter, no lens "?".
- [x] B5 toast moved to lower centre above the controls.
- [x] B6 viewer two-way flip and "tap or swipe to flip" hint; existing navigation kept.
- [x] Verified at 360×640 / 390×844 / 430×932; screenshots in `test-artifacts/batch-b/`.

## Batch C (v2 text and config) — done

- [x] C1 intro note "you said anything, so here's my anything" moved to `introNote` config + types + fallback.
- [x] Default subtitle changed to "our tiny photo challenge".
- [x] `finishedLine` moved to config with identical default.
- [x] README updated for intro note/subtitle and the stock-photo replacement reminder.
- [x] Verified fallback config, direct `dist/config.js` edit without rebuild.

## Final checks — done

- [x] Clean production build and static `dist/` serving.
- [x] Full normal-speed ritual at 390×844, five photos, four strokes each.
- [x] Refresh mid-photo resumes at the same photo without repeating the camera.
- [x] Desktop 1280×800 stays a 480px centered column.
- [x] `?fast`, `?day`, `?unlock=all`, `?reset`, `?debug` all verified.
- [x] Regression screenshots at 360×640 and 390×844; final screenshots in `test-artifacts/final-v2/`.

## Change list v3 — complete

- [x] Batch A: sound hint removed; full-screen body-portal flash; printer hides after print and is gone from Develop; print/Develop card alignment; swipe only near photo; album icon hidden on Day Complete.
- [x] Batch B: fuller intro, props/dust, special Start button, tap feedback, cream-camera details, film frames, aperture shutter, top-view sage printer, film-strip develop slider + sway, neutral Keep, warmer album paper/tapes/tabs/X, richer Day Complete, moon developing locked page.
- [x] Batch C: synthesized two-part shutter, pulsed stepper printer, paper flutter/stroke ticks/chime, flip/keep swishes. Gains at or below 0.08; mute and first-tap unlock preserved.
- [x] Batch D: neutral subtitle, Day Complete line/outro, config `texts` with fallbacks, neutral sample captions/messages.
- [x] G1: no heart/envelope symbols or 💛 in source or runtime config.
- [x] Batch E: `extraPages` note/audio pages, tabs, swipe, captions, audio fallback; temporary open pages verified then restored to `[]`.
- [x] Final full normal-speed ritual, refresh resume, desktop, test links and 24 final regression screenshots.

## In progress

Part 2 proposals only. No code from Part 2 has been built. Waiting for the owner to choose IDs.

## Known issues

- Real iPhone Safari and audible/haptic output were not verified.
- Audio tap-to-seek is implemented but did not move playback in headless Chromium; marked PARTIAL in the report.
- Stock preview photos must be replaced.
- Config-open semantics and finished-day visibility remain as documented in v2.

## Known issues

- Real iPhone Safari/device testing and audible sound were unavailable.
- Stock preview photos must be replaced before sharing.
- Config-open semantics and finished-day hiding risk are documented in the report; no feature was silently changed.

## Next (optional polish)

- Add real owner photos for days 2–7 when she is ready.
- Consider richer hand-drawn SVG decorations if the owner wants more flourish.
- Optional: a tiny "sound on" confirmation pulse, if desired.

## Known issues / notes

- Real Safari and iOS device testing was not available in this environment. iPhone-specific CSS (3D flip, safe areas, dynamic viewport, audio unlock) is implemented from the spec but verified only in Chromium's mobile emulation.
- The sample day-1 photos are downloaded Pexels images included so the experience can be previewed immediately. Replace them by overwriting `public/photos/d1-*.jpg` or editing `public/config.js`.
- Test URLs that change local storage are per-URL; use `?reset=1` to start clean.
