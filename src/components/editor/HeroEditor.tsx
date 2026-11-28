import { useState, type ChangeEvent } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { resolveTemplateText } from '../../config/anniversary';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  PHOTO_ACCEPT_ATTRIBUTE,
  processPhotoFile,
  validateMediaFile,
} from '../../utils/mediaSupport';
import {
  EditorCard,
  FieldLabel,
  inputClassName,
  TokenHintBanner,
} from './EditorPrimitives';
import { ImagePositionEditor } from './ImagePositionEditor';

export function HeroEditor() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { hero } = draftConfig;
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const updateHero = (patch: Partial<typeof hero>) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...patch,
      },
    }));
  };

  const handleTempFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadNotice(null);
    const validation = await validateMediaFile(file, 'photo', new Set());
    if (!validation.valid) {
      setUploadNotice(validation.error ?? 'Unsupported photo file.');
      return;
    }

    const processed = await processPhotoFile(file);
    if (!processed.previewSupported || !processed.previewUrl) {
      setUploadNotice(
        processed.compatibilityNote ?? 'Could not decode this photo format in this browser.',
      );
      return;
    }

    if (processed.compatibilityNote) {
      setUploadNotice(processed.compatibilityNote);
    }
    updateHero({ image: processed.previewUrl });
  };

  return (
    <div className="space-y-6">
      <EditorCard
        title="Hero Text & Messaging"
        description="Customize the opening hero banner text. Name tokens update automatically when you edit Couple Details."
      >
        <div className="space-y-4">
          <TokenHintBanner />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Hero Greeting (Script)" htmlFor="hero-kicker" />
              <input
                id="hero-kicker"
                type="text"
                value={hero.kicker}
                onChange={(e) => updateHero({ kicker: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel
                label="Couple Names Display"
                hint={`Preview: ${resolveTemplateText(hero.coupleDisplay, draftConfig)}`}
                htmlFor="hero-couple-display"
              />
              <input
                id="hero-couple-display"
                type="text"
                value={hero.coupleDisplay}
                onChange={(e) => updateHero({ coupleDisplay: e.target.value })}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel
                label="Anniversary Heading"
                hint={`Preview: ${resolveTemplateText(hero.subtitle, draftConfig)}`}
                htmlFor="hero-subtitle"
              />
              <input
                id="hero-subtitle"
                type="text"
                value={hero.subtitle}
                onChange={(e) => updateHero({ subtitle: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Subtitle / Tagline" htmlFor="hero-tagline" />
              <input
                id="hero-tagline"
                type="text"
                value={hero.tagline}
                onChange={(e) => updateHero({ tagline: e.target.value })}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <FieldLabel label="Supporting Message / Quote" htmlFor="hero-quote" />
            <textarea
              id="hero-quote"
              rows={2}
              value={hero.quote}
              onChange={(e) => updateHero({ quote: e.target.value })}
              className={inputClassName}
            />
          </div>

          <div>
            <FieldLabel label="Scroll Button Label" htmlFor="hero-scroll" />
            <input
              id="hero-scroll"
              type="text"
              value={hero.scrollPrompt}
              onChange={(e) => updateHero({ scrollPrompt: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard
        title="Hero Background Photograph & Positioning"
        description="Drag the photograph horizontally or vertically, adjust zoom, and tune the burgundy overlay darkness."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-8">
              <FieldLabel
                label="Hero Image Path"
                hint="e.g. /memories/photos/26.jpeg"
                htmlFor="hero-image-path"
              />
              <div className="relative">
                <input
                  id="hero-image-path"
                  type="text"
                  value={hero.image}
                  onChange={(e) => updateHero({ image: e.target.value })}
                  placeholder="/memories/photos/26.jpeg"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#6D1025]/25 bg-white px-4 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-[#6D1025] hover:bg-[#FCECEF] transition-colors cursor-pointer min-h-[42px]">
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Temp Local Preview</span>
                <input
                  type="file"
                  accept={PHOTO_ACCEPT_ATTRIBUTE}
                  onChange={(e) => void handleTempFileSelect(e)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {uploadNotice && (
            <div className="rounded-[8px] border border-[#B52B45]/35 bg-[#FCECEF] px-3.5 py-2.5 text-xs text-[#6D1025]">
              {uploadNotice}
            </div>
          )}

          {hero.image.startsWith('blob:') && (
            <div className="rounded-[8px] border border-[#C6A36A]/50 bg-[#FCECEF]/60 px-3.5 py-2.5 text-xs text-[#490D20] flex items-start gap-2">
              <ImageIcon className="w-4 h-4 text-[#6D1025] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                You are previewing a temporary local file. To make this permanent on the deployed
                website, copy the image into <code>public/memories/photos/</code>, enter its path
                above (e.g. <code>/memories/photos/26.jpeg</code>), and redeploy.
              </span>
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs uppercase tracking-[0.12em] text-[#6D1025] mb-1.5">
              <span>Background Overlay Darkness</span>
              <span className="tabular-nums">{hero.overlayDarkness}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={hero.overlayDarkness}
              onChange={(e) => updateHero({ overlayDarkness: Number(e.target.value) })}
              className="w-full accent-[#6D1025] cursor-pointer"
            />
          </div>

          <ImagePositionEditor
            imageSrc={hero.image}
            position={hero.position}
            overlayDarkness={hero.overlayDarkness}
            aspectRatio="16 / 10"
            label="Drag hero photo to frame composition"
            onChange={(position) => updateHero({ position })}
          />
        </div>
      </EditorCard>
    </div>
  );
}
