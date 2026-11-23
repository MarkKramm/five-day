// FIVE A DAY — the only file you need to edit each day.
// To release a new day: set open: true, put the 5 photos in /photos, fill in the rows, and re-upload the folder.
// This file is loaded at runtime, so after a build you can edit it inside dist/ too — no rebuild needed.
window.FIVE_A_DAY_CONFIG = {
  appTitle: "Five a Day",
  subtitle: "five random photos a day",
  totalDays: 7,
  photoTone: "warm",          // "warm" or "none"
  lockedText: "opens tomorrow",
  introNote: "you said anything, so here's my anything",
  finishedLine: "More photos arrive tomorrow ✨",

  // Owner-editable interface text. Missing keys fall back to the built-in copies.
  texts: {
    startDay: "Start Day {n}",
    openAlbum: "Open album",
    cameraHint: "Tap the shutter 5 times 📸",
    cameraDone: "Film roll full! Let's print them.",
    printButton: "HOLD TO PRINT",
    printHelp: "Press and hold",
    developMain: "Sway the photo to develop",
    developSub: "slide it side to side",
    developFallback: "or tap to develop",
    frontHint: "Swipe the photo to flip ↔",
    backHint: "Swipe the photo to flip back ↔",
    keepButton: "Keep it",
    toast: "Saved to album 📖",
    dayCompleteSub: "All photos are now in the album.",
    lockedPrefix: "Day {n}",
    viewerHint: "tap or swipe to flip",
    albumButton: "Open album"
  },

  // Optional extra album pages. They are completely hidden until open: true.
  // Example:
  // { id: "note-1", type: "note", title: "A small note", open: false,
  //   body: ["First paragraph.", "Second paragraph."] },
  // { id: "audio-1", type: "audio", title: "A voice note", open: false,
  //   src: "audio/vm1.m4a", captions: [{ t: 0, text: "Hi!" }], note: "" }
  extraPages: [],

  days: [
    {
      id: 1,
      open: true,
      dateLabel: "Nov 22",
      outro: "Day 1 done. Five photos, kept.",
      photos: [
        // order does not matter; each photo has its own rank (5 is shown first, 1 is the favorite)
        { rank: 5, src: "photos/d1-5.jpg", caption: "caption 5", message: "message 5: a short note about this photo",
          frame: "cream",   focus: "50% 50%", effect: { motion: "rise", emojis: ["✨","🌙"], count: 18 } },
        { rank: 4, src: "photos/d1-4.jpg", caption: "caption 4", message: "message 4: a short note about this photo",
          frame: "classic", focus: "50% 45%", effect: { motion: "fall", emojis: ["🍂"], count: 16 } },
        { rank: 3, src: "photos/d1-3.jpg", caption: "caption 3", message: "message 3: a short note about this photo",
          frame: "rose",    focus: "50% 50%", effect: { motion: "burst", emojis: ["⭐","✨"], count: 14 } },
        { rank: 2, src: "photos/d1-2.jpg", caption: "caption 2", message: "message 2: a short note about this photo",
          frame: "sage",    focus: "50% 55%", effect: { motion: "drift", emojis: ["🌟"], count: 12 } },
        { rank: 1, src: "photos/d1-1.jpg", caption: "my favourite today", message: "message 1: a short note about this photo",
          frame: "kraft",   focus: "50% 50%", effect: { motion: "burst", emojis: ["⭐","✨"], count: 24 } }
      ]
    },

    // Days 2 to 7: same shape, open: false, empty or placeholder photo rows.
    // When a day is open, missing photo rows are filled with warm placeholders automatically.
    { id: 2, open: false, dateLabel: "Nov 23", outro: "", photos: [] },
    { id: 3, open: false, dateLabel: "Nov 24", outro: "", photos: [] },
    { id: 4, open: false, dateLabel: "Nov 25", outro: "", photos: [] },
    { id: 5, open: false, dateLabel: "Nov 26", outro: "", photos: [] },
    { id: 6, open: false, dateLabel: "Nov 27", outro: "", photos: [] },
    { id: 7, open: false, dateLabel: "Nov 28", outro: "", photos: [] }
  ]
};
