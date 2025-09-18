import React, { useState, useEffect } from 'react';

const UpdateProgress = () => {
  const [updateState, setUpdateState] = useState({
    status: 'idle', // idle, checking, available, downloading, downloaded, installing, completed, error
    version: null,
    progress: 0,
    speed: 0,
    transferred: 0,
    total: 0,
    error: null
  });

  const [showUpdate, setShowUpdate] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    electronAPIAvailable: false,
    version: null
  });
  
  useEffect(() => {
    // Check if electronAPI is available
    const apiAvailable = !!window.electronAPI;
    setDebugInfo(prev => ({ ...prev, electronAPIAvailable: apiAvailable }));
    
    if (apiAvailable) {
      // Get app version
      window.electronAPI.getVersion().then(version => {
        setDebugInfo(prev => ({ ...prev, version }));
      }).catch(e => console.error('Failed to get version:', e));
    }

    // Always show the component for debugging (remove this later)
    setShowUpdate(true);

    // Listen for update events from main process
    if (window.electronAPI) {
      const removeListeners = [];

      // Update checking
      const onUpdateChecking = () => {
        setUpdateState(prev => ({ ...prev, status: 'checking' }));
        setShowUpdate(true);
      };

      // Update available
      const onUpdateAvailable = (info) => {
        setUpdateState(prev => ({ 
          ...prev, 
          status: 'available', 
          version: info.version 
        }));
        setShowUpdate(true);
      };

      // Update not available
      const onUpdateNotAvailable = () => {
        setUpdateState(prev => ({ ...prev, status: 'idle' }));
        setTimeout(() => setShowUpdate(false), 2000);
      };

      // Download progress
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

      // Update downloaded
      const onUpdateDownloaded = (info) => {
        setUpdateState(prev => ({ 
          ...prev, 
          status: 'downloaded',
          version: info.version 
        }));
      };

      // Update error
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

      // Cleanup function
      return () => {
        removeListeners.forEach(remove => remove && remove());
      };
    }
  }, []);

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

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  const handleCheckForUpdates = () => {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
      window.electronAPI.checkForUpdates();
    } else {
      console.log('checkForUpdates not available');
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

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 bg-surface border border-base rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-3">
  <h3 className="text-lg font-semibold text-gray-900">App Update</h3>
        {updateState.status === 'idle' && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Debug Information */}
  <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <div>ElectronAPI: {debugInfo.electronAPIAvailable ? '✅' : '❌'}</div>
        <div>App Version: {debugInfo.version || 'N/A'}</div>
        <div>Update Status: {updateState.status}</div>
      </div>

      {updateState.status === 'idle' && (
        <div>
          <p className="text-gray-600 mb-3">No updates available.</p>
          <button
            onClick={handleCheckForUpdates}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2"
          >
            Check for Updates
          </button>
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Dismiss
          </button>
        </div>
      )}

      {updateState.status === 'checking' && (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Checking for updates...</span>
        </div>
      )}

      {updateState.status === 'available' && (
        <div>
          <p className="text-gray-600 mb-3">
            A new version ({updateState.version}) is available!
          </p>
          <button
            onClick={handleStartDownload}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download Update
          </button>
        </div>
      )}

      {updateState.status === 'downloading' && (
        <div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Downloading {updateState.version}</span>
              <span>{updateState.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${updateState.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatBytes(updateState.transferred)} / {formatBytes(updateState.total)}</span>
            <span>{formatSpeed(updateState.speed)}</span>
          </div>
        </div>
      )}

      {updateState.status === 'downloaded' && (
        <div>
          <p className="text-green-600 mb-3">
            ✓ Update downloaded successfully!
          </p>
          <button
            onClick={handleInstallUpdate}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Install & Restart
          </button>
        </div>
      )}

      {updateState.status === 'installing' && (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <span className="text-gray-600">Installing update...</span>
        </div>
      )}

      {updateState.status === 'error' && (
        <div>
          <p className="text-red-600 mb-3">
            ✗ Update failed: {updateState.error}
          </p>
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateProgress;
