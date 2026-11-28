import type { CSSProperties } from 'react';
import type { ImagePosition } from '../config/anniversary';

/**
 * Produces identical CSS positioning for ImagePositionEditor, AnniversaryHero, and PhotoFrame.
 */
export function getPositionedImageStyle(position?: ImagePosition): CSSProperties {
  const x = position?.x ?? 50;
  const y = position?.y ?? 50;
  const zoom = position?.zoom ?? 1;

  return {
    objectPosition: `${x}% ${y}%`,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    transformOrigin: `${x}% ${y}%`,
  };
}
