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

export function FinalMessageEditor() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { finalMessage } = draftConfig;

  const updateFinal = (patch: Partial<typeof finalMessage>) => {
    updateDraft((prev) => ({
      ...prev,
      finalMessage: {
        ...prev.finalMessage,
        ...patch,
      },
    }));
  };

  const annNum = getEffectiveAnniversaryNumber(draftConfig.couple);
  const weddingReadable = formatReadableDate(draftConfig.couple.weddingDate);
  const annReadable = formatReadableDate(
    getAnniversaryDateISO(draftConfig.couple.weddingDate, annNum),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6">
        <EditorCard
          title="Final Anniversary Message"
          description="Customize the closing burgundy dedication at the bottom of the website."
        >
          <div className="space-y-4">
            <TokenHintBanner />

            <div>
              <FieldLabel label="Lead Line" htmlFor="final-lead" />
              <input
                id="final-lead"
                type="text"
                value={finalMessage.lead}
                onChange={(e) => updateFinal({ lead: e.target.value })}
                placeholder="One year down..."
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Final Heading (Animated Line)" htmlFor="final-animated" />
              <input
                id="final-animated"
                type="text"
                value={finalMessage.animatedLine}
                onChange={(e) => updateFinal({ animatedLine: e.target.value })}
                placeholder="Forever to go. ❤️"
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Anniversary Greeting" htmlFor="final-greeting" />
              <input
                id="final-greeting"
                type="text"
                value={finalMessage.anniversaryGreeting}
                onChange={(e) => updateFinal({ anniversaryGreeting: e.target.value })}
                placeholder="Happy {anniversaryOrdinalWord} Anniversary, {groom}."
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Signature" htmlFor="final-signoff" />
              <input
                id="final-signoff"
                type="text"
                value={finalMessage.signOff}
                onChange={(e) => updateFinal({ signOff: e.target.value })}
                placeholder="With love, {bride}."
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Closing Sentence" htmlFor="final-closing" />
              <input
                id="final-closing"
                type="text"
                value={finalMessage.closingNote}
                onChange={(e) => updateFinal({ closingNote: e.target.value })}
                placeholder="To many more beautiful years together."
                className={inputClassName}
              />
            </div>
          </div>
        </EditorCard>
      </div>

      <div className="lg:col-span-6">
        <EditorCard
          title="Live Closing Preview"
          description="Preview of the footer dedication."
        >
          <div className="surface-burgundy-linen text-[#FFF8F2] rounded-[12px] p-8 sm:p-10 text-center border border-[#C6A36A]/35">
            <p className="font-[family-name:var(--font-display)] italic text-xl text-[#F7DDE2] mb-2">
              {resolveTemplateText(finalMessage.lead, draftConfig)}
            </p>
            <h4 className="font-[family-name:var(--font-editorial)] text-3xl sm:text-4xl text-[#FFF8F2] mb-6">
              {resolveTemplateText(finalMessage.animatedLine, draftConfig)}
            </h4>
            <p className="font-[family-name:var(--font-display)] text-lg text-[#FFF8F2]/95 mb-1">
              {resolveTemplateText(finalMessage.anniversaryGreeting, draftConfig)}
            </p>
            <p className="font-[family-name:var(--font-script)] text-3xl text-[#F7DDE2] mb-2">
              {resolveTemplateText(finalMessage.signOff, draftConfig)}
            </p>
            <p className="text-xs text-[#F7DDE2]/80 mb-6">
              {resolveTemplateText(finalMessage.closingNote, draftConfig)}
            </p>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#C6A36A]/85 tabular-nums">
              {resolveTemplateText(draftConfig.hero.coupleDisplay, draftConfig)} ·{' '}
              {weddingReadable} — {annReadable}
            </p>
          </div>
        </EditorCard>
      </div>
    </div>
  );
}
