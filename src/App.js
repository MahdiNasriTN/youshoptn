import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout';
import Login from './pages/Login';

// Import pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Packs from './pages/Packs';
import Analytics from './pages/Analytics';

const AppContent = () => {
  const { state } = useApp();
  const { currentView } = state;
  const { isAuthenticated } = state;
  const theme = state.settings?.theme || 'light';

  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (e) {
      // ignore (SSR or test)
    }
  }, [theme]);

  // Global key handler: Ctrl+R to reload with loading indicator
  useEffect(() => {
    function onKey(e) {
      const isCtrlR = (e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R');
      if (isCtrlR) {
        e.preventDefault();
        // Show loading overlay then reload
        setReloading(true);
        // small delay so overlay is visible
        setTimeout(() => {
          try {
            // Prefer Electron-aware reload if available
            if (window && window.location) {
              window.location.reload();
            } else {
              location.reload();
            }
          } catch (err) {
            // fallback
            location.reload();
          }
        }, 350);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'packs':
        return <Packs />;
      case 'permissions':
        return <div className="text-center py-12"><h2 className="text-2xl">Permissions Management - Coming Soon</h2></div>;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <div className="text-center py-12"><h2 className="text-2xl">Settings - Coming Soon</h2></div>;
      default:
        return <Dashboard />;
    }
  };

  // Always render a wrapper so the reload overlay can display on login and inside the app
  return (
    <div className="relative min-h-screen">
      { !isAuthenticated ? <Login /> : <Layout>{renderCurrentView()}</Layout> }

      {/* Reload overlay */}
      {reloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <div className="mx-auto mb-4 w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium">Reloading…</div>
            <div className="text-sm opacity-80 mt-2">Press Ctrl+R again to force reload</div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
