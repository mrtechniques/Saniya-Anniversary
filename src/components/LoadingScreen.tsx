import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  resolveTemplateText,
  type WebsiteConfig,
} from '../config/anniversary';
import { formatShortDate } from '../config/dateUtils';

interface LoadingScreenProps {
  config?: WebsiteConfig;
  skip?: boolean;
  onComplete?: () => void;
}

export function LoadingScreen({
  config = DEFAULT_WEBSITE_CONFIG,
  skip = false,
  onComplete,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(!skip);
  const [progress, setProgress] = useState(18);

  const headline = resolveTemplateText(config.loading.headline, config);
  const subline = resolveTemplateText(config.loading.subline, config);
  const weddingDateShort = formatShortDate(config.couple.weddingDate);

  useEffect(() => {
    if (skip) {
      setVisible(false);
      return;
    }

    let settled = false;

    const finishLoading = () => {
      if (settled) return;
      settled = true;
      setProgress(100);
      window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 360);
    };

    const t1 = window.setTimeout(() => setProgress((prev) => Math.max(prev, 54)), 240);
    const t2 = window.setTimeout(() => setProgress((prev) => Math.max(prev, 82)), 620);

    const preloadImg = new Image();
    preloadImg.referrerPolicy = 'no-referrer';
    preloadImg.src = config.hero.image;

    const minDisplayTimer = window.setTimeout(() => {
      if (preloadImg.complete) {
        finishLoading();
      }
    }, 1050);

    preloadImg.onload = () => {
      window.setTimeout(finishLoading, 520);
    };
    preloadImg.onerror = () => {
      window.setTimeout(finishLoading, 750);
    };

    const maxTimeoutTimer = window.setTimeout(finishLoading, 2100);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(minDisplayTimer);
      window.clearTimeout(maxTimeoutTimer);
      preloadImg.onload = null;
      preloadImg.onerror = null;
    };
  }, [config.hero.image, onComplete, skip]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={subline}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 surface-burgundy-linen text-[#FFF8F2]"
        >
          <div className="relative flex flex-col items-center text-center max-w-xs w-full">
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: [0.95, 1.06, 0.95], opacity: 1 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="mb-7 flex items-center justify-center"
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden="true"
                className="text-[#F7DDE2]"
              >
                <path
                  d="M18 31.2C17.6 31.2 17.2 31.05 16.9 30.78C14.7 28.85 5 20.1 5 12.6C5 8.18 8.46 4.8 12.6 4.8C15.05 4.8 17.22 6.03 18 7.82C18.78 6.03 20.95 4.8 23.4 4.8C27.54 4.8 31 8.18 31 12.6C31 20.1 21.3 28.85 19.1 30.78C18.8 31.05 18.4 31.2 18 31.2Z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  fill="rgba(247, 221, 226, 0.14)"
                />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="font-[family-name:var(--font-script)] text-[1.95rem] leading-tight text-[#F7DDE2] mb-2"
            >
              {headline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.86 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="font-[family-name:var(--font-display)] text-sm tracking-[0.18em] uppercase text-[#FFF8F2]/85 mb-8"
            >
              {subline}
            </motion.p>

            <div className="w-44 h-[1.5px] bg-[#FFF8F2]/18 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F7DDE2]/70 via-[#F7DDE2] to-[#C6A36A]"
                initial={{ width: '10%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <p className="mt-5 text-[11px] tracking-[0.26em] uppercase text-[#C6A36A]/85 tabular-nums">
              {weddingDateShort}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
