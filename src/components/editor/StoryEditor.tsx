import { useState, type ChangeEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  DEFAULT_IMAGE_POSITION,
  resolveTemplateText,
  type StoryChapter,
} from '../../config/anniversary';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  PHOTO_ACCEPT_ATTRIBUTE,
  processPhotoFile,
  validateMediaFile,
} from '../../utils/mediaSupport';
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  EditorCard,
  FieldLabel,
  inputClassName,
} from './EditorPrimitives';
import { ImagePositionEditor } from './ImagePositionEditor';

export function StoryEditor() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { stories } = draftConfig;

  const [selectedId, setSelectedId] = useState<string>(stories[0]?.id ?? '');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const selectedStory = stories.find((s) => s.id === selectedId) ?? stories[0] ?? null;

  const updateStory = (id: string, patch: Partial<StoryChapter>) => {
    updateDraft((prev) => ({
      ...prev,
      stories: prev.stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const handleAddStory = () => {
    const nextNum = stories.length + 1;
    const newId = `chapter-${Date.now()}`;
    const newStory: StoryChapter = {
      id: newId,
      sequence: String(nextNum).padStart(2, '0'),
      photoId: 100 + nextNum,
      heading: 'A New Chapter Together',
      body: 'Write the story behind this cherished memory.',
      dateLabel: '',
      image: '/memories/photos/1.jpeg',
      plateLabel: `Plate ${String(nextNum).padStart(2, '0')}`,
      position: { ...DEFAULT_IMAGE_POSITION },
      visible: true,
    };

    updateDraft((prev) => ({
      ...prev,
      stories: [...prev.stories, newStory],
    }));
    setSelectedId(newId);
  };

  const handleDeleteStory = (id: string) => {
    updateDraft((prev) => {
      const remaining = prev.stories
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, sequence: String(idx + 1).padStart(2, '0') }));
      return { ...prev, stories: remaining };
    });
    if (selectedId === id) {
      const fallback = stories.find((s) => s.id !== id);
      setSelectedId(fallback?.id ?? '');
    }
  };

  const moveStory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= stories.length || fromIndex === toIndex) return;
    updateDraft((prev) => {
      const copy = [...prev.stories];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return {
        ...prev,
        stories: copy.map((s, idx) => ({
          ...s,
          sequence: String(idx + 1).padStart(2, '0'),
        })),
      };
    });
  };

  const handleTempImage = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
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
    updateStory(id, { image: processed.previewUrl });
  };

  return (
    <div className="space-y-6">
      <EditorCard
        title="Story Chapters"
        description="Drag and drop chapters to reorder. Each chapter keeps its photograph, positioning, and story text together."
        rightSlot={
          <button type="button" onClick={handleAddStory} className={buttonPrimaryClass}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Story
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter list */}
          <div className="lg:col-span-5 space-y-2.5">
            {stories.length === 0 ? (
              <p className="text-sm text-[#490D20]/70 py-6 text-center border border-dashed border-[#6D1025]/25 rounded-[10px]">
                No story chapters yet. Click &ldquo;Add Story&rdquo; to create one.
              </p>
            ) : (
              stories.map((story, idx) => {
                const isSelected = selectedStory?.id === story.id;
                return (
                  <div
                    key={story.id}
                    draggable
                    onDragStart={() => setDraggedIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex !== null) {
                        moveStory(draggedIndex, idx);
                        setDraggedIndex(null);
                      }
                    }}
                    onDragEnd={() => setDraggedIndex(null)}
                    onClick={() => setSelectedId(story.id)}
                    className={`group flex items-center gap-3 rounded-[10px] border p-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#6D1025] bg-[#FCECEF]/70'
                        : 'border-[#6D1025]/15 bg-white hover:border-[#6D1025]/40'
                    } ${!story.visible ? 'opacity-60' : ''}`}
                  >
                    <GripVertical
                      className="w-4 h-4 text-[#6D1025]/45 shrink-0 cursor-grab"
                      aria-hidden="true"
                    />
                    <img
                      src={story.image}
                      alt={story.heading}
                      className="h-12 w-12 rounded-[6px] object-cover bg-[#F5EEE8] border border-[#6D1025]/15 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6D1025]/75 tabular-nums">
                        Chapter {String(idx + 1).padStart(2, '0')}
                        {!story.visible && ' · Hidden'}
                      </p>
                      <p className="font-[family-name:var(--font-display)] text-base text-[#310916] truncate">
                        {resolveTemplateText(story.heading, draftConfig) || 'Untitled'}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => moveStory(idx, idx - 1)}
                        disabled={idx === 0}
                        aria-label="Move story up"
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStory(idx, idx + 1)}
                        disabled={idx === stories.length - 1}
                        aria-label="Move story down"
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStory(story.id, { visible: !story.visible })}
                        aria-label={story.visible ? 'Hide story' : 'Show story'}
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white cursor-pointer"
                      >
                        {story.visible ? (
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story.id)}
                        aria-label={`Delete ${story.heading}`}
                        className="p-1.5 rounded text-[#B52B45] hover:bg-white cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected chapter editor */}
          <div className="lg:col-span-7">
            {selectedStory ? (
              <div className="rounded-[12px] border border-[#C6A36A]/40 bg-white p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#6D1025]/10">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#6D1025] font-medium">
                    Editing Chapter {selectedStory.sequence}
                  </span>
                  <label className="inline-flex items-center gap-2 text-xs text-[#310916] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStory.visible}
                      onChange={(e) =>
                        updateStory(selectedStory.id, { visible: e.target.checked })
                      }
                      className="rounded border-[#6D1025]/30 accent-[#6D1025]"
                    />
                    Visible on website
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Chapter Title" htmlFor="story-title" />
                    <input
                      id="story-title"
                      type="text"
                      value={selectedStory.heading}
                      onChange={(e) =>
                        updateStory(selectedStory.id, { heading: e.target.value })
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <FieldLabel label="Optional Date Label" htmlFor="story-date" />
                    <input
                      id="story-date"
                      type="text"
                      value={selectedStory.dateLabel ?? ''}
                      onChange={(e) =>
                        updateStory(selectedStory.id, { dateLabel: e.target.value })
                      }
                      placeholder="e.g. 23 November 2025"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel label="Story Description" htmlFor="story-body" />
                  <textarea
                    id="story-body"
                    rows={3}
                    value={selectedStory.body}
                    onChange={(e) =>
                      updateStory(selectedStory.id, { body: e.target.value })
                    }
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-5">
                    <FieldLabel label="Plate Label" htmlFor="story-plate" />
                    <input
                      id="story-plate"
                      type="text"
                      value={selectedStory.plateLabel}
                      onChange={(e) =>
                        updateStory(selectedStory.id, { plateLabel: e.target.value })
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <FieldLabel label="Associated Image Path" htmlFor="story-image" />
                    <input
                      id="story-image"
                      type="text"
                      value={selectedStory.image}
                      onChange={(e) =>
                        updateStory(selectedStory.id, { image: e.target.value })
                      }
                      placeholder="/memories/photos/1.jpeg"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={buttonSecondaryClass}>
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Choose Local Image (Temp Preview)</span>
                    <input
                      type="file"
                      accept={PHOTO_ACCEPT_ATTRIBUTE}
                      onChange={(e) => void handleTempImage(selectedStory.id, e)}
                      className="sr-only"
                    />
                  </label>
                  {uploadNotice && (
                    <p className="text-xs text-[#6D1025] bg-[#FCECEF] border border-[#B52B45]/30 rounded-[8px] px-3 py-2">
                      {uploadNotice}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#6D1025]/10">
                  <ImagePositionEditor
                    imageSrc={selectedStory.image}
                    position={selectedStory.position}
                    aspectRatio="4 / 5"
                    label="Drag story photo to frame"
                    onChange={(position) => updateStory(selectedStory.id, { position })}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-dashed border-[#6D1025]/25 p-8 text-center text-sm text-[#490D20]/70">
                Select a story chapter on the left to edit it.
              </div>
            )}
          </div>
        </div>
      </EditorCard>
    </div>
  );
}
