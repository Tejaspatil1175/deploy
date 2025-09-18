import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  HelpCircle, 
  MapPin,
  Phone,
  MessageSquare,
  X
} from 'lucide-react';
import { USER_STATUS } from '../utils/constants';
import { apiClient } from '../utils/api';

const StatusReporter = ({ user, onStatusUpdate, className = '' }) => {
  const [currentStatus, setCurrentStatus] = useState(user?.status || USER_STATUS.SAFE);
  const [isReporting, setIsReporting] = useState(false);
  const [showEmergencyActions, setShowEmergencyActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    [USER_STATUS.SAFE]: {
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'I am Safe',
      description: 'You are in a safe location'
    },
    [USER_STATUS.HELP_NEEDED]: {
      icon: HelpCircle,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      label: 'Need Help',
      description: 'Require assistance but not critical'
    },
    [USER_STATUS.INJURED]: {
      icon: Heart,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Injured',
      description: 'Medical attention needed'
    },
    [USER_STATUS.TRAPPED]: {
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      label: 'Trapped',
      description: 'Cannot move from current location'
    },
    [USER_STATUS.MISSING]: {
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      label: 'Missing',
      description: 'Location unknown to others'
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await apiClient.updateStatus(user.email, newStatus);
      if (result.success) {
        setCurrentStatus(newStatus);
        onStatusUpdate(newStatus);
        setIsReporting(false);
        
        // Show emergency actions for critical statuses
        if ([USER_STATUS.INJURED, USER_STATUS.TRAPPED].includes(newStatus)) {
          setShowEmergencyActions(true);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const callEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  const sendLocationToEmergency = async () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const message = `Emergency! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Try to share location
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: message,
          url: `https://maps.google.com/?q=${latitude},${longitude}`
        });
      } else {
        // Fallback to SMS
        window.location.href = `sms:108?body=${encodeURIComponent(message)}`;
      }
    });
  };

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <currentConfig.icon className="w-5 h-5 mr-2" />
          Safety Status
        </h3>

        {/* Current Status Display */}
        <div className={`${currentConfig.bgColor} ${currentConfig.borderColor} border rounded-xl p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentConfig.color} rounded-full flex items-center justify-center`}>
                <currentConfig.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`font-medium ${currentConfig.textColor}`}>
                  {currentConfig.label}
                </p>
                <p className="text-sm text-gray-600">
                  {currentConfig.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsReporting(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Update
            </button>
          </div>
        </div>

        {/* Quick Emergency Button */}
        {[USER_STATUS.HELP_NEEDED, USER_STATUS.INJURED, USER_STATUS.TRAPPED].includes(currentStatus) && (
          <button
            onClick={() => setShowEmergencyActions(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Emergency Actions</span>
          </button>
        )}
      </div>

      {/* Status Selection Modal */}
      <AnimatePresence>
        {isReporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsReporting(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
                <button
                  onClick={() => setIsReporting(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  const isSelected = currentStatus === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={loading}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${config.borderColor} ${config.bgColor}`
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{config.label}</p>
                          <p className="text-sm text-gray-600">{config.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Actions Modal */}
      <AnimatePresence>
        {showEmergencyActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmergencyActions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Emergency Actions</h3>
                <p className="text-sm text-gray-600">Get help immediately</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => callEmergency('108')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Ambulance (108)</span>
                </button>

                <button
                  onClick={() => callEmergency('100')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Police (100)</span>
                </button>

                <button
                  onClick={sendLocationToEmergency}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Location SMS</span>
                </button>

                <button
                  onClick={() => setShowEmergencyActions(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusReporter;
