import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearWebsiteConfig,
  cloneConfig,
  DEFAULT_WEBSITE_CONFIG,
  loadWebsiteConfig,
  resolveTemplateText,
  saveWebsiteConfig,
  type WebsiteConfig,
} from '../config/anniversary';

interface ConfigContextValue {
  savedConfig: WebsiteConfig;
  draftConfig: WebsiteConfig;
  isDirty: boolean;
  lastSavedAt: number | null;
  updateDraft: (updater: (prev: WebsiteConfig) => WebsiteConfig) => void;
  setDraftConfig: (next: WebsiteConfig) => void;
  saveDraft: () => boolean;
  discardDraftChanges: () => void;
  resetToDefaults: () => void;
  applyImportedConfig: (imported: WebsiteConfig, saveImmediately?: boolean) => boolean;
  exportConfigJson: () => string;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [savedConfig, setSavedConfig] = useState<WebsiteConfig>(() => loadWebsiteConfig());
  const [draftConfig, setDraftConfigState] = useState<WebsiteConfig>(() =>
    cloneConfig(savedConfig),
  );
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(savedConfig) !== JSON.stringify(draftConfig),
    [savedConfig, draftConfig],
  );

  // Sync browser page title and meta description with savedConfig
  useEffect(() => {
    const resolvedTitle = resolveTemplateText(savedConfig.couple.pageTitle, savedConfig);
    if (resolvedTitle) {
      document.title = resolvedTitle;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const groom = savedConfig.couple.groomName.trim() || 'Arshad';
      const bride = savedConfig.couple.brideName.trim() || 'Saniya';
      const tagline = resolveTemplateText(savedConfig.hero.tagline, savedConfig);
      metaDesc.setAttribute(
        'content',
        `${tagline} An anniversary keepsake from ${bride} to ${groom}.`,
      );
    }
  }, [savedConfig]);

  // Listen to storage events across tabs in the same browser
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'a_year_of_us_config_v1') {
        const loaded = loadWebsiteConfig();
        setSavedConfig(loaded);
        setDraftConfigState(cloneConfig(loaded));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateDraft = useCallback((updater: (prev: WebsiteConfig) => WebsiteConfig) => {
    setDraftConfigState((prev) => updater(prev));
  }, []);

  const setDraftConfig = useCallback((next: WebsiteConfig) => {
    setDraftConfigState(cloneConfig(next));
  }, []);

  const saveDraft = useCallback(() => {
    const snapshot = cloneConfig(draftConfig);
    const ok = saveWebsiteConfig(snapshot);
    setSavedConfig(snapshot);
    if (ok) {
      setLastSavedAt(Date.now());
    }
    return ok;
  }, [draftConfig]);

  const discardDraftChanges = useCallback(() => {
    setDraftConfigState(cloneConfig(savedConfig));
  }, [savedConfig]);

  const resetToDefaults = useCallback(() => {
    clearWebsiteConfig();
    const fresh = cloneConfig(DEFAULT_WEBSITE_CONFIG);
    saveWebsiteConfig(fresh);
    setSavedConfig(fresh);
    setDraftConfigState(cloneConfig(fresh));
    setLastSavedAt(Date.now());
  }, []);

  const applyImportedConfig = useCallback(
    (imported: WebsiteConfig, saveImmediately = true) => {
      const snapshot = cloneConfig(imported);
      setDraftConfigState(snapshot);
      if (saveImmediately) {
        const ok = saveWebsiteConfig(snapshot);
        setSavedConfig(snapshot);
        if (ok) {
          setLastSavedAt(Date.now());
        }
        return ok;
      }
      return true;
    },
    [],
  );

  const exportConfigJson = useCallback(() => {
    return JSON.stringify(draftConfig, null, 2);
  }, [draftConfig]);

  const value = useMemo<ConfigContextValue>(
    () => ({
      savedConfig,
      draftConfig,
      isDirty,
      lastSavedAt,
      updateDraft,
      setDraftConfig,
      saveDraft,
      discardDraftChanges,
      resetToDefaults,
      applyImportedConfig,
      exportConfigJson,
    }),
    [
      savedConfig,
      draftConfig,
      isDirty,
      lastSavedAt,
      updateDraft,
      setDraftConfig,
      saveDraft,
      discardDraftChanges,
      resetToDefaults,
      applyImportedConfig,
      exportConfigJson,
    ],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useWebsiteConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useWebsiteConfig must be used inside ConfigProvider');
  }
  return ctx;
}
