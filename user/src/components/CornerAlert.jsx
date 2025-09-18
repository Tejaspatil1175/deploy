import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Phone, MapPin, VolumeX } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const CornerAlert = ({ disasters, userCoords, onClose, onStop, onMute }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDisaster, setCurrentDisaster] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (disasters && disasters.length > 0 && userCoords) {
      setIsVisible(true);
      setCurrentDisaster(disasters[0]); // Show the first disaster
    } else {
      setIsVisible(false);
    }
  }, [disasters, userCoords]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleStop = () => {
    setIsVisible(false);
    if (onStop) onStop();
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (onMute) onMute(!isMuted);
  };

  const handleEmergencyCall = () => {
    window.open('tel:911', '_self');
  };

  if (!isVisible || !currentDisaster) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, y: -300 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 300, y: -300 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50 w-80 max-w-sm"
      >
        <div className="bg-red-600 text-white rounded-lg shadow-2xl border border-red-500 overflow-hidden">
          {/* Header */}
          <div className="bg-red-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-200 animate-pulse" />
              <span className="font-bold text-sm">DANGER ALERT</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={handleMute}
                size="sm"
                variant="ghost"
                className="text-red-200 hover:text-white hover:bg-red-600 p-1 h-6 w-6"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="text-red-200 hover:text-white hover:bg-red-600 p-1 h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Disaster Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg capitalize">{currentDisaster.type}</h3>
                <Badge variant="destructive" className="text-xs">
                  High Risk
                </Badge>
              </div>
              
              <p className="text-sm text-red-100">{currentDisaster.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-red-100">
                <MapPin className="w-4 h-4" />
                <span>Within {currentDisaster.radius}km radius</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleEmergencyCall}
                className="w-full bg-white text-red-600 hover:bg-red-50 font-bold text-sm py-2"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency (911)
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 text-xs"
                >
                  Acknowledge
                </Button>
                
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-200 hover:bg-red-500/20 text-xs"
                >
                  Stop Alerts
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="text-xs text-red-200 text-center">
              {isMuted ? "🔇 Audio Muted" : "🔊 Audio Active"}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CornerAlert;
