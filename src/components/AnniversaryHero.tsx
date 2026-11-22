import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { COUPLE_INFO } from '../config/anniversary';

export function AnniversaryHero() {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'fallback'>('loading');

  const handleScrollToStory = () => {
    const storyEl = document.getElementById('our-story');
    storyEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Anniversary introduction"
      className="relative min-h-[100svh] w-full flex flex-col justify-end overflow-hidden bg-[#310916] text-[#FFF8F2]"
    >
      {/* Background photograph (/memories/photos/26.jpeg) with graceful velvet editorial fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {imageState !== 'fallback' ? (
          <motion.img
            src={COUPLE_INFO.heroImageSrc}
            alt={`${COUPLE_INFO.husband} and ${COUPLE_INFO.wife} on their first wedding anniversary`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('fallback')}
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full w-full object-cover object-center transition-opacity duration-700 ${
              imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="h-full w-full surface-burgundy-linen relative flex items-center justify-center">
            {/* Subtle framing guide when 26.jpeg is not yet added */}
            <div className="absolute inset-6 sm:inset-10 border border-[#C6A36A]/22 pointer-events-none" />
            <div className="mb-36 sm:mb-44 flex flex-col items-center text-center px-6 pointer-events-none">
              <div className="h-20 w-20 rounded-full border border-[#C6A36A]/35 flex items-center justify-center mb-3 bg-[#490D20]/45">
                <span className="font-[family-name:var(--font-display)] italic text-2xl text-[#F7DDE2]/90">
                  A &amp; S
                </span>
              </div>
              <span className="text-[11px] tracking-[0.26em] uppercase text-[#C6A36A]/85">
                Cover Frame · Plate 26
              </span>
            </div>
          </div>
        )}

        {/* Soft burgundy scrim anchored to bottom third so faces/upper subject stay unobstructed */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#310916] via-[#490D20]/55 via-38% to-[#310916]/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#310916]/95 via-[#310916]/68 to-transparent"
        />
        {/* Subtle film grain overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 film-grain-overlay opacity-40 mix-blend-soft-light pointer-events-none"
        />
      </div>

      {/* Top quiet date ornament (keeps center completely open) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative z-10 w-full px-5 pt-6 sm:px-8 sm:pt-8 mb-auto flex items-center justify-between text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#FFF8F2]/80"
      >
        <span>{COUPLE_INFO.title}</span>
        <span className="tabular-nums text-[#F7DDE2]/90">{COUPLE_INFO.weddingDateShort}</span>
      </motion.div>

      {/* Bottom-aligned editorial typography block */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 pb-8 pt-24 sm:px-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <p className="font-[family-name:var(--font-script)] text-[1.75rem] sm:text-[2.25rem] leading-snug text-[#F7DDE2] mb-2">
            {COUPLE_INFO.heroKicker}
          </p>

          <h1 className="font-[family-name:var(--font-display)] font-medium tracking-[0.06em] text-[clamp(2.1rem,8.2vw,4.5rem)] leading-[0.98] text-[#FFF8F2] mb-3">
            {COUPLE_INFO.coupleDisplay}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#C6A36A] mb-4">
            <span>{COUPLE_INFO.heroSubtitle}</span>
            <span aria-hidden="true" className="text-[#FFF8F2]/45">
              ·
            </span>
            <span className="tabular-nums text-[#F7DDE2]">{COUPLE_INFO.weddingDate}</span>
          </div>

          <p className="font-[family-name:var(--font-editorial)] italic text-lg sm:text-xl text-[#FFF8F2]/95 mb-2.5">
            {COUPLE_INFO.heroTagline}
          </p>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[#F7DDE2]/88 max-w-md mb-7">
            “{COUPLE_INFO.heroQuote}”
          </p>

          <button
            type="button"
            onClick={handleScrollToStory}
            aria-label={COUPLE_INFO.scrollPrompt}
            className="group inline-flex items-center gap-3 min-h-[44px] pr-4 py-2 text-xs tracking-[0.22em] uppercase text-[#FFF8F2]/90 hover:text-[#F7DDE2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7DDE2] cursor-pointer"
          >
            <span className="h-[1px] w-7 bg-[#C6A36A] transition-all duration-300 group-hover:w-10" />
            <span>{COUPLE_INFO.scrollPrompt}</span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <ChevronDown className="w-4 h-4 text-[#F7DDE2]" />
            </motion.span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
