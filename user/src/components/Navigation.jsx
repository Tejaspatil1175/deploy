import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  User,
  Settings,
  Heart,
  Shield,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  Activity,
  MessageCircle,
  HelpCircle,
  LogOut
} from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, notificationCount = 0 }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'map', icon: MapPin, label: 'Map' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts', badge: notificationCount > 0 ? notificationCount : null },
    { id: 'contacts', icon: Phone, label: 'Emergency' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 px-2 py-2 z-50 bottom-nav-safe"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 min-w-[60px] ${
                isActive 
                  ? 'text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </motion.div>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export const TopNav = ({ user, onLogout, showBack, onBack, title, onMenuToggle, showSearch = false, onSearch }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass border-b border-white/20 sticky top-0 z-40 safe-area-top"
    >
      <div className="flex items-center justify-between p-4">
        {showBack ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
          >
            <X size={24} />
          </motion.button>
        ) : (
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMenuToggle}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl md:hidden"
            >
              <Menu size={24} />
            </motion.button>
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-800 text-xl">SafeZone</h1>
                {user && (
                  <p className="text-sm text-gray-600">Welcome back, {user.name?.split(' ')[0]}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {title && (
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-gray-800 text-lg"
          >
            {title}
          </motion.h2>
        )}
        
        <div className="flex items-center space-x-2">
          {showSearch && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSearch}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl"
            >
              <Search size={20} />
            </motion.button>
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl relative"
          >
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </motion.button>

          {user && (
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-12 w-48 glass rounded-2xl border border-white/20 shadow-xl py-2"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center space-x-2">
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center space-x-2">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center space-x-2">
                      <HelpCircle size={16} />
                      <span>Help</span>
                    </button>
                    <hr className="my-2 border-white/10" />
                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export const Sidebar = ({ isOpen, onClose, user, activeView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', description: 'Your safety overview' },
    { id: 'map', icon: MapPin, label: 'Interactive Map', description: 'View danger zones' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alert Center', description: 'Manage notifications' },
    { id: 'contacts', icon: Phone, label: 'Emergency Contacts', description: 'Quick access contacts' },
    { id: 'resources', icon: Heart, label: 'Resource Center', description: 'Safety resources' },
    { id: 'reports', icon: Activity, label: 'Safety Reports', description: 'Report incidents' },
    { id: 'chat', icon: MessageCircle, label: 'Community Chat', description: 'Connect with others' },
  ];

  const handleNavigation = (viewId) => {
    onNavigate(viewId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-80 glass-dark border-r border-white/10 z-50 md:hidden"
          >
            <div className="p-6 safe-area-top">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xl">SafeZone</h2>
                    <p className="text-white/70 text-sm">Stay Safe, Stay Connected</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {user && (
                <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <p className="text-white/70 text-sm">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-white'
                          : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className={`text-sm ${
                          isActive ? 'text-white/90' : 'text-white/60'
                        }`}>{item.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center space-x-4 p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
                >
                  <div className="p-2 rounded-xl bg-white/10">
                    <Settings size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-white/60">App preferences</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const FloatingActionButton = ({ 
  icon: Icon = Plus, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'default',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    emergency: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 emergency-glow',
    success: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  const sizes = {
    sm: 'w-12 h-12 bottom-24 right-4',
    default: 'w-14 h-14 bottom-24 right-6',
    lg: 'w-16 h-16 bottom-24 right-6'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05, rotate: 5 }}
      onClick={onClick}
      className={`fixed ${sizes[size]} ${variants[variant]} text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center z-40 transition-all duration-300 ${className}`}
      {...props}
    >
      <Icon size={size === 'lg' ? 28 : size === 'sm' ? 20 : 24} />
    </motion.button>
  );
};

export const PullToRefresh = ({ onRefresh, isRefreshing, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isPulling && window.scrollY === 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(Math.min(distance / 2, 80)); // Damping effect
    }
  };

  const handleTouchEnd = () => {
    if (isPulling) {
      if (pullDistance > 60 && !isRefreshing) {
        onRefresh();
      }
      setPullDistance(0);
      setIsPulling(false);
      setStartY(0);
    }
  };

  const refreshThreshold = pullDistance > 60;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen relative"
      style={{ 
        transform: `translateY(${Math.min(pullDistance, 80)}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <AnimatePresence>
        {pullDistance > 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-0 left-0 right-0 flex justify-center items-center pt-4 pb-2 z-10"
          >
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full glass transition-all duration-300 ${
              refreshThreshold ? 'text-blue-600 border border-blue-200' : 'text-gray-500 border border-gray-200'
            }`}>
              <motion.div
                animate={{ 
                  rotate: isRefreshing ? 360 : refreshThreshold ? 180 : 0 
                }}
                transition={{ 
                  duration: isRefreshing ? 1 : 0.3,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Activity size={16} />
              </motion.div>
              <span className="text-sm font-medium">
                {isRefreshing ? 'Refreshing...' : refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default BottomNav;
