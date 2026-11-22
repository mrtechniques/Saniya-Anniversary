import { motion } from 'motion/react';
import {
  PHOTO_MEMORIES,
  STORY_CHAPTERS,
  STORY_SECTION_HEADER,
} from '../config/anniversary';
import { StoryComposition } from './StoryComposition';

interface StorySectionProps {
  onSelectPhoto: (photoId: number) => void;
}

export function StorySection({ onSelectPhoto }: StorySectionProps) {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative surface-cream-paper py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-14 sm:mb-20"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            The First Year
          </p>
          <h2
            id="our-story-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2.1rem,6vw,3.35rem)] leading-[1.1] text-[#310916] mb-4"
          >
            {STORY_SECTION_HEADER.heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#6D1025]/90">
            {STORY_SECTION_HEADER.subheading}
          </p>
          <div
            aria-hidden="true"
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-[1px] w-12 bg-[#C6A36A]/50" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C6A36A]" />
            <span className="h-[1px] w-12 bg-[#C6A36A]/50" />
          </div>
        </motion.header>

        {/* Alternating story compositions */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {STORY_CHAPTERS.map((chapter, index) => {
            const photo =
              PHOTO_MEMORIES.find((p) => p.id === chapter.photoId) ??
              PHOTO_MEMORIES[index];

            return (
              <StoryComposition
                key={chapter.id}
                chapter={chapter}
                photo={photo}
                reverse={index % 2 === 1}
                onSelectPhoto={onSelectPhoto}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
