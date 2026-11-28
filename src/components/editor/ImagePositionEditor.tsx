import { useRef, useState, type PointerEvent } from 'react';
import { Move, RotateCcw, ZoomIn } from 'lucide-react';
import {
  DEFAULT_IMAGE_POSITION,
  type ImagePosition,
} from '../../config/anniversary';
import { getPositionedImageStyle } from '../../utils/imageStyle';

interface ImagePositionEditorProps {
  imageSrc: string;
  position: ImagePosition;
  onChange: (next: ImagePosition) => void;
  aspectRatio?: string;
  overlayDarkness?: number;
  label?: string;
  emptyFallbackText?: string;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function ImagePositionEditor({
  imageSrc,
  position,
  onChange,
  aspectRatio = '4 / 3',
  overlayDarkness = 0,
  label = 'Drag image to reposition',
  emptyFallbackText = 'Preview unavailable for this path',
}: ImagePositionEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    // Dragging image right moves focal point left (natural pan feel)
    const sensitivity = 100 / Math.max(1, position.zoom * 0.85);
    const nextX = clamp(
      Math.round((dragStartRef.current.startX - (dx / rect.width) * sensitivity) * 10) / 10,
      0,
      100,
    );
    const nextY = clamp(
      Math.round((dragStartRef.current.startY - (dy / rect.height) * sensitivity) * 10) / 10,
      0,
      100,
    );

    onChange({
      ...position,
      x: nextX,
      y: nextY,
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if not captured
      }
      dragStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_IMAGE_POSITION });
  };

  const imageStyle = getPositionedImageStyle(position);
  const overlayAlpha = clamp(overlayDarkness, 0, 100) / 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-xs text-[#490D20]/80">
        <span className="inline-flex items-center gap-1.5 font-medium text-[#6D1025]">
          <Move className="w-3.5 h-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className="tabular-nums text-[11px] text-[#490D20]/70">
          X: {position.x.toFixed(0)}% · Y: {position.y.toFixed(0)}% · {position.zoom.toFixed(2)}×
        </span>
      </div>

      {/* Interactive draggable frame */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ aspectRatio }}
        className={`relative w-full overflow-hidden rounded-[10px] border-2 ${
          isDragging ? 'border-[#6D1025]' : 'border-[#C6A36A]/50'
        } bg-[#310916]/10 select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {!hasError && imageSrc ? (
          <img
            src={imageSrc}
            alt="Reposition preview"
            draggable={false}
            onLoad={() => setHasError(false)}
            onError={() => setHasError(true)}
            style={imageStyle}
            className="h-full w-full object-cover pointer-events-none"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center surface-ivory-album text-xs text-[#490D20]/70">
            <span>{emptyFallbackText}</span>
            <span className="mt-1 text-[11px] opacity-70">{imageSrc}</span>
          </div>
        )}

        {overlayDarkness > 0 && (
          <div
            aria-hidden="true"
            style={{ opacity: overlayAlpha }}
            className="absolute inset-0 bg-gradient-to-t from-[#310916] via-[#490D20]/70 to-[#310916]/30 pointer-events-none"
          />
        )}

        {/* Focal crosshair indicator */}
        <div
          aria-hidden="true"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="h-5 w-5 rounded-full border-2 border-[#FFF8F2] bg-[#6D1025]/60 shadow" />
        </div>
      </div>

      {/* Sliders & Reset */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div>
          <label className="flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#6D1025] mb-1">
            <span>Horizontal (X)</span>
            <span className="tabular-nums">{position.x.toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={position.x}
            onChange={(e) => onChange({ ...position, x: Number(e.target.value) })}
            className="w-full accent-[#6D1025] cursor-pointer"
          />
        </div>

        <div>
          <label className="flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#6D1025] mb-1">
            <span>Vertical (Y)</span>
            <span className="tabular-nums">{position.y.toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={position.y}
            onChange={(e) => onChange({ ...position, y: Number(e.target.value) })}
            className="w-full accent-[#6D1025] cursor-pointer"
          />
        </div>

        <div>
          <label className="flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#6D1025] mb-1">
            <span className="inline-flex items-center gap-1">
              <ZoomIn className="w-3 h-3" aria-hidden="true" />
              Zoom
            </span>
            <span className="tabular-nums">{position.zoom.toFixed(2)}×</span>
          </label>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.05}
            value={position.zoom}
            onChange={(e) => onChange({ ...position, zoom: Number(e.target.value) })}
            className="w-full accent-[#6D1025] cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#6D1025]/20 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6D1025] hover:bg-[#FCECEF] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          Reset Position
        </button>
      </div>
    </div>
  );
}
