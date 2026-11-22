import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  DEFAULT_LETTER,
  DEFAULT_LOVE_NOTES,
  PHOTO_MEMORIES,
} from './config/anniversary';
import { ScrollProgress } from './components/ScrollProgress';
import { LoadingScreen } from './components/LoadingScreen';
import { AnniversaryHero } from './components/AnniversaryHero';
import { StorySection } from './components/StorySection';
import { PhotoGallery } from './components/PhotoGallery';
import { VideoGallery } from './components/VideoGallery';
import { LoveNotes } from './components/LoveNotes';
import { AnniversaryLetter } from './components/AnniversaryLetter';
import { FinalMessage } from './components/FinalMessage';
import { Lightbox } from './components/Lightbox';

export default function App() {
  const [activeLightboxPhotoId, setActiveLightboxPhotoId] = useState<number | null>(
    null,
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-[#FFF8F2] text-[#310916]">
        <LoadingScreen />
        <ScrollProgress />

        <main>
          <AnniversaryHero />
          <StorySection onSelectPhoto={setActiveLightboxPhotoId} />
          <PhotoGallery onSelectPhoto={setActiveLightboxPhotoId} />
          <VideoGallery />
          <LoveNotes notes={DEFAULT_LOVE_NOTES} />
          <AnniversaryLetter letter={DEFAULT_LETTER} />
        </main>

        <FinalMessage />

        <Lightbox
          photos={PHOTO_MEMORIES}
          activePhotoId={activeLightboxPhotoId}
          onClose={() => setActiveLightboxPhotoId(null)}
          onChangePhoto={setActiveLightboxPhotoId}
        />
      </div>
    </MotionConfig>
  );
}
