import { useRef, useState, type ChangeEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react';
import {
  getValidVisiblePhotos,
  MINIMUM_PUBLISH_PHOTOS,
  validateImportedConfig,
  validatePublishConfig,
  type WebsiteConfig,
} from '../../config/anniversary';
import { formatReadableDate } from '../../config/dateUtils';
import { useWebsiteConfig } from '../../context/ConfigContext';
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  EditorCard,
} from './EditorPrimitives';

interface ConfigurationManagerProps {
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export function ConfigurationManager({ onNotify }: ConfigurationManagerProps) {
  const {
    draftConfig,
    isDirty,
    saveDraft,
    discardDraftChanges,
    resetToDefaults,
    applyImportedConfig,
    exportConfigJson,
  } = useWebsiteConfig();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingImport, setPendingImport] = useState<WebsiteConfig | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const publishValidation = validatePublishConfig(draftConfig);
  const validPhotoCount = getValidVisiblePhotos(draftConfig).length;

  const handleSaveDraft = () => {
    const ok = saveDraft();
    if (ok) {
      onNotify('success', 'Draft saved to browser localStorage.');
    } else {
      onNotify('error', 'Could not save to localStorage (storage quota or private mode).');
    }
  };

  const downloadJson = (filename: string) => {
    const json = exportConfigJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportDraft = () => {
    downloadJson('anniversary-config-draft.json');
    onNotify('success', 'Configuration exported as JSON.');
  };

  const handleExportPublishReady = () => {
    if (!publishValidation.valid) {
      onNotify('error', publishValidation.errors[0] ?? 'Validation failed.');
      return;
    }
    saveDraft();
    downloadJson('anniversary-config-publish.json');
    onNotify('success', 'Publish-ready configuration saved and exported!');
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setImportError(null);
    setPendingImport(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        const parsed = JSON.parse(text) as unknown;
        const validation = validateImportedConfig(parsed);
        if (!validation.valid || !validation.config) {
          setImportError(validation.error ?? 'Invalid configuration structure.');
          onNotify('error', validation.error ?? 'Invalid configuration structure.');
          return;
        }
        setPendingImport(validation.config);
      } catch {
        const msg = 'Invalid JSON file. Please select a valid exported configuration.';
        setImportError(msg);
        onNotify('error', msg);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    applyImportedConfig(pendingImport, true);
    setPendingImport(null);
    setImportError(null);
    onNotify('success', 'Imported configuration applied and saved.');
  };

  const handleResetAll = () => {
    resetToDefaults();
    setConfirmReset(false);
    onNotify('success', 'Website configuration reset to original defaults.');
  };

  return (
    <div className="space-y-6">
      {/* Publish Readiness & Save */}
      <EditorCard
        title="Save & Publish Readiness"
        description="Save drafts anytime in your browser. Publishing requires at least 8 valid photographs and all required couple details."
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#C6A36A]/40 bg-[#FCECEF]/45 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#6D1025] font-medium">
                Gallery Photo Requirement
              </p>
              <p className="text-sm font-medium text-[#310916] mt-0.5 tabular-nums">
                {validPhotoCount} / {MINIMUM_PUBLISH_PHOTOS} minimum photographs
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                publishValidation.valid
                  ? 'bg-white text-[#6D1025] border border-[#C6A36A]/45'
                  : 'bg-[#6D1025] text-[#FFF8F2]'
              }`}
            >
              {publishValidation.valid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Ready to Publish
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  Needs Attention
                </>
              )}
            </span>
          </div>

          {!publishValidation.valid && (
            <div className="rounded-[10px] border border-[#B52B45]/35 bg-[#FCECEF] p-4 space-y-1.5 text-xs text-[#6D1025]">
              <p className="font-semibold uppercase tracking-[0.12em]">
                Fix before publishing:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {publishValidation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSaveDraft} className={buttonPrimaryClass}>
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              Save Draft
            </button>

            <button
              type="button"
              disabled={!publishValidation.valid}
              onClick={handleExportPublishReady}
              className={buttonPrimaryClass}
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Publish &amp; Export JSON
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  discardDraftChanges();
                  onNotify('success', 'Reverted unsaved draft changes.');
                }}
                className={buttonSecondaryClass}
              >
                Discard Unsaved Changes
              </button>
            )}
          </div>

          <div className="rounded-[8px] border border-[#6D1025]/15 bg-white p-4 text-xs text-[#490D20]/85 space-y-2 leading-relaxed">
            <p className="font-medium text-[#6D1025] flex items-center gap-1.5">
              <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
              How Frontend-Only Persistence &amp; Deployment Works
            </p>
            <p>
              <strong>Local Browser Storage:</strong> Saving a draft stores your changes in{' '}
              <code>localStorage</code> on <strong>this browser and device only</strong>. Changes
              do not automatically synchronize between different devices.
            </p>
            <p>
              <strong>Updating the Public Website:</strong> Because there is no backend or
              database, permanently updating the deployed website for everyone requires exporting
              your JSON configuration, updating the project&apos;s media/config files (e.g.
              copying new photos into <code>public/memories/photos/</code>), and redeploying.
            </p>
          </div>
        </div>
      </EditorCard>

      {/* Export / Import */}
      <EditorCard
        title="Export & Import Configuration"
        description="Download your complete website settings as JSON or restore from a previously exported file."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExportDraft} className={buttonSecondaryClass}>
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Export Settings (JSON)
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={buttonSecondaryClass}
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              Import Settings (JSON)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </div>

          {importError && (
            <div className="rounded-[8px] border border-[#B52B45]/40 bg-[#FCECEF] p-3 text-xs text-[#6D1025]">
              {importError}
            </div>
          )}

          {pendingImport && (
            <div className="rounded-[10px] border border-[#C6A36A] bg-white p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D1025]">
                Preview Imported Configuration
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#310916]">
                <div>
                  <span className="block text-[#490D20]/60">Couple</span>
                  <strong>
                    {pendingImport.couple.groomName} &amp; {pendingImport.couple.brideName}
                  </strong>
                </div>
                <div>
                  <span className="block text-[#490D20]/60">Wedding Date</span>
                  <strong>{formatReadableDate(pendingImport.couple.weddingDate)}</strong>
                </div>
                <div>
                  <span className="block text-[#490D20]/60">Stories / Photos</span>
                  <strong>
                    {pendingImport.stories.length} stories · {pendingImport.photos.length} photos
                  </strong>
                </div>
                <div>
                  <span className="block text-[#490D20]/60">Videos</span>
                  <strong>{pendingImport.videos.length} videos</strong>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className={buttonPrimaryClass}
                >
                  Confirm &amp; Replace Settings
                </button>
                <button
                  type="button"
                  onClick={() => setPendingImport(null)}
                  className={buttonSecondaryClass}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </EditorCard>

      {/* Reset to Defaults */}
      <EditorCard
        title="Reset to Defaults"
        description="Restore the original Arshad & Saniya anniversary configuration."
      >
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className={buttonSecondaryClass}
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset to Defaults
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#6D1025] font-medium">
              Are you sure? This will overwrite your saved customizations on this browser.
            </span>
            <button type="button" onClick={handleResetAll} className={buttonPrimaryClass}>
              Yes, Reset Everything
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className={buttonSecondaryClass}
            >
              Cancel
            </button>
          </div>
        )}
      </EditorCard>
    </div>
  );
}
