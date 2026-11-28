import { useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  getCoupleInitials,
  isValidMediaPath,
  resolveTemplateText,
  type PhotoMemory,
  type WebsiteConfig,
} from '../config/anniversary';
import { ScrollProgress } from './ScrollProgress';
import { LoadingScreen } from './LoadingScreen';
import { AnniversaryHero } from './AnniversaryHero';
import { StorySection } from './StorySection';
import { PhotoGallery } from './PhotoGallery';
import { VideoGallery } from './VideoGallery';
import { LoveNotes } from './LoveNotes';
import { AnniversaryLetter } from './AnniversaryLetter';
import { FinalMessage } from './FinalMessage';
import { Lightbox } from './Lightbox';

interface PublicWebsiteProps {
  config: WebsiteConfig;
  previewMode?: boolean;
}

export function PublicWebsite({ config, previewMode = false }: PublicWebsiteProps) {
  const [activeLightboxPhotoId, setActiveLightboxPhotoId] = useState<number | null>(null);

  const lightboxPhotos = useMemo<PhotoMemory[]>(() => {
    const storyPhotos: PhotoMemory[] = config.stories
      .filter((s) => s.visible && isValidMediaPath(s.image))
      .map((s) => ({
        id: s.photoId,
        src: s.image,
        plateLabel: s.plateLabel,
        caption: resolveTemplateText(s.heading, config),
        position: s.position,
        visible: true,
      }));

    const galleryPhotos: PhotoMemory[] = config.photos
      .filter((p) => p.visible && isValidMediaPath(p.src))
      .map((p) => ({
        ...p,
        caption: resolveTemplateText(p.caption, config),
        subcaption: p.subcaption ? resolveTemplateText(p.subcaption, config) : undefined,
      }));

    return [...storyPhotos, ...galleryPhotos];
  }, [config]);

  const coupleInitials = getCoupleInitials(config.couple);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-[#FFF8F2] text-[#310916]">
        {!previewMode && <LoadingScreen config={config} />}
        {!previewMode && <ScrollProgress />}

        <main>
          <AnniversaryHero config={config} />
          <StorySection config={config} onSelectPhoto={setActiveLightboxPhotoId} />
          <PhotoGallery config={config} onSelectPhoto={setActiveLightboxPhotoId} />
          <VideoGallery config={config} />
          <LoveNotes config={config} />
          <AnniversaryLetter config={config} />
        </main>

        <FinalMessage config={config} />

        <Lightbox
          photos={lightboxPhotos}
          activePhotoId={activeLightboxPhotoId}
          coupleInitials={coupleInitials}
          onClose={() => setActiveLightboxPhotoId(null)}
          onChangePhoto={setActiveLightboxPhotoId}
        />
      </div>
    </MotionConfig>
  );
}
