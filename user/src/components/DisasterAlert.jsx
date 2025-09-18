import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Heart, MapPin, Clock, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const DisasterAlert = ({ disasters, coords }) => {
  const [activeDisaster, setActiveDisaster] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/audio/alert1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    
    // Preload audio
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Debug and check for nearby disasters
  useEffect(() => {
    console.log('DisasterAlert useEffect triggered:', { disasters, coords });
    
    if (disasters && disasters.length > 0 && coords) {
      const result = findNearestDisaster(disasters, coords);
      console.log('Nearest disaster result:', result);
      
      if (result && result.disaster && shouldShowAlert(result.disaster)) {
        console.log('Showing alert for disaster:', result.disaster.type);
        setActiveDisaster(result.disaster);
        setDistance(result.distance);
        setIsVisible(true);
        setUserStatus(null);
        startAlertSound();
      } else {
        console.log('No alert needed or disaster not close enough');
        handleAlertEnd();
      }
    } else {
      console.log('Missing disasters or coords');
      handleAlertEnd();
    }
  }, [disasters, coords]);

  const findNearestDisaster = (disasters, userCoords) => {
    if (!userCoords || !disasters.length) return null;
    
    let nearest = null;
    let minDistance = Infinity;
    
    disasters.forEach(disaster => {
      if (disaster.location?.coordinates && Array.isArray(disaster.location.coordinates)) {
        const [lng, lat] = disaster.location.coordinates;
        
        const dist = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          lat,
          lng
        );
        
        console.log('Distance calculated:', dist, 'km for', disaster.type);
        
        // Increased alert radius for testing
        const alertRadius = disaster.severity === 'High' ? 50 : 
                           disaster.severity === 'Medium' ? 30 : 20;
        
        if (dist <= alertRadius && dist < minDistance) {
          nearest = { disaster, distance: dist };
          minDistance = dist;
        }
      }
    });
    
    return nearest;
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const shouldShowAlert = (disaster) => {
    return true; // Show for all disasters for now
  };

  const startAlertSound = () => {
    console.log('Starting alert sound...');
    stopAlertSound();

    if (audioRef.current) {
      // Reset audio to beginning
      audioRef.current.currentTime = 0;
      
      // Play audio
      audioRef.current.play().catch(error => {
        console.error('Audio play failed:', error);
      });

      // Stop audio after 10 seconds
      setTimeout(() => {
        if (audioRef.current && !userStatus) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 10000);
    }
  };

  const stopAlertSound = () => {
    console.log('Stopping alert sound...');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAlertEnd = () => {
    console.log('Ending alert...');
    setIsVisible(false);
    setActiveDisaster(null);
    setUserStatus(null);
    stopAlertSound();
  };

  const handleStatusUpdate = async (status) => {
    console.log('Status updated:', status);
    setUserStatus(status);
    stopAlertSound(); // Stop audio immediately when user responds

    // Send status to backend (if available)
    try {
      const response = await fetch('/api/user/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disasterId: activeDisaster._id,
          status: status,
          location: coords,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        console.log('Status updated successfully');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }

    // Show status confirmation for 3 seconds, then dismiss
    setTimeout(() => {
      handleAlertEnd();
    }, 3000);
  };

  const testAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        console.log('Test audio playing...');
        // Stop after 3 seconds for test
        setTimeout(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }, 3000);
      }).catch(error => {
        console.error('Test audio failed:', error);
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-100';
      case 'Medium': return 'text-orange-100';
      case 'Low': return 'text-yellow-100';
      default: return 'text-gray-100';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'High': return 'from-red-600 to-red-800';
      case 'Medium': return 'from-orange-600 to-orange-800';
      case 'Low': return 'from-yellow-600 to-yellow-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getStatusMessage = () => {
    if (userStatus === 'safe') {
      return {
        title: '✅ Status Updated',
        message: 'Thank you for confirming you are safe. Stay alert and follow emergency guidelines.',
        color: 'text-green-100'
      };
    } else if (userStatus === 'need-help') {
      return {
        title: '🚨 Help Request Sent',
        message: 'Emergency services have been notified. Stay calm and follow safety instructions.',
        color: 'text-yellow-100'
      };
    }
    return null;
  };

  // Debug component - COMMENTED OUT FOR PRODUCTION
  /*
  const DebugInfo = () => (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs z-40">
      <div>Coords: {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'None'}</div>
      <div>Disasters: {disasters ? disasters.length : 0}</div>
      <div>Active: {activeDisaster ? activeDisaster.type : 'None'}</div>
      <div>Visible: {isVisible ? 'Yes' : 'No'}</div>
      <div>Distance: {distance.toFixed(2)} km</div>
      <div>Audio: {audioRef?.current ? 'Loaded' : 'Not loaded'}</div>
      <div>Status: {userStatus || 'None'}</div>
      {disasters && disasters.length > 0 && (
        <div>
          <div className="mt-2 text-yellow-200">Available Disasters:</div>
          {disasters.map((disaster, index) => (
            <div key={index} className="text-xs text-gray-300">
              • {disaster.type} ({disaster.severity})
            </div>
          ))}
        </div>
      )}
    </div>
  );
  */

  return (
    <>
      {/* <DebugInfo /> */}
      
      <AnimatePresence>
        {isVisible && activeDisaster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 bg-gradient-to-br ${getSeverityBg(activeDisaster.severity)} flex items-center justify-center p-4`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)'
                }}
              />
            </div>

            <div className="relative w-full max-w-lg">
              {userStatus ? (
                // Status confirmation screen
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8">
                    <h1 className={`text-3xl font-bold mb-4 ${getStatusMessage().color}`}>
                      {getStatusMessage().title}
                    </h1>
                    <p className="text-white/90 text-lg leading-relaxed">
                      {getStatusMessage().message}
                    </p>
                  </div>
                </motion.div>
              ) : (
                // Disaster alert screen
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="text-center"
                >
                  {/* Emergency Icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-6 flex justify-center"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                      <AlertTriangle className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>
                  </motion.div>

                  {/* Alert Title */}
                  <motion.h1
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`text-4xl font-bold mb-2 ${getSeverityColor(activeDisaster.severity)}`}
                  >
                    🚨 EMERGENCY ALERT
                  </motion.h1>

                  {/* Disaster Info Card */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-6 mb-8 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="destructive" className="text-sm font-bold px-3 py-1">
                        {activeDisaster.severity} SEVERITY
                      </Badge>
                      <span className="text-white/80 text-sm font-medium">
                        {distance.toFixed(1)} km away
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">
                      {activeDisaster.type}
                    </h2>
                    
                    {activeDisaster.description && (
                      <p className="text-white/90 text-lg leading-relaxed mb-4">
                        {activeDisaster.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-white/80">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {activeDisaster.location?.address || 'Location updating...'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(activeDisaster.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Instructions */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 mb-8 text-left">
                    <h3 className="text-white font-bold mb-2">⚠️ SAFETY INSTRUCTIONS:</h3>
                    <ul className="text-white/90 text-sm space-y-1">
                      <li>• Stay calm and follow emergency protocols</li>
                      <li>• Move to a safe location immediately</li>
                      <li>• Keep emergency contacts ready</li>
                      <li>• Monitor official emergency channels</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <p className="text-white/90 text-lg font-medium mb-6">
                      Please confirm your safety status:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        onClick={() => handleStatusUpdate('safe')}
                        className="h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white border-2 border-green-400 shadow-lg"
                        size="xl"
                      >
                        <Shield className="mr-3 h-6 w-6" />
                        I AM SAFE
                      </Button>
                      
                      <Button
                        onClick={() => handleStatusUpdate('need-help')}
                        className="h-16 text-xl font-bold bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg emergency-glow"
                        size="xl"
                      >
                        <Heart className="mr-3 h-6 w-6" />
                        I NEED HELP
                      </Button>
                    </div>
                  </div>

                  {/* Manual Test Button for debugging - COMMENTED OUT FOR PRODUCTION */}
                  {/*
                  <div className="mt-4">
                    <Button
                      onClick={testAudioPlay}
                      className="h-12 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                      size="default"
                    >
                      🔊 Test Sound
                    </Button>
                  </div>
                  */}

                  {/* Emergency Contact Info */}
                  <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm">
                      🆘 <strong>Emergency:</strong> Call 112 | 📞 <strong>Police:</strong> 100 | 🚑 <strong>Medical:</strong> 108
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DisasterAlert;