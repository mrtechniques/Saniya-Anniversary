import { motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  getCoupleInitials,
  resolveTemplateText,
  type PhotoMemory,
  type WebsiteConfig,
} from '../config/anniversary';
import { StoryComposition } from './StoryComposition';

interface StorySectionProps {
  config?: WebsiteConfig;
  onSelectPhoto: (photoId: number) => void;
}

export function StorySection({
  config = DEFAULT_WEBSITE_CONFIG,
  onSelectPhoto,
}: StorySectionProps) {
  const visibleStories = config.stories.filter((s) => s.visible);
  if (visibleStories.length === 0) {
    return null;
  }

  const coupleInitials = getCoupleInitials(config.couple);
  const eyebrow = resolveTemplateText(config.storyHeader.eyebrow ?? 'The First Year', config);
  const heading = resolveTemplateText(config.storyHeader.heading, config);
  const subheading = resolveTemplateText(config.storyHeader.subheading, config);

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative surface-cream-paper py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/20"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-14 sm:mb-20"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            {eyebrow}
          </p>
          <h2
            id="our-story-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2.1rem,6vw,3.35rem)] leading-[1.1] text-[#310916] mb-4"
          >
            {heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#6D1025]/90">
            {subheading}
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

        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {visibleStories.map((chapter, index) => {
            const resolvedChapter = {
              ...chapter,
              sequence: String(index + 1).padStart(2, '0'),
              heading: resolveTemplateText(chapter.heading, config),
              body: resolveTemplateText(chapter.body, config),
              dateLabel: chapter.dateLabel
                ? resolveTemplateText(chapter.dateLabel, config)
                : undefined,
            };

            const storyPhoto: PhotoMemory = {
              id: chapter.photoId,
              src: chapter.image,
              plateLabel: chapter.plateLabel,
              caption: resolvedChapter.heading,
              position: chapter.position,
              visible: chapter.visible,
            };

            return (
              <StoryComposition
                key={chapter.id}
                chapter={resolvedChapter}
                photo={storyPhoto}
                reverse={index % 2 === 1}
                coupleInitials={coupleInitials}
                onSelectPhoto={onSelectPhoto}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
