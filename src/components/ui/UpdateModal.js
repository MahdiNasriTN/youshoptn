import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useApp } from '../../context/AppContext';

const UpdateModal = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const update = state.update || {};

  const startDownload = () => {
    if (window.electronAPI && window.electronAPI.startDownload) {
      window.electronAPI.startDownload();
    }
  };

  const install = () => {
    if (window.electronAPI && window.electronAPI.installUpdate) {
      window.electronAPI.installUpdate();
    }
  };

  const closeApp = () => {
    try { window.close(); } catch (e) { /* ignore */ }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Available${update.version ? ` - v${update.version}` : ''}`} size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">A new version of YouShop is available. You should update to get the latest features and security fixes.</p>

        {update.status === 'downloading' && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${update.progress}%` }} />
            </div>
            <div className="text-xs text-gray-500">{update.progress}% — {Math.round((update.transferred||0)/1024)}KB / {Math.round((update.total||0)/1024)}KB</div>
          </div>
        )}

        <div className="flex space-x-3 justify-end">
          <Button variant="secondary" onClick={closeApp}>Close App</Button>
          {update.status === 'available' && (
            <Button onClick={startDownload}>Download</Button>
          )}
          {update.status === 'downloaded' && (
            <Button onClick={install} className="bg-green-600 hover:bg-green-700">Install & Restart</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
