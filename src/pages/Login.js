import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { actions } = useApp();
  const [email, setEmail] = useState('admin@youshop.pro');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  
  // Update state
  const [updateState, setUpdateState] = useState({
    status: 'idle', // idle, checking, available, downloading, downloaded, installing, error
    version: null,
    progress: 0,
    speed: 0,
    transferred: 0,
    total: 0,
    error: null
  });

  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    // Check if electronAPI is available and get version
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(version => {
        setAppVersion(version);
      }).catch(e => console.error('Failed to get version:', e));

      // Listen for update events
      const onUpdateChecking = () => {
        setUpdateState(prev => ({ ...prev, status: 'checking' }));
      };

      const onUpdateAvailable = (info) => {
        setUpdateState(prev => ({ 
          ...prev, 
          status: 'available', 
          version: info.version 
        }));
      };

      const onUpdateNotAvailable = () => {
        setUpdateState(prev => ({ ...prev, status: 'idle' }));
      };

      const onDownloadProgress = (progress) => {
        setUpdateState(prev => ({
          ...prev,
          status: 'downloading',
          progress: Math.round(progress.percent),
          speed: progress.bytesPerSecond,
          transferred: progress.transferred,
          total: progress.total
        }));
      };

      const onUpdateDownloaded = (info) => {
        setUpdateState(prev => ({ 
          ...prev, 
          status: 'downloaded',
          version: info.version 
        }));
      };

      const onUpdateError = (error) => {
        setUpdateState(prev => ({ 
          ...prev, 
          status: 'error',
          error: error.message || 'Update failed'
        }));
      };

      // Register listeners
      window.electronAPI.onUpdateChecking(onUpdateChecking);
      window.electronAPI.onUpdateAvailable(onUpdateAvailable);
      window.electronAPI.onUpdateNotAvailable(onUpdateNotAvailable);
      window.electronAPI.onDownloadProgress(onDownloadProgress);
      window.electronAPI.onUpdateDownloaded(onUpdateDownloaded);
      window.electronAPI.onUpdateError(onUpdateError);

      // Check for updates on mount
      setTimeout(() => {
        window.electronAPI.checkForUpdates();
      }, 1000);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If update is available or downloading, prevent login
    if (updateState.status === 'available' || updateState.status === 'downloading' || updateState.status === 'downloaded') {
      setError('Please update the application before signing in');
      return;
    }

    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    // Mock local login (no backend)
    setError(null);
    const user = { id: Date.now(), name: 'Admin', email };
    actions.login(user);
  };

  const handleStartDownload = () => {
    if (window.electronAPI) {
      window.electronAPI.startDownload();
    }
  };

  const handleInstallUpdate = () => {
    if (window.electronAPI) {
      setUpdateState(prev => ({ ...prev, status: 'installing' }));
      window.electronAPI.installUpdate();
    }
  };

  const handleCheckForUpdates = () => {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
      window.electronAPI.checkForUpdates();
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  const getButtonContent = () => {
    switch (updateState.status) {
      case 'checking':
        return (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Checking for updates...</span>
          </div>
        );
      case 'available':
        return 'Download Update';
      case 'downloading':
        return `Downloading... ${updateState.progress}%`;
      case 'downloaded':
        return 'Install & Restart';
      case 'installing':
        return (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Installing...</span>
          </div>
        );
      case 'error':
        return 'Check for Updates';
      default:
        return 'Sign In';
    }
  };

  const getButtonAction = () => {
    switch (updateState.status) {
      case 'available':
        return handleStartDownload;
      case 'downloaded':
        return handleInstallUpdate;
      case 'error':
        return handleCheckForUpdates;
      default:
        return handleSubmit;
    }
  };

  const isButtonDisabled = () => {
    return updateState.status === 'checking' || 
           updateState.status === 'downloading' || 
           updateState.status === 'installing';
  };

  const getButtonColor = () => {
    switch (updateState.status) {
      case 'available':
      case 'downloaded':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">YS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YouShop</h1>
          <p className="text-gray-600">E-Commerce SAAS Management</p>
          {appVersion && (
            <p className="text-xs text-gray-500 mt-1">Version {appVersion}</p>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>
          
          {/* Update Status */}
          {updateState.status !== 'idle' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">App Update</span>
                {updateState.version && (
                  <span className="text-sm text-gray-600">v{updateState.version}</span>
                )}
              </div>
              
              {updateState.status === 'downloading' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Downloading...</span>
                    <span>{updateState.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${updateState.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatBytes(updateState.transferred)} / {formatBytes(updateState.total)}</span>
                    <span>{formatSpeed(updateState.speed)}</span>
                  </div>
                </div>
              )}
              
              {updateState.status === 'error' && (
                <p className="text-red-600 text-sm">
                  Update failed: {updateState.error}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={getButtonAction()}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={updateState.status === 'available' || updateState.status === 'downloading' || updateState.status === 'downloaded'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={updateState.status === 'available' || updateState.status === 'downloading' || updateState.status === 'downloaded'}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={getButtonAction()}
              disabled={isButtonDisabled()}
              className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getButtonColor()}`}
            >
              {getButtonContent()}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Secure access to your e-commerce dashboard
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 YouShop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
