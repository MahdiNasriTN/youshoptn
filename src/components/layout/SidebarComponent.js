import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui';

const Sidebar = () => {
  const { state, actions } = useApp();
  const { currentView, sidebarCollapsed } = state;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line', color: 'text-blue-500' },
    { id: 'users', label: 'Users Management', icon: 'fas fa-users', color: 'text-green-500' },
    { id: 'packs', label: 'Packs Management', icon: 'fas fa-box', color: 'text-purple-500' },
    { id: 'permissions', label: 'Permissions', icon: 'fas fa-shield-alt', color: 'text-orange-500' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar', color: 'text-pink-500' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', color: 'text-gray-500' }
  ];

  return (
    <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-xl transition-all duration-300 ease-in-out border-r border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">E-Commerce</h1>
              <p className="text-sm text-gray-500">SAAS Manager</p>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => actions.setSidebarCollapsed(!sidebarCollapsed)}
            icon="fas fa-bars"
            className="p-2"
          />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => actions.setCurrentView(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors ${
              currentView === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <i className={`${item.icon} ${item.color} text-lg`}></i>
            {!sidebarCollapsed && (
              <span className={`font-medium ${currentView === item.id ? 'text-blue-700' : 'text-gray-700'}`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 E-Commerce SAAS</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
