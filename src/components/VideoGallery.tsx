import { useState } from 'react';
import { motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  isValidMediaPath,
  resolveTemplateText,
  type WebsiteConfig,
} from '../config/anniversary';
import { VideoFrame } from './VideoFrame';

interface VideoGalleryProps {
  config?: WebsiteConfig;
}

export function VideoGallery({ config = DEFAULT_WEBSITE_CONFIG }: VideoGalleryProps) {
  const [activeAudioVideoId, setActiveAudioVideoId] = useState<number | null>(null);

  const visibleVideos = config.videos
    .filter((v) => v.visible && isValidMediaPath(v.src))
    .map((v) => ({
      ...v,
      title: resolveTemplateText(v.title, config),
      caption: resolveTemplateText(v.caption, config),
    }));

  // Zero videos: hide the entire section cleanly with no empty frames or spacing
  if (visibleVideos.length === 0) {
    return null;
  }

  const handleToggleAudio = (videoId: number) => {
    setActiveAudioVideoId((prev) => (prev === videoId ? null : videoId));
  };

  const heading = resolveTemplateText(config.videoHeader.heading, config);
  const subheading = resolveTemplateText(config.videoHeader.subheading, config);
  const helperNote = resolveTemplateText(
    config.videoHeader.helperNote ?? 'Tap any reel to listen',
    config,
  );

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
            In Motion · {helperNote}
          </p>
          <h2
            id="motion-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.2rem)] leading-[1.12] text-[#FFF8F2] mb-4"
          >
            {heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#F7DDE2]/90">
            {subheading}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
          {visibleVideos.map((video, index) => (
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
