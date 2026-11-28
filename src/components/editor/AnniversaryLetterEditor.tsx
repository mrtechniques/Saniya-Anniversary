import {
  getEffectiveAnniversaryNumber,
  resolveTemplateText,
} from '../../config/anniversary';
import { formatReadableDate, getAnniversaryDateISO } from '../../config/dateUtils';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  EditorCard,
  FieldLabel,
  inputClassName,
  TokenHintBanner,
} from './EditorPrimitives';

export function AnniversaryLetterEditor() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { letter } = draftConfig;

  const updateLetter = (patch: Partial<typeof letter>) => {
    updateDraft((prev) => ({
      ...prev,
      letter: {
        ...prev.letter,
        ...patch,
      },
    }));
  };

  const bodyText = letter.paragraphs.join('\n\n');
  const annNum = getEffectiveAnniversaryNumber(draftConfig.couple);
  const annDateReadable = formatReadableDate(
    getAnniversaryDateISO(draftConfig.couple.weddingDate, annNum),
  );

  const handleBodyChange = (value: string) => {
    const nextParagraphs = value
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p, idx, arr) => p.length > 0 || (arr.length === 1 && idx === 0));
    updateLetter({ paragraphs: nextParagraphs.length > 0 ? nextParagraphs : [''] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 space-y-5">
        <EditorCard
          title="Anniversary Letter"
          description="Edit your personal keepsake letter. Separate paragraphs with a blank line."
        >
          <div className="space-y-4">
            <TokenHintBanner />

            <div>
              <FieldLabel label="Letter Heading" htmlFor="letter-heading-input" />
              <input
                id="letter-heading-input"
                type="text"
                value={letter.heading}
                onChange={(e) => updateLetter({ heading: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Greeting / Salutation" htmlFor="letter-salutation" />
              <input
                id="letter-salutation"
                type="text"
                value={letter.salutation}
                onChange={(e) => updateLetter({ salutation: e.target.value })}
                placeholder="My Dearest {groom},"
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel
                label="Letter Body"
                hint="Blank line = new paragraph"
                htmlFor="letter-body"
              />
              <textarea
                id="letter-body"
                rows={9}
                value={bodyText}
                onChange={(e) => handleBodyChange(e.target.value)}
                className={`${inputClassName} leading-relaxed`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Closing Message" htmlFor="letter-closing" />
                <input
                  id="letter-closing"
                  type="text"
                  value={letter.closing}
                  onChange={(e) => updateLetter({ closing: e.target.value })}
                  className={inputClassName}
                />
              </div>

              <div>
                <FieldLabel label="Signature" htmlFor="letter-signature" />
                <input
                  id="letter-signature"
                  type="text"
                  value={letter.signature}
                  onChange={(e) => updateLetter({ signature: e.target.value })}
                  placeholder="{bride} ❤️"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        </EditorCard>
      </div>

      {/* Live stationery preview */}
      <div className="lg:col-span-6">
        <EditorCard
          title="Live Letter Preview"
          description="Updates in real time as you type."
        >
          <div className="bg-[#FFF8F2] border border-[#C6A36A]/45 rounded-[10px] p-3 sm:p-4">
            <div className="border border-[#6D1025]/15 rounded-[6px] px-5 py-7 sm:px-8 sm:py-9 surface-cream-paper">
              <p className="text-[11px] tracking-[0.26em] uppercase text-[#6D1025]/65 mb-5 tabular-nums">
                {annDateReadable}
              </p>

              <p className="font-[family-name:var(--font-display)] italic text-2xl text-[#490D20] mb-5">
                {resolveTemplateText(letter.salutation, draftConfig)}
              </p>

              <div className="space-y-4 text-sm sm:text-[15px] leading-[1.8] text-[#310916]/90">
                {letter.paragraphs.map((p, idx) => (
                  <p key={idx}>{resolveTemplateText(p, draftConfig)}</p>
                ))}
              </div>

              <div className="mt-7 pt-5 border-t border-[#C6A36A]/25">
                <p className="font-[family-name:var(--font-display)] italic text-base text-[#490D20]">
                  {resolveTemplateText(letter.closing, draftConfig)}
                </p>
                <p className="font-[family-name:var(--font-script)] text-3xl text-[#6D1025]">
                  {resolveTemplateText(letter.signature, draftConfig)}
                </p>
              </div>
            </div>
          </div>
        </EditorCard>
      </div>
    </div>
  );
}
