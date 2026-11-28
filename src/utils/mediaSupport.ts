export const ACCEPTED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'] as const;
export const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.mkv', '.webm', '.m4v', '.avi'] as const;

export const PHOTO_ACCEPT_ATTRIBUTE =
  '.jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif';

export const VIDEO_ACCEPT_ATTRIBUTE =
  '.mp4,.mov,.mkv,.webm,.m4v,.avi,video/mp4,video/quicktime,video/x-matroska,video/webm,video/x-m4v,video/x-msvideo,video/avi';

const PHOTO_MIME_ALLOWLIST = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
]);

const VIDEO_MIME_ALLOWLIST = new Set([
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/webm',
  'video/x-m4v',
  'video/mp4v-es',
  'video/x-msvideo',
  'video/avi',
  'video/msvideo',
]);

const MAX_PHOTO_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_VIDEO_BYTES = 1024 * 1024 * 1024; // 1 GB

export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx < 0) return '';
  return filename.slice(idx).toLowerCase();
}

export function formatFileSize(bytes?: number): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

export function getFileSignature(file: File): string {
  return `${file.name.toLowerCase()}::${file.size}::${file.lastModified}`;
}

export interface FileValidationResult {
  valid: boolean;
  extension: string;
  error?: string;
  warning?: string;
}

async function verifyFileReadable(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, Math.min(32, file.size));
    const buffer = await slice.arrayBuffer();
    return buffer.byteLength > 0;
  } catch {
    return false;
  }
}

export async function validateMediaFile(
  file: File,
  kind: 'photo' | 'video',
  existingNames: Set<string>,
): Promise<FileValidationResult> {
  const ext = getFileExtension(file.name);
  const allowedExts: readonly string[] =
    kind === 'photo' ? ACCEPTED_PHOTO_EXTENSIONS : ACCEPTED_VIDEO_EXTENSIONS;

  if (!allowedExts.includes(ext)) {
    return {
      valid: false,
      extension: ext,
      error: `Unsupported ${kind} format "${ext || 'unknown'}". Accepted: ${allowedExts.join(', ')}.`,
    };
  }

  const mime = (file.type || '').toLowerCase();
  if (mime) {
    const mimeSet = kind === 'photo' ? PHOTO_MIME_ALLOWLIST : VIDEO_MIME_ALLOWLIST;
    const isGenericOctet = mime === 'application/octet-stream';
    if (!mimeSet.has(mime) && !isGenericOctet) {
      return {
        valid: false,
        extension: ext,
        error: `MIME type "${mime}" does not match a supported ${kind} format.`,
      };
    }
  }

  if (file.size <= 0) {
    return {
      valid: false,
      extension: ext,
      error: 'File appears to be empty (0 bytes).',
    };
  }

  const maxBytes = kind === 'photo' ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    return {
      valid: false,
      extension: ext,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed is ${formatFileSize(maxBytes)}.`,
    };
  }

  const readable = await verifyFileReadable(file);
  if (!readable) {
    return {
      valid: false,
      extension: ext,
      error: 'Could not read file bytes from disk. Check file permissions or try copying it again.',
    };
  }

  const warning = existingNames.has(file.name.toLowerCase())
    ? `A file named "${file.name}" is already in your list (duplicate filename).`
    : undefined;

  return { valid: true, extension: ext, warning };
}

export interface ProcessedPhotoResult {
  previewUrl: string;
  previewSupported: boolean;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  compatibilityNote?: string;
}

async function tryConvertHeicWithBrowser(file: File): Promise<string | null> {
  // Attempt 1: createImageBitmap (respects EXIF orientation in modern browsers with HEIF support)
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.94),
        );
        if (blob) {
          return URL.createObjectURL(blob);
        }
      } else {
        bitmap.close();
      }
    } catch {
      // Browser cannot natively decode HEIC via createImageBitmap
    }
  }

  // Attempt 2: Native <img> decode (e.g. Safari)
  const rawUrl = URL.createObjectURL(file);
  try {
    const loaded = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = rawUrl;
    });
    if (loaded) {
      return rawUrl;
    }
  } catch {
    // Ignore
  }
  URL.revokeObjectURL(rawUrl);
  return null;
}

export async function processPhotoFile(
  file: File,
  onProgress?: (percent: number, stage: string) => void,
): Promise<ProcessedPhotoResult> {
  const ext = getFileExtension(file.name);
  const isHeic = ext === '.heic' || ext === '.heif';

  onProgress?.(25, isHeic ? 'Checking HEIC/HEIF decoder...' : 'Reading photograph...');

  if (isHeic) {
    onProgress?.(55, 'Converting HEIC/HEIF for browser preview...');
    const convertedUrl = await tryConvertHeicWithBrowser(file);
    if (convertedUrl) {
      onProgress?.(100, 'Ready');
      return {
        previewUrl: convertedUrl,
        previewSupported: true,
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'image/heic',
        compatibilityNote:
          'HEIC/HEIF decoded for browser preview. For universal browser support when deploying, convert to .jpg/.webp before copying into public/memories/photos/.',
      };
    }

    onProgress?.(100, 'Conversion needed');
    return {
      previewUrl: '',
      previewSupported: false,
      originalFileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'image/heic',
      compatibilityNote: `This browser cannot natively decode ${ext.toUpperCase()} files without an OS codec. Convert "${file.name}" to JPEG/WebP locally (e.g. iPhone "Most Compatible", macOS Preview, or: ffmpeg -i "${file.name}" -q:v 2 "${file.name.replace(/\.(heic|heif)$/i, '.jpg')}") before deploying.`,
    };
  }

  const objectUrl = URL.createObjectURL(file);
  onProgress?.(70, 'Verifying image dimensions...');
  const canLoad = await new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = objectUrl;
  });

  onProgress?.(100, canLoad ? 'Ready' : 'Preview unavailable');

  if (!canLoad) {
    URL.revokeObjectURL(objectUrl);
    return {
      previewUrl: '',
      previewSupported: false,
      originalFileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'image/jpeg',
      compatibilityNote: `Could not decode "${file.name}". The file may be corrupted or use an unsupported sub-format.`,
    };
  }

  return {
    previewUrl: objectUrl,
    previewSupported: true,
    originalFileName: file.name,
    fileSize: file.size,
    mimeType: file.type || `image/${ext.replace('.', '')}`,
  };
}

export interface ProcessedVideoResult {
  previewUrl: string;
  previewSupported: boolean;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  compatibilityNote?: string;
}

export function getLocalVideoConversionCommand(filename: string): string {
  const outputName = filename.replace(/\.[^.]+$/, '') + '.mp4';
  return `ffmpeg -i "${filename}" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "${outputName}"`;
}

async function probeVideoPlayability(url: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const video = document.createElement('video');
    let settled = false;

    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      video.removeAttribute('src');
      video.load();
      resolve(result);
    };

    const timer = window.setTimeout(() => finish(false), 3500);

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      finish(video.videoWidth > 0 && video.videoHeight > 0);
    };
    video.onerror = () => {
      window.clearTimeout(timer);
      finish(false);
    };
    video.src = url;
  });
}

export async function processVideoFile(
  file: File,
  onProgress?: (percent: number, stage: string) => void,
): Promise<ProcessedVideoResult> {
  const ext = getFileExtension(file.name);
  onProgress?.(30, 'Checking browser codec support...');

  const probe = document.createElement('video');
  const mimeGuess =
    file.type ||
    (ext === '.mp4' || ext === '.m4v'
      ? 'video/mp4'
      : ext === '.webm'
        ? 'video/webm'
        : ext === '.mov'
          ? 'video/quicktime'
          : ext === '.mkv'
            ? 'video/x-matroska'
            : 'video/x-msvideo');

  const canPlayHint = probe.canPlayType(mimeGuess);
  const objectUrl = URL.createObjectURL(file);

  onProgress?.(65, 'Probing video metadata...');
  const metadataPlayable = await probeVideoPlayability(objectUrl);

  // MKV and AVI should never be assumed to play reliably across browsers even if one browser partially opens them
  const isUnreliableContainer = ext === '.mkv' || ext === '.avi';

  if (!metadataPlayable) {
    URL.revokeObjectURL(objectUrl);
    onProgress?.(100, 'Incompatible codec/container');
    return {
      previewUrl: '',
      previewSupported: false,
      originalFileName: file.name,
      fileSize: file.size,
      mimeType: mimeGuess,
      compatibilityNote: `${ext.toUpperCase()} (${canPlayHint || 'codec unsupported'}) cannot be played directly in this browser. Convert to MP4 (H.264 + AAC) locally before deploying.`,
    };
  }

  onProgress?.(100, isUnreliableContainer ? 'Limited browser support' : 'Ready');

  return {
    previewUrl: objectUrl,
    previewSupported: true,
    originalFileName: file.name,
    fileSize: file.size,
    mimeType: mimeGuess,
    compatibilityNote: isUnreliableContainer
      ? `${ext.toUpperCase()} plays in this browser, but many browsers (especially Safari/iOS) do not support ${ext.toUpperCase()}. Converting to MP4 (H.264 + AAC) is recommended.`
      : ext === '.mov'
        ? 'MOV previewed using browser codecs. For maximum compatibility across Android & Windows, MP4 (H.264 + AAC) is recommended.'
        : undefined,
  };
}
