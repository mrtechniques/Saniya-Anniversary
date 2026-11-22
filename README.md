# A Year of Us — Arshad & Saniya ❤️

A mobile-first, luxury editorial first wedding anniversary keepsake and digital love letter from Saniya to Arshad celebrating **23 November 2025 – 23 November 2026**.

---

## Features

- **Cinematic Loading Curtain**: Deep burgundy linen curtain preloading cover photo `26.jpeg` with a bounded timeout fallback.
- **Editorial Hero (`26.jpeg`)**: Full-viewport opening with gentle cinematic zoom, film-grain texture, soft burgundy scrim, and bottom-aligned typography that keeps subjects unobstructed.
- **Our Story**: Four alternating editorial spreads pairing chapters `01`–`04` with narrative passages (single-column photo-first on mobile, balanced alternating columns on desktop).
- **Our Memories & Adaptive Framing**: Curated album spreads for 24 gallery plates (`05`–`25` and `27`–`29`) using `PhotoFrame`, which detects natural image dimensions on load to preserve original aspect ratios inside warm cream matting without stretching or cropping faces. Empty or un-added media files render styled cream editorial plates gracefully.
- **Fullscreen Swipeable Lightbox**: Supports touch-swipe navigation, keyboard arrows (`ArrowLeft` / `ArrowRight` / `Escape`), and uncropped aspect-preserved viewing across all 29 plates.
- **Moments in Motion**: Viewport-aware video gallery (`1.mp4`–`6.mp4`) featuring muted inline autoplay when scrolled into view, automatic offscreen pausing, lazy metadata loading, and single-active-audio coordination.
- **It's the Little Things & Anniversary Letter**: Editorial romantic notes and stationery letter with handwritten signature styling, centrally configurable in code.
- **Forever Finale**: Minimal deep burgundy closing tribute.

---

## Getting Started

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm

### Installation & Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port `3000` |
| `npm run build` | Builds the production static bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) |

---

## Adding Your Personal Photos & Videos

Place your personal media inside the `public/memories/` folders using sequential filenames:

```text
public/
└── memories/
    ├── photos/
    │   ├── 1.jpeg
    │   ├── 2.jpeg
    │   ├── ...
    │   ├── 26.jpeg   (Used as the Hero cover background)
    │   ├── 27.jpeg
    │   ├── 28.jpeg
    │   └── 29.jpeg
    └── videos/
        ├── 1.mp4
        ├── 2.mp4
        ├── 3.mp4
        ├── 4.mp4
        ├── 5.mp4
        └── 6.mp4
```

- **`26.jpeg`**: Full-screen hero background photograph.
- **`1.jpeg` – `4.jpeg`**: Paired with the four chapters in **Our Story**.
- **`5.jpeg` – `25.jpeg` & `27.jpeg` – `29.jpeg`**: Featured in **Our Memories** in numerical order.
- **`1.mp4` – `6.mp4`**: Featured in **Moments in Motion**.

---

## Customizing Text, Captions & Counts

All copy, dates, story chapters, photo captions, video titles, love notes, and the anniversary letter live in one centralized configuration file:

```text
src/config/anniversary.ts
```

- Update `TOTAL_PHOTOS` or `TOTAL_VIDEOS` if you add or remove media files.
- Edit `DEFAULT_PHOTO_CAPTIONS`, `STORY_CHAPTERS`, `DEFAULT_VIDEO_META`, `DEFAULT_LOVE_NOTES`, and `DEFAULT_LETTER` to customize wording directly in code.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Motion** (`motion/react`)
- **Lucide React**
- **Google Fonts** (`Cormorant Garamond`, `Playfair Display`, `DM Sans`, `Great Vibes`)
