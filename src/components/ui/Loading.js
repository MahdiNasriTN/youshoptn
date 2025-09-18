import React from 'react';

const Loading = ({ size = 48, message = 'Loading…' }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${Math.max(4, Math.round(size / 12))}px solid rgba(0,0,0,0.08)`,
    borderTop: `${Math.max(4, Math.round(size / 12))}px solid #4F46E5`,
    animation: 'spin 1s linear infinite'
  };

  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 12 }}>
      <div style={style} aria-hidden="true" />
      <div className="text-gray-600 text-sm">{message}</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loading;
