import { motion } from 'motion/react';
import {
  DEFAULT_WEBSITE_CONFIG,
  getCoupleInitials,
  isValidMediaPath,
  resolveTemplateText,
  type PhotoMemory,
  type WebsiteConfig,
} from '../config/anniversary';
import { PhotoFrame } from './PhotoFrame';

interface PhotoGalleryProps {
  config?: WebsiteConfig;
  onSelectPhoto: (photoId: number) => void;
}

interface EditorialSpread {
  feature: PhotoMemory;
  pair: PhotoMemory[];
}

export function PhotoGallery({
  config = DEFAULT_WEBSITE_CONFIG,
  onSelectPhoto,
}: PhotoGalleryProps) {
  const galleryPhotos = config.photos
    .filter((p) => p.visible && isValidMediaPath(p.src))
    .map((p) => ({
      ...p,
      caption: resolveTemplateText(p.caption, config),
      subcaption: p.subcaption ? resolveTemplateText(p.subcaption, config) : undefined,
    }));

  if (galleryPhotos.length === 0) {
    return null;
  }

  const coupleInitials = getCoupleInitials(config.couple);
  const heading = resolveTemplateText(config.galleryHeader.heading, config);
  const subheading = resolveTemplateText(config.galleryHeader.subheading, config);

  const spreads: EditorialSpread[] = [];
  for (let i = 0; i < galleryPhotos.length; i += 3) {
    spreads.push({
      feature: galleryPhotos[i],
      pair: galleryPhotos.slice(i + 1, i + 3),
    });
  }

  return (
    <section
      id="our-memories"
      aria-labelledby="our-memories-heading"
      className="relative surface-ivory-album py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/25"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-20"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            Our Memories · {galleryPhotos.length} Album Plates
          </p>
          <h2
            id="our-memories-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.2rem)] leading-[1.12] text-[#310916] mb-4"
          >
            {heading}
          </h2>
          <p className="text-[15px] sm:text-base leading-relaxed text-[#490D20]/80 max-w-lg mx-auto">
            {subheading}
          </p>
          <div
            aria-hidden="true"
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-[1px] w-14 bg-[#C6A36A]/55" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C6A36A]" />
            <span className="h-[1px] w-14 bg-[#C6A36A]/55" />
          </div>
        </motion.header>

        <div className="space-y-14 sm:space-y-20">
          {spreads.map((spread, spreadIndex) => (
            <div key={spread.feature.id} className="space-y-10 sm:space-y-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto"
              >
                <PhotoFrame
                  photo={spread.feature}
                  variant="feature"
                  coupleInitials={coupleInitials}
                  onSelect={onSelectPhoto}
                />
              </motion.div>

              {spread.pair.length > 0 && (
                <div
                  className={`grid grid-cols-1 ${
                    spread.pair.length === 2 ? 'md:grid-cols-2' : 'max-w-xl mx-auto'
                  } gap-8 md:gap-10 items-start`}
                >
                  {spread.pair.map((photo, pairIdx) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.6,
                        delay: pairIdx * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <PhotoFrame
                        photo={photo}
                        variant="default"
                        coupleInitials={coupleInitials}
                        onSelect={onSelectPhoto}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {spreadIndex < spreads.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pt-2 flex items-center justify-center gap-4"
                >
                  <span className="h-[1px] w-16 sm:w-24 bg-[#6D1025]/12" />
                  <span className="font-[family-name:var(--font-display)] italic text-xs text-[#C6A36A]">
                    &amp;
                  </span>
                  <span className="h-[1px] w-16 sm:w-24 bg-[#6D1025]/12" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
