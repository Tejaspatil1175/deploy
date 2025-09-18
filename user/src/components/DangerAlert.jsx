import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

const DangerAlert = ({ disasters, userCoords, onClose, onStop }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDisaster, setCurrentDisaster] = useState(null);

  useEffect(() => {
    if (disasters && disasters.length > 0 && userCoords) {
      setIsVisible(true);
      setCurrentDisaster(disasters[0]); // Show the first disaster
    } else {
      setIsVisible(false);
    }
  }, [disasters, userCoords]);

  const handleEmergencyCall = () => {
    window.open('tel:911', '_self');
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !currentDisaster) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
              
              <CardTitle className="text-2xl font-bold text-white">
                ⚠️ DANGER ALERT!
              </CardTitle>
              <CardDescription className="text-red-100">
                You are in a disaster zone. Immediate action required!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Disaster Info */}
              <div className="bg-white/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{currentDisaster.type}</h3>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {currentDisaster.severity || 'High'} Risk
                  </Badge>
                </div>
                <p className="text-sm text-red-100">{currentDisaster.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-red-100">
                  <MapPin className="w-4 h-4" />
                  <span>Within {currentDisaster.radius}km radius</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleEmergencyCall}
                  className="w-full bg-white text-red-600 hover:bg-red-50 font-bold text-lg py-3"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Emergency (911)
                </Button>
                
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Acknowledge Alert
                </Button>
                
                {onStop && (
                  <Button
                    onClick={onStop}
                    variant="outline"
                    className="w-full border-red-300 text-red-200 hover:bg-red-500/20"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Stop Alerts
                  </Button>
                )}
              </div>

              {/* Safety Instructions */}
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2">Safety Instructions:</h4>
                <ul className="text-xs text-red-100 space-y-1">
                  <li>• Evacuate immediately to a safe location</li>
                  <li>• Follow emergency evacuation routes</li>
                  <li>• Stay away from affected areas</li>
                  <li>• Listen to emergency broadcasts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DangerAlert;
