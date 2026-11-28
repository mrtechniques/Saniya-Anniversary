import { useState, type FormEvent } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  Film,
  Heart,
  Image as ImageIcon,
  Lock,
  Mail,
  Menu,
  Save,
  Settings,
  Sparkles,
  Users,
  X,
  AlertCircle,
} from 'lucide-react';
import { useWebsiteConfig } from '../../context/ConfigContext';
import { GeneralSettings } from './GeneralSettings';
import { CoupleDetailsEditor } from './CoupleDetailsEditor';
import { HeroEditor } from './HeroEditor';
import { StoryEditor } from './StoryEditor';
import { PhotoManager } from './PhotoManager';
import { VideoManager } from './VideoManager';
import { AnniversaryLetterEditor } from './AnniversaryLetterEditor';
import { FinalMessageEditor } from './FinalMessageEditor';
import { LivePreview } from './LivePreview';
import { ConfigurationManager } from './ConfigurationManager';

type EditorSectionId =
  | 'general'
  | 'couple'
  | 'hero'
  | 'story'
  | 'photos'
  | 'videos'
  | 'letter'
  | 'final'
  | 'preview';

const NAV_ITEMS: { id: EditorSectionId; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'couple', label: 'Couple Details', icon: Users },
  { id: 'hero', label: 'Hero Section', icon: Sparkles },
  { id: 'story', label: 'Story & Memories', icon: BookOpen },
  { id: 'photos', label: 'Photo Gallery', icon: ImageIcon },
  { id: 'videos', label: 'Video Gallery', icon: Film },
  { id: 'letter', label: 'Anniversary Letter', icon: Mail },
  { id: 'final', label: 'Final Message', icon: Heart },
  { id: 'preview', label: 'Preview & Save', icon: Eye },
];

interface EditDashboardProps {
  onNavigatePublic: () => void;
}

export function EditDashboard({ onNavigatePublic }: EditDashboardProps) {
  const { savedConfig, draftConfig, isDirty, saveDraft } = useWebsiteConfig();
  const [activeSection, setActiveSection] = useState<EditorSectionId>('couple');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  // Optional client-side PIN gate
  const pinRequired =
    savedConfig.editorAccess.pinEnabled && savedConfig.editorAccess.pinCode.trim().length > 0;
  const [unlocked, setUnlocked] = useState(!pinRequired);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const notify = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const handleQuickSave = () => {
    const ok = saveDraft();
    if (ok) {
      notify('success', 'Changes saved to this browser.');
    } else {
      notify('error', 'Failed to save changes to localStorage.');
    }
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === savedConfig.editorAccess.pinCode.trim()) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  if (pinRequired && !unlocked) {
    return (
      <div className="min-h-screen surface-burgundy-linen flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[14px] bg-[#FFF8F2] border border-[#C6A36A]/45 p-6 sm:p-8 shadow-2xl text-[#310916]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[#6D1025]/10 text-[#6D1025] flex items-center justify-center">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#310916]">
                Editor Access
              </h1>
              <p className="text-xs text-[#490D20]/70">
                Enter your PIN to open the customization dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              autoFocus
              className="w-full rounded-[8px] border border-[#6D1025]/25 bg-white px-3.5 py-2.5 text-sm text-[#310916] focus:border-[#6D1025] focus:outline-none"
            />
            {pinError && <p className="text-xs text-[#B52B45]">{pinError}</p>}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onNavigatePublic}
                className="text-xs text-[#6D1025] hover:underline cursor-pointer"
              >
                ← Back to website
              </button>
              <button
                type="submit"
                className="rounded-[8px] bg-[#6D1025] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#FFF8F2] hover:bg-[#490D20] cursor-pointer"
              >
                Unlock Editor
              </button>
            </div>
          </form>

          <p className="mt-5 pt-4 border-t border-[#6D1025]/10 text-[11px] text-[#490D20]/65 leading-relaxed">
            Note: Client-side PIN protection is only to prevent accidental edits on this browser
            and is not strong security.
          </p>
        </div>
      </div>
    );
  }

  const activeNav = NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#F5EEE8] text-[#310916] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 surface-burgundy-linen text-[#FFF8F2] border-r border-[#C6A36A]/25">
        <div className="p-6 border-b border-[#FFF8F2]/10">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#C6A36A] mb-1">
            Website Studio
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#FFF8F2]">
            {draftConfig.couple.websiteTitle || 'A Year of Us'}
          </h1>
          <p className="text-xs text-[#F7DDE2]/80 mt-0.5">
            {draftConfig.couple.groomName || 'Arshad'} &amp;{' '}
            {draftConfig.couple.brideName || 'Saniya'}
          </p>
        </div>

        <nav aria-label="Editor sections" className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-left text-xs font-medium tracking-[0.06em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF8F2] text-[#490D20] shadow-sm'
                    : 'text-[#F7DDE2]/85 hover:bg-[#FFF8F2]/10 hover:text-[#FFF8F2]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#FFF8F2]/10">
          <button
            type="button"
            onClick={onNavigatePublic}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#C6A36A]/45 bg-[#310916]/60 px-3.5 py-2.5 text-xs uppercase tracking-[0.14em] text-[#F7DDE2] hover:bg-[#6D1025] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            View Public Site
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FFF8F2]/95 backdrop-blur-md border-b border-[#C6A36A]/30 px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open editor menu"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#6D1025]/20 bg-white text-[#6D1025] cursor-pointer"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl text-[#310916]">
                  {activeNav.label}
                </h2>
                <p className="text-[11px] text-[#490D20]/65">
                  {isDirty ? 'Unsaved draft changes' : 'All changes saved locally'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('preview')}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#6D1025]/25 bg-white px-3.5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6D1025] hover:bg-[#FCECEF] cursor-pointer min-h-[38px]"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Preview Website</span>
                <span className="sm:hidden">Preview</span>
              </button>

              <button
                type="button"
                onClick={handleQuickSave}
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#6D1025] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#FFF8F2] hover:bg-[#490D20] cursor-pointer min-h-[38px]"
              >
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile horizontal pill bar for quick switching */}
        <div className="lg:hidden bg-[#FFF8F2] border-b border-[#6D1025]/10 px-4 py-2 overflow-x-auto flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#6D1025] text-[#FFF8F2]'
                    : 'bg-[#F5EEE8] text-[#490D20] hover:bg-[#FCECEF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Toast feedback */}
        {toast && (
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4">
            <div
              role="status"
              className={`rounded-[10px] border px-4 py-3 text-xs sm:text-sm flex items-center justify-between gap-3 ${
                toast.type === 'success'
                  ? 'border-[#C6A36A] bg-[#FFF8F2] text-[#310916]'
                  : 'border-[#B52B45] bg-[#FCECEF] text-[#6D1025]'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#6D1025] shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#B52B45] shrink-0" aria-hidden="true" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss message"
                className="p-1 rounded hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Active Section Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeSection === 'general' && <GeneralSettings />}
          {activeSection === 'couple' && <CoupleDetailsEditor />}
          {activeSection === 'hero' && <HeroEditor />}
          {activeSection === 'story' && <StoryEditor />}
          {activeSection === 'photos' && <PhotoManager />}
          {activeSection === 'videos' && <VideoManager />}
          {activeSection === 'letter' && <AnniversaryLetterEditor />}
          {activeSection === 'final' && <FinalMessageEditor />}
          {activeSection === 'preview' && (
            <div className="space-y-6">
              <ConfigurationManager onNotify={notify} />
              <LivePreview />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-[#1F050D]/70 backdrop-blur-xs"
          />
          <div className="relative w-72 max-w-[85vw] surface-burgundy-linen text-[#FFF8F2] flex flex-col h-full z-10">
            <div className="p-5 border-b border-[#FFF8F2]/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.24em] uppercase text-[#C6A36A]">
                  Website Studio
                </p>
                <p className="font-[family-name:var(--font-display)] text-xl">
                  {draftConfig.couple.websiteTitle || 'A Year of Us'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-left text-xs font-medium ${
                      isActive
                        ? 'bg-[#FFF8F2] text-[#490D20]'
                        : 'text-[#F7DDE2]/85 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#FFF8F2]/10">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  onNavigatePublic();
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#C6A36A]/45 bg-[#310916]/60 px-3.5 py-2.5 text-xs uppercase tracking-[0.14em] text-[#F7DDE2]"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                View Public Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
