import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Pencil, RotateCcw, X } from 'lucide-react';
import {
  DEFAULT_LOVE_NOTES,
  LOVE_NOTES_HEADER,
  type LoveNote,
} from '../config/anniversary';

interface LoveNotesProps {
  notes: LoveNote[];
  onSaveNotes: (notes: LoveNote[]) => void;
  onResetNotes: () => void;
}

export function LoveNotes({ notes, onSaveNotes, onResetNotes }: LoveNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState<LoveNote[]>(notes);

  const handleOpenEditor = () => {
    setDraftNotes(notes);
    setIsEditing(true);
  };

  const handleDraftChange = (
    id: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setDraftNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, [field]: value } : note)),
    );
  };

  const handleSave = () => {
    const cleaned = draftNotes.map((note, idx) => ({
      ...note,
      title: note.title.trim() || DEFAULT_LOVE_NOTES[idx]?.title || 'Little Moment',
      description:
        note.description.trim() ||
        DEFAULT_LOVE_NOTES[idx]?.description ||
        'Every moment with you.',
    }));
    onSaveNotes(cleaned);
    setIsEditing(false);
  };

  const handleReset = () => {
    onResetNotes();
    setDraftNotes(DEFAULT_LOVE_NOTES);
    setIsEditing(false);
  };

  return (
    <section
      id="little-things"
      aria-labelledby="little-things-heading"
      className="relative surface-blush-silk text-[#310916] py-16 sm:py-24 lg:py-28 px-5 sm:px-8 border-t border-[#6D1025]/12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#6D1025]/75 mb-3">
            Notes of Affection
          </p>
          <h2
            id="little-things-heading"
            className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2rem,5.5vw,3.15rem)] leading-[1.12] text-[#310916] mb-3.5"
          >
            {LOVE_NOTES_HEADER.heading}
          </h2>
          <p className="font-[family-name:var(--font-display)] italic text-lg sm:text-xl text-[#6D1025]/90">
            {LOVE_NOTES_HEADER.subheading}
          </p>
        </motion.header>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {notes.map((note, index) => (
              <motion.article
                key={note.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: (index % 2) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-t border-[#6D1025]/18 pt-5 pb-2"
              >
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="font-[family-name:var(--font-display)] font-medium text-2xl text-[#490D20]">
                    {note.title}
                  </h3>
                  <span className="text-[11px] tracking-[0.24em] text-[#B52B45]/80 tabular-nums shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[15px] sm:text-base leading-[1.7] text-[#310916]/85">
                  {note.description}
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="bg-[#FFF8F2]/92 border border-[#6D1025]/18 rounded-[12px] p-5 sm:p-8 editorial-frame-shadow space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-[#6D1025]/12 pb-4">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#310916]">
                Edit Little Things Notes
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Cancel editing notes"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#490D20] hover:bg-[#F7DDE2]/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {draftNotes.map((note, idx) => (
                <div
                  key={note.id}
                  className="p-4 rounded-[8px] bg-[#FCECEF]/55 border border-[#6D1025]/12 space-y-3"
                >
                  <label className="block">
                    <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1">
                      Note {String(idx + 1).padStart(2, '0')} Heading
                    </span>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) =>
                        handleDraftChange(note.id, 'title', e.target.value)
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/20 text-sm text-[#310916] focus:outline-none focus:border-[#6D1025]"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[11px] tracking-[0.2em] uppercase text-[#6D1025]/75 mb-1">
                      Description
                    </span>
                    <textarea
                      rows={2}
                      value={note.description}
                      onChange={(e) =>
                        handleDraftChange(note.id, 'description', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[#FFF8F2] border border-[#6D1025]/20 text-sm text-[#310916] focus:outline-none focus:border-[#6D1025]"
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#6D1025]/25 text-xs tracking-[0.16em] uppercase text-[#6D1025] hover:bg-[#F7DDE2]/50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
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
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discreet personalization trigger */}
        {!isEditing && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleOpenEditor}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs tracking-[0.2em] uppercase text-[#6D1025]/70 hover:text-[#490D20] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6D1025]"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Personalize Notes</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
