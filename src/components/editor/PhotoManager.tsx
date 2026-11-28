import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  FileImage,
  GripVertical,
  Info,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  DEFAULT_IMAGE_POSITION,
  getValidVisiblePhotos,
  MINIMUM_PUBLISH_PHOTOS,
  resolveTemplateText,
  type PhotoMemory,
} from '../../config/anniversary';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  formatFileSize,
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

interface UploadQueueItem {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  stage: string;
  status: 'processing' | 'ready' | 'warning' | 'error';
  message?: string;
}

export function PhotoManager() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { photos } = draftConfig;

  const multiInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedId, setSelectedId] = useState<number>(photos[0]?.id ?? 0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);

  const selectedPhoto = photos.find((p) => p.id === selectedId) ?? photos[0] ?? null;
  const validPhotosCount = getValidVisiblePhotos(draftConfig).length;
  const meetsMinimum = validPhotosCount >= MINIMUM_PUBLISH_PHOTOS;

  const updatePhoto = (id: number, patch: Partial<PhotoMemory>) => {
    updateDraft((prev) => ({
      ...prev,
      photos: prev.photos.map((p) =>
        p.id === id
          ? {
              ...p,
              ...patch,
              objectPosition: patch.position
                ? `${patch.position.x}% ${patch.position.y}%`
                : p.objectPosition,
            }
          : p,
      ),
    }));
  };

  const updateQueueItem = (id: string, patch: Partial<UploadQueueItem>) => {
    setUploadQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleFilesAdded = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const existingNames = new Set(
      photos
        .map((p) => p.originalFileName?.toLowerCase() ?? p.src.split('/').pop()?.toLowerCase() ?? '')
        .filter(Boolean),
    );

    let nextIdCounter = photos.reduce((max, p) => Math.max(max, p.id), 0) + 1;

    for (const file of files) {
      const queueId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setUploadQueue((prev) => [
        {
          id: queueId,
          fileName: file.name,
          fileSize: file.size,
          progress: 10,
          stage: 'Validating...',
          status: 'processing',
        },
        ...prev.slice(0, 14),
      ]);

      const validation = await validateMediaFile(file, 'photo', existingNames);
      if (!validation.valid) {
        updateQueueItem(queueId, {
          progress: 100,
          stage: 'Rejected',
          status: 'error',
          message: validation.error,
        });
        continue;
      }

      existingNames.add(file.name.toLowerCase());

      const processed = await processPhotoFile(file, (percent, stage) => {
        updateQueueItem(queueId, { progress: percent, stage });
      });

      const assignedId = nextIdCounter++;
      const newPhoto: PhotoMemory = {
        id: assignedId,
        src: processed.previewUrl,
        plateLabel: `Plate ${String(assignedId).padStart(2, '0')}`,
        caption: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
        position: { ...DEFAULT_IMAGE_POSITION },
        objectPosition: '50% 50%',
        visible: true,
        originalFileName: processed.originalFileName,
        fileSize: processed.fileSize,
        mimeType: processed.mimeType,
        compatibilityNote: processed.compatibilityNote ?? validation.warning,
        previewSupported: processed.previewSupported,
      };

      updateDraft((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhoto],
      }));
      setSelectedId(assignedId);

      const hasWarning = Boolean(processed.compatibilityNote || validation.warning || !processed.previewSupported);
      updateQueueItem(queueId, {
        progress: 100,
        stage: processed.previewSupported ? 'Added' : 'Added (Preview Unsupported)',
        status: hasWarning ? 'warning' : 'ready',
        message: processed.compatibilityNote ?? validation.warning,
      });
    }
  };

  const handleDropZone = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleAddEmptyPlate = () => {
    const maxId = photos.reduce((max, p) => Math.max(max, p.id), 0);
    const nextId = maxId + 1;
    const newPhoto: PhotoMemory = {
      id: nextId,
      src: `/memories/photos/${nextId}.jpeg`,
      plateLabel: `Plate ${String(nextId).padStart(2, '0')}`,
      caption: 'A cherished memory from our year together.',
      position: { ...DEFAULT_IMAGE_POSITION },
      objectPosition: '50% 50%',
      visible: true,
      previewSupported: true,
    };
    updateDraft((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }));
    setSelectedId(nextId);
  };

  const handleDeletePhoto = (id: number) => {
    updateDraft((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
    if (selectedId === id) {
      const next = photos.find((p) => p.id !== id);
      setSelectedId(next?.id ?? 0);
    }
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length || fromIndex === toIndex) return;
    updateDraft((prev) => {
      const copy = [...prev.photos];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return { ...prev, photos: copy };
    });
  };

  const handleReplaceFile = async (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const queueId = `replace-${Date.now()}`;
    setUploadQueue((prev) => [
      {
        id: queueId,
        fileName: file.name,
        fileSize: file.size,
        progress: 15,
        stage: 'Validating...',
        status: 'processing',
      },
      ...prev.slice(0, 14),
    ]);

    const validation = await validateMediaFile(file, 'photo', new Set());
    if (!validation.valid) {
      updateQueueItem(queueId, {
        progress: 100,
        stage: 'Rejected',
        status: 'error',
        message: validation.error,
      });
      return;
    }

    const processed = await processPhotoFile(file, (percent, stage) => {
      updateQueueItem(queueId, { progress: percent, stage });
    });

    updatePhoto(id, {
      src: processed.previewUrl,
      originalFileName: processed.originalFileName,
      fileSize: processed.fileSize,
      mimeType: processed.mimeType,
      compatibilityNote: processed.compatibilityNote,
      previewSupported: processed.previewSupported,
    });

    updateQueueItem(queueId, {
      progress: 100,
      stage: processed.previewSupported ? 'Replaced' : 'Replaced (Preview Unsupported)',
      status: processed.compatibilityNote ? 'warning' : 'ready',
      message: processed.compatibilityNote,
    });
  };

  return (
    <div className="space-y-6">
      {/* Minimum Photo Requirement Banner */}
      <div
        className={`rounded-[12px] border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          meetsMinimum
            ? 'border-[#C6A36A]/45 bg-[#FFF8F2] text-[#310916]'
            : 'border-[#B52B45]/40 bg-[#FCECEF] text-[#6D1025]'
        }`}
      >
        <div className="flex items-start gap-3">
          {meetsMinimum ? (
            <CheckCircle2 className="w-5 h-5 text-[#6D1025] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-[#B52B45] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="text-sm font-medium">
              {validPhotosCount} / {MINIMUM_PUBLISH_PHOTOS} minimum photographs
            </p>
            <p className="text-xs opacity-85 mt-0.5">
              {meetsMinimum
                ? 'Your gallery meets the minimum requirement for publishing. You can add more or reorder anytime.'
                : 'You need at least 8 photographs before publishing your anniversary website. Drafts can still be saved.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => multiInputRef.current?.click()}
            className={buttonPrimaryClass}
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            Upload Photos
          </button>
          <button type="button" onClick={handleAddEmptyPlate} className={buttonSecondaryClass}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Path
          </button>
        </div>

        <input
          ref={multiInputRef}
          type="file"
          multiple
          accept={PHOTO_ACCEPT_ATTRIBUTE}
          onChange={(e) => {
            if (e.target.files) void handleFilesAdded(e.target.files);
            e.target.value = '';
          }}
          className="sr-only"
        />
      </div>

      {/* Multi-file Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDropActive(true);
        }}
        onDragLeave={() => setIsDropActive(false)}
        onDrop={handleDropZone}
        onClick={() => multiInputRef.current?.click()}
        className={`rounded-[12px] border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
          isDropActive
            ? 'border-[#6D1025] bg-[#FCECEF]'
            : 'border-[#C6A36A]/60 bg-[#FFF8F2] hover:border-[#6D1025]/60'
        }`}
      >
        <FileImage className="w-7 h-7 text-[#6D1025]/75 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-[#310916]">
          Drag &amp; drop photographs here, or click to select multiple files
        </p>
        <p className="text-xs text-[#490D20]/70 mt-1">
          Supports <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>, <code>.webp</code>,{' '}
          <code>.heic</code>, <code>.heif</code> from iPhone, Android, Windows, and Mac.
        </p>
        <p className="text-[11px] text-[#6D1025]/75 mt-2 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Browser previews are temporary. For permanent deployment, copy compatible photos into{' '}
          <code>public/memories/photos/</code> and redeploy.
        </p>
      </div>

      {/* Upload Queue & Validation Status */}
      {uploadQueue.length > 0 && (
        <div className="rounded-[12px] border border-[#C6A36A]/40 bg-[#FFF8F2] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#6D1025]">
              Recent Photo Uploads ({uploadQueue.length})
            </span>
            <button
              type="button"
              onClick={() => setUploadQueue([])}
              className="text-[11px] text-[#6D1025]/70 hover:text-[#6D1025] cursor-pointer"
            >
              Clear list
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="rounded-[8px] border border-[#6D1025]/12 bg-white px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#310916] truncate">
                    {item.fileName}{' '}
                    <span className="font-normal text-[#490D20]/60">
                      ({formatFileSize(item.fileSize)})
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-medium ${
                      item.status === 'error'
                        ? 'text-[#B52B45]'
                        : item.status === 'warning'
                          ? 'text-[#8A5A00]'
                          : 'text-[#6D1025]'
                    }`}
                  >
                    {item.stage}
                  </span>
                </div>
                {item.status === 'processing' && (
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F5EEE8] overflow-hidden">
                    <div
                      className="h-full bg-[#6D1025] transition-all duration-200"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.message && (
                  <p
                    className={`mt-1 text-[11px] leading-relaxed ${
                      item.status === 'error' ? 'text-[#B52B45]' : 'text-[#490D20]/80'
                    }`}
                  >
                    {item.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <EditorCard
        title="Photo Gallery Manager"
        description="Drag and drop to reorder frames. Select any photograph to edit its caption, visibility, and focal positioning."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Photo list */}
          <div className="lg:col-span-5 space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {photos.map((photo, idx) => {
              const isSelected = selectedPhoto?.id === photo.id;
              return (
                <div
                  key={photo.id}
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null) {
                      movePhoto(draggedIndex, idx);
                      setDraggedIndex(null);
                    }
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  onClick={() => setSelectedId(photo.id)}
                  className={`flex items-center gap-2.5 rounded-[10px] border p-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#6D1025] bg-[#FCECEF]/75'
                      : 'border-[#6D1025]/15 bg-white hover:border-[#6D1025]/40'
                  } ${!photo.visible ? 'opacity-55' : ''}`}
                >
                  <GripVertical
                    className="w-4 h-4 text-[#6D1025]/45 shrink-0 cursor-grab"
                    aria-hidden="true"
                  />
                  {photo.previewSupported !== false && photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="h-11 w-11 rounded-[6px] object-cover bg-[#F5EEE8] border border-[#6D1025]/15 shrink-0"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-[6px] bg-[#FCECEF] border border-[#B52B45]/30 flex items-center justify-center shrink-0 text-[#B52B45]">
                      <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6D1025]/75 tabular-nums truncate">
                      {photo.plateLabel}
                      {photo.fileSize ? ` · ${formatFileSize(photo.fileSize)}` : ''}
                      {!photo.visible && ' · Disabled'}
                    </p>
                    <p className="text-xs text-[#310916] truncate">
                      {photo.originalFileName ||
                        resolveTemplateText(photo.caption, draftConfig) ||
                        photo.src}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => movePhoto(idx, idx - 1)}
                      disabled={idx === 0}
                      aria-label="Move photo up"
                      className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(idx, idx + 1)}
                      disabled={idx === photos.length - 1}
                      aria-label="Move photo down"
                      className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePhoto(photo.id, { visible: !photo.visible })}
                      aria-label={photo.visible ? 'Disable photo' : 'Enable photo'}
                      className="p-1.5 rounded text-[#6D1025]/70 hover:bg-white cursor-pointer"
                    >
                      {photo.visible ? (
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      aria-label={`Remove ${photo.plateLabel}`}
                      className="p-1.5 rounded text-[#B52B45] hover:bg-white cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected photo editor & interactive frame positioning */}
          <div className="lg:col-span-7">
            {selectedPhoto ? (
              <div className="rounded-[12px] border border-[#C6A36A]/40 bg-white p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#6D1025]/10">
                  <div>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#6D1025] font-medium">
                      Editing {selectedPhoto.plateLabel}
                    </span>
                    {selectedPhoto.originalFileName && (
                      <p className="text-[11px] text-[#490D20]/65 mt-0.5">
                        File: {selectedPhoto.originalFileName}
                        {selectedPhoto.fileSize
                          ? ` (${formatFileSize(selectedPhoto.fileSize)})`
                          : ''}
                      </p>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs text-[#310916] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPhoto.visible}
                      onChange={(e) =>
                        updatePhoto(selectedPhoto.id, { visible: e.target.checked })
                      }
                      className="rounded border-[#6D1025]/30 accent-[#6D1025]"
                    />
                    Enabled in gallery
                  </label>
                </div>

                {selectedPhoto.compatibilityNote && (
                  <div className="rounded-[8px] border border-[#C6A36A]/60 bg-[#FCECEF]/55 p-3 text-xs text-[#490D20] flex items-start justify-between gap-2">
                    <span className="leading-relaxed">{selectedPhoto.compatibilityNote}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updatePhoto(selectedPhoto.id, { compatibilityNote: undefined })
                      }
                      aria-label="Dismiss note"
                      className="p-1 rounded hover:bg-white/60 shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Plate Label" htmlFor="photo-plate" />
                    <input
                      id="photo-plate"
                      type="text"
                      value={selectedPhoto.plateLabel}
                      onChange={(e) =>
                        updatePhoto(selectedPhoto.id, { plateLabel: e.target.value })
                      }
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <FieldLabel label="Optional Subcaption" htmlFor="photo-subcaption" />
                    <input
                      id="photo-subcaption"
                      type="text"
                      value={selectedPhoto.subcaption ?? ''}
                      onChange={(e) =>
                        updatePhoto(selectedPhoto.id, { subcaption: e.target.value })
                      }
                      placeholder="e.g. November 2025"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel label="Photo Caption" htmlFor="photo-caption" />
                  <input
                    id="photo-caption"
                    type="text"
                    value={selectedPhoto.caption}
                    onChange={(e) =>
                      updatePhoto(selectedPhoto.id, { caption: e.target.value })
                    }
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-7">
                    <FieldLabel
                      label="Image Path"
                      hint="/memories/photos/..."
                      htmlFor="photo-src"
                    />
                    <input
                      id="photo-src"
                      type="text"
                      value={selectedPhoto.src}
                      onChange={(e) =>
                        updatePhoto(selectedPhoto.id, {
                          src: e.target.value,
                          previewSupported: true,
                        })
                      }
                      className={inputClassName}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className={`${buttonSecondaryClass} w-full`}>
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Replace (Temp Preview)</span>
                      <input
                        type="file"
                        accept={PHOTO_ACCEPT_ATTRIBUTE}
                        onChange={(e) => void handleReplaceFile(selectedPhoto.id, e)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#6D1025]/10">
                  <ImagePositionEditor
                    imageSrc={selectedPhoto.src}
                    position={selectedPhoto.position}
                    aspectRatio="4 / 5"
                    label="Drag inside frame to adjust focal point"
                    onChange={(position) => updatePhoto(selectedPhoto.id, { position })}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-dashed border-[#6D1025]/25 p-8 text-center text-sm text-[#490D20]/70">
                Select a photograph from the list to edit and position it.
              </div>
            )}
          </div>
        </div>
      </EditorCard>
    </div>
  );
}
