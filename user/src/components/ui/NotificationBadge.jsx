import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const NotificationBadge = ({ 
  count, 
  variant = 'error', 
  size = 'default',
  position = 'top-right',
  showZero = false,
  maxCount = 99,
  className,
  children
}) => {
  const shouldShow = showZero || (count && count > 0);
  
  const variants = {
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
    neutral: 'bg-gray-500 text-white'
  };

  const sizes = {
    sm: 'h-4 w-4 text-xs',
    default: 'h-5 w-5 text-xs',
    lg: 'h-6 w-6 text-sm'
  };

  const positions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
    'top-center': '-top-1 left-1/2 transform -translate-x-1/2',
    'bottom-center': '-bottom-1 left-1/2 transform -translate-x-1/2'
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className="relative inline-block">
      {children}
      {shouldShow && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={cn(
            'absolute rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white',
            variants[variant],
            sizes[size],
            positions[position],
            className
          )}
        >
          {count > 0 ? displayCount : ''}
        </motion.div>
      )}
    </div>
  );
};

const StatusDot = ({ 
  status = 'offline', 
  size = 'default',
  position = 'bottom-right',
  animated = true,
  className,
  children
}) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
    invisible: 'bg-gray-300'
  };

  const sizes = {
    sm: 'h-2 w-2',
    default: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const positions = {
    'top-right': '-top-0.5 -right-0.5',
    'top-left': '-top-0.5 -left-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5',
    'bottom-left': '-bottom-0.5 -left-0.5'
  };

  return (
    <div className="relative inline-block">
      {children}
      <div
        className={cn(
          'absolute rounded-full border-2 border-white shadow-sm',
          statusColors[status],
          sizes[size],
          positions[position],
          animated && status === 'online' && 'animate-pulse',
          className
        )}
      />
    </div>
  );
};

export { NotificationBadge, StatusDot };
export default NotificationBadge;