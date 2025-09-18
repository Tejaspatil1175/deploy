import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav, Sidebar, PullToRefresh } from '../Navigation';
import BottomNav from '../Navigation';
import SearchBar from './SearchBar';
import { cn } from '../../lib/utils';

const AppLayout = ({ 
  children, 
  user, 
  onLogout,
  activeView,
  onNavigate,
  showSearch = false,
  onSearch,
  title,
  showPullToRefresh = true,
  onRefresh,
  isRefreshing = false,
  className
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count

  // Handle escape key to close sidebar/search
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close sidebar when view changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeView]);

  const handleSearch = (query) => {
    if (onSearch) {
      onSearch(query);
    }
    setIsSearchOpen(false);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const contentWithPullToRefresh = showPullToRefresh ? (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      {children}
    </PullToRefresh>
  ) : children;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Navigation */}
      <TopNav
        user={user}
        onLogout={onLogout}
        title={title}
        onMenuToggle={() => setIsSidebarOpen(true)}
        showSearch={showSearch}
        onSearch={() => setIsSearchOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        activeView={activeView}
        onNavigate={onNavigate}
      />

      {/* Search Bar */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <main className={cn(
        'min-h-screen pb-24 pt-2',
        className
      )}>
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {contentWithPullToRefresh}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeView}
        onTabChange={onNavigate}
        notificationCount={notificationCount}
      />
    </div>
  );
};

const PageContainer = ({ 
  children, 
  maxWidth = '4xl', 
  padding = true,
  className 
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidths[maxWidth],
      padding && 'px-4 py-6',
      className
    )}>
      {children}
    </div>
  );
};

const SectionHeader = ({ 
  title, 
  subtitle, 
  action,
  className 
}) => (
  <div className={cn('flex items-center justify-between mb-6', className)}>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
    {action && (
      <div className="flex-shrink-0">
        {action}
      </div>
    )}
  </div>
);

const GridContainer = ({ 
  children, 
  cols = 2,
  gap = 4,
  className 
}) => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapMap = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div className={cn(
      'grid',
      colsMap[cols] || 'grid-cols-1',
      gapMap[gap] || 'gap-4',
      className
    )}>
      {children}
    </div>
  );
};

const LoadingScreen = ({ 
  message = "Loading...",
  showLogo = true 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {showLogo && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <div className="w-8 h-8 bg-white rounded-lg"></div>
        </motion.div>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4"
      />
      <p className="text-gray-600 font-medium">{message}</p>
    </motion.div>
  </div>
);

const EmptyState = ({ 
  title, 
  description, 
  action,
  icon: Icon,
  className 
}) => (
  <div className={cn('text-center py-12', className)}>
    {Icon && (
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    )}
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action && action}
  </div>
);

export { 
  AppLayout, 
  PageContainer, 
  SectionHeader, 
  GridContainer, 
  LoadingScreen, 
  EmptyState 
};
export default AppLayout;