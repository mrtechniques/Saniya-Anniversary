import { Calendar, Heart, Sparkles } from 'lucide-react';
import {
  getEffectiveAnniversaryNumber,
  resolveTemplateText,
} from '../../config/anniversary';
import {
  calculateAnniversaryNumber,
  formatOrdinal,
  formatReadableDate,
  getAnniversaryDateISO,
  isLeapYear,
  parseISODate,
} from '../../config/dateUtils';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  EditorCard,
  FieldLabel,
  inputClassName,
  TokenHintBanner,
} from './EditorPrimitives';

export function CoupleDetailsEditor() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { couple } = draftConfig;

  const effectiveAnnNum = getEffectiveAnniversaryNumber(couple);
  const annDateISO = getAnniversaryDateISO(couple.weddingDate, effectiveAnnNum);
  const parsedWedding = parseISODate(couple.weddingDate);
  const isFeb29Wedding = parsedWedding?.month === 2 && parsedWedding?.day === 29;
  const annYear = parseISODate(annDateISO)?.year;

  const updateCouple = (patch: Partial<typeof couple>) => {
    updateDraft((prev) => ({
      ...prev,
      couple: {
        ...prev.couple,
        ...patch,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <EditorCard
        title="Couple Details & Automatic Name Sync"
        description="Updating the groom or bride name automatically updates the Hero, Loading screen, Letter, Final message, and Page title wherever tokens are used."
      >
        <div className="space-y-5">
          <TokenHintBanner />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Groom Name" htmlFor="groom-name" />
              <input
                id="groom-name"
                type="text"
                value={couple.groomName}
                onChange={(e) => updateCouple({ groomName: e.target.value })}
                placeholder="Arshad"
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel label="Bride Name" htmlFor="bride-name" />
              <input
                id="bride-name"
                type="text"
                value={couple.brideName}
                onChange={(e) => updateCouple({ brideName: e.target.value })}
                placeholder="Saniya"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel
                label="Website Title"
                hint="Shown in hero header"
                htmlFor="website-title"
              />
              <input
                id="website-title"
                type="text"
                value={couple.websiteTitle}
                onChange={(e) => updateCouple({ websiteTitle: e.target.value })}
                placeholder="A Year of Us"
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel
                label="Browser Page Title"
                hint="Shown in browser tab"
                htmlFor="page-title"
              />
              <input
                id="page-title"
                type="text"
                value={couple.pageTitle}
                onChange={(e) => updateCouple({ pageTitle: e.target.value })}
                placeholder="A Year of Us — {groom} & {bride}"
                className={inputClassName}
              />
              <p className="mt-1 text-[11px] text-[#490D20]/65">
                Live preview:{' '}
                <span className="font-medium text-[#6D1025]">
                  {resolveTemplateText(couple.pageTitle, draftConfig)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard
        title="Wedding & Anniversary Dates"
        description="Anniversary dates are calculated dynamically with leap-year handling. You can also set the anniversary number manually."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <FieldLabel
                label="Wedding Date"
                hint={formatReadableDate(couple.weddingDate)}
                htmlFor="wedding-date"
              />
              <input
                id="wedding-date"
                type="date"
                value={couple.weddingDate}
                onChange={(e) => updateCouple({ weddingDate: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <FieldLabel
                label="Anniversary Number"
                hint={couple.autoCalculateAnniversary ? 'Auto-calculated' : 'Manual'}
                htmlFor="anniversary-number"
              />
              <div className="flex items-center gap-3">
                <input
                  id="anniversary-number"
                  type="number"
                  min={1}
                  max={100}
                  disabled={couple.autoCalculateAnniversary}
                  value={effectiveAnnNum}
                  onChange={(e) =>
                    updateCouple({
                      anniversaryNumber: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className={`${inputClassName} disabled:bg-[#F5EEE8] disabled:text-[#490D20]/70`}
                />
              </div>
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-[#490D20]/85 cursor-pointer">
                <input
                  type="checkbox"
                  checked={couple.autoCalculateAnniversary}
                  onChange={(e) =>
                    updateCouple({
                      autoCalculateAnniversary: e.target.checked,
                      anniversaryNumber: e.target.checked
                        ? calculateAnniversaryNumber(couple.weddingDate)
                        : couple.anniversaryNumber,
                    })
                  }
                  className="rounded border-[#6D1025]/30 accent-[#6D1025]"
                />
                Auto-calculate anniversary number from today&apos;s date
              </label>
            </div>
          </div>

          {/* Calculated summary card */}
          <div className="rounded-[10px] border border-[#C6A36A]/40 bg-[#FCECEF]/45 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#6D1025]/10 text-[#6D1025] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#6D1025] font-medium">
                  {formatOrdinal(effectiveAnnNum)} Anniversary Milestone
                </p>
                <p className="font-[family-name:var(--font-display)] text-lg text-[#310916]">
                  {formatReadableDate(couple.weddingDate)} → {formatReadableDate(annDateISO)}
                </p>
                {isFeb29Wedding && annYear && !isLeapYear(annYear) && (
                  <p className="text-[11px] text-[#6D1025]/80 mt-0.5">
                    Leap-year note: {annYear} is not a leap year, so 29 Feb is celebrated on 28 Feb {annYear}.
                  </p>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-[#6D1025] bg-white px-3 py-1.5 rounded-full border border-[#C6A36A]/35 shrink-0">
              <Heart className="w-3.5 h-3.5 fill-[#B52B45] text-[#B52B45]" aria-hidden="true" />
              <span>
                {couple.groomName || 'Arshad'} &amp; {couple.brideName || 'Saniya'}
              </span>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#6D1025]/12 bg-white p-3.5 text-xs text-[#490D20]/80 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C6A36A] shrink-0" aria-hidden="true" />
            <span>
              Resolved hero display:{' '}
              <strong className="text-[#310916]">
                {resolveTemplateText(draftConfig.hero.coupleDisplay, draftConfig)}
              </strong>{' '}
              · Letter greeting:{' '}
              <strong className="text-[#310916]">
                {resolveTemplateText(draftConfig.letter.salutation, draftConfig)}
              </strong>
            </span>
          </div>
        </div>
      </EditorCard>
    </div>
  );
}
