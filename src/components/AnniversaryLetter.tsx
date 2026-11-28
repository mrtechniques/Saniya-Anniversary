import { motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  getEffectiveAnniversaryNumber,
  resolveTemplateText,
  type AnniversaryLetterData,
  type WebsiteConfig,
} from '../config/anniversary';
import { formatReadableDate, getAnniversaryDateISO } from '../config/dateUtils';

interface AnniversaryLetterProps {
  letter?: AnniversaryLetterData;
  config?: WebsiteConfig;
}

export function AnniversaryLetter({
  letter,
  config = DEFAULT_WEBSITE_CONFIG,
}: AnniversaryLetterProps) {
  const sourceLetter = letter ?? config.letter;
  const annNum = getEffectiveAnniversaryNumber(config.couple);
  const anniversaryDateReadable = formatReadableDate(
    getAnniversaryDateISO(config.couple.weddingDate, annNum),
  );

  const heading = resolveTemplateText(sourceLetter.heading, config);
  const salutation = resolveTemplateText(sourceLetter.salutation, config);
  const closing = resolveTemplateText(sourceLetter.closing, config);
  const signature = resolveTemplateText(sourceLetter.signature, config);

  return (
    <section
      id="letter"
      aria-labelledby="letter-heading"
      className="relative surface-cream-paper text-[#310916] py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/25"
    >
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-10 sm:mb-14"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            Personal Keepsake
          </p>
          <h2
            id="letter-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.1rem)] leading-[1.12] text-[#310916]"
          >
            {heading}
          </h2>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FFF8F2] border border-[#C6A36A]/45 rounded-[12px] p-4 sm:p-7 editorial-frame-shadow"
        >
          <div className="relative border border-[#6D1025]/14 rounded-[8px] px-5 py-8 sm:px-10 sm:py-12 md:px-14 md:py-14 surface-cream-paper">
            <span
              aria-hidden="true"
              className="absolute top-3.5 left-3.5 h-3.5 w-3.5 border-t border-l border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute top-3.5 right-3.5 h-3.5 w-3.5 border-t border-r border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3.5 right-3.5 h-3.5 w-3.5 border-b border-r border-[#C6A36A]/70"
            />

            <div className="max-w-xl mx-auto">
              <p className="text-[11px] tracking-[0.26em] uppercase text-[#6D1025]/65 mb-7 tabular-nums">
                {anniversaryDateReadable}
              </p>

              <p className="font-[family-name:var(--font-display)] italic text-2xl sm:text-[1.7rem] text-[#490D20] mb-6">
                {salutation}
              </p>

              <div className="space-y-5 text-[15.5px] sm:text-[16.5px] leading-[1.82] text-[#310916]/90">
                {sourceLetter.paragraphs.map((paragraph, index) => (
                  <p key={index}>{resolveTemplateText(paragraph, config)}</p>
                ))}
              </div>

              <div className="mt-9 pt-6 border-t border-[#C6A36A]/25">
                <p className="font-[family-name:var(--font-display)] italic text-lg text-[#490D20] mb-1">
                  {closing}
                </p>
                <p className="font-[family-name:var(--font-script)] text-[2.25rem] sm:text-[2.6rem] leading-tight text-[#6D1025]">
                  {signature}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
