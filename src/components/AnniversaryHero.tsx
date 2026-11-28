import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  DEFAULT_WEBSITE_CONFIG,
  getCoupleInitials,
  getEffectiveAnniversaryNumber,
  resolveTemplateText,
  type WebsiteConfig,
} from '../config/anniversary';
import { formatOrdinal, formatReadableDate, formatShortDate } from '../config/dateUtils';
import { getPositionedImageStyle } from '../utils/imageStyle';

interface AnniversaryHeroProps {
  config?: WebsiteConfig;
}

export function AnniversaryHero({ config = DEFAULT_WEBSITE_CONFIG }: AnniversaryHeroProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'fallback'>('loading');

  useEffect(() => {
    setImageState('loading');
  }, [config.hero.image]);

  const handleScrollToStory = () => {
    const storyEl = document.getElementById('our-story');
    storyEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const groom = config.couple.groomName.trim() || 'Arshad';
  const bride = config.couple.brideName.trim() || 'Saniya';
  const initials = getCoupleInitials(config.couple);
  const annOrdinal = formatOrdinal(getEffectiveAnniversaryNumber(config.couple));
  const weddingDateReadable = formatReadableDate(config.couple.weddingDate);
  const weddingDateShort = formatShortDate(config.couple.weddingDate);

  const title = resolveTemplateText(config.couple.websiteTitle, config);
  const kicker = resolveTemplateText(config.hero.kicker, config);
  const coupleDisplay = resolveTemplateText(config.hero.coupleDisplay, config);
  const subtitle = resolveTemplateText(config.hero.subtitle, config);
  const tagline = resolveTemplateText(config.hero.tagline, config);
  const quote = resolveTemplateText(config.hero.quote, config);
  const scrollPrompt = resolveTemplateText(config.hero.scrollPrompt, config);

  const overlayAlpha = Math.min(Math.max(config.hero.overlayDarkness, 0), 100) / 100;
  const imageStyle = getPositionedImageStyle(config.hero.position);

  return (
    <section
      aria-label="Anniversary introduction"
      className="relative min-h-[100svh] w-full flex flex-col justify-end overflow-hidden bg-[#310916] text-[#FFF8F2]"
    >
      {/* Background photograph with graceful velvet editorial fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {imageState !== 'fallback' ? (
          <motion.img
            src={config.hero.image}
            alt={`${groom} and ${bride} on their ${annOrdinal} wedding anniversary`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('fallback')}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageState === 'loaded' ? 1 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={imageStyle}
            className="h-full w-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full surface-burgundy-linen relative flex items-center justify-center">
            <div className="absolute inset-6 sm:inset-10 border border-[#C6A36A]/22 pointer-events-none" />
            <div className="mb-36 sm:mb-44 flex flex-col items-center text-center px-6 pointer-events-none">
              <div className="h-20 w-20 rounded-full border border-[#C6A36A]/35 flex items-center justify-center mb-3 bg-[#490D20]/45">
                <span className="font-[family-name:var(--font-display)] italic text-2xl text-[#F7DDE2]/90">
                  {initials}
                </span>
              </div>
              <span className="text-[11px] tracking-[0.26em] uppercase text-[#C6A36A]/85">
                Cover Frame
              </span>
            </div>
          </div>
        )}

        {/* Adjustable soft burgundy scrim anchored to bottom third */}
        <div
          aria-hidden="true"
          style={{ opacity: overlayAlpha }}
          className="absolute inset-0 bg-gradient-to-t from-[#310916] via-[#490D20]/70 via-40% to-[#310916]/30 pointer-events-none"
        />
        <div
          aria-hidden="true"
          style={{ opacity: Math.min(1, overlayAlpha + 0.2) }}
          className="absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#310916] via-[#310916]/75 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 film-grain-overlay opacity-40 mix-blend-soft-light pointer-events-none"
        />
      </div>

      {/* Top quiet date ornament */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative z-10 w-full px-5 pt-6 sm:px-8 sm:pt-8 mb-auto flex items-center justify-between text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#FFF8F2]/80"
      >
        <span>{title}</span>
        <span className="tabular-nums text-[#F7DDE2]/90">{weddingDateShort}</span>
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
            {kicker}
          </p>

          <h1 className="font-[family-name:var(--font-display)] font-medium tracking-[0.06em] text-[clamp(2.1rem,8.2vw,4.5rem)] leading-[0.98] text-[#FFF8F2] mb-3">
            {coupleDisplay}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#C6A36A] mb-4">
            <span>{subtitle}</span>
            <span aria-hidden="true" className="text-[#FFF8F2]/45">
              ·
            </span>
            <span className="tabular-nums text-[#F7DDE2]">{weddingDateReadable}</span>
          </div>

          <p className="font-[family-name:var(--font-editorial)] italic text-lg sm:text-xl text-[#FFF8F2]/95 mb-2.5">
            {tagline}
          </p>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[#F7DDE2]/88 max-w-md mb-7">
            “{quote}”
          </p>

          <button
            type="button"
            onClick={handleScrollToStory}
            aria-label={scrollPrompt}
            className="group inline-flex items-center gap-3 min-h-[44px] pr-4 py-2 text-xs tracking-[0.22em] uppercase text-[#FFF8F2]/90 hover:text-[#F7DDE2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7DDE2] cursor-pointer"
          >
            <span className="h-[1px] w-7 bg-[#C6A36A] transition-all duration-300 group-hover:w-10" />
            <span>{scrollPrompt}</span>
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
