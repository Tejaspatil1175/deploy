import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';

const NotificationCenter = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    emergency: true,
    updates: true,
    tips: true
  });
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'emergency',
        title: 'Emergency Alert',
        message: 'High-risk earthquake detected 2km from your location. Seek immediate shelter.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'update',
        title: 'Disaster Update',
        message: 'Flood water levels decreasing in your area. Safe evacuation routes are now available.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'info',
        title: 'Safety Tip',
        message: 'Keep emergency supplies ready: water, food, first aid kit, flashlight, and radio.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'update':
        return Info;
      case 'info':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (type === 'emergency' || priority === 'high') {
      return 'from-red-500 to-red-600';
    } else if (priority === 'medium') {
      return 'from-orange-500 to-orange-600';
    }
    return 'from-blue-500 to-blue-600';
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const playNotificationSound = () => {
    if (settings.sound) {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
        badge: '/badge-icon.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });
    }
  };

  // Simulate receiving new notification
  const addTestNotification = () => {
    const newNotification = {
      id: Date.now().toString(),
      type: 'emergency',
      title: 'Test Alert',
      message: 'This is a test emergency notification to demonstrate the system.',
      timestamp: new Date(),
      read: false,
      priority: 'high'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound();
    showBrowserNotification(newNotification);
    
    if (settings.vibration && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <>
      {/* Notification Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    {unreadCount} unread
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={addTestNotification}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Test Alert
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                    <button
                      onClick={addTestNotification}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Add test notification
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(notification.type, notification.priority);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {notification.timestamp.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className={`text-sm mt-1 ${
                                !notification.read ? 'text-gray-800' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Notification Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'sound', label: 'Sound', icon: settings.sound ? Volume2 : VolumeX },
                  { key: 'vibration', label: 'Vibration', icon: Bell },
                  { key: 'emergency', label: 'Emergency Alerts', icon: AlertTriangle },
                  { key: 'updates', label: 'Status Updates', icon: Info },
                  { key: 'tips', label: 'Safety Tips', icon: CheckCircle }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800">{label}</span>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[key] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
