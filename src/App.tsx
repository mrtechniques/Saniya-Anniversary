import { useEffect, useState } from 'react';
import { ConfigProvider, useWebsiteConfig } from './context/ConfigContext';
import { PublicWebsite } from './components/PublicWebsite';
import { EditDashboard } from './components/editor/EditDashboard';

function isEditPathname(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === '/edit';
}

function AppRoutes() {
  const { savedConfig } = useWebsiteConfig();
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setPathname(to);
      window.scrollTo({ top: 0 });
    }
  };

  if (isEditPathname(pathname)) {
    return <EditDashboard onNavigatePublic={() => navigate('/')} />;
  }

  return <PublicWebsite config={savedConfig} />;
}

export default function App() {
  return (
    <ConfigProvider>
      <AppRoutes />
    </ConfigProvider>
  );
}
