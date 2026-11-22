export interface PhotoMemory {
  id: number;
  src: string;
  plateLabel: string;
  caption: string;
  subcaption?: string;
  objectPosition?: string;
}

export interface StoryChapter {
  id: string;
  sequence: string;
  photoId: number;
  heading: string;
  body: string;
  dateLabel?: string;
}

export interface VideoMemory {
  id: number;
  src: string;
  reelLabel: string;
  title: string;
  caption: string;
}

export interface LoveNote {
  id: string;
  title: string;
  description: string;
}

export interface AnniversaryLetterData {
  heading: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
}

export const TOTAL_PHOTOS = 26;
export const TOTAL_VIDEOS = 4;
export const HERO_PHOTO_ID = 26;

export const COUPLE_INFO = {
  husband: 'Arshad',
  wife: 'Saniya',
  title: 'A Year of Us',
  coupleDisplay: 'ARSHAD & SANIYA',
  weddingDate: '23 November 2025',
  weddingDateShort: '23.11.2025',
  firstAnniversaryDate: '23 November 2026',
  heroKicker: 'For the love of my life...',
  heroSubtitle: 'Happy 1st Anniversary',
  heroTagline: 'One year of us. A lifetime to go.',
  heroQuote:
    '365 days of memories, countless reasons to love you, and forever still ahead.',
  scrollPrompt: 'Scroll to begin our story',
  heroImageSrc: `/memories/photos/${HERO_PHOTO_ID}.jpeg`,
};

export const LOADING_CONTENT = {
  headline: 'A little world made with love...',
  subline: 'Preparing our beautiful memories',
};

const DEFAULT_PHOTO_CAPTIONS: Record<number, { caption: string; subcaption?: string }> = {
  1: { caption: 'Every picture holds a little piece of our story.' },
  2: { caption: 'Where ordinary moments turned into quiet keepsakes.' },
  3: { caption: 'A gentle frame from our first year together.' },
  4: { caption: 'Side by side, learning the rhythm of forever.' },
  5: { caption: 'Captured in stillness, remembered with warmth.' },
  6: { caption: 'A day we wished could linger just a little longer.' },
  7: { caption: 'Soft light, familiar laughter, and you.' },
  8: { caption: 'Moments that needed no words at all.' },
  9: { caption: 'One frame closer to a lifetime of memories.' },
  10: { caption: 'The kind of happiness that feels effortlessly like home.' },
  11: { caption: 'Held tenderly in time, just as it felt.' },
  12: { caption: 'Little glances that say everything the heart feels.' },
  13: { caption: 'A quiet afternoon preserved in full.' },
  14: { caption: 'Together is still my favourite place to be.' },
  15: { caption: 'Every shared smile stays tucked inside this year.' },
  16: { caption: 'Unscripted, unhurried, and completely ours.' },
  17: { caption: 'Another chapter written simply by being together.' },
  18: { caption: 'Warmth that stays long after the moment passes.' },
  19: { caption: 'Simple days that became unforgettable because of you.' },
  20: { caption: 'Carrying this feeling into every year ahead.' },
  21: { caption: 'A small frame holding so much gratitude.' },
  22: { caption: 'Still looking at you the same way.' },
  23: { caption: 'Treasured details from our first chapter.' },
  24: { caption: 'All the warmth of our first three hundred and sixty-five days.' },
  25: { caption: 'Here is to every frame still waiting for us.' },
  26: { caption: 'Our cover frame — one year of us, forever to go.' },
};

export const PHOTO_MEMORIES: PhotoMemory[] = Array.from(
  { length: TOTAL_PHOTOS },
  (_, index) => {
    const id = index + 1;
    const meta = DEFAULT_PHOTO_CAPTIONS[id] ?? {
      caption: `A cherished memory from our first year together.`,
    };
    return {
      id,
      src: `/memories/photos/${id}.jpeg`,
      plateLabel: `Plate ${String(id).padStart(2, '0')}`,
      caption: meta.caption,
      subcaption: meta.subcaption,
      objectPosition: 'center center',
    };
  },
);

export const STORY_SECTION_HEADER = {
  heading: 'Our Story',
  subheading: 'Every beautiful forever begins with a moment.',
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-01',
    sequence: '01',
    photoId: 1,
    heading: 'The Beginning of Forever',
    body: 'Every picture holds a little piece of our story—the quiet certainty that from this day forward, every season would belong to us.',
    dateLabel: '23 November 2025',
  },
  {
    id: 'chapter-02',
    sequence: '02',
    photoId: 2,
    heading: 'Ordinary Days, Extraordinary Grace',
    body: 'From ordinary days to extraordinary memories, everything became special with you. Even the simplest hours turned into treasures.',
  },
  {
    id: 'chapter-03',
    sequence: '03',
    photoId: 3,
    heading: 'Felt More Than Spoken',
    body: 'Some moments are too beautiful to explain. They can only be felt—in a shared glance, a quiet laugh, and the peace of being understood.',
  },
  {
    id: 'chapter-04',
    sequence: '04',
    photoId: 4,
    heading: 'Always You',
    body: 'And if I could live this whole first year all over again, through every small and sweeping moment, I would still choose you.',
  },
];

export const GALLERY_SECTION_HEADER = {
  heading: 'A Thousand Memories, One Beautiful Story',
  subheading:
    'Twenty-five framed moments from our first year, preserved intact without losing a single detail.',
};

export const GALLERY_PHOTO_IDS = PHOTO_MEMORIES.filter(
  (photo) => photo.id > 4 && photo.id < HERO_PHOTO_ID,
).map((photo) => photo.id);

export const VIDEO_SECTION_HEADER = {
  heading: 'Some Memories Come Alive',
  subheading: 'Little moments that deserve to be remembered forever.',
  helperNote: 'Tap any reel to listen',
};

const DEFAULT_VIDEO_META: Record<number, { title: string; caption: string }> = {
  1: {
    title: 'In Motion — Reel I',
    caption: 'A living fragment of laughter and closeness.',
  },
  2: {
    title: 'In Motion — Reel II',
    caption: 'Because some moments deserve to move and breathe.',
  },
  3: {
    title: 'In Motion — Reel III',
    caption: 'A fleeting second kept forever in motion.',
  },
  4: {
    title: 'In Motion — Reel IV',
    caption: 'Our first year, playing back in warmth.',
  },
};

export const VIDEO_MEMORIES: VideoMemory[] = Array.from(
  { length: TOTAL_VIDEOS },
  (_, index) => {
    const id = index + 1;
    const meta = DEFAULT_VIDEO_META[id] ?? {
      title: `In Motion — Reel ${id}`,
      caption: 'A cherished moment in motion.',
    };
    return {
      id,
      src: `/memories/videos/${id}.mp4`,
      reelLabel: `Reel ${String(id).padStart(2, '0')}`,
      title: meta.title,
      caption: meta.caption,
    };
  },
);

export const LOVE_NOTES_HEADER = {
  heading: "It's the Little Things",
  subheading: 'The small, everyday reasons I fall in love with you again.',
};

export const DEFAULT_LOVE_NOTES: LoveNote[] = [
  {
    id: 'note-1',
    title: 'Your Warmth',
    description: 'Your smile makes everything better, even on the longest days.',
  },
  {
    id: 'note-2',
    title: 'Shared Laughter',
    description: 'The way we laugh at the smallest things until nothing else matters.',
  },
  {
    id: 'note-3',
    title: 'Endless Conversations',
    description: 'How hours slip away whenever we talk about everything and nothing.',
  },
  {
    id: 'note-4',
    title: 'Every Little Adventure',
    description: 'Turning spontaneous plans and quiet drives into favourite stories.',
  },
  {
    id: 'note-5',
    title: 'Quiet Comfort',
    description: 'The calm and safety of simply having you right beside me.',
  },
  {
    id: 'note-6',
    title: 'Every Ordinary Day',
    description: 'How life feels softer, brighter, and whole because it is with you.',
  },
];

export const DEFAULT_LETTER: AnniversaryLetterData = {
  heading: 'A Little Something From My Heart',
  salutation: 'My Dearest Arshad,',
  paragraphs: [
    'One year ago, we started a beautiful journey together.',
    'Thank you for being my person, my happiness, my comfort, and the one I get to call mine.',
    'Every moment with you is a memory I want to keep forever.',
    "And if I had to choose all over again, I'd still choose you.",
    'This is just the first chapter of our forever.',
  ],
  closing: 'With all my love,',
  signature: 'Saniya ❤️',
};

export const FINAL_MESSAGE_CONTENT = {
  lead: 'One year down...',
  animatedLine: 'Forever to go. ❤️',
  anniversaryGreeting: 'Happy First Anniversary, Arshad.',
  signOff: 'With love, Saniya.',
  closingNote: 'To many more beautiful years together.',
  dateRange: '23 November 2025 — 23 November 2026',
};

const STORAGE_KEYS = {
  letter: 'a_year_of_us_letter_v1',
  notes: 'a_year_of_us_notes_v1',
};

export function loadStoredLetter(): AnniversaryLetterData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.letter);
    if (!raw) return DEFAULT_LETTER;
    const parsed = JSON.parse(raw) as Partial<AnniversaryLetterData>;
    if (
      typeof parsed.salutation === 'string' &&
      Array.isArray(parsed.paragraphs) &&
      typeof parsed.closing === 'string' &&
      typeof parsed.signature === 'string'
    ) {
      return {
        heading: typeof parsed.heading === 'string' ? parsed.heading : DEFAULT_LETTER.heading,
        salutation: parsed.salutation,
        paragraphs: parsed.paragraphs.filter((p): p is string => typeof p === 'string'),
        closing: parsed.closing,
        signature: parsed.signature,
      };
    }
  } catch {
    // Ignore storage read errors and fall back to defaults
  }
  return DEFAULT_LETTER;
}

export function saveStoredLetter(letter: AnniversaryLetterData): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.letter, JSON.stringify(letter));
  } catch {
    // Ignore quota/private-mode storage failures
  }
}

export function clearStoredLetter(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.letter);
  } catch {
    // Ignore
  }
}

export function loadStoredNotes(): LoveNote[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.notes);
    if (!raw) return DEFAULT_LOVE_NOTES;
    const parsed = JSON.parse(raw) as LoveNote[];
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (item) =>
          typeof item?.id === 'string' &&
          typeof item?.title === 'string' &&
          typeof item?.description === 'string',
      )
    ) {
      return parsed;
    }
  } catch {
    // Ignore
  }
  return DEFAULT_LOVE_NOTES;
}

export function saveStoredNotes(notes: LoveNote[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  } catch {
    // Ignore
  }
}

export function clearStoredNotes(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.notes);
  } catch {
    // Ignore
  }
}
