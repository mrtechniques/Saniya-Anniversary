import { Lock, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  buttonSecondaryClass,
  EditorCard,
  FieldLabel,
  inputClassName,
} from './EditorPrimitives';

export function GeneralSettings() {
  const { draftConfig, updateDraft } = useWebsiteConfig();

  const handleAddNote = () => {
    const newId = `note-${Date.now()}`;
    updateDraft((prev) => ({
      ...prev,
      loveNotes: [
        ...prev.loveNotes,
        {
          id: newId,
          title: 'New Reason',
          description: 'Another little reason I love you.',
        },
      ],
    }));
  };

  const handleRemoveNote = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      loveNotes: prev.loveNotes.filter((n) => n.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <EditorCard
        title="Opening Animation & Global Headings"
        description="Customize the opening loading screen and section titles across the website."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Opening Greeting" htmlFor="loading-headline" />
              <input
                id="loading-headline"
                type="text"
                value={draftConfig.loading.headline}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, headline: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel label="Opening Subline" htmlFor="loading-subline" />
              <input
                id="loading-subline"
                type="text"
                value={draftConfig.loading.subline}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    loading: { ...prev.loading, subline: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#6D1025]/10">
            <div>
              <FieldLabel label="Story Section Heading" htmlFor="story-heading" />
              <input
                id="story-heading"
                type="text"
                value={draftConfig.storyHeader.heading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    storyHeader: { ...prev.storyHeader, heading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel label="Story Section Subheading" htmlFor="story-subheading" />
              <input
                id="story-subheading"
                type="text"
                value={draftConfig.storyHeader.subheading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    storyHeader: { ...prev.storyHeader, subheading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#6D1025]/10">
            <div>
              <FieldLabel label="Photo Gallery Heading" htmlFor="gallery-heading" />
              <input
                id="gallery-heading"
                type="text"
                value={draftConfig.galleryHeader.heading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    galleryHeader: { ...prev.galleryHeader, heading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel label="Photo Gallery Subheading" htmlFor="gallery-subheading" />
              <input
                id="gallery-subheading"
                type="text"
                value={draftConfig.galleryHeader.subheading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    galleryHeader: { ...prev.galleryHeader, subheading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#6D1025]/10">
            <div>
              <FieldLabel label="Video Section Heading" htmlFor="video-heading" />
              <input
                id="video-heading"
                type="text"
                value={draftConfig.videoHeader.heading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    videoHeader: { ...prev.videoHeader, heading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel label="Video Section Subheading" htmlFor="video-subheading" />
              <input
                id="video-subheading"
                type="text"
                value={draftConfig.videoHeader.subheading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    videoHeader: { ...prev.videoHeader, subheading: e.target.value },
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard
        title="Love Notes Section"
        description="Edit the love notes heading and individual affection cards."
        rightSlot={
          <button type="button" onClick={handleAddNote} className={buttonSecondaryClass}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Note
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Love Notes Heading" htmlFor="notes-heading" />
              <input
                id="notes-heading"
                type="text"
                value={draftConfig.loveNotesHeader.heading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    loveNotesHeader: {
                      ...prev.loveNotesHeader,
                      heading: e.target.value,
                    },
                  }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel label="Love Notes Subheading" htmlFor="notes-subheading" />
              <input
                id="notes-subheading"
                type="text"
                value={draftConfig.loveNotesHeader.subheading}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    loveNotesHeader: {
                      ...prev.loveNotesHeader,
                      subheading: e.target.value,
                    },
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {draftConfig.loveNotes.map((note, idx) => (
              <div
                key={note.id}
                className="rounded-[10px] border border-[#6D1025]/15 bg-white p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#6D1025]/70 tabular-nums">
                    Note {String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNote(note.id)}
                    aria-label={`Remove note ${note.title}`}
                    className="p-1.5 rounded text-[#6D1025]/60 hover:text-[#6D1025] hover:bg-[#FCECEF] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      loveNotes: prev.loveNotes.map((n) =>
                        n.id === note.id ? { ...n, title: e.target.value } : n,
                      ),
                    }))
                  }
                  placeholder="Note title"
                  className={inputClassName}
                />
                <textarea
                  rows={2}
                  value={note.description}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      loveNotes: prev.loveNotes.map((n) =>
                        n.id === note.id ? { ...n, description: e.target.value } : n,
                      ),
                    }))
                  }
                  placeholder="Note description"
                  className={inputClassName}
                />
              </div>
            ))}
          </div>
        </div>
      </EditorCard>

      <EditorCard
        title="Optional Editor PIN Gate"
        description="Prevent accidental edits on this browser with a simple client-side PIN."
      >
        <div className="space-y-4">
          <div className="rounded-[8px] border border-[#C6A36A]/45 bg-[#FCECEF]/50 p-3.5 flex items-start gap-2.5 text-xs text-[#490D20]/85 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-[#6D1025] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Note:</strong> Client-side PIN protection only prevents accidental access in
              this browser. Because this website has no backend or database, a client-side PIN is
              not strong security. The public homepage (<code>/</code>) always remains accessible
              without a PIN.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center gap-2.5 text-sm text-[#310916] cursor-pointer">
              <input
                type="checkbox"
                checked={draftConfig.editorAccess.pinEnabled}
                onChange={(e) =>
                  updateDraft((prev) => ({
                    ...prev,
                    editorAccess: {
                      ...prev.editorAccess,
                      pinEnabled: e.target.checked,
                    },
                  }))
                }
                className="rounded border-[#6D1025]/30 accent-[#6D1025]"
              />
              <Lock className="w-4 h-4 text-[#6D1025]" aria-hidden="true" />
              Require PIN to open /edit
            </label>

            {draftConfig.editorAccess.pinEnabled && (
              <div className="sm:w-52">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={draftConfig.editorAccess.pinCode}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      editorAccess: {
                        ...prev.editorAccess,
                        pinCode: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter 4-6 digit PIN"
                  className={inputClassName}
                />
              </div>
            )}
          </div>
        </div>
      </EditorCard>
    </div>
  );
}
