import { useState } from 'react';
import { Maximize2, Monitor, Smartphone, X } from 'lucide-react';
import { useWebsiteConfig } from '../../context/ConfigContext';
import { PublicWebsite } from '../PublicWebsite';
import { EditorCard } from './EditorPrimitives';

export function LivePreview() {
  const { draftConfig, isDirty } = useWebsiteConfig();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="space-y-4">
      <EditorCard
        title="Live Website Preview"
        description="Preview your current editor changes in mobile, desktop, or full-screen mode."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
                isDirty
                  ? 'bg-[#FCECEF] text-[#B52B45] border border-[#B52B45]/30'
                  : 'bg-[#F5EEE8] text-[#6D1025] border border-[#C6A36A]/40'
              }`}
            >
              {isDirty ? 'Unsaved Draft Changes' : 'All Changes Saved'}
            </span>

            <div className="inline-flex rounded-[8px] border border-[#6D1025]/20 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-[#6D1025] text-[#FFF8F2]'
                    : 'text-[#6D1025] hover:bg-[#FCECEF]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-[#6D1025] text-[#FFF8F2]'
                    : 'text-[#6D1025] hover:bg-[#FCECEF]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                Desktop
              </button>
            </div>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#6D1025]/25 bg-white px-3 py-1.5 text-xs font-medium text-[#6D1025] hover:bg-[#FCECEF] cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              Full Preview
            </button>
          </div>
        }
      >
        <div className="rounded-[12px] border border-[#6D1025]/15 bg-[#310916]/5 p-3 sm:p-5 flex justify-center">
          <div
            className={`bg-[#FFF8F2] border border-[#C6A36A]/45 rounded-[12px] shadow-xl overflow-y-auto overflow-x-hidden transition-all duration-300 ${
              viewport === 'mobile'
                ? 'w-[390px] max-w-full h-[720px]'
                : 'w-full h-[720px]'
            }`}
          >
            <PublicWebsite config={draftConfig} previewMode />
          </div>
        </div>
      </EditorCard>

      {fullscreen && (
        <div className="fixed inset-0 z-[120] bg-[#1F050D]/95 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 bg-[#310916] text-[#FFF8F2] border-b border-[#C6A36A]/30">
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-display)] text-lg">
                Full Website Preview
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#F7DDE2]/80">
                {isDirty ? 'Showing Unsaved Draft' : 'Saved Configuration'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FFF8F2]/25 px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] hover:bg-[#6D1025] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Close Preview
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#FFF8F2]">
            <PublicWebsite config={draftConfig} previewMode />
          </div>
        </div>
      )}
    </div>
  );
}
