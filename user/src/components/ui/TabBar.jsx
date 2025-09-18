import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const TabBar = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'pills', 
  size = 'default',
  className 
}) => {
  const variants = {
    pills: 'bg-gray-100 rounded-2xl p-1',
    underline: 'border-b border-gray-200',
    buttons: 'space-x-2'
  };

  const sizes = {
    sm: 'text-sm py-2 px-3',
    default: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-6'
  };

  return (
    <div className={cn(variants[variant], className)}>
      <div className={cn(
        'flex',
        variant === 'pills' ? 'space-x-1' : 
        variant === 'underline' ? 'space-x-6' : 
        'space-x-2'
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative font-medium transition-all duration-200 touch-feedback',
                sizes[size],
                variant === 'pills' && [
                  'rounded-xl flex-1',
                  isActive 
                    ? 'text-blue-600 bg-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                ],
                variant === 'underline' && [
                  'pb-3',
                  isActive 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                ],
                variant === 'buttons' && [
                  'rounded-xl border',
                  isActive 
                    ? 'text-white bg-blue-600 border-blue-600' 
                    : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
                ]
              )}
            >
              {tab.icon && (
                <span className="mr-2">
                  <tab.icon size={18} />
                </span>
              )}
              {tab.label}
              
              {tab.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
              
              {variant === 'pills' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const ScrollableTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}) => {
  return (
    <div className={cn('overflow-x-auto hide-scrollbar', className)}>
      <div className="flex space-x-2 px-4 py-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap',
                isActive 
                  ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              )}
            >
              {tab.icon && <tab.icon size={16} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  'text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                )}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export { TabBar, ScrollableTabs };
export default TabBar;