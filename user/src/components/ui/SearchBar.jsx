import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, Zap, AlertTriangle, Phone, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const SearchBar = ({ 
  onSearch, 
  onClose, 
  isOpen, 
  placeholder = "Search locations, alerts, resources...",
  recentSearches = [],
  quickActions = []
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const defaultQuickActions = [
    { id: 'emergency', label: 'Emergency Contacts', icon: Phone, action: () => onSearch('emergency') },
    { id: 'nearby-alerts', label: 'Nearby Alerts', icon: AlertTriangle, action: () => onSearch('nearby-alerts') },
    { id: 'safe-routes', label: 'Safe Routes', icon: MapPin, action: () => onSearch('safe-routes') },
    { id: 'shelter', label: 'Find Shelter', icon: Shield, action: () => onSearch('shelter') }
  ];

  const actions = quickActions.length > 0 ? quickActions : defaultQuickActions;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleRecentSearch = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 mt-4 glass rounded-3xl border border-white/20 shadow-2xl safe-area-top"
          >
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-white/10">
              <div className="flex items-center flex-1 space-x-3">
                <Search className="w-6 h-6 text-gray-600" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 text-lg font-medium outline-none"
                />
                {isLoading && (
                  <div className="animate-spin">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Quick Actions */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-100 transition-all duration-200"
                    >
                      <div className="p-2 bg-blue-500 text-white rounded-xl">
                        <Icon size={20} />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Clock size={20} />
                  <span>Recent Searches</span>
                </h3>
                <div className="space-y-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRecentSearch(search)}
                      className="flex items-center space-x-3 w-full p-3 hover:bg-white/50 rounded-xl transition-all duration-200"
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-700 font-medium">{search}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSearch(suggestion.text)}
                      className="flex items-center space-x-3 w-full p-3 hover:bg-white/50 rounded-xl transition-all duration-200"
                    >
                      <MapPin size={16} className="text-blue-500" />
                      <div className="text-left">
                        <p className="text-gray-800 font-medium">{suggestion.text}</p>
                        {suggestion.subtitle && (
                          <p className="text-gray-500 text-sm">{suggestion.subtitle}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;