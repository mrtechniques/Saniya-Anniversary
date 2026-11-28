import { motion } from 'motion/react';
import type { PhotoMemory, StoryChapter } from '../config/anniversary';
import { PhotoFrame } from './PhotoFrame';

interface StoryCompositionProps {
  chapter: StoryChapter;
  photo: PhotoMemory;
  reverse?: boolean;
  coupleInitials?: string;
  onSelectPhoto?: (photoId: number) => void;
}

export function StoryComposition({
  chapter,
  photo,
  reverse = false,
  coupleInitials = 'A & S',
  onSelectPhoto,
}: StoryCompositionProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-12 lg:gap-16 items-center"
    >
      <div
        className={`md:col-span-6 ${reverse ? 'md:order-2' : 'md:order-1'
          }`}
      >
        <PhotoFrame
          photo={photo}
          variant="story"
          showCaption={false}
          coupleInitials={coupleInitials}
          onSelect={onSelectPhoto}
        />
      </div>

      <div
        className={`md:col-span-6 flex flex-col ${reverse ? 'md:order-1 md:pr-4' : 'md:order-2 md:pl-4'
          }`}
      >
        <div className="flex items-center gap-3 mb-3.5 text-xs tracking-[0.24em] uppercase text-[#6D1025]/75 tabular-nums">
          <span>Chapter {chapter.sequence}</span>
          {chapter.dateLabel && (
            <>
              <span aria-hidden="true" className="text-[#C6A36A]">
                ·
              </span>
              <span>{chapter.dateLabel}</span>
            </>
          )}
        </div>

        <h3 className="font-[family-name:var(--font-display)] font-medium text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.12] text-[#310916] mb-4">
          {chapter.heading}
        </h3>

        <div aria-hidden="true" className="h-[1px] w-12 bg-[#C6A36A]/65 mb-5" />

        <p className="text-[15px] sm:text-base leading-[1.75] text-[#490D20]/90 max-w-[46ch]">
          {chapter.body}
        </p>

        <p className="mt-4 text-xs tracking-[0.18em] uppercase text-[#6D1025]/60 tabular-nums">
          {photo.plateLabel}
        </p>
      </div>
    </motion.article>
  );
}
