import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui';

const Header = () => {
  const { state, actions } = useApp();
  const { currentView } = state;
  const currentTheme = state.settings?.theme || 'light';

  const getPageInfo = () => {
    const pageMap = {
      dashboard: {
        title: 'Dashboard',
        description: 'test test'
      },
      users: {
        title: 'Users Management',
        description: 'Manage your customers and their subscriptions'
      },
      packs: {
        title: 'Packs Management',
        description: 'Configure subscription packages and pricing'
      },
      permissions: {
        title: 'Permissions Management',
        description: 'Set up access control and permissions'
      },
      analytics: {
        title: 'Analytics',
        description: 'Detailed insights and performance metrics'
      },
      settings: {
        title: 'Settings',
        description: 'Platform configuration and preferences'
      }
    };
    
    return pageMap[currentView] || { title: 'Dashboard', description: 'Overview' };
  };

  const pageInfo = getPageInfo();

  return (
  <header className="bg-surface shadow-sm border-b border-base px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {pageInfo.title}
          </h2>
          <p className="text-muted mt-1">
            {pageInfo.description}
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <div>
            <button
              onClick={() => actions.toggleTheme()}
              title="Toggle dark mode"
              className="p-2 rounded-md hover:bg-white/20 transition-colors"
            >
              {currentTheme === 'dark' ? (
                  <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                  <i className="fas fa-moon text-gray-700"></i>
              )}
            </button>
          </div>
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon="fas fa-bell"
              className="p-3 relative"
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="Admin" 
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div className="hidden md:block">
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
