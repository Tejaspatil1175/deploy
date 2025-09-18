import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Bell, Phone, X } from 'lucide-react';
import { Button } from './ui/Button';

const FloatingActionButton = ({ onEmergencyCall, onToggleMap, onOpenNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Phone,
      label: 'Emergency Call',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: onEmergencyCall,
    },
    {
      icon: MapPin,
      label: 'Toggle Map',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onToggleMap,
    },
    {
      icon: Bell,
      label: 'Notifications',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onOpenNotifications,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-end"
                >
                  <span className="mr-3 text-sm font-medium text-white bg-black/50 px-2 py-1 rounded-lg">
                    {action.label}
                  </span>
                  <Button
                    size="icon"
                    className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg`}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingActionButton;
