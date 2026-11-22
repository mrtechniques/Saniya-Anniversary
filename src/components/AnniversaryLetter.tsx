import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Pencil, RotateCcw, X } from 'lucide-react';
import {
  COUPLE_INFO,
  DEFAULT_LETTER,
  type AnniversaryLetterData,
} from '../config/anniversary';

interface AnniversaryLetterProps {
  letter: AnniversaryLetterData;
  onSaveLetter: (letter: AnniversaryLetterData) => void;
  onResetLetter: () => void;
}

export function AnniversaryLetter({
  letter,
  onSaveLetter,
  onResetLetter,
}: AnniversaryLetterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [salutation, setSalutation] = useState(letter.salutation);
  const [bodyText, setBodyText] = useState(letter.paragraphs.join('\n\n'));
  const [closing, setClosing] = useState(letter.closing);
  const [signature, setSignature] = useState(letter.signature);

  const handleOpenEditor = () => {
    setSalutation(letter.salutation);
    setBodyText(letter.paragraphs.join('\n\n'));
    setClosing(letter.closing);
    setSignature(letter.signature);
    setIsEditing(true);
  };

  const handleSave = () => {
    const paragraphs = bodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    onSaveLetter({
      heading: letter.heading,
      salutation: salutation.trim() || DEFAULT_LETTER.salutation,
      paragraphs: paragraphs.length > 0 ? paragraphs : DEFAULT_LETTER.paragraphs,
      closing: closing.trim() || DEFAULT_LETTER.closing,
      signature: signature.trim() || DEFAULT_LETTER.signature,
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    onResetLetter();
    setSalutation(DEFAULT_LETTER.salutation);
    setBodyText(DEFAULT_LETTER.paragraphs.join('\n\n'));
    setClosing(DEFAULT_LETTER.closing);
    setSignature(DEFAULT_LETTER.signature);
    setIsEditing(false);
  };

  return (
    <section
      id="letter"
      aria-labelledby="letter-heading"
      className="relative surface-cream-paper text-[#310916] py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#C6A36A]/25"
    >
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-10 sm:mb-14"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            Personal Keepsake
          </p>
          <h2
            id="letter-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.1rem)] leading-[1.12] text-[#310916]"
          >
            {letter.heading}
          </h2>
        </motion.header>

        {/* Stationery letter frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FFF8F2] border border-[#C6A36A]/45 rounded-[12px] p-4 sm:p-7 editorial-frame-shadow"
        >
          <div className="relative border border-[#6D1025]/14 rounded-[8px] px-5 py-8 sm:px-10 sm:py-12 md:px-14 md:py-14 surface-cream-paper">
            {/* Ornamental corner marks */}
            <span
              aria-hidden="true"
              className="absolute top-3.5 left-3.5 h-3.5 w-3.5 border-t border-l border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute top-3.5 right-3.5 h-3.5 w-3.5 border-t border-r border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l border-[#C6A36A]/70"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3.5 right-3.5 h-3.5 w-3.5 border-b border-r border-[#C6A36A]/70"
            />

            {!isEditing ? (
              <div className="max-w-xl mx-auto">
                <p className="text-[11px] tracking-[0.26em] uppercase text-[#6D1025]/65 mb-7 tabular-nums">
                  {COUPLE_INFO.firstAnniversaryDate}
                </p>

                <p className="font-[family-name:var(--font-display)] italic text-2xl sm:text-[1.7rem] text-[#490D20] mb-6">
                  {letter.salutation}
                </p>

                <div className="space-y-5 text-[15.5px] sm:text-[16.5px] leading-[1.82] text-[#310916]/90">
                  {letter.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-9 pt-6 border-t border-[#C6A36A]/25">
                  <p className="font-[family-name:var(--font-display)] italic text-lg text-[#490D20] mb-1">
                    {letter.closing}
                  </p>
                  <p className="font-[family-name:var(--font-script)] text-[2.25rem] sm:text-[2.6rem] leading-tight text-[#6D1025]">
                    {letter.signature}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-center justify-between gap-4 border-b border-[#6D1025]/12 pb-3">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#310916]">
                    Edit Your Letter
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    aria-label="Cancel editing letter"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#490D20] hover:bg-[#F7DDE2]/60 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <label className="block">
                  <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1.5">
                    Salutation
                  </span>
                  <input
                    type="text"
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/25 text-base text-[#310916] focus:outline-none focus:border-[#6D1025]"
                  />
                </label>

                <label className="block">
                  <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1.5">
                    Letter Paragraphs (separate paragraphs with a blank line)
                  </span>
                  <textarea
                    rows={9}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/25 text-[15px] leading-relaxed text-[#310916] focus:outline-none focus:border-[#6D1025]"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1.5">
                      Closing Line
                    </span>
                    <input
                      type="text"
                      value={closing}
                      onChange={(e) => setClosing(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/25 text-sm text-[#310916] focus:outline-none focus:border-[#6D1025]"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1.5">
                      Signature
                    </span>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/25 text-sm text-[#310916] focus:outline-none focus:border-[#6D1025]"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#6D1025]/25 text-xs tracking-[0.16em] uppercase text-[#6D1025] hover:bg-[#F7DDE2]/50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset Default</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg text-xs tracking-[0.16em] uppercase text-[#490D20]/80 hover:text-[#310916] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-lg bg-[#6D1025] text-[#FFF8F2] text-xs tracking-[0.16em] uppercase hover:bg-[#490D20] transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Save Letter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {!isEditing && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleOpenEditor}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs tracking-[0.2em] uppercase text-[#6D1025]/70 hover:text-[#490D20] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6D1025]"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit Letter</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
