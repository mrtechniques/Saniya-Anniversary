import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Film,
  GripVertical,
  Info,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import type { VideoMemory } from '../../config/anniversary';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  formatFileSize,
  getLocalVideoConversionCommand,
  processVideoFile,
  validateMediaFile,
  VIDEO_ACCEPT_ATTRIBUTE,
} from '../../utils/mediaSupport';
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  EditorCard,
  FieldLabel,
  inputClassName,
} from './EditorPrimitives';

interface VideoQueueItem {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  stage: string;
  status: 'processing' | 'ready' | 'warning' | 'error';
  message?: string;
}

export function VideoManager() {
  const { draftConfig, updateDraft } = useWebsiteConfig();
  const { videos } = draftConfig;

  const multiInputRef = useRef<HTMLInputElement | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<VideoQueueItem[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const enabledCount = videos.filter((v) => v.visible && v.src.trim()).length;

  const updateVideo = (id: number, patch: Partial<VideoMemory>) => {
    updateDraft((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  };

  const updateQueueItem = (id: string, patch: Partial<VideoQueueItem>) => {
    setUploadQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleFilesAdded = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const existingNames = new Set(
      videos
        .map((v) => v.originalFileName?.toLowerCase() ?? v.src.split('/').pop()?.toLowerCase() ?? '')
        .filter(Boolean),
    );

    let nextIdCounter = videos.reduce((max, v) => Math.max(max, v.id), 0) + 1;

    for (const file of files) {
      const queueId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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

      const validation = await validateMediaFile(file, 'video', existingNames);
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

      const processed = await processVideoFile(file, (percent, stage) => {
        updateQueueItem(queueId, { progress: percent, stage });
      });

      const assignedId = nextIdCounter++;
      const newVideo: VideoMemory = {
        id: assignedId,
        src: processed.previewUrl,
        reelLabel: `Reel ${String(assignedId).padStart(2, '0')}`,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
        caption: 'A cherished moment in motion.',
        visible: true,
        originalFileName: processed.originalFileName,
        fileSize: processed.fileSize,
        mimeType: processed.mimeType,
        compatibilityNote: processed.compatibilityNote ?? validation.warning,
        previewSupported: processed.previewSupported,
      };

      updateDraft((prev) => ({
        ...prev,
        videos: [...prev.videos, newVideo],
      }));

      const hasWarning = Boolean(
        processed.compatibilityNote || validation.warning || !processed.previewSupported,
      );
      updateQueueItem(queueId, {
        progress: 100,
        stage: processed.previewSupported ? 'Ready' : 'Compatibility Warning',
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

  const handleAddVideoPath = () => {
    const maxId = videos.reduce((max, v) => Math.max(max, v.id), 0);
    const nextId = maxId + 1;
    const newVideo: VideoMemory = {
      id: nextId,
      src: `/memories/videos/${nextId}.mp4`,
      reelLabel: `Reel ${String(nextId).padStart(2, '0')}`,
      title: `In Motion — Reel ${nextId}`,
      caption: 'A cherished moment in motion.',
      visible: true,
      previewSupported: true,
    };
    updateDraft((prev) => ({
      ...prev,
      videos: [...prev.videos, newVideo],
    }));
  };

  const handleRemoveVideo = (id: number) => {
    updateDraft((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== id),
    }));
  };

  const moveVideo = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= videos.length || fromIndex === toIndex) return;
    updateDraft((prev) => {
      const copy = [...prev.videos];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return { ...prev, videos: copy };
    });
  };

  const handleReplaceVideo = async (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const queueId = `replace-vid-${Date.now()}`;
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

    const validation = await validateMediaFile(file, 'video', new Set());
    if (!validation.valid) {
      updateQueueItem(queueId, {
        progress: 100,
        stage: 'Rejected',
        status: 'error',
        message: validation.error,
      });
      return;
    }

    const processed = await processVideoFile(file, (percent, stage) => {
      updateQueueItem(queueId, { progress: percent, stage });
    });

    updateVideo(id, {
      src: processed.previewUrl,
      originalFileName: processed.originalFileName,
      fileSize: processed.fileSize,
      mimeType: processed.mimeType,
      compatibilityNote: processed.compatibilityNote,
      previewSupported: processed.previewSupported,
    });

    updateQueueItem(queueId, {
      progress: 100,
      stage: processed.previewSupported ? 'Replaced' : 'Compatibility Warning',
      status: processed.compatibilityNote ? 'warning' : 'ready',
      message: processed.compatibilityNote,
    });
  };

  const handleCopyCommand = async (id: number, filename: string) => {
    const cmd = getLocalVideoConversionCommand(filename);
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2500);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[12px] border border-[#C6A36A]/45 bg-[#FFF8F2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#6D1025] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[#310916]">
              Videos are completely optional ({enabledCount} active)
            </p>
            <p className="text-xs text-[#490D20]/75 mt-0.5">
              {enabledCount === 0
                ? 'With 0 active videos, the entire video section is automatically hidden on the homepage with no empty frames or extra spacing.'
                : 'MP4 (H.264 + AAC) is recommended for universal playback. Incompatible containers show a warning without a broken player.'}
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
            Upload Videos
          </button>
          <button type="button" onClick={handleAddVideoPath} className={buttonSecondaryClass}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Path
          </button>
        </div>

        <input
          ref={multiInputRef}
          type="file"
          multiple
          accept={VIDEO_ACCEPT_ATTRIBUTE}
          onChange={(e) => {
            if (e.target.files) void handleFilesAdded(e.target.files);
            e.target.value = '';
          }}
          className="sr-only"
        />
      </div>

      {/* Multi-file Drag & Drop Zone */}
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
        <Film className="w-7 h-7 text-[#6D1025]/75 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-[#310916]">
          Drag &amp; drop videos here, or click to select multiple files
        </p>
        <p className="text-xs text-[#490D20]/70 mt-1">
          Accepts <code>.mp4</code>, <code>.mov</code>, <code>.mkv</code>, <code>.webm</code>,{' '}
          <code>.m4v</code>, <code>.avi</code>. Preferred web format: MP4 (H.264 + AAC).
        </p>
        <p className="text-[11px] text-[#6D1025]/75 mt-2">
          For permanent deployment, copy compatible <code>.mp4</code> videos into{' '}
          <code>public/memories/videos/</code> and redeploy.
        </p>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="rounded-[12px] border border-[#C6A36A]/40 bg-[#FFF8F2] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#6D1025]">
              Recent Video Uploads ({uploadQueue.length})
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
        title="Video Gallery"
        description="Add, remove, reorder, or disable video reels. Drag and drop cards to change their order."
      >
        {videos.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#6D1025]/25 p-8 text-center">
            <Film className="w-7 h-7 text-[#6D1025]/50 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-[#310916] font-medium">No videos configured</p>
            <p className="text-xs text-[#490D20]/70 mt-1">
              The video section will be cleanly hidden on the public website.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, idx) => {
              const displayFilename =
                video.originalFileName || video.src.split('/').pop() || `video-${video.id}.mkv`;
              const isCompatible = video.previewSupported !== false && Boolean(video.src);

              return (
                <div
                  key={video.id}
                  draggable
                  onDragStart={() => setDraggedIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null) {
                      moveVideo(draggedIndex, idx);
                      setDraggedIndex(null);
                    }
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={`rounded-[10px] border border-[#6D1025]/18 bg-white p-4 space-y-3 ${
                    !video.visible ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#6D1025]/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical
                        className="w-4 h-4 text-[#6D1025]/45 cursor-grab shrink-0"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#6D1025] block">
                          {video.reelLabel}
                        </span>
                        {video.originalFileName && (
                          <span className="text-[11px] text-[#490D20]/65 truncate block">
                            {video.originalFileName}
                            {video.fileSize ? ` · ${formatFileSize(video.fileSize)}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveVideo(idx, idx - 1)}
                        disabled={idx === 0}
                        aria-label="Move video up"
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-[#FCECEF] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveVideo(idx, idx + 1)}
                        disabled={idx === videos.length - 1}
                        aria-label="Move video down"
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-[#FCECEF] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateVideo(video.id, { visible: !video.visible })}
                        aria-label={video.visible ? 'Disable video' : 'Enable video'}
                        className="p-1.5 rounded text-[#6D1025]/70 hover:bg-[#FCECEF] cursor-pointer"
                      >
                        {video.visible ? (
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(video.id)}
                        aria-label={`Remove ${video.reelLabel}`}
                        className="p-1.5 rounded text-[#B52B45] hover:bg-[#FCECEF] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Video preview or compatibility warning (never render a broken player) */}
                  {isCompatible ? (
                    <div className="rounded-[8px] overflow-hidden bg-[#220610] aspect-video border border-[#6D1025]/15">
                      <video
                        src={video.src}
                        muted
                        playsInline
                        controls
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-[8px] border border-[#B52B45]/35 bg-[#FCECEF] p-3.5 space-y-2 text-xs text-[#6D1025]">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-semibold">Browser Preview Unsupported</p>
                          <p className="text-[11px] text-[#490D20]/85 mt-0.5 leading-relaxed">
                            {video.compatibilityNote ||
                              'This video container/codec cannot play directly in this browser.'}
                          </p>
                        </div>
                      </div>
                      <div className="rounded bg-white/85 border border-[#6D1025]/15 p-2 font-mono text-[10px] text-[#310916] break-all">
                        {getLocalVideoConversionCommand(displayFilename)}
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleCopyCommand(video.id, displayFilename)}
                        className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#6D1025] px-2.5 py-1.5 text-[11px] font-medium text-[#FFF8F2] hover:bg-[#490D20] cursor-pointer"
                      >
                        {copiedId === video.id ? (
                          <>
                            <Check className="w-3 h-3" aria-hidden="true" />
                            Copied Local FFmpeg Command
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" aria-hidden="true" />
                            Copy Local FFmpeg Command (H.264/AAC)
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isCompatible && video.compatibilityNote && (
                    <div className="rounded-[8px] border border-[#C6A36A]/50 bg-[#FCECEF]/50 p-2.5 text-[11px] text-[#490D20] leading-relaxed">
                      {video.compatibilityNote}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel label="Reel Label" />
                      <input
                        type="text"
                        value={video.reelLabel}
                        onChange={(e) =>
                          updateVideo(video.id, { reelLabel: e.target.value })
                        }
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <FieldLabel label="Title" />
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel label="Caption" />
                    <input
                      type="text"
                      value={video.caption}
                      onChange={(e) => updateVideo(video.id, { caption: e.target.value })}
                      className={inputClassName}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-7">
                      <FieldLabel label="Video Path (.mp4)" />
                      <input
                        type="text"
                        value={video.src}
                        onChange={(e) =>
                          updateVideo(video.id, {
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
                        <span>Replace Video</span>
                        <input
                          type="file"
                          accept={VIDEO_ACCEPT_ATTRIBUTE}
                          onChange={(e) => void handleReplaceVideo(video.id, e)}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </EditorCard>
    </div>
  );
}
