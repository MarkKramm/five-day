# FLAVOR PROPOSALS — Five a Day (ideas only)

This file contains **proposals, not code**. Nothing below has been built. Every idea is additive and would be placed behind a `features.<name>` flag in `public/config.js` with a fallback in `src/config/defaultConfig.ts`. An owner can turn an idea off by setting that flag to `false`. Part 1 is finished and documented in `BUILD_REPORT.md`; real iPhone Safari and audible sound were not available for testing.

## 1. Summary table

| ID | Name | Screen | Effort | Confidence | Risk | Phone performance cost |
|---|---|---|---|---|---|---|
| S1 | Paper-curl print reveal | Printing | S | 95% | Low | Very low — transform/opacity only |
| S2 | Living film grain | Developing | S | 93% | Low | Low — one small overlay, no filter |
| S3 | Album-slot star trail | Keep / top bar | S | 94% | Low | Very low — 3–4 particles |
| S4 | Colored page tabs | Album pages | S | 95% | Low | Negligible (static CSS) |
| S5 | Completion fan shimmer | Day Complete | S | 94% | Low | Very low — one pass, transform only |
| S6 | Slow night-sky drift | Locked page | S | 95% | Low | Very low — 2–3 transforms |
| S7 | Lens focus breathing | Camera | S | 94% | Low | Very low — transform on small element |
| S8 | Subtler page/sound layering | Album / sound | S | 92% | Low | Negligible |
| S9 | Breathing idle hints | All ritual screens | S | 92% | Low | Very low |
| S10 | Calm loading / empty-state polish | Whole app / album | S | 94% | Low | Very low |
| M1 | Caption karaoke for voice notes | Audio extra page | M | 82% | Medium | Low — text state updates only |
| M2 | Per-photo secret corner sticker | Back of polaroid | M | 83% | Medium | Negligible |
| M3 | Week overview inside the cover | Album cover | M | 78% | Medium | Low–medium — small thumbnails |
| M4 | Press-and-hold photo loupe | Front / viewer | M | 67% | Medium–high | Low, but gesture conflicts possible |
| A1 | Day-7 recap montage | Extra album page | L | 45% | High | Medium — many images and motion |
| A2 | Ambient “time of day” mood shifts | Whole app | L | 40% | High | Medium on low-end phones |

---

## 2. Ideas

### SAFE — at least 90% confident

#### S1. Paper-curl print reveal
- **What she sees:** the blank polaroid does not just slide out; its leading edge curls and softens for a moment as it clears the printer, then settles flat.
- **Where:** Print screen, while holding.
- **How:** add one pseudo-element shadow/edge to the blank and animate only its transform and opacity with the existing print progress variable. It disappears once printing completes.
- **Files:** `src/screens/PrintScreen.tsx`, `src/styles/screens.css` or `src/styles/v3.css`, `src/constants.ts`.
- **Switch/risk:** `features.paperCurl` in config. Very low risk; if the curl looks odd on a short screen it can be disabled without touching printing logic.
- **Tone check:** it only makes a physical print feel tactile; neutral and non-romantic.

#### S2. Living film grain
- **What she sees:** as she shakes the developing polaroid, a faint silver grain drifts over the photo. It settles and disappears when the image is fully developed.
- **Where:** Develop screen, tied to the reveal value she already controls.
- **How:** a tiny CSS repeating texture overlay whose opacity follows reveal progress; no CSS blur or SVG filter on the image. It never covers the controls.
- **Files:** `src/screens/DevelopScreen.tsx`, `src/styles/v3.css`.
- **Switch/risk:** `features.developGrain`. Must be tested on a low-end phone because any full-card texture has some paint cost.
- **Tone check:** evokes a darkroom, not a message to a person.

#### S3. Album-slot star trail
- **What she sees:** after Keep, two or three tiny stars follow the shrinking card toward the album icon before fading. The badge bounce stays exactly as it is.
- **Where:** Keep flight and top bar.
- **How:** reuse the existing keep-flight vector and add three short-lived absolutely positioned ✦ elements; no new animation library.
- **Files:** `src/screens/FlipScreen.tsx`, `src/styles/screens.css`, `src/constants.ts`.
- **Switch/risk:** `features.keepStarTrail`. The existing keep-flight must remain the fallback if disabled.
- **Tone check:** a tiny celebratory detail using neutral stars.

#### S4. Colored page tabs
- **What she sees:** small sage, amber and rose paper tabs peeking from the outer edge of each album day page, making the book feel hand-bound. They are informational only.
- **Where:** Album day pages.
- **How:** a CSS pseudo-element per open day using the existing deterministic day order; it never becomes a second navigation control.
- **Files:** `src/album/AlbumDayPage.tsx`, `src/styles/album.css` or `v3.css`.
- **Switch/risk:** `features.pageTabs`. No interaction changes; the owner’s existing bottom dock remains the navigation.
- **Tone check:** craft and colour, no personal or romantic message.

#### S5. Completion fan shimmer
- **What she sees:** on Day Complete, a single quiet highlight travels across the fan of five mini photos, as if the paper catches the desk light.
- **Where:** Day Complete card.
- **How:** one overlay on the existing fan, animated once with transform/opacity after the card appears.
- **Files:** `src/screens/DayCompleteScreen.tsx`, `src/styles/v3.css`.
- **Switch/risk:** `features.completionShimmer`. No extra rows or data.
- **Tone check:** a lighting effect, not a message.

#### S6. Slow night-sky drift
- **What she sees:** on the locked page, the moon and a few stars drift almost imperceptibly and twinkle slower than now.
- **Where:** “Day N opens tomorrow” page.
- **How:** extend the existing moon/star CSS with two transform-only keyframes; reduced motion freezes them.
- **Files:** `src/album/AlbumLockedPage.tsx`, `src/styles/v3.css`.
- **Switch/risk:** `features.lockedSky`. The locked page text and gray tone stay untouched.
- **Tone check:** calm night imagery, with no lock/heart/envelope.

#### S7. Lens focus breathing
- **What she sees:** before the first shutter tap, the lens glass gives one very slow, shallow focus “breath” every few seconds. It stops after the first tap.
- **Where:** Camera screen.
- **How:** animate a tiny ring/glint inside the existing lens with transform and opacity only.
- **Files:** `src/screens/CameraScreen.tsx`, `src/styles/screens.css`.
- **Switch/risk:** `features.lensBreath`. Camera geometry and five-tap logic remain unchanged.
- **Tone check:** a mechanical camera detail, fully neutral.

#### S8. Slightly richer paper swishes
- **What she sees/hears:** page moves and flips get a very faint second paper layer, so a page feels thicker rather than like a single click.
- **Where:** album pages, polaroid flip and Keep.
- **How:** layer two existing filtered-noise swishes with a 30–40ms offset, still capped at the current maximum gain. No audio files.
- **Files:** `src/lib/sound.ts`, `src/album/Album.tsx`.
- **Switch/risk:** `features.paperSwishLayer`. Mute still wins; if it clips on a device, one line removes the second layer.
- **Tone check:** purely material sound.

#### S9. Breathing idle hints
- **What she sees:** if she pauses for a while, the current hint gains one slow opacity “breath” and then rests. It never repeats rapidly or demands attention.
- **Where:** Print, Develop, Front and Back.
- **How:** one CSS class driven by an idle timer already available in each screen; it does not move controls or change text.
- **Files:** `src/constants.ts`, the four screen files, `src/styles/v3.css`.
- **Switch/risk:** `features.idleBreath`. Keep the current static hints as the fallback.
- **Tone check:** gentle guidance without pressure.

#### S10. Calm loading and empty-state polish
- **What she sees:** a brief cream paper placeholder where a photo is still loading, and a very soft fade when the real image arrives. The existing broken-photo camera placeholder stays.
- **Where:** album, viewer and filled pages.
- **How:** use the existing lazy image wrapper with a neutral paper background and a short opacity transition after `onLoad`; no layout change.
- **Files:** `src/components/PhotoMedia.tsx`, `src/styles/screens.css`.
- **Switch/risk:** `features.calmLoading`. Loading must degrade to the current behaviour when disabled.
- **Tone check:** purely functional and quiet.

---

### MEDIUM — 60–89% confident

#### M1. Caption karaoke for voice notes
- **What she sees:** the current caption line gets a soft amber underline that fills with the audio, while future lines stay muted below. Captions still have the existing on/off switch.
- **Where:** audio extra page.
- **How:** drive a progress value from the existing `timeupdate` event and animate the underline’s `scaleX`; never highlight by colour alone. The player and audio element stay the same.
- **Files:** `src/album/AlbumAudioPage.tsx`, `src/styles/v3.css`.
- **Switch/risk:** `features.captionKaraoke`. Frequent `timeupdate` events are throttled to avoid re-render pressure; if audio seeking/captions misbehave, this idea is independent and can stay off.
- **Tone check:** accessibility polish, no personal framing.

#### M2. Per-photo secret corner sticker
- **What she sees:** a tiny compass, leaf or ✦ is tucked into a different corner of each photo’s back, chosen by config. Discovering it is optional.
- **Where:** back of the polaroid and viewer back.
- **How:** add an optional `sticker` field to each photo, render one small absolutely positioned glyph; no new tap surface and no layout shift.
- **Files:** `public/config.js`, `src/config/defaultConfig.ts`, `src/types.ts`, `src/config/loadConfig.ts`, `src/components/Polaroid.tsx`, album CSS.
- **Switch/risk:** `features.photoStickers`. Unknown/missing sticker values fall back to no sticker, preserving current pages.
- **Tone check:** decorative collectibles, never a hidden personal message.

#### M3. Week overview inside the cover
- **What she sees:** the inside cover can show five tiny, unopenable “contact sheet” frames per open day, with today’s strip slightly brighter.
- **Where:** inside the album cover, only after “tap to open”.
- **How:** reuse the existing mini polaroid renderer in a compact 5-column strip, reading only kept ranks. Keep the cover’s exterior exactly as it is.
- **Files:** `src/album/AlbumCover.tsx` or a new `AlbumOverview.tsx`, `src/styles/album.css`.
- **Switch/risk:** `features.coverOverview`. Risk is extra DOM on low-end phones; cap it to open days and loaded thumbnails. If it crowds the cover, switch off.
- **Tone check:** a factual weekly contact sheet.

#### M4. Press-and-hold photo loupe
- **What she sees:** holding a front photo enlarges that photo slightly under the finger, so she can inspect a detail without leaving the screen.
- **Where:** Front screen and enlarged viewer.
- **How:** use the existing pointer events, but only after a deliberate 280ms hold; show a clipped duplicate image at scale, release to return. Never changes Keep/Flip gestures.
- **Files:** `src/screens/FlipScreen.tsx`, `src/album/AlbumViewer.tsx`, `src/components/Polaroid.tsx`, CSS.
- **Switch/risk:** `features.photoLoupe`. **Risk:** gesture conflict with swipe-flip and dragging; if the prototype interferes at all, do not ship it. A second reason to be cautious is memory for a second decoded image.
- **Tone check:** a visual inspection tool, no emotional wording.

---

### AMBITIOUS — below 60% confidence / large

#### A1. Day-7 recap montage
- **What she sees:** an optional final album page assembles small prints from the whole week into a single contact sheet, then settles. No ranking, no “best of” judgement.
- **Where:** a new extra album page after Day 7.
- **How:** extend the extra-page mechanism with a `recap` type that reads kept ranks from saved progress. It would need careful lazy loading and stable layout.
- **Files:** new `src/album/AlbumRecapPage.tsx`, `src/types.ts`, `src/config/loadConfig.ts`, `src/album/Album.tsx`, `public/config.js`, default config.
- **Switch/risk:** `features.recapPage`; must also have `open` false. **Risk:** more images and DOM on low-end phones, plus the temptation to design a finale the owner has not specified. I would not build it before the owner explicitly asks for the finale.
- **Tone check:** a factual week recap, not a message of affection.

#### A2. Ambient “time of day” mood shifts
- **What she sees:** the desk glow becomes slightly warmer in the evening and cooler in the morning. No new content, no schedule pressure, no notifications.
- **Where:** whole app background.
- **How:** use the device’s local clock only to choose between two or three pre-tuned CSS variables; keep the change instant and very low contrast. No date-based unlocking.
- **Files:** `src/App.tsx` or `Background.tsx`, `src/constants.ts`, CSS.
- **Switch/risk:** `features.ambientTimeOfDay`. **Risk:** device time zones, owner expectations, and extra CSS repaint cost; can make the app feel different from the approved baseline. I would test it with the owner before shipping.
- **Tone check:** atmosphere only, no personal or time-pressure meaning.

---

## 3. Coverage check

| Area | Ideas |
|---|---|
| Intro | S9, S10 (plus props via Easter eggs) |
| Camera moment | S7, S9 |
| Printing | S1, S9, S8 |
| Developing | S2, S9 |
| Front and back | S9, M2, M4 |
| Keep moment | S3, S8 |
| Day Complete | S5 |
| Album pages/covers/transitions | S4, S8, M3, A1 |
| Locked page | S6 |
| Sound design | S8, M1 |
| Micro-interactions | S3, S9, M4 |
| Polish/loading/empty/reduced motion | S10, S6, S9 |
| Finale-ready config | Finale section below |

---

## 4. Finale readiness (proposal only — nothing built)

These use the existing generic `extraPages` mechanism and config; all are neutral. None should be opened until the owner decides.

1. **A closing note page.** Add an `extraPages` entry of `type: "note"` with a title and short paragraphs; set `open: true`. **Config only.** No code.
2. **A voice message page.** Add `type: "audio"`, `src: "audio/vm1.m4a"`, optional `captions` and `note`. Record mono, 1–2 MB, neutral filename. **Config only.** No code.
3. **A short “week in five lines” page.** A note page listing five plain observations, one per line, with no evaluation. **Config only.** No code.
4. **A credits / how-this-was-made note.** A note page explaining the small build in a few factual paragraphs. **Config only.** No code.
5. **A recap contact sheet.** Only truly final-ready with a new optional `recap` type or a `gallery` note variant that can render existing day photos. **Needs small extension code:** one new page component and config schema; otherwise config-only text can point back to the seven day pages. The existing `extraPages` type currently supports only `note` and `audio`.

---

## 5. Easter eggs and secrets (proposal only — nothing built)

All would be behind an individual feature flag and must not alter core navigation.

1. **Coffee-ring steam.** Tap the faint coffee-ring prop on the desk: two tiny ✦ rise and fade. Finding: tap the ring near the left edge. Difficulty **S**.
2. **Film canister rattle.** Tap the film canister prop: the five film frames on the camera screen do a quick wave once. Finding: camera screen, tap the canister. Difficulty **S**.
3. **Pencil doodle.** Hold the pencil prop for about half a second: a tiny pencil line draws itself on the desk, then fades. Finding: desk edge. Difficulty **M**.
4. **Hidden cover note.** If an extra note page is open, triple-tapping the album cover’s small ✦ jumps to it. Finding: cover. Difficulty **M**. It must never expose a closed page.
5. **Star count.** Tap the #1 star in the album three times: the rays do one slow extra turn. Finding: filled day page. Difficulty **S**.
6. **Moon wink.** Tap the locked-page moon: it gives one gentle brightness pulse; the text does not change. Finding: locked page. Difficulty **S**.
7. **Badge shimmer.** Tap the album badge: it sparkles once without changing the count. Finding: top bar. Difficulty **S**.
8. **Fan shuffle.** On Day Complete, swipe across the five-photo fan: the fan reorders once with a soft paper sound, then returns. Finding: completion card. Difficulty **M**.

---

## 6. Things I would NOT recommend

| Idea | Why not |
|---|---|
| Accelerometer “shake the phone” to develop | iOS permission prompts and inconsistent browser support; the existing slider is reliable and accessible. |
| Any backend, account, cloud sync or analytics | Directly against the project’s privacy and static-hosting rules; adds failure modes. |
| Autoplaying the voice message | iPhone Safari blocks it and it removes the person’s choice; always require a tap. |
| Location, date-based unlocking, reminders or notifications | Creates pressure, privacy concerns and breaks the owner’s manual `open` control. |
| WebGL/canvas film grain or full-screen live filters | High battery/GPU cost on low-end phones; CSS-only subtle grain is safer. |
| A realistic 3D page-curl with shadows | Expensive on low-end Safari and risks the owner’s beloved existing slide/swipe behavior. |
| Storing voice recordings in localStorage | Quota and iOS eviction risks; audio should stay a normal static file. |
| Automatic “surprise” extra pages | Must remain owner-controlled via `open`; hidden content could be confusing or feel like pressure. |
| Heavy confetti, long particles or infinite full-screen animation | Battery heat and motion discomfort; current capped effects are safer. |

---

## 7. My top 5 picks and why

1. **S4 Colored page tabs** — visible craft, almost zero risk and no interaction changes.
2. **S1 Paper-curl print reveal** — improves the printing moment with pure transform/opacity and no logic changes.
3. **S6 Slow night-sky drift** — makes the locked page feel alive while keeping its calm, non-pushy message.
4. **S5 Completion fan shimmer** — a tiny reward at the emotional peak with negligible performance cost.
5. **M2 Per-photo secret sticker** — enables quiet discovery across all seven days, is config-driven and has no new gestures.

**Reply with the IDs you want (for example S1, S3, M2). I will build them in separate batches.**
