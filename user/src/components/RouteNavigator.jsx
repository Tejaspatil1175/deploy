import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation,
  MapPin,
  Route,
  Clock,
  AlertTriangle,
  Car,
  Users,
  Phone,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { apiClient } from '../utils/api';

const RouteNavigator = ({ userLocation, disasters, className = '' }) => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [safeZones, setSafeZones] = useState([]);
  const [showNavigator, setShowNavigator] = useState(false);

  // Mock safe zones (in real app, these would come from API)
  useEffect(() => {
    setSafeZones([
      {
        id: 1,
        name: 'Community Center - Bandra',
        type: 'Evacuation Center',
        coordinates: [72.8400, 19.0600],
        capacity: 500,
        facilities: ['Medical Aid', 'Food', 'Shelter', 'Communication'],
        distance: '2.3 km',
        status: 'Available'
      },
      {
        id: 2,
        name: 'Municipal Hospital',
        type: 'Medical Facility',
        coordinates: [72.8300, 19.0700],
        capacity: 200,
        facilities: ['Emergency Medical', 'Surgery', 'Ambulance'],
        distance: '1.8 km',
        status: 'Available'
      },
      {
        id: 3,
        name: 'Police Station - Mahim',
        type: 'Emergency Services',
        coordinates: [72.8450, 19.0450],
        capacity: 100,
        facilities: ['Security', 'Communication', 'Coordination'],
        distance: '3.1 km',
        status: 'Available'
      }
    ]);
  }, []);

  const findSafeRoutes = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      // Calculate routes to each safe zone
      const routePromises = safeZones.map(async (zone) => {
        // In real app, use actual routing API
        const mockRoute = {
          id: zone.id,
          destination: zone,
          distance: zone.distance,
          estimatedTime: Math.floor(Math.random() * 20 + 10) + ' mins',
          difficulty: Math.random() > 0.5 ? 'Easy' : 'Moderate',
          hazards: disasters.filter(d => {
            // Simple distance check (in real app, use proper geo calculations)
            return Math.random() > 0.7; // Random hazards for demo
          }),
          waypoints: [
            { lat: userLocation.latitude, lng: userLocation.longitude, description: 'Your Location' },
            { lat: zone.coordinates[1], lng: zone.coordinates[0], description: zone.name }
          ],
          instructions: [
            'Head northeast on Main Street',
            'Turn right onto Highway Road',
            'Continue for 1.5 km',
            'Turn left at Community Center'
          ],
          safetyScore: Math.floor(Math.random() * 30 + 70) // 70-100%
        };
        return mockRoute;
      });

      const calculatedRoutes = await Promise.all(routePromises);
      setRoutes(calculatedRoutes.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)));
    } catch (error) {
      console.error('Error calculating routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (route) => {
    const dest = route.destination;
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${dest.coordinates[1]},${dest.coordinates[0]}`;
    window.open(url, '_blank');
  };

  const startNavigation = (route) => {
    setSelectedRoute(route);
    // In real app, integrate with maps API for turn-by-turn navigation
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Evacuation Center': return Shield;
      case 'Medical Facility': return Users;
      case 'Emergency Services': return Phone;
      default: return MapPin;
    }
  };

  return (
    <div className={className}>
      {/* Navigation Button */}
      <button
        onClick={() => {
          setShowNavigator(true);
          findSafeRoutes();
        }}
        disabled={!userLocation}
        className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors ${
          userLocation
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Navigation className="w-4 h-4" />
        <span>Find Safe Routes</span>
      </button>

      {/* Navigator Modal */}
      <AnimatePresence>
        {showNavigator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4"
            onClick={() => setShowNavigator(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Safe Routes</h3>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Routes List */}
              <div className="overflow-y-auto max-h-96 p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Finding safe routes...</span>
                  </div>
                ) : routes.length === 0 ? (
                  <div className="text-center py-8">
                    <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No routes available</p>
                    <p className="text-sm text-gray-400">Enable location to find safe routes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {routes.map((route) => {
                      const TypeIcon = getTypeIcon(route.destination.type);
                      
                      return (
                        <motion.div
                          key={route.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <TypeIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{route.destination.name}</h4>
                              <p className="text-sm text-gray-600">{route.destination.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-800">{route.distance}</p>
                              <p className="text-sm text-gray-500">{route.estimatedTime}</p>
                            </div>
                          </div>

                          {/* Route Info */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                                {route.difficulty}
                              </span>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>{route.safetyScore}% safe</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              route.destination.status === 'Available' 
                                ? 'text-green-700 bg-green-100' 
                                : 'text-red-700 bg-red-100'
                            }`}>
                              {route.destination.status}
                            </span>
                          </div>

                          {/* Hazards */}
                          {route.hazards.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium text-orange-700">Hazards on Route</span>
                              </div>
                              <div className="space-y-1">
                                {route.hazards.map((hazard, index) => (
                                  <p key={index} className="text-xs text-orange-600 pl-6">
                                    {hazard.type} - {hazard.radius}km radius
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Facilities */}
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Available Facilities:</p>
                            <div className="flex flex-wrap gap-1">
                              {route.destination.facilities.map((facility, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200"
                                >
                                  {facility}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startNavigation(route)}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                            >
                              <Navigation className="w-4 h-4" />
                              <span>Start Navigation</span>
                            </button>
                            <button
                              onClick={() => openInMaps(route)}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open in Maps</span>
                            </button>
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

      {/* Active Navigation Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRoute(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Navigation className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Navigation Started</h3>
                <p className="text-sm text-gray-600">To {selectedRoute.destination.name}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="font-medium">{selectedRoute.distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Est. Time</span>
                    <span className="font-medium">{selectedRoute.estimatedTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Turn-by-turn Directions:</h4>
                  {selectedRoute.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    openInMaps(selectedRoute);
                    setSelectedRoute(null);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium"
                >
                  Open in Maps
                </button>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
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

export default RouteNavigator;
