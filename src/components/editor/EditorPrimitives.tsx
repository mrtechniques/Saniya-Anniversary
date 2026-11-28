import type { ReactNode } from 'react';

export function EditorCard({
  title,
  description,
  children,
  rightSlot,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="bg-[#FFF8F2] border border-[#C6A36A]/35 rounded-[12px] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-[#6D1025]/10">
        <div>
          <h3 className="font-[family-name:var(--font-display)] font-medium text-xl sm:text-2xl text-[#310916]">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-[#490D20]/75 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

export function FieldLabel({
  label,
  hint,
  htmlFor,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium tracking-[0.12em] uppercase text-[#6D1025]"
      >
        {label}
      </label>
      {hint && <span className="text-[11px] text-[#490D20]/60">{hint}</span>}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-[8px] border border-[#6D1025]/20 bg-white px-3.5 py-2.5 text-sm text-[#310916] placeholder:text-[#490D20]/40 focus:border-[#6D1025] focus:outline-none focus:ring-2 focus:ring-[#6D1025]/15 transition-colors';

export const buttonPrimaryClass =
  'inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#6D1025] px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-[#FFF8F2] hover:bg-[#490D20] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[40px]';

export const buttonSecondaryClass =
  'inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#6D1025]/25 bg-white px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-[#6D1025] hover:bg-[#FCECEF] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[40px]';

export function TokenHintBanner() {
  return (
    <div className="rounded-[8px] border border-[#C6A36A]/40 bg-[#FCECEF]/55 px-3.5 py-2.5 text-xs text-[#490D20]/85 leading-relaxed">
      <span className="font-medium text-[#6D1025]">Auto-Name Tokens:</span> Use{' '}
      <code className="px-1 py-0.5 rounded bg-white/80 text-[#6D1025]">{'{groom}'}</code>,{' '}
      <code className="px-1 py-0.5 rounded bg-white/80 text-[#6D1025]">{'{bride}'}</code>,{' '}
      <code className="px-1 py-0.5 rounded bg-white/80 text-[#6D1025]">
        {'{anniversaryOrdinal}'}
      </code>
      , or{' '}
      <code className="px-1 py-0.5 rounded bg-white/80 text-[#6D1025]">
        {'{weddingDate}'}
      </code>{' '}
      to update all occurrences automatically when Couple Details change.
    </div>
  );
}
