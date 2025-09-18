import React from "react";

const StatusIndicator = ({ status }) => {
  let color = 'bg-gray-400';
  if (status === 'tracking...') color = 'bg-green-500';
  if (status.includes('denied') || status.includes('failed')) color = 'bg-red-500';
  if (status === 'stopped') color = 'bg-yellow-500';

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color} animate-pulse`}></span>
      <span className="text-sm text-gray-600 capitalize">{status}</span>
    </div>
  );
};

export default StatusIndicator;
