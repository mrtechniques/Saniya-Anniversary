import { motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  resolveTemplateText,
  type LoveNote,
  type WebsiteConfig,
} from '../config/anniversary';

interface LoveNotesProps {
  notes?: LoveNote[];
  config?: WebsiteConfig;
}

export function LoveNotes({ notes, config = DEFAULT_WEBSITE_CONFIG }: LoveNotesProps) {
  const sourceNotes = notes ?? config.loveNotes;
  if (sourceNotes.length === 0) return null;

  const eyebrow = resolveTemplateText(
    config.loveNotesHeader.eyebrow ?? 'Notes of Affection',
    config,
  );
  const heading = resolveTemplateText(config.loveNotesHeader.heading, config);
  const subheading = resolveTemplateText(config.loveNotesHeader.subheading, config);

  return (
    <section
      id="little-things"
      aria-labelledby="little-things-heading"
      className="relative surface-blush-silk text-[#310916] py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#6D1025]/12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            {eyebrow}
          </p>
          <h2
            id="little-things-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.15rem)] leading-[1.12] text-[#310916] mb-3.5"
          >
            {heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#6D1025]/90">
            {subheading}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {sourceNotes.map((note, index) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: (index % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-t border-[#6D1025]/18 pt-5 pb-2"
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-[family-name:var(--font-display)] font-medium text-2xl text-[#490D20]">
                  {resolveTemplateText(note.title, config)}
                </h3>
                <span className="text-[11px] tracking-[0.24em] text-[#B52B45]/80 tabular-nums shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[15px] sm:text-base leading-[1.7] text-[#310916]/85">
                {resolveTemplateText(note.description, config)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
