import {
  calculateAnniversaryNumber,
  formatOrdinal,
  formatOrdinalWord,
  formatReadableDate,
  formatShortDate,
  getAnniversaryDateISO,
  parseISODate,
} from './dateUtils';

export interface ImagePosition {
  x: number; // 0..100
  y: number; // 0..100
  zoom: number; // 1..2.5
}

export const DEFAULT_IMAGE_POSITION: ImagePosition = {
  x: 50,
  y: 50,
  zoom: 1,
};

export interface PhotoMemory {
  id: number;
  src: string;
  plateLabel: string;
  caption: string;
  subcaption?: string;
  objectPosition?: string;
  position: ImagePosition;
  visible: boolean;
  originalFileName?: string;
  fileSize?: number;
  mimeType?: string;
  compatibilityNote?: string;
  previewSupported?: boolean;
}

export interface StoryChapter {
  id: string;
  sequence: string;
  photoId: number;
  heading: string;
  body: string;
  dateLabel?: string;
  image: string;
  plateLabel: string;
  position: ImagePosition;
  visible: boolean;
}

export interface VideoMemory {
  id: number;
  src: string;
  reelLabel: string;
  title: string;
  caption: string;
  visible: boolean;
  originalFileName?: string;
  fileSize?: number;
  mimeType?: string;
  compatibilityNote?: string;
  previewSupported?: boolean;
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

export interface CoupleConfig {
  groomName: string;
  brideName: string;
  weddingDate: string; // YYYY-MM-DD
  autoCalculateAnniversary: boolean;
  anniversaryNumber: number;
  websiteTitle: string;
  pageTitle: string;
}

export interface HeroConfig {
  kicker: string;
  coupleDisplay: string;
  subtitle: string;
  tagline: string;
  quote: string;
  scrollPrompt: string;
  image: string;
  position: ImagePosition;
  overlayDarkness: number; // 0..100
}

export interface SectionHeaderConfig {
  eyebrow?: string;
  heading: string;
  subheading: string;
  helperNote?: string;
}

export interface FinalMessageConfig {
  lead: string;
  animatedLine: string;
  anniversaryGreeting: string;
  signOff: string;
  closingNote: string;
}

export interface EditorAccessConfig {
  pinEnabled: boolean;
  pinCode: string;
}

export interface WebsiteConfig {
  version: 1;
  couple: CoupleConfig;
  loading: {
    headline: string;
    subline: string;
  };
  hero: HeroConfig;
  storyHeader: SectionHeaderConfig;
  stories: StoryChapter[];
  galleryHeader: SectionHeaderConfig;
  photos: PhotoMemory[];
  videoHeader: SectionHeaderConfig;
  videos: VideoMemory[];
  loveNotesHeader: SectionHeaderConfig;
  loveNotes: LoveNote[];
  letter: AnniversaryLetterData;
  finalMessage: FinalMessageConfig;
  editorAccess: EditorAccessConfig;
}

export const MINIMUM_PUBLISH_PHOTOS = 8;

export const TOTAL_PHOTOS = 29;
export const TOTAL_VIDEOS = 6;
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
  27: { caption: 'Another quiet moment we will always carry with us.' },
  28: { caption: 'Still finding new favourites in every glance.' },
  29: { caption: 'Ending our first year just as warmly as it began.' },
};

export const PHOTO_MEMORIES: PhotoMemory[] = Array.from(
  { length: TOTAL_PHOTOS },
  (_, index) => {
    const id = index + 1;
    const meta = DEFAULT_PHOTO_CAPTIONS[id] ?? {
      caption: 'A cherished memory from our first year together.',
    };
    return {
      id,
      src: `/memories/photos/${id}.jpeg`,
      plateLabel: `Plate ${String(id).padStart(2, '0')}`,
      caption: meta.caption,
      subcaption: meta.subcaption,
      objectPosition: '50% 50%',
      position: { ...DEFAULT_IMAGE_POSITION },
      visible: true,
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
    image: '/memories/photos/1.jpeg',
    plateLabel: 'Plate 01',
    position: { ...DEFAULT_IMAGE_POSITION },
    visible: true,
  },
  {
    id: 'chapter-02',
    sequence: '02',
    photoId: 2,
    heading: 'Ordinary Days, Extraordinary Grace',
    body: 'From ordinary days to extraordinary memories, everything became special with you. Even the simplest hours turned into treasures.',
    image: '/memories/photos/2.jpeg',
    plateLabel: 'Plate 02',
    position: { ...DEFAULT_IMAGE_POSITION },
    visible: true,
  },
  {
    id: 'chapter-03',
    sequence: '03',
    photoId: 3,
    heading: 'Felt More Than Spoken',
    body: 'Some moments are too beautiful to explain. They can only be felt—in a shared glance, a quiet laugh, and the peace of being understood.',
    image: '/memories/photos/3.jpeg',
    plateLabel: 'Plate 03',
    position: { ...DEFAULT_IMAGE_POSITION },
    visible: true,
  },
  {
    id: 'chapter-04',
    sequence: '04',
    photoId: 4,
    heading: 'Always You',
    body: 'And if I could live this whole first year all over again, through every small and sweeping moment, I would still choose you.',
    image: '/memories/photos/4.jpeg',
    plateLabel: 'Plate 04',
    position: { ...DEFAULT_IMAGE_POSITION },
    visible: true,
  },
];

export const GALLERY_SECTION_HEADER = {
  heading: 'A Thousand Memories, One Beautiful Story',
  subheading:
    'Framed moments from our first year, preserved intact without losing a single detail.',
};

export const GALLERY_PHOTO_IDS = PHOTO_MEMORIES.filter(
  (photo) => photo.id > 4 && photo.id !== HERO_PHOTO_ID,
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
  5: {
    title: 'In Motion — Reel V',
    caption: 'Little expressions worth replaying forever.',
  },
  6: {
    title: 'In Motion — Reel VI',
    caption: 'Quiet joy, preserved just as it happened.',
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
      visible: true,
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
  salutation: 'My Dearest {groom},',
  paragraphs: [
    'One year ago, we started a beautiful journey together.',
    'Thank you for being my person, my happiness, my comfort, and the one I get to call mine.',
    'Every moment with you is a memory I want to keep forever.',
    "And if I had to choose all over again, I'd still choose you.",
    'This is just the first chapter of our forever.',
  ],
  closing: 'With all my love,',
  signature: '{bride} ❤️',
};

export const FINAL_MESSAGE_CONTENT = {
  lead: 'One year down...',
  animatedLine: 'Forever to go. ❤️',
  anniversaryGreeting: 'Happy {anniversaryOrdinalWord} Anniversary, {groom}.',
  signOff: 'With love, {bride}.',
  closingNote: 'To many more beautiful years together.',
  dateRange: '23 November 2025 — 23 November 2026',
};

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  version: 1,
  couple: {
    groomName: 'Arshad',
    brideName: 'Saniya',
    weddingDate: '2025-11-23',
    autoCalculateAnniversary: false,
    anniversaryNumber: 1,
    websiteTitle: 'A Year of Us',
    pageTitle: 'A Year of Us — {groom} & {bride}',
  },
  loading: {
    headline: LOADING_CONTENT.headline,
    subline: LOADING_CONTENT.subline,
  },
  hero: {
    kicker: COUPLE_INFO.heroKicker,
    coupleDisplay: '{GROOM} & {BRIDE}',
    subtitle: 'Happy {anniversaryOrdinal} Anniversary',
    tagline: COUPLE_INFO.heroTagline,
    quote: COUPLE_INFO.heroQuote,
    scrollPrompt: COUPLE_INFO.scrollPrompt,
    image: COUPLE_INFO.heroImageSrc,
    position: { ...DEFAULT_IMAGE_POSITION },
    overlayDarkness: 65,
  },
  storyHeader: {
    eyebrow: 'The First Year',
    heading: STORY_SECTION_HEADER.heading,
    subheading: STORY_SECTION_HEADER.subheading,
  },
  stories: STORY_CHAPTERS.map((ch) => ({
    ...ch,
    position: { ...ch.position },
  })),
  galleryHeader: {
    heading: GALLERY_SECTION_HEADER.heading,
    subheading: GALLERY_SECTION_HEADER.subheading,
  },
  photos: PHOTO_MEMORIES.filter((p) => GALLERY_PHOTO_IDS.includes(p.id)).map((p) => ({
    ...p,
    position: { ...p.position },
  })),
  videoHeader: {
    heading: VIDEO_SECTION_HEADER.heading,
    subheading: VIDEO_SECTION_HEADER.subheading,
    helperNote: VIDEO_SECTION_HEADER.helperNote,
  },
  videos: VIDEO_MEMORIES.map((v) => ({ ...v })),
  loveNotesHeader: {
    eyebrow: 'Notes of Affection',
    heading: LOVE_NOTES_HEADER.heading,
    subheading: LOVE_NOTES_HEADER.subheading,
  },
  loveNotes: DEFAULT_LOVE_NOTES.map((n) => ({ ...n })),
  letter: {
    ...DEFAULT_LETTER,
    paragraphs: [...DEFAULT_LETTER.paragraphs],
  },
  finalMessage: {
    lead: FINAL_MESSAGE_CONTENT.lead,
    animatedLine: FINAL_MESSAGE_CONTENT.animatedLine,
    anniversaryGreeting: FINAL_MESSAGE_CONTENT.anniversaryGreeting,
    signOff: FINAL_MESSAGE_CONTENT.signOff,
    closingNote: FINAL_MESSAGE_CONTENT.closingNote,
  },
  editorAccess: {
    pinEnabled: false,
    pinCode: '',
  },
};

export const CONFIG_STORAGE_KEY = 'a_year_of_us_config_v1';

export function cloneConfig(config: WebsiteConfig): WebsiteConfig {
  return JSON.parse(JSON.stringify(config)) as WebsiteConfig;
}

export function getEffectiveAnniversaryNumber(couple: CoupleConfig): number {
  if (couple.autoCalculateAnniversary) {
    return calculateAnniversaryNumber(couple.weddingDate);
  }
  return Math.max(1, Math.floor(couple.anniversaryNumber || 1));
}

export function getCoupleInitials(couple: CoupleConfig): string {
  const g = couple.groomName.trim().charAt(0).toUpperCase() || 'A';
  const b = couple.brideName.trim().charAt(0).toUpperCase() || 'S';
  return `${g} & ${b}`;
}

export function resolveTemplateText(text: string, config: WebsiteConfig): string {
  if (!text) return '';
  const groom = config.couple.groomName.trim() || 'Arshad';
  const bride = config.couple.brideName.trim() || 'Saniya';
  const annNum = getEffectiveAnniversaryNumber(config.couple);
  const weddingReadable = formatReadableDate(config.couple.weddingDate);
  const annISO = getAnniversaryDateISO(config.couple.weddingDate, annNum);
  const annReadable = formatReadableDate(annISO);

  return text
    .replace(/\{groom\}/g, groom)
    .replace(/\{bride\}/g, bride)
    .replace(/\{GROOM\}/g, groom.toUpperCase())
    .replace(/\{BRIDE\}/g, bride.toUpperCase())
    .replace(/\{anniversaryNumber\}/g, String(annNum))
    .replace(/\{anniversaryOrdinal\}/g, formatOrdinal(annNum))
    .replace(/\{anniversaryOrdinalWord\}/g, formatOrdinalWord(annNum))
    .replace(/\{weddingDate\}/g, weddingReadable)
    .replace(/\{weddingDateShort\}/g, formatShortDate(config.couple.weddingDate))
    .replace(/\{anniversaryDate\}/g, annReadable);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeImagePosition(pos?: Partial<ImagePosition> | null): ImagePosition {
  return {
    x: typeof pos?.x === 'number' && Number.isFinite(pos.x) ? clamp(pos.x, 0, 100) : 50,
    y: typeof pos?.y === 'number' && Number.isFinite(pos.y) ? clamp(pos.y, 0, 100) : 50,
    zoom:
      typeof pos?.zoom === 'number' && Number.isFinite(pos.zoom)
        ? clamp(pos.zoom, 1, 2.5)
        : 1,
  };
}

export function isValidMediaPath(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  );
}

export function getValidVisiblePhotos(config: WebsiteConfig): PhotoMemory[] {
  return config.photos.filter((p) => p.visible && isValidMediaPath(p.src));
}

export interface PublishValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePublishConfig(config: WebsiteConfig): PublishValidationResult {
  const errors: string[] = [];

  if (!config.couple.groomName.trim()) {
    errors.push('Groom name is required.');
  }
  if (!config.couple.brideName.trim()) {
    errors.push('Bride name is required.');
  }
  if (!parseISODate(config.couple.weddingDate)) {
    errors.push('A valid wedding date (YYYY-MM-DD) is required.');
  }
  if (!isValidMediaPath(config.hero.image)) {
    errors.push('Hero background photograph path is required.');
  }
  if (!config.hero.subtitle.trim() && !config.hero.coupleDisplay.trim()) {
    errors.push('Hero heading or couple display text is required.');
  }

  const validPhotos = getValidVisiblePhotos(config);
  if (validPhotos.length < MINIMUM_PUBLISH_PHOTOS) {
    errors.push(
      `You need at least ${MINIMUM_PUBLISH_PHOTOS} photographs before publishing your anniversary website. (Currently ${validPhotos.length} / ${MINIMUM_PUBLISH_PHOTOS})`,
    );
  }

  const invalidStory = config.stories.find(
    (s) => s.visible && (!s.heading.trim() || !isValidMediaPath(s.image)),
  );
  if (invalidStory) {
    errors.push(`Visible story "${invalidStory.heading || invalidStory.sequence}" needs a title and valid image path.`);
  }

  const invalidVideo = config.videos.find((v) => v.visible && !isValidMediaPath(v.src));
  if (invalidVideo) {
    errors.push(`Visible video "${invalidVideo.title || invalidVideo.reelLabel}" has an invalid media path.`);
  }

  if (!config.letter.salutation.trim() || config.letter.paragraphs.every((p) => !p.trim())) {
    errors.push('Anniversary letter needs a greeting and at least one paragraph.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface ImportValidationResult {
  valid: boolean;
  config?: WebsiteConfig;
  error?: string;
}

export function validateImportedConfig(raw: unknown): ImportValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Configuration file must contain a JSON object.' };
  }

  const data = raw as Partial<WebsiteConfig>;
  if (data.version !== 1) {
    return {
      valid: false,
      error: `Unsupported configuration version (${String(data.version ?? 'missing')}). Expected version 1.`,
    };
  }

  if (!data.couple || typeof data.couple.groomName !== 'string' || typeof data.couple.brideName !== 'string') {
    return { valid: false, error: 'Missing required "couple" details (groomName, brideName).' };
  }

  const def = cloneConfig(DEFAULT_WEBSITE_CONFIG);

  const merged: WebsiteConfig = {
    version: 1,
    couple: {
      ...def.couple,
      ...data.couple,
    },
    loading: {
      ...def.loading,
      ...(data.loading ?? {}),
    },
    hero: {
      ...def.hero,
      ...(data.hero ?? {}),
      position: normalizeImagePosition(data.hero?.position),
      overlayDarkness:
        typeof data.hero?.overlayDarkness === 'number'
          ? clamp(data.hero.overlayDarkness, 0, 100)
          : def.hero.overlayDarkness,
    },
    storyHeader: {
      ...def.storyHeader,
      ...(data.storyHeader ?? {}),
    },
    stories: Array.isArray(data.stories)
      ? data.stories.map((s, idx) => ({
          id: typeof s?.id === 'string' ? s.id : `chapter-${idx + 1}`,
          sequence: typeof s?.sequence === 'string' ? s.sequence : String(idx + 1).padStart(2, '0'),
          photoId: typeof s?.photoId === 'number' ? s.photoId : idx + 1,
          heading: typeof s?.heading === 'string' ? s.heading : '',
          body: typeof s?.body === 'string' ? s.body : '',
          dateLabel: typeof s?.dateLabel === 'string' ? s.dateLabel : undefined,
          image: typeof s?.image === 'string' ? s.image : '',
          plateLabel:
            typeof s?.plateLabel === 'string'
              ? s.plateLabel
              : `Plate ${String(idx + 1).padStart(2, '0')}`,
          position: normalizeImagePosition(s?.position),
          visible: typeof s?.visible === 'boolean' ? s.visible : true,
        }))
      : def.stories,
    galleryHeader: {
      ...def.galleryHeader,
      ...(data.galleryHeader ?? {}),
    },
    photos: Array.isArray(data.photos)
      ? data.photos.map((p, idx) => ({
          id: typeof p?.id === 'number' ? p.id : idx + 1,
          src: typeof p?.src === 'string' ? p.src : '',
          plateLabel:
            typeof p?.plateLabel === 'string'
              ? p.plateLabel
              : `Plate ${String(idx + 1).padStart(2, '0')}`,
          caption: typeof p?.caption === 'string' ? p.caption : '',
          subcaption: typeof p?.subcaption === 'string' ? p.subcaption : undefined,
          position: normalizeImagePosition(p?.position),
          objectPosition: `${normalizeImagePosition(p?.position).x}% ${normalizeImagePosition(p?.position).y}%`,
          visible: typeof p?.visible === 'boolean' ? p.visible : true,
        }))
      : def.photos,
    videoHeader: {
      ...def.videoHeader,
      ...(data.videoHeader ?? {}),
    },
    videos: Array.isArray(data.videos)
      ? data.videos.map((v, idx) => ({
          id: typeof v?.id === 'number' ? v.id : idx + 1,
          src: typeof v?.src === 'string' ? v.src : '',
          reelLabel:
            typeof v?.reelLabel === 'string'
              ? v.reelLabel
              : `Reel ${String(idx + 1).padStart(2, '0')}`,
          title: typeof v?.title === 'string' ? v.title : '',
          caption: typeof v?.caption === 'string' ? v.caption : '',
          visible: typeof v?.visible === 'boolean' ? v.visible : true,
        }))
      : def.videos,
    loveNotesHeader: {
      ...def.loveNotesHeader,
      ...(data.loveNotesHeader ?? {}),
    },
    loveNotes: Array.isArray(data.loveNotes)
      ? data.loveNotes.map((n, idx) => ({
          id: typeof n?.id === 'string' ? n.id : `note-${idx + 1}`,
          title: typeof n?.title === 'string' ? n.title : '',
          description: typeof n?.description === 'string' ? n.description : '',
        }))
      : def.loveNotes,
    letter: {
      ...def.letter,
      ...(data.letter ?? {}),
      paragraphs: Array.isArray(data.letter?.paragraphs)
        ? data.letter.paragraphs.filter((p): p is string => typeof p === 'string')
        : def.letter.paragraphs,
    },
    finalMessage: {
      ...def.finalMessage,
      ...(data.finalMessage ?? {}),
    },
    editorAccess: {
      ...def.editorAccess,
      ...(data.editorAccess ?? {}),
    },
  };

  return { valid: true, config: merged };
}

export function loadWebsiteConfig(): WebsiteConfig {
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return cloneConfig(DEFAULT_WEBSITE_CONFIG);
    const parsed = JSON.parse(raw) as unknown;
    const result = validateImportedConfig(parsed);
    if (result.valid && result.config) {
      return result.config;
    }
  } catch {
    // Ignore storage read errors and fall back to defaults
  }
  return cloneConfig(DEFAULT_WEBSITE_CONFIG);
}

export function saveWebsiteConfig(config: WebsiteConfig): boolean {
  try {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
}

export function clearWebsiteConfig(): void {
  try {
    window.localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
