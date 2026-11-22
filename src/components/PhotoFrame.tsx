import { useState, type SyntheticEvent } from 'react';
import { Expand } from 'lucide-react';
import type { PhotoMemory } from '../config/anniversary';

interface PhotoFrameProps {
  photo: PhotoMemory;
  variant?: 'default' | 'feature' | 'story';
  showCaption?: boolean;
  onSelect?: (photoId: number) => void;
  priority?: boolean;
  className?: string;
}

export function PhotoFrame({
  photo,
  variant = 'default',
  showCaption = true,
  onSelect,
  priority = false,
  className = '',
}: PhotoFrameProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'placeholder'>('loading');
  const [aspectRatio, setAspectRatio] = useState<number>(variant === 'feature' ? 4 / 3 : 4 / 5);

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      // Preserve natural orientation while keeping extreme aspect ratios harmonious in the album
      const ratio = naturalWidth / naturalHeight;
      const clampedRatio = Math.min(Math.max(ratio, 0.58), 1.85);
      setAspectRatio(clampedRatio);
    }
    setStatus('loaded');
  };

  const handleImageError = () => {
    setStatus('placeholder');
  };

  const isInteractive = Boolean(onSelect);
  const framePadding =
    variant === 'feature'
      ? 'p-3 sm:p-5'
      : variant === 'story'
        ? 'p-3 sm:p-4'
        : 'p-2.5 sm:p-3.5';

  return (
    <figure className={`group w-full ${className}`}>
      <div
        className={`relative bg-[#FFF8F2] border border-[#C6A36A]/28 rounded-[10px] ${framePadding} editorial-frame-shadow transition-transform duration-300 ${
          isInteractive ? 'group-hover:-translate-y-0.5' : ''
        }`}
      >
        {/* Subtle inner hairline mat border */}
        <div
          className="relative w-full overflow-hidden rounded-[6px] bg-[#F5EEE8] border border-[#6D1025]/10"
          style={{ aspectRatio: String(aspectRatio) }}
        >
          {status !== 'placeholder' && (
            <img
              src={photo.src}
              alt={photo.caption}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ objectPosition: photo.objectPosition ?? 'center center' }}
              className={`h-full w-full object-contain transition-opacity duration-500 ${
                status === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Graceful styled cream editorial placeholder until personal JPEG is placed */}
          {status === 'placeholder' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center surface-ivory-album">
              {/* Ornamental corner ticks */}
              <span
                aria-hidden="true"
                className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[#C6A36A]/55"
              />
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[#C6A36A]/55"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#C6A36A]/55"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#C6A36A]/55"
              />

              <span className="font-[family-name:var(--font-display)] italic text-lg text-[#6D1025]/70 mb-1">
                A &amp; S
              </span>
              <span className="text-[11px] tracking-[0.26em] uppercase text-[#490D20]/80 font-medium tabular-nums">
                {photo.plateLabel}
              </span>
              <span className="mt-2 h-[1px] w-8 bg-[#C6A36A]/50" />
              <span className="mt-2.5 text-[11px] text-[#490D20]/55 tracking-wide max-w-[18ch] leading-relaxed">
                {photo.id}.jpeg
              </span>
            </div>
          )}

          {/* Loading shimmer state */}
          {status === 'loading' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-[#F5EEE8] via-[#FCECEF]/50 to-[#F5EEE8] animate-pulse"
            />
          )}

          {/* Accessible full-frame click trigger for Lightbox */}
          {isInteractive && (
            <button
              type="button"
              onClick={() => onSelect?.(photo.id)}
              aria-label={`Open ${photo.plateLabel}: ${photo.caption}`}
              className="absolute inset-0 flex items-end justify-end p-2.5 sm:p-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#6D1025]"
            >
              <span className="inline-flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#FFF8F2]/88 text-[#490D20] border border-[#6D1025]/15 shadow-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 transition-opacity duration-200">
                <Expand className="w-4 h-4" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>

        {/* Optional quiet album plate footer */}
        {showCaption && (
          <figcaption className="pt-3 pb-0.5 px-1 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/70 tabular-nums">
              <span>{photo.plateLabel}</span>
              {photo.subcaption && <span>{photo.subcaption}</span>}
            </div>
            <p className="font-[family-name:var(--font-display)] text-[15px] sm:text-base leading-snug text-[#310916]">
              {photo.caption}
            </p>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
