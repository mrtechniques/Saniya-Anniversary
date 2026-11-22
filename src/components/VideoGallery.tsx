import { useState } from 'react';
import { motion } from 'motion/react';
import { VIDEO_MEMORIES, VIDEO_SECTION_HEADER } from '../config/anniversary';
import { VideoFrame } from './VideoFrame';

export function VideoGallery() {
  // Ensures at most one video plays audio at any moment
  const [activeAudioVideoId, setActiveAudioVideoId] = useState<number | null>(null);

  const handleToggleAudio = (videoId: number) => {
    setActiveAudioVideoId((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <section
      id="moments-in-motion"
      aria-labelledby="motion-heading"
      className="relative surface-burgundy-linen text-[#FFF8F2] py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/25"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-12 sm:mb-18"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#C6A36A] mb-3">
            In Motion · {VIDEO_SECTION_HEADER.helperNote}
          </p>
          <h2
            id="motion-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.2rem)] leading-[1.12] text-[#FFF8F2] mb-4"
          >
            {VIDEO_SECTION_HEADER.heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#F7DDE2]/90">
            {VIDEO_SECTION_HEADER.subheading}
          </p>
          <div
            aria-hidden="true"
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-[1px] w-14 bg-[#C6A36A]/45" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C6A36A]" />
            <span className="h-[1px] w-14 bg-[#C6A36A]/45" />
          </div>
        </motion.header>

        {/* Balanced 1-column mobile / 2-column desktop editorial video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
          {VIDEO_MEMORIES.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: (index % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <VideoFrame
                video={video}
                isAudioActive={activeAudioVideoId === video.id}
                onToggleAudio={handleToggleAudio}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
