import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PhotoMemory } from '../config/anniversary';

interface LightboxProps {
  photos: PhotoMemory[];
  activePhotoId: number | null;
  coupleInitials?: string;
  onClose: () => void;
  onChangePhoto: (photoId: number) => void;
}

export function Lightbox({
  photos,
  activePhotoId,
  coupleInitials = 'A & S',
  onClose,
  onChangePhoto,
}: LightboxProps) {
  const [erroredIds, setErroredIds] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentIndex = photos.findIndex((p) => p.id === activePhotoId);
  const activePhoto = currentIndex >= 0 ? photos[currentIndex] : null;

  const goPrev = () => {
    if (!photos.length || currentIndex < 0) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onChangePhoto(photos[prevIndex].id);
  };

  const goNext = () => {
    if (!photos.length || currentIndex < 0) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    onChangePhoto(photos[nextIndex].id);
  };

  useEffect(() => {
    if (!activePhoto) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        onChangePhoto(photos[prevIndex].id);
      } else if (event.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % photos.length;
        onChangePhoto(photos[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto, currentIndex, onChangePhoto, onClose, photos]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  };

  const isPlaceholder = activePhoto ? Boolean(erroredIds[activePhoto.id]) : false;

  return (
    <AnimatePresence>
      {activePhoto && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${activePhoto.plateLabel} lightbox viewer`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[110] flex flex-col justify-between bg-[#1F050D]/96 backdrop-blur-md text-[#FFF8F2] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs tracking-[0.22em] uppercase text-[#F7DDE2]/85 tabular-nums">
              <span>{activePhoto.plateLabel}</span>
              <span aria-hidden="true" className="text-[#C6A36A]">
                ·
              </span>
              <span>
                {currentIndex + 1} / {photos.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#FFF8F2]/20 bg-[#310916]/70 text-[#FFF8F2] hover:bg-[#6D1025] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F7DDE2]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div
            onClick={onClose}
            className="relative flex-1 flex items-center justify-center my-3 sm:my-5 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhoto.id}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center max-h-full max-w-full"
              >
                {!isPlaceholder ? (
                  <div className="p-2 sm:p-3 bg-[#FFF8F2] rounded-[8px] shadow-2xl">
                    <img
                      src={activePhoto.src}
                      alt={activePhoto.caption}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setErroredIds((prev) => ({ ...prev, [activePhoto.id]: true }))
                      }
                      className="max-h-[68vh] sm:max-h-[74vh] max-w-[86vw] sm:max-w-[82vw] w-auto h-auto object-contain rounded-[4px]"
                    />
                  </div>
                ) : (
                  <div className="w-[min(84vw,420px)] aspect-[4/5] p-3 bg-[#FFF8F2] rounded-[8px] shadow-2xl">
                    <div className="h-full w-full surface-ivory-album border border-[#C6A36A]/35 rounded-[4px] flex flex-col items-center justify-center p-6 text-center">
                      <span className="font-[family-name:var(--font-display)] italic text-2xl text-[#6D1025]/75 mb-2">
                        {coupleInitials}
                      </span>
                      <span className="text-xs tracking-[0.26em] uppercase text-[#490D20] tabular-nums">
                        {activePhoto.plateLabel}
                      </span>
                      <span className="mt-3 text-xs text-[#490D20]/60">
                        {activePhoto.src}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl w-full mx-auto pb-1">
            <p className="font-[family-name:var(--font-display)] text-base sm:text-lg text-[#FFF8F2]/95 text-center sm:text-left">
              {activePhoto.caption}
            </p>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photograph"
                className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#FFF8F2]/25 bg-[#310916]/75 text-[#FFF8F2] hover:bg-[#6D1025] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F7DDE2]"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photograph"
                className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#FFF8F2]/25 bg-[#310916]/75 text-[#FFF8F2] hover:bg-[#6D1025] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F7DDE2]"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
