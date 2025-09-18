// Temporary debug component - you can remove this after testing
import React from 'react';

const DebugInfo: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const mode = import.meta.env.MODE;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>API URL: {apiUrl || 'undefined'}</div>
      <div>Mode: {mode}</div>
      <div>All env vars: {JSON.stringify(import.meta.env, null, 2)}</div>
    </div>
  );
};

export default DebugInfo;