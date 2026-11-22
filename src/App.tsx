import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  clearStoredLetter,
  clearStoredNotes,
  loadStoredLetter,
  loadStoredNotes,
  PHOTO_MEMORIES,
  saveStoredLetter,
  saveStoredNotes,
  type AnniversaryLetterData,
  type LoveNote,
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
  const [letter, setLetter] = useState<AnniversaryLetterData>(() =>
    loadStoredLetter(),
  );
  const [notes, setNotes] = useState<LoveNote[]>(() => loadStoredNotes());

  const handleSaveLetter = (updated: AnniversaryLetterData) => {
    setLetter(updated);
    saveStoredLetter(updated);
  };

  const handleResetLetter = () => {
    clearStoredLetter();
    setLetter(loadStoredLetter());
  };

  const handleSaveNotes = (updated: LoveNote[]) => {
    setNotes(updated);
    saveStoredNotes(updated);
  };

  const handleResetNotes = () => {
    clearStoredNotes();
    setNotes(loadStoredNotes());
  };

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
          <LoveNotes
            notes={notes}
            onSaveNotes={handleSaveNotes}
            onResetNotes={handleResetNotes}
          />
          <AnniversaryLetter
            letter={letter}
            onSaveLetter={handleSaveLetter}
            onResetLetter={handleResetLetter}
          />
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
