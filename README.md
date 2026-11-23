# Five a Day

A tiny, cozy photo challenge: five random photos a day, printed and developed on a little web polaroid, then kept in an album. Built for one person to open on her phone.

Everything you will edit day to day lives in **`public/config.js`**. The page loads that file at runtime, so you can change it without touching the code.

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org/) (version 20 or newer).

1. Open this folder in VS Code.
2. Open a terminal (Terminal → New Terminal).
3. Type:

   ```bash
   npm install
   npm run dev
   ```

4. Open the address the terminal prints (usually `http://localhost:5173`).
5. To stop the server, press `Ctrl + C` in the terminal.

On your computer, the page will look narrow and phone-shaped. That is intentional.

## 2. Build the files to upload

```bash
npm run build
```

This creates a folder called **`dist/`**. Everything the website needs is inside it (except your photos and config, which live alongside it — see below). Upload the **contents of `dist/`**, not the folder itself.

## 3. Put it on Netlify (no server needed)

1. Go to [netlify.com](https://www.netlify.com/) and sign in.
2. Choose **Add new site → Deploy manually** (or drag the `dist` folder onto the Netlify "Sites" page).
3. Drag the **contents of `dist/`** into the upload area.
4. Netlify gives you a link like `https://something.netlify.app`. Send it to her.
5. You can open the link on your phone to check it.

**No build settings are required for the manual drag-and-drop method.** If you connect a Git repository instead, use build command `npm run build` and publish directory `dist`.

## 3b. Change the intro words

All of the intro wording lives in `public/config.js`:

- `introNote` is the handwritten line under the subtitle. Its default is `you said anything, so here's my anything`.
- `subtitle` is the small line beginning "Day 1 of 7 … · …". Its default is `five random photos a day`.
- `finishedLine` is the line shown above "Open album" when every open day is finished. Its default is `More photos arrive tomorrow ✨`.
- `appTitle` is the title. It stays `Five a Day` unless you change it.

Edit those values in `public/config.js` (or directly in `dist/config.js` after a build) and re-upload. No rebuild is needed if you edit `dist/config.js`.

## 3c. Sounds

All sounds are synthesized in the browser; there are no audio effect files. Sound starts ON, the top-left toggle mutes it, and an iPhone needs one real tap before audio can start. The iPhone hardware silent switch can still mute Web Audio.

## 3d. Extra note pages and voice messages

`public/config.js` has an optional `extraPages: []` array. Extra pages stay completely hidden until `open: true` and then appear after the day pages. Copy one of these blocks:

```js
{ id: "note-1", type: "note", title: "A small note", open: true,
  body: ["First paragraph.", "Second paragraph."] }

{ id: "audio-1", type: "audio", title: "A voice note", open: true,
  src: "audio/vm1.m4a",
  captions: [{ t: 0, text: "Hi!" }, { t: 4, text: "This is the second line." }],
  note: "" }
```

Put audio files in `public/audio/`. Use short mono clips, m4a or mp3, ideally 1–2 MB. Do not put a location or personal information in the filename. `public/audio/test-tone.wav` is only a small test tone. Set `open: false` to hide an extra page again. Missing audio shows a calm “audio goes here” placeholder.

## 4. Add a new day — step by step

1. Save the five photos in **`public/photos/`**, named like this:
   - `d2-5.jpg` is the first photo she sees (rank 5).
   - `d2-4.jpg`, `d2-3.jpg`, `d2-2.jpg`.
   - `d2-1.jpg` is your favourite (rank 1, with the gold star and rays).
   - Any `.jpg` or `.png` works; `.jpg` keeps the download small. Square photos look best.
2. Open **`public/config.js`** in VS Code.
3. Find the row for that day, for example:

   ```js
   { id: 2, open: false, dateLabel: "Nov 23", outro: "", photos: [] },
   ```

4. Change it to:

   ```js
   {
     id: 2,
     open: true,
     dateLabel: "Nov 23",
     outro: "A short note you want her to see when she finishes.",
     photos: [
       { rank: 5, src: "photos/d2-5.jpg", caption: "caption 5", message: "message 5", frame: "cream", focus: "50% 50%", effect: { motion: "rise", emojis: ["✨"], count: 18 } },
       { rank: 4, src: "photos/d2-4.jpg", caption: "caption 4", message: "message 4", frame: "classic", focus: "50% 50%", effect: { motion: "fall", emojis: ["🍂"], count: 16 } },
       { rank: 3, src: "photos/d2-3.jpg", caption: "caption 3", message: "message 3", frame: "rose", focus: "50% 50%", effect: { motion: "burst", emojis: ["⭐","✨"], count: 14 } },
       { rank: 2, src: "photos/d2-2.jpg", caption: "caption 2", message: "message 2", frame: "sage", focus: "50% 50%", effect: { motion: "drift", emojis: ["🌟"], count: 12 } },
       { rank: 1, src: "photos/d2-1.jpg", caption: "my favourite today", message: "message 1", frame: "kraft", focus: "50% 50%", effect: { motion: "burst", emojis: ["⭐","✨"], count: 24 } }
     ]
   },
   ```

5. Set `open: true` on that day. **Important:** set the previous day back to `open: false` if you only want one day available at a time. Days you close are hidden from the album; days you leave open remain visible and playable.
6. For the quickest update after you have already built once, you can copy the new photos into `dist/photos/`, edit `dist/config.js`, and re-upload `dist/` — **no rebuild necessary**. Otherwise run `npm run build` again.
7. Upload the contents of `dist/` to Netlify again (deploy a new version).

You can open a day with no photos filled in: it shows warm camera placeholders instead of crashing. Nothing has to be perfect before it is released.

> **Before sharing the site:** the five sample photos in `public/photos/d1-1.jpg` … `d1-5.jpg` are stock images included only so the design can be previewed. They must be replaced with the owner's own photos (and old copies removed from `dist/photos/` before uploading).

## 5. Swap a photo or a note

- **Photo:** keep the filename and overwrite the file in `public/photos/` (then build), or put the new file in `dist/photos/` and replace the old one. For the deployed site, do the same and re-upload.
- **Caption / message:** edit the `caption` or `message` text in `public/config.js` (or `dist/config.js`). Captions sit on the front, messages on the back.
- **Crop:** `focus` controls which part of the photo is visible in the square, for example `"50% 30%"` moves the crop up. `"50% 50%"` is centred.
- **Frame:** `frame` can be `"classic"`, `"cream"`, `"rose"`, `"sage"` or `"kraft"`.
- **Effect:** `motion` can be `"rise"`, `"fall"`, `"burst"` or `"drift"`; `emojis` is a list; `count` is how many (maximum 40).
- **Text must stay as plain text.** Do not put HTML tags inside config text.

## 6. Hidden test links

Add these after the site address, for example `https://yoursite.netlify.app/?fast=1`.

| Link | What it does |
|---|---|
| `?day=3` | Start on day 3, even if it is closed or finished. The album includes it too. |
| `?reset=1` | Erase saved progress and reload. |
| `?unlock=all` | Treat every day in the config as open, for previewing. |
| `?fast=1` | Printing takes 0.5 seconds and developing needs one stroke. |
| `?debug=1` | Show the current state name in the bottom-left corner. |

None of these links have any visible buttons in the page. `?reset=1` removes itself from the address after a reload.

## 7. Tunable numbers

The words used on the ritual screens live in `public/config.js` under `texts`; if a text key is missing, the built-in fallback is used. `lockedText` (default "opens tomorrow") is separate and the code adds no lock symbol.

The important numbers are all together in **`src/constants.ts`**, with comments. Useful ones:

| Setting | Current value | What it does |
|---|---|---|
| `printHoldMs` | `2500` | How long to hold to finish one print. |
| `fastPrintHoldMs` | `500` | Hold time in the `?fast=1` test mode. |
| `developStrokes` | `4` | One-way slides needed to develop. |
| `fastDevelopStrokes` | `1` | Strokes needed in `?fast=1`. |
| `strokeDistanceFraction` | `0.6` | How much of the track one stroke needs. |
| `developKnobNudgeMs` | `4000` | When the knob starts nudging. |
| `developTapFallbackMs` | `10000` | When "or tap to develop" appears. |
| `shutterDebounceMs` | `250` | Duplicate-tap guard (a real human tap is never swallowed). |
| `keepFlightMs` | `600` | Keep-to-album flight. |
| `flipMs` | `500` | Polaroid flip. |
| `pageSlideMs` | `300` | Album page slide. |
| `particleCap` | `40` | Maximum particles in one burst. |
| `maxGain` | `0.08` | Loudest any sound can get. |
| `polaroidWidthCss` | `min(78vw, 340px, calc(52dvh - 52px))` | Polaroid width formula. |
| `COLORS` | see file | All colour tokens. |

Contents the owner edits (days, photos, captions, messages, frames, effects) belong in `public/config.js`, not in the code.

## 8. Sound

Sound now defaults to **on** for a new visitor. The speaker icon in the top-left mutes it, and the choice is remembered. The first tap anywhere unlocks audio for iPhone Safari. On an iPhone, the hardware **silent switch** can still mute Web Audio even when the speaker icon shows 🔊 — this is an iOS limitation, not a setting in the page.

## 9. What is saved, and where

Progress is saved in the browser's `localStorage` under one key: `fiveADay.v1`. It contains the sound preference and, for each day, whether the camera is done, which ranks have been kept and whether the day is finished.

If storage is unavailable (for example locked-down private browsing), everything still works for the current visit, it is just not remembered.

To start over, open `?reset=1`.

## 10. Music and sounds

There are no audio files. The tiny shutter, printer, pling and plop sounds are synthesized in the browser. Sound is **off** by default; the top-left button turns it on and remembers the choice.

## 11. Troubleshooting

- **The page is blank after upload:** make sure `config.js` and the `photos/` folder were uploaded next to `index.html`. If `config.js` is missing the page still works with built-in placeholders, so a blank page usually means `index.html` itself was not uploaded.
- **A photo is missing:** that slot shows a warm camera placeholder. Check the filename in `config.js` matches the file exactly (including upper/lower case).
- **A change does not appear:** if you edited `config.js` on Netlify, refresh; if you edited the project, run `npm run build` and upload again.
- **Sound does not play:** sound is off by default. Tap the speaker in the top-left. On iPhone, the first tap unlocks audio.
