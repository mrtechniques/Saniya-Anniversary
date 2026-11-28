import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Film, Volume2, VolumeX } from 'lucide-react';
import type { VideoMemory } from '../config/anniversary';

interface VideoFrameProps {
  video: VideoMemory;
  isAudioActive: boolean;
  onToggleAudio: (videoId: number) => void;
}

export function VideoFrame({
  video,
  isAudioActive,
  onToggleAudio,
}: VideoFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'placeholder'>(
    video.previewSupported === false || !video.src ? 'placeholder' : 'idle',
  );
  const [isVisible, setIsVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(9 / 14);

  useEffect(() => {
    setStatus(video.previewSupported === false || !video.src ? 'placeholder' : 'idle');
  }, [video.src, video.previewSupported]);

  // Observe visibility to autoplay muted when visible and pause offscreen
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0, 0.45, 0.75] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Sync play/pause and mute state safely for mobile Safari & Android Chrome
  useEffect(() => {
    const el = videoRef.current;
    if (!el || status === 'placeholder') return;

    el.muted = !isAudioActive;

    if (isVisible) {
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If unmuted autoplay is blocked by browser policy, fall back cleanly to muted autoplay
          el.muted = true;
          el.play().catch(() => {
            // Ignore if browser completely blocks autoplay until user gesture
          });
        });
      }
    } else {
      el.pause();
    }
  }, [isVisible, isAudioActive, status]);

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      const ratio = videoWidth / videoHeight;
      setAspectRatio(Math.min(Math.max(ratio, 0.52), 1.85));
    }
    setStatus('ready');
  };

  const handleVideoError = () => {
    setStatus('placeholder');
  };

  const handleTapToggle = () => {
    if (status === 'placeholder') return;
    const el = videoRef.current;
    if (el && el.paused) {
      el.play().catch(() => {});
    }
    onToggleAudio(video.id);
  };

  return (
    <figure ref={containerRef} className="w-full">
      <div className="bg-[#310916]/85 border border-[#C6A36A]/30 rounded-[12px] p-2.5 sm:p-3.5 editorial-frame-shadow-dark">
        <div
          className="relative w-full overflow-hidden rounded-[8px] bg-[#220610] border border-[#FFF8F2]/10"
          style={{ aspectRatio: String(aspectRatio) }}
        >
          {status !== 'placeholder' && (
            <video
              ref={videoRef}
              src={video.src}
              playsInline
              loop
              muted={!isAudioActive}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleVideoError}
              onClick={handleTapToggle}
              className="h-full w-full object-contain cursor-pointer"
            />
          )}

          {/* Loading state while metadata initializes */}
          {status === 'idle' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#2A0713] text-[#F7DDE2]/65 pointer-events-none"
            >
              <Film className="w-6 h-6 mb-2 opacity-60" />
              <span className="text-[11px] tracking-[0.24em] uppercase tabular-nums">
                {video.reelLabel}
              </span>
            </div>
          )}

          {/* Styled placeholder when .mp4 is not yet added */}
          {status === 'placeholder' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#3A0B1B] to-[#260610]">
              <span
                aria-hidden="true"
                className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[#C6A36A]/45"
              />
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 h-3 w-3 border-t border-r border-[#C6A36A]/45"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#C6A36A]/45"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#C6A36A]/45"
              />

              <Film className="w-6 h-6 text-[#C6A36A]/80 mb-3" aria-hidden="true" />
              <span className="font-[family-name:var(--font-display)] italic text-xl text-[#FFF8F2]/90 mb-1">
                {video.title}
              </span>
              <span className="text-[11px] tracking-[0.26em] uppercase text-[#C6A36A]/85 tabular-nums">
                {video.reelLabel}
              </span>
              <span className="mt-3 text-[11px] text-[#F7DDE2]/55 tracking-wide">
                {video.id}.mp4
              </span>
            </div>
          )}

          {/* Audio toggle control (minimum 44x44 touch target) */}
          {status !== 'placeholder' && (
            <button
              type="button"
              onClick={handleTapToggle}
              aria-label={
                isAudioActive
                  ? `Mute sound for ${video.title}`
                  : `Enable sound for ${video.title}`
              }
              aria-pressed={isAudioActive}
              className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-full bg-[#310916]/85 backdrop-blur-sm border border-[#FFF8F2]/25 text-xs tracking-[0.14em] uppercase text-[#FFF8F2] hover:bg-[#6D1025] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F7DDE2]"
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#F7DDE2]" aria-hidden="true" />
                  <span>Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#F7DDE2]/80" aria-hidden="true" />
                  <span>Tap for Sound</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Clean editorial caption underneath */}
        <figcaption className="pt-3.5 pb-0.5 px-1 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C6A36A]/90 tabular-nums">
            <span>{video.reelLabel}</span>
            <span>{isAudioActive ? 'Audio Active' : 'Silent Reel'}</span>
          </div>
          <p className="font-[family-name:var(--font-display)] text-base sm:text-lg text-[#FFF8F2]/95">
            {video.caption}
          </p>
        </figcaption>
      </div>
    </figure>
  );
}
