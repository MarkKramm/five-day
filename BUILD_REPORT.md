# BUILD REPORT — Five a Day

## Stack and why

- **Vite 7 + React 19 + TypeScript + CSS (no component or animation library).**
- React/Typescript gives the project a clear state machine and small, named files for the owner to keep editing. Plain CSS keeps the motion limited to `transform`/`opacity`, avoids a heavy runtime, and allows the exact physical desk/polaroid look.
- **Runtime config:** `public/config.js` is copied as-is to `dist/config.js` and loaded by a relative `<script src="./config.js">` before the app. It can be edited in `dist/` without rebuilding. `loadConfig()` falls back to an identical built-in config and normalizes every field.
- **Self-hosted font:** Caveat 500/700 through `@fontsource/caveat`, bundled by Vite. No CDN or runtime network dependency (except the owner's own photos).
- **Sound:** a tiny Web Audio synthesizer, no audio files. **Effects:** one generic DOM particle function.
- Production is a static `dist/` directory with `index.html`, `config.js` and `photos/`.

## Section 17 acceptance checklist

| # | Item | Status | Evidence / notes |
|---|---|---|---|
| 1 | Empty storage: intro Day 1; Start Day 1 → camera | **PASS** | Browser test at 360×640 and 390×844. |
| 2 | Five shutter taps (incl. very fast) count exactly 5 and move to printing | **PASS** | Rapid 70ms taps → `5/5`, "Film roll full! Let's print them.", then PRINT. |
| 3 | Hold prints, release pauses, resume continues, 2.5s completes, LED green | **PASS** | Normal mode: 43% → pause → 78% → reaches DEVELOP; LED class `is-done`. |
| 4 | Four alternating strokes develop; releasing keeps count; 4s nudge and 10s fallback | **PASS** | Dots went 1→2→3→4 => FRONT. Nudge timer implemented via class; fallback seen after 11s and completes the develop. |
| 5 | Swipe flips; Flip button flips; Keep only on back | **PASS** | Pointer swipe test reached BACK; Keep count 0 on front / 1 on back. |
| 6 | Keep flies to album icon, badge increments, next #4…#1 | **PASS** | Keep → PRINT, badge `1`, next label "Photo #4"; full run reached all five. |
| 7 | After #1: confetti, day card, album 2-2-1, labels, larger #1 with rays + star | **PASS** | Full run ended DAY_COMPLETE with 5 kept; album had 5 filled slots, `#5…#1`, star + rays + outro. |
| 8 | Album mid-ritual: only kept slot filled; close returns to same state | **PASS** | After keeping #5: 1 filled, 4 dashed; closing returned to PRINT (same state). |
| 9 | Reopen resumes at next unkept photo | **PASS** | Saved `{"sound":false,"days":{"1":{"cameraDone":true,"kept":[5],"done":false}}}`, reload → PRINT Photo #4. |
| 10 | Day 2 closed: Cover, Day 1, one locked Day 2 only; no Days 3–7 | **PASS** | Tabs `▤`, `1`, `🔒2`; locked page titled "Day 2 opens tomorrow 🔒"; one day page. |
| 11 | Missing/broken photo shows placeholder, no crash | **PASS** | In a browser run, `d1-5.jpg` was served as 404; the developed polaroid rendered 1 warm `.photo-placeholder`, the full ritual reached FRONT, the photo was kept, and the album slot also rendered the placeholder. The only console messages were the intentional 404s; no page error. |
| 12 | No scroll/selection/image drags/context menu/pull-to-refresh | **PASS (CSS/JS)** | `position: fixed; inset:0`, `overflow:hidden`, `overscroll-behavior:none`, user-select/callout/drag and contextmenu guards on interactive layers; `scrollHeight == innerHeight` at all three sizes. |
| 13 | Works at 360×640, 390×844, 430×932; polaroid ≤52% screen; tap targets ≥44px | **PASS** | Screenshots + geometry at all three; polaroid measured 356px / 844 = **42.2%**. No overflow. The visual swipe hint says "↔" without a separate button, which is not a separate tap target. |
| 14 | Landscape shows "Turn your phone upright 📱" | **PASS** | 844×390 emulation: overlay `display:flex`, exact copy. |
| 15 | All test links work | **PASS** | `?day=3` (forced ritual + album), `?reset=1` (storage null, parameter removed), `?unlock=all` (7 days, 0 locked), `?fast=1` (0.5s print, 1 stroke), `?debug=1` (state overlay). |
| 16 | config editable in `dist/` without rebuild; missing config → fallback | **PASS** | Editing `dist/config.js` title showed "Test Runtime Title" on reload with no rebuild; aborting `config.js` still showed Day 1 defaults. |
| 17 | `npm install`, `npm run dev`, `npm run build` work; `dist/` runs statically | **PASS** | `npm install` completed; Vite dev server served on 4174; production build served from `dist/` via a plain static server. Build output includes `config.js` and `photos/`. |
| 18 | README, PROGRESS, BUILD_REPORT exist and are accurate | **PASS** | All three in the project root. |

## Feature status by priority

### MUST

| Feature | Status |
|---|---|
| Project/build setup | PASS |
| Runtime config + built-in fallback | PASS |
| Full state machine (INTRO, CAMERA, PRINT, DEVELOP, FRONT, BACK, KEEPING, DAY_COMPLETE; ALBUM overlay) | PASS |
| Camera taps with flash, shake, counter pop, completion | PASS |
| Hold-to-print with pause/resume, keyboard, progress fill, LED | PASS |
| Drag-to-develop, 4 strokes, release keeps progress | PASS |
| Flip via swipe and button; Keep only on back | PASS |
| Keep shrink/arc flight to album icon, badge, toast, next rank | PASS |
| Album cover, day pages, locked next day, bottom nav | PASS |
| 2-2-1 layout, always-visible rank labels, dashed vs kept states | PASS |
| Viewer front/back | PASS |
| Persistence and resume | PASS |
| Missing photo / missing config placeholders | PASS |
| Mobile touch rules, pointer events, no context menu/drag/selection | PASS |
| Safe areas, fixed one-screen shell, no scrolling | PASS |
| Landscape overlay | PASS |
| Sound default off but remembered | PASS |
| #1 special rays/star | PASS |

### SHOULD

| Feature | Status |
|---|---|
| Frames classic/cream/rose/sage/kraft + tape | PASS |
| Particle system rise/fall/burst/drift, low-end halving, reduced-motion off | PASS |
| Crop focus | PASS |
| Warm/none photo tone | PASS |
| #1 sunburst and ⭐ in album | PASS |
| Locked-tab styling | PASS |
| Album page slide + swipe | PASS |
| Idle develop nudge + 10s fallback | PASS |
| Test links | PASS |
| README for a non-programmer | PASS |
| Photo preload in memory | PASS |

### NICE

| Feature | Status |
|---|---|
| Synthesised sounds and haptics | PASS (implemented; audible output not testable in headless Chromium) |
| Intro decorative polaroid stack + slow glow | PASS |
| Cover "tap to open" | PASS |
| Lamp glow pulse | PASS |
| Viewer up/down slot navigation | PASS (also left/right flip) |

## Not done / limitations

- **Real device testing:** no physical iPhone Safari or low-end Android device was available. Chromium mobile emulation was used at 360×640, 390×844 and 430×932, plus 844×390 landscape. iOS-specific code (3D backface, safe-area env vars, `100dvh`, audio unlock, pointer capture, no overscroll) follows the spec but is not claimed as device-verified.
- **Audible sound:** Web Audio runs without console errors, but headless Chromium cannot confirm audible output or haptics (iPhone has no vibration).
- No page-curl album animation (explicitly out of scope; horizontal slide used).
- No name, account, comments, analytics, forms or tracking anywhere.

## Deviations, improvements and assumptions

1. **Stack:** React + TypeScript + Vite + hand-written CSS. No animation/sound libraries were added, keeping the bundle and GPU work small.
2. **Shutter debounce:** the spec asks for a 250ms debounce but also for five very fast taps to count exactly 5. A real 250ms lock swallows intentional taps. The constant remains `250ms` in `constants.ts`, but only taps within **45ms** are collapsed as accidental duplicates. This meets both acceptance items 2 and the spec intent.
3. **Develop threshold:** the track is 240px wide and the knob is 60px, which leaves 180px of centre travel. A literal 60% of the full groove (144px) does not fit in half a sweep. The stroke measure uses 60% of usable centre travel, capped at a forgiving 92px, with the spec's four alternating strokes. Note: for a thumb that cannot sweep far, the cap makes each leg count at 92px of finger travel; this is a deliberate playability improvement on small screens.
4. **Config `open` semantics:** per section 11, a day is available only if its config flag is `open: true`. Opening Day 2 in the config makes **both** Day 1 and Day 2 available. PROGRESS.md/README explicitly tell the owner to close the previous day if they want only one current day. The README also suggests closing finished days because closed days are hidden from the album. This is the most reasonable interpretation of the two parts of the spec.
5. **Album opening page:** opens on the most recent open day from the top bar, the completed day from the end-of-day card, and the Cover if the album has no day pages. The Cover can be reached through its tab; tapping it goes to the first day. An earlier prototype opened on the Cover first, then was aligned to section 8.1's "most recent open day".
6. **Test link forced day** inserts that day into the album even if it is closed, and the ritual starts on it as specified.
7. **Album `#1` star when missing photo:** the star is attached to the mini polaroid and appears when the slot is kept. Rank labels are outside the polaroid as specified.
8. **Printing visual:** the blank is clipped by the printer slot and the visible window grows with progress. Once complete it expands to its full blank-card size and the hold controls fade out. This is a readability improvement, still with no photo preview.
9. **Sample content:** day 1 uses five warm stock photographs downloaded from Pexels so the preview is meaningful. They are normal static files in `public/photos/` and can be replaced by the owner. Content text is placeholder-friendly and contains no names.
10. **Reduced motion:** big motion transitions are reduced to near-zero and particles are skipped. The album rays are static.
11. **`?reset=1`** removes only the reset flag and reloads, preserving any other test flags.
12. **Keyboard:** the print button supports Space/Enter; Escape closes the album/viewer; arrows change album pages.
13. **Dialogs:** no `alert()` anywhere. Errors are silent and use placeholders.

## How to run locally

```bash
npm install
npm run dev
```

Open the printed local address. To stop, press `Ctrl+C`.

## How to build

```bash
npm run build
```

The static site is in **`dist/`**.

## How to deploy to Netlify

1. Sign in to Netlify.
2. Choose **Add new site → Deploy manually** and drag the **contents of `dist/`** (not the folder) into the upload area. Alternatively connect the Git repo with build command `npm run build` and publish directory `dist`.
3. Share the generated `https://…netlify.app` link.

The `config.js` and `photos/` at the top of `dist/` must be uploaded next to `index.html`. To update content without rebuilding, edit `dist/config.js` / `dist/photos/` and re-upload.

## How to add a new day (non-programmer)

1. Save five photos as `public/photos/d2-5.jpg` … `d2-1.jpg` (rank 5 seen first, rank 1 = favourite).
2. Open `public/config.js` in VS Code and find the day row (e.g. id 2).
3. Fill `dateLabel`, `outro` and five photo rows with `rank`, `src`, `caption`, `message`, optional `frame`, `focus`, `effect`.
4. Set `open: true`. If you want this to be the only active day, set the previous day's `open` to `false` (closed days are hidden from the album).
5. Run `npm run build`, or copy the photos and edited `config.js` into `dist/` directly (no rebuild needed).
6. Upload the new `dist/` contents to Netlify.
7. Full example and troubleshooting are in `README.md`.

## Hidden test links

| Link | Purpose |
|---|---|
| `?day=3` | Force the ritual/album onto that day (ignores open/done). |
| `?reset=1` | Clear saved progress, remove the flag, reload. |
| `?unlock=all` | Treat all config days as open. |
| `?fast=1` | Print hold 0.5s; develop needs 1 stroke. |
| `?debug=1` | Small state name overlay bottom-left. |

## Known issues and suggested next steps

- Test the final build on an actual iPhone (Safari) and a low-end Android device, especially the 3D flip, safe-area spacing at the notch, audio unlock and the keep flight.
- Audible sound/haptics cannot be verified headlessly.
- Consider a lightweight in-app content check (a dev-only script) that verifies each `src` file exists when preparing a day, to save the owner from typos in filenames.
- Real owner photos should replace the stock day-1 samples before sending the link.

## Verification honesty

Browser-tested with a real headless Chromium against the static `dist/` build and the Vite dev server at the sizes listed. Tests covered the complete five-photo ritual twice (fast and normal printing/developing), rapid shutter taps, pause/resume, the 4-stroke develop, front/back flip, swipe flip, Keep flight, persistence and resume, album mid/final/locked/cover states, viewer, the test links, config edits without a rebuild, missing config fallback, a deliberately 404 photo through develop/keep/album, landscape, and viewport geometry. No browser console errors or page errors were recorded in the successful runs (only the expected 404s in the missing-photo test). Real iOS Safari and audible output were not verified.

---

## Change list v2, batch A — mechanics

**Status: complete.** Verified in real headless Chromium against the production `dist/` build at 360×640, 390×844 and 430×932, plus `?fast=1`. Screenshots in `test-artifacts/batch-a/`.

| Item | Status | What was verified |
|---|---|---|
| A1. Printer is a fixed handheld pocket printer; photo dispenses downward | **PASS** | Settled measurements: printer top 83px at 0/50/100% on 360×640, 390×844 and 430×932 (0px movement). Printer is `var(--pw) × 1.16` wide with a slot of `var(--pw) + 14px`; measured card width 280.8px < slot 294.8px at 360px, 304.2px < 318.2px at 390px, 335.4px < 349.4px at 430px. The stage now has a fixed height, the clip window is absolute under the slot, and only the blank moves (`translateY` driven by `--print-progress`). Printer top at 0/50/100% after the 330ms entry animation settles: **83.000 → 83.000 → 83.000px on all three sizes (delta 0.000px)**. An earlier measurement taken during the screen's entry animation showed a 1.05px transient; the settled layout is exactly fixed, as required. Hold button bottom 615/614 at 360×640, 819/818 at 390×844, 906 at 430×932 — never off-screen. LED red → green. Compact printer on DEVELOP uses the same component and shape. The invalid `calc(... - height)` rule and the old print-paper-window approach were deleted. |
| A2. Develop strokes must alternate | **PASS** | Ten consecutive left drags stayed at **1 stroke** (the first direction is free); knob then pointed `→`. A right stroke → 2 dots, left → 3, right → 4 → FRONT, with the finger lifted between every stroke. Reversal hysteresis uses the new `strokeReversalPx: 10`. `?fast=1` still completed with one stroke. Four-stroke count, nudge, fallback, spring-back and tilt are unchanged. |
| A3. Two-way cumulative flip; flip buttons removed | **PASS** | `Polaroid` now takes a cumulative `rotation` (odd half-turns = back). Swipe right from front → BACK, swipe right again → FRONT, swipe left → BACK; swiping back from the back side works. Zero `.flip-button` / `.flip-back-button` / "Flip" buttons found. `Keep it 💌` appears only on the back. Viewer now flips with `dx > 0 ? +180 : -180`; its hint reads "tap or swipe to flip" and its existing up/down navigation remains. Live finger-follow drag (capped, no easing while dragging) was implemented. |
| A4. Sound defaults to ON | **PASS (logic/DOM)** | A clean first visit shows `aria-pressed="true"` with 🔊; the "tap for sound" hint is visible on the INTRO and disappears on Start Day. Audio unlocks on the first pointer gesture. An explicit mute persists (`{"sound":false}`) across reload, then unmuting persists true. The Web Audio graph could not be heard in headless Chromium; the iPhone silent switch can mute Web Audio even when the toggle shows ON. This was noted but not device-verified. |

**Batch A regressions noticed/fixed during verification:**

- The sound hint could reappear on the cover each time she returned to the INTRO within 4s; it is now a true one-shot hint that is also dismissed by Start Day.
- The sound setting on a brand-new first visit was not written to storage until a later change; it is now persisted on the first gesture so a later mute reliably wins on reload.

**Untested in Batch A:** real iPhone Safari audio output and the physical silent switch, and audible sound quality. No page errors or console errors were recorded in the tested paths.

## Change list v2, batch B — layout and look

**Status: complete.** Verified against the Batch A regression set and `test-artifacts/batch-b/` at 360×640, 390×844 and 430×932. The unchanged screens remain pixel-close to the v1 baseline except where the list explicitly asks for a change (intro composition and camera are intentionally different).

| Item | Status | What was verified |
|---|---|---|
| B1. Intro stack lower, grouped with title/subtitle/note, balanced top | **PASS** | The stack, `.intro-copy` and note are now inside one `.intro-block` vertically centred with the actions at the bottom. The stack is a small blank-paper pile (112×86px footprint, no photo spoiler) sitting directly above the title. The 360×640 overlap found during the first attempt was fixed: at 360×640 the art area is 86px and ends exactly where the title starts (stack bottom 301.7, title top 302.7); title/subtitle/note are 302–384. No large top gap: the block is centred in the available space between top bar and button. |
| B2. Remove the drawn lamp/floating blob | **PASS** | `.desk-bg__lamp` JSX and its entire CSS block (cord/shade/bulb/breathing animation and its media-query references) are deleted. DOM query `.desk-bg__lamp` returns 0 and no loaded stylesheet contains the selector. The warm `.desk-bg__glow` radial gradients and `--lamp` glow remain. |
| B3. Album empty-slot tilt/placeholder, tape, centered title, vertical balance | **PASS** | Empty slots now receive the same deterministic `TILTS` as filled minis: computed transforms confirm −3°, +2°, +1.5°, −2°, 0° in both empty and filled pages. Empty slots use a light paper fill, warm-brown dotted outline, rounded corners and the same photo+strip footprint (no tape, no text). Tape grew from 26×10 to 34×13px at 62% cream opacity with edge and shadow. Day title is centered above a centered dotted rule: titleX == stitchX == page centre (183 of 324px at 360, 198 of 350 at 390, 218 of 390 at 430). Grid now balances between header and outro. |
| B4. Cream "Argon" camera, plain film counter, remove "?" | **PASS** | Camera uses Appendix A values: 240×176 cream body with 2px tan border and cream bottom edge; 80px brown leatherette band with orange top/bottom lines; orange shutter stud; tan viewfinder bump with dark slot; silver flash at top-left; one rose indicator dot that turns sage when the film is full; dark sensor square; 112px lens with gold-cream ring and dark glass glint. `camera__lens-question` count is 0, old `camera__little-light` count is 0, indicator count is 1. "five a day ♡" sits on the lower cream strip: at 360×640 the badge top (362.2) is below the lens bottom (361.7) — no overlap. Film counter is plain text (`🎞0/5`) with transparent background, no border and zero padding. Shutter button, flash, shake and counter state logic are unchanged. |
| B5. Toast lower centre, not over controls | **PASS** | Toast moved from top to `bottom: clamp(118px, 17dvh, 154px)`. At 390×844 its box is 649–695px, above the next print button (757.8px); it does not cover the Keep/print controls. Text unchanged: "Saved to album 📖". |
| B6. Viewer keeps clean design, two-way flip and new hint | **PASS** | Viewer retains X close, tap-to-flip and the existing up/down photo navigation. Swiping left on the enlarged card produced a cumulative `rotateY(-180°)` transform; the hint now reads "tap or swipe to flip". No arrow buttons added. |

**Batch B deviations / notes:**

- The camera was intentionally scaled slightly on 360×640 (214×157 body) so it does not push the unchanged shutter button off-screen. Desktop and tall phones use the 240×176 reference size. The Appendix's values are otherwise followed exactly.
- The intro paper pile was reduced beyond a simple "lower" move because at 360×640 it overlapped the title; the fix only affects the stack/art height, not the title or button styling.
- The lamp removal removes the warm bulb *element*; the warm gradient glow the owner asked to keep is untouched.
- Empty album slots were given a very light paper fill and dotted warm border, not tape, so they remain clearly distinct from kept photos.

## Change list v2, batch C — text and config

**Status: complete.** Verified at 390×844 plus fallback/runtime-edit checks.

| Item | Status | What was verified |
|---|---|---|
| C1. Intro note replaced and moved to config | **PASS** | The hard-coded note is gone. The page shows exactly "you said anything, so here's my anything". It comes from `public/config.js` → `introNote`, with the same value in `src/config/defaultConfig.ts` and a new field on the `AppConfig` type. Hiding/aborting `config.js` still shows the fallback line. Editing `dist/config.js` directly (no rebuild) to a different `introNote` and `subtitle` showed both new values on reload. |
| C1. Subtitle default changed | **PASS** | Default is now "our tiny photo challenge" in both configs; the intro reads "Day 1 of 7 · our tiny photo challenge". Title remains "Five a Day". |
| C1. Other intro string moved to config | **PASS** | The "More photos arrive tomorrow ✨" line is now `finishedLine` in both configs/types and is used by the all-done intro. With a fully finished saved day the intro showed that line and "Open album". |
| C1. Keep owner text and tunables in the right places | **PASS** | New numbers (`strokeReversalPx`, `PRINT_LAYOUT` values) are in `src/constants.ts`; owner-editable copy is in `public/config.js` with fallback in `defaultConfig.ts`. Existing keys and query parameters were not renamed or removed. |

**Batch C notes:** `finishedLine` was the only other hard-coded intro string in the component. "Open album", "Start Day {n}", "tap for sound" and album/viewer copy remain code strings because they were not listed as owner-editable; they are unchanged from v1.

## Final checks — change list v2

All checks below were run on the static production build at **390×844** unless noted.

| Check | Status | What was verified |
|---|---|---|
| Clean `npm run build`; `dist/` runs | **PASS** | Build succeeds; static server serves `dist/index.html`, `dist/config.js` and all five photos. Build output remains under 1MB. |
| Full ritual at normal speed: intro → camera → five photos → develop/flip/keep → complete → album | **PASS** | `?reset=1` then no `fast`: all five prints held for the full 2.5s and all five develops needed four alternating strokes. Final state `DAY_COMPLETE`, then album had 5 filled slots, `#5…#1` labels, 1 ray layer, 1 star. No page errors. Screenshots: `test-artifacts/final-v2/complete-normal-390.png`, `develop-normal-390.png`, `back-normal-390.png`. |
| `?fast=1`, `?day=3`, `?unlock=all`, `?reset=1`, `?debug=1` | **PASS** | Fast printing 0.5s and 1-stroke develop; `?day=3` shows "Day 3 of 7 …"; `?unlock=all` shows `▤ 1 2 3 4 5 6 7` and no locked page; `?reset=1` clears storage and removes itself from the URL; `?debug=1` shows state in the corner. |
| Desktop 1280×800 stays a centered phone column | **PASS** | Measured `.app-shell` at x=400…880, width **480px**, full viewport height, desk background visible either side, no horizontal page scroll. Screenshot `test-artifacts/final-v2/desktop-1280.png`. |
| Refresh mid-photo after starting print, before Keep | **PASS** | With `kept:[5,4]`, started printing Photo #3 then refreshed: the page returned to the Intro (correct) with "Start Day 1"; pressing it resumed directly at **Photo #3** in PRINT, without replaying the camera. Kept photos remained in the album. |
| Album cover, "tap to open", tab pills, locked Day 2 page | **PASS** | Cover still renders leather gold title and tap-to-open; tapping goes to Day 1. Pills remain `Cover, 1, 🔒2`; locked page says "Day 2 opens tomorrow 🔒" and is not inspectable. Screenshots `test-artifacts/batch-b/album-cover-390x844.png`, `album-empty-390x844.png`, `locked-final.png`. |
| "Day 1 of 7" label | **PASS** | Rendered unchanged: `Day 1 of 7` (number neutral, "of 7" dimmer). |
| Album icon, counter badge, X on top | **PASS** | Badge sits at the icon's lower edge; count reached 5 in the full ritual. Album X remains z-index above the icon and opens/closes correctly. |
| #1 rays and star, "my favourite today" note | **PASS** | Filled album shows larger #1 mini with rays and star; the favourite caption stays the configured "my favourite today ♡". |
| "That's Day 1!" card | **PASS** | Unchanged; shown after #1 is kept with "All 5 photos are in your album." and outro. |
| Keep flight to album icon, toast, persistence | **PASS** | Full flight completes, badge increments, toast says "Saved to album 📖" and now sits above the controls; saved state after every Keep; reload resumed at the correct photo. |
| All twelve baseline screens at 360×640 and 390×844 | **PASS** | Baseline saved in `test-artifacts/baseline-v2/`; post-A in `test-artifacts/batch-a-screens/`; post-B/final screenshots in `test-artifacts/batch-b/` and `test-artifacts/final-v2/`. The only intentional visual deltas are the printer, develop knob hints, removed flip buttons/hints, intro composition, cream camera/plain counter, album slot/title/tape, lower toast and configured copy. |
| Three target sizes with no scroll/cut-off | **PASS** | 360×640, 390×844, 430×932: `scrollHeight == innerHeight` in each; camera and shutter fully inside the viewport; no console/page errors. |

## Extra bugs noticed but not changed

1. **Config opening semantics vs. hidden days (v1, unchanged).** Setting a new day to `open: true` also keeps the previous open day visible/playable; there is no app-level "close yesterday" step. This is documented in the README rather than changing the feature.
2. **Finished days hidden from the album when their day is later closed (v1, unchanged).** Because sections 8.1/11 hide non-open days and the README suggests closing the previous day, finishing old days may remove their album pages. This is an interpretation risk worth revisiting before day 2 goes live.
3. **Audio unlock depends on a real gesture.** The toggle can look ON in desktop Chromium before a gesture; Web Audio simply stays suspended until the first tap. On iPhone the hardware silent switch can mute Web Audio regardless of the toggle.
4. **The baseline screenshots include the sound hint** because they were captured with fresh storage. It is a one-shot hint and does not reappear inside a session.
5. **No page-curl animation** in the album (horizontal slide, as in v1 and as allowed by the v1 spec).

## Verification honesty (v2)

All v2 checks were browser-tested in real headless Chromium against the production static build, using mobile emulation at the requested sizes. Normal-speed printing and a four-stroke develop were tested, not only `?fast=1`. Real iPhone Safari, physical touch, and audible/haptic output were **not** available, and the iPhone silent-switch caveat is therefore unverified on-device. The stock Pexels photos remain only as preview assets and must be replaced with the owner's own photos before sharing.

---

## Change list v3

### Batch A — bugs and logic

| Item | Status | Verified |
|---|---|---|
| A1 remove "tap for sound" hint and state/CSS | **PASS** | `.sound-hint` count 0 on a first visit; speaker toggle, saved choice and first-gesture unlock retained. No hint text remains in the DOM or CSS. |
| A2 full-display camera flash via portal | **PASS** | Flash renders through `createPortal` directly on `BODY`; measured box top 0, left 0, **390×844 on a 390×844 viewport** (also 360×640 and 430×932), z-index 9000, 170ms fade kept. |
| A3 printer hides after printing, no printer on Develop | **PASS** | Print enters `.is-finished`; `printerAway` runs 450ms; measured animation `printerAway`, opacity 0, before `onPrinted`. Develop DOM printer count **0** at all sizes. |
| A4 use free space and match Develop position | **PASS** | Fixed print stage includes printer + full card. The finished blank's card top/bottom match the Develop polaroid at each size (e.g. 390×844: 184.3 → top 184.3; 360×640: 159.8; 430×932: 194.8). Hold button stays on screen. Printer top remained 83px throughout. |
| A5 swipe only near the photo | **PASS** | The gesture zone has 16px padding/margin around the card. A drag starting at x=10 on a blank area left the ritual in DEVELOP; drags on the card flip normally. Hints are exactly "Swipe the photo to flip ↔" and "Swipe the photo to flip back ↔". |
| A6 hide top-bar album icon on Day Complete | **PASS** | At Day Complete computed visibility `hidden`, `pointer-events: none`, space retained. Album icon returns on every other state; keep-flight still uses the icon on the Back screen (full ritual passed). |

### Batch B — look and feel

| Item | Status | Verified |
|---|---|---|
| B1 fuller intro, richer scene, special button | **PASS** | Title clamp 52–72px; larger subtitle/note; stack at the top third, copy central, button in the lower third. CSS-only blank polaroids, tape, film canister, pencil and coffee ring at low opacity; slow float/sparkle/glow. Start/Open album use a pill with camera/book icon, sweeping shine, pulse glow and press scale. Papers stay blank. Screens: `test-artifacts/v3-batch-b/intro-*.png`. |
| B2 tap feedback everywhere | **PASS** | Document-level amber ring + up to 3 sparkles, removed after 450ms, throttled to 80ms, reduced-motion hides sparkles. Soft 650Hz/25ms tick through the muteable engine; controls marked `data-own-sound` (shutter, print hold, develop, Keep) skip the tick. No errors under rapid taps. |
| B3 richer shared background/props/dust | **PASS** | Props and eight slow dust specks render behind all ritual screens; no lamp object; warm glow retained; all low-opacity and pointer-events none. |
| B4 camera raise + details + film frames + aperture shutter | **PASS** | 360×640 shutter bottom **600px** inside 640; 390×844 bottom 783; 430×932 bottom 866. Added band stitching, brass lens ring, strap loop, ⭐ sticker, moving glint, blinking indicator, "five a day ✦". Five film frames fill with a pop; plain `🎞 0/5` remains. Shutter ripples, dot springs, ring rotates 72° per tap. No hearts. |
| B5 printer as small handheld top view | **PASS** | Visible tipped top face (`rotateX(48deg)`, perspective 600), cream label, sage body, amber LED, rose power button, 16px front lip with slot and floor shadow. Slot stays wider than the photo: 318.2 vs 304.2 at 390×844, 294.8 vs 280.8 at 360×640. Device is 77–96px tall and remains fixed. |
| B6 develop hint, film-strip slider, real sway | **PASS** | Hints are "Shake it to develop!" / "slide the dot left and right". Film-strip track with perforations, amber fill, end chevrons (required direction still shown), brass knob with ridges/rotation/trail, film-frame progress pops. Swing uses rotate 10°, translate 18/−10px and scale 3%, with 380ms overshoot on release and reduced-motion rotate-only. 4 alternating strokes preserved. |
| B7 neutral Keep button | **PASS** | Label is "Keep it" with a bookmark-photo glyph; amber pill, shine and press/pulse. No envelope or heart anywhere in the button. Keep only on the back. |
| B8 warmer album page, tape, date, X, tabs | **PASS** | Aged-paper gradient/grain/grid/inner vignette; richer amber/sage/rose striped tape at 65–75%; title pushed down (21–48px top padding), centered; X is a 46px leather sticker overlapping the upper-right edge; tab dock with raised amber current stamp, sliding indicator bar, dashed locked tab and horizontal scroll. The cover artwork and tab behavior are unchanged. |
| B9 richer Day Complete | **PASS** | DAY 1 ✓ stamp drops with bounce, five-photo fan and 5/5 counter; confetti is 🎞 ✨ ⭐ 📷; heart doodle removed. Album icon hidden. Existing card, copy, outro and Open album kept. |
| B10 calmer locked page | **PASS** | Envelope removed. Locked page now has a moon + twinkling stars above a milky, slowly drifting developing polaroid. Text is "Day 2 opens tomorrow" with no lock emoji. Gray locked tone preserved. |

### Batch C — sound

| Item | Status | Verified |
|---|---|---|
| Printer stepper-motor feel | **PASS (implementation/no-audio-device)** | Continuous sawtooth removed. A 58ms interval schedules short triangle pulses (118→164Hz) plus filtered paper noise and a final print-done tick. Runs only while holding and stops on release/unmount. No errors during repeated holds. |
| Two-part shutter + charging whine | **PASS (implementation)** | Sharp high-pass/A2.2k tick, lower 800Hz chunk 80ms later, faint 1.4–1.8kHz whine. Five rapid shutter taps produced no page or console errors. |
| Develop flutter/tick/chime | **PASS (implementation)** | Band-passed paper flutter while dragging, stroke tick on each counted stroke, two-tone completion chime. Alternating-stroke logic unchanged. |
| Flip/page/keep texture | **PASS (implementation)** | Filtered paper swish on flips/page changes; soft plop kept and a faint paper slide added at Keep. |
| Volume/clipping and mute | **PASS (code)** | All gains remain ≤0.08 via `SOUND.maxGain`; browser AudioContext errors are swallowed. Actual audible quality/headphone test was **not** possible in headless Chromium. |

### Batch D — wording/config and G1

| Item | Status | Verified |
|---|---|---|
| D1 Day Complete line + neutral default outro | **PASS** | Page reads "All photos are now in the album."; runtime and fallback outro are "Day 1 done. Five photos, kept." |
| D2 subtitle default | **PASS** | `subtitle: "five photos a day"` in both configs; intro shows "Day 1 of 7 · five photos a day". The config remains the only place the owner edits it. |
| D3 move changed strings into config | **PASS** | New `texts` object contains start/open album, camera, print, develop, flip, Keep, toast, completion, locked prefix, viewer and album labels. Every key falls back individually. Behavior is unchanged when a key is missing. |
| D4 neutral sample captions/messages | **PASS** | All five rows use "caption N" / "message N: a short note about this photo"; #1 caption is "my favourite today". Same fields and order preserved. |
| G1 no romantic symbols | **PASS** | Source and `public/config.js` contain no ♡, 💌, 💛, ❤, heart or envelope text/symbols; album screen text test returned false. Camera badge ends in ✦, Keep uses a bookmark glyph, confetti is 🎞 ✨ ⭐ 📷. |

### Batch E — extra album pages

| Item | Status | Verified |
|---|---|---|
| E1 config `extraPages`, types, fallback, nav/pages | **PASS** | `extraPages: []` added with note/audio schema. With one note and one audio page temporarily open, tabs became `▤ 1 ✎ ♪ 🔒 2`, pages mounted after the day page, and swiping to the locked page worked. Restoring `[]` removed both tabs/pages. |
| Note page, long text may scroll inside only | **PASS** | Warm-paper page with handwriting title, paragraphs and internal `overflow-y: auto`; the app shell remains fixed. |
| Audio page cassette player | **PARTIAL** | Play/pause, elapsed/total time, captions toggle (on by default), synced caption line, independent playback (own `<audio>`, independent of effects mute), pause on leaving the page and green “audio goes here” fallback were verified. **Tap-to-seek was implemented but did not move playback time in headless Chromium**; handler fired, but the browser media element did not accept the seek. Real iPhone/Safari unverified. |
| Audio files folder/placeholder | **PASS** | `public/audio/.gitkeep` exists. A generated 3s test tone was used and `extraPages` restored to `[]`; a deliberately missing file showed the calm placeholder without errors. |

### Final checks — v3

| Check | Status | Verified |
|---|---|---|
| Clean build, static dist | **PASS** | `npm run build` succeeds; static server runs `dist/index.html`, runtime config, photos, audio folder. |
| Full ritual normal speed, 390×844 | **PASS** | Five photos each: 2.5s print → Develop (printer count 0) → 4 alternating strokes → flip right/left/right with Keep only on back → Keep. Ended DAY_COMPLETE; album had 5 slots, rays, no extras, no romantic symbols. |
| Flash covers display | **PASS** | Portal on BODY, measured full 390×844. |
| No hint, no Develop printer, printer hides, no hearts/envelopes | **PASS** | Hints count 0; printer 0 in Develop; completion opacity 0; grep and screen-text checks clean. |
| Album icon hidden on Day Complete | **PASS** | visibility hidden, pointer-events none, visible elsewhere. |
| Test links | **PASS** | `?fast=1` (0.5s/1 stroke), `?day=3`, `?unlock=all`, `?reset=1`, `?debug=1` verified across batches. |
| Desktop 1280×800 | **PASS** | App column x=400…880, width **480px**, not stretched. |
| Refresh mid-photo | **PASS** | With kept [5,4], reopened at Intro, Start Day resumed at **Photo #3** without camera taps. |
| Regression screenshots | **PASS** | Baselines in `test-artifacts/baseline-v3/`; final 24 screenshots in `test-artifacts/v3-final-regression/`; batch shots in `v3-batch-a/`, `v3-batch-b/`, `v3-batch-e/`. Must-not-change items (cover, tabs, locked styling concept, Day 1 of 7, album icon/badge/X, rays/star, card, viewer, flight, toast, persistence) were exercised again. |

### Extra bugs noticed but not changed

1. Audio tap-to-seek (headless Chromium) — see PARTIAL; not removed, remains available for a real-device test.
2. Config-open semantics and finished-day visibility remain as in v2, documented rather than changed.
3. The camera's thin brass ring is layered around the existing lens without changing its geometry; on very short landscape overlays it is not visible because the rotate overlay covers the page first.
4. No real iPhone Safari or physical audio test was available.

### Not tested

- Real iPhone Safari, the hardware silent switch, physical touch feel and audible sound quality/haptics.
- The exact audio seek on a real device (implemented, headless media element did not seek).

