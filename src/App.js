import React from 'react';
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

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
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
