import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Shield,
  Zap,
  Flame,
  Waves,
  Mountain,
  Wind
} from 'lucide-react';

const getDisasterIcon = (type) => {
  const icons = {
    'Earthquake': Mountain,
    'Flood': Waves,
    'Fire': Flame,
    'Cyclone': Wind,
    'Landslide': Mountain,
    'Tsunami': Waves,
    'Other': AlertTriangle
  };
  return icons[type] || AlertTriangle;
};

const getSeverityColor = (type, radius) => {
  if (radius >= 10) return 'from-red-500 to-red-600';
  if (radius >= 5) return 'from-orange-500 to-orange-600';
  return 'from-yellow-500 to-yellow-600';
};

const DisasterCard = ({ disaster, index, onSelect, userCoords }) => {
  const Icon = getDisasterIcon(disaster.type);
  const severityColor = getSeverityColor(disaster.type, disaster.radius);
  const timeAgo = new Date(disaster.createdAt).toLocaleString();
  
  // Calculate distance from user to disaster
  const calculateDistance = (disasterCoords, userCoords) => {
    if (!userCoords || !disasterCoords) return null;
    
    const R = 6371; // Earth's radius in kilometers
    // FIXED: Disaster coordinates are [longitude, latitude] in MongoDB
    const [disasterLon, disasterLat] = disasterCoords;
    const dLat = (disasterLat - userCoords.latitude) * Math.PI / 180;
    const dLon = (disasterLon - userCoords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userCoords.latitude * Math.PI / 180) * Math.cos(disasterLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = disaster.location?.coordinates ? 
    calculateDistance(disaster.location.coordinates, userCoords) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(disaster)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${severityColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800 text-sm">{disaster.type}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                disaster.radius >= 10 ? 'bg-red-100 text-red-700' :
                disaster.radius >= 5 ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {disaster.radius >= 10 ? 'High' : disaster.radius >= 5 ? 'Medium' : 'Low'} Risk
              </span>
            </div>
            
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {disaster.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {distance !== null ? `${distance.toFixed(1)}km away` : `${disaster.radius}km radius`}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
            
            {distance !== null && distance <= disaster.radius && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-1 text-red-700 text-xs font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>You are in the danger zone!</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {disaster.resources && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Food</span>
                <span className="font-medium">{disaster.resources.food || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Medical</span>
                <span className="font-medium">{disaster.resources.medikits || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DisasterModal = ({ disaster, onClose }) => {
  if (!disaster) return null;

  const Icon = getDisasterIcon(disaster.type);
  const severityColor = getSeverityColor(disaster.type, disaster.radius);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-2xl max-w-md w-full max-h-96 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${severityColor} rounded-2xl flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{disaster.type}</h2>
                <p className="text-gray-600">{disaster.radius}km radius</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{disaster.description}</p>
            
            {disaster.resources && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Available Resources</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(disaster.resources).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium">
                Get Directions
              </button>
              <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium">
                Report Status
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DisastersList = ({ disasters, userCoords, className = '' }) => {
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  // Calculate distance from user to disaster
  const calculateDistance = (disasterCoords, userCoords) => {
    if (!userCoords || !disasterCoords) return null;
    
    const R = 6371; // Earth's radius in kilometers
    // FIXED: Disaster coordinates are [longitude, latitude] in MongoDB
    const [disasterLon, disasterLat] = disasterCoords;
    const dLat = (disasterLat - userCoords.latitude) * Math.PI / 180;
    const dLon = (disasterLon - userCoords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userCoords.latitude * Math.PI / 180) * Math.cos(disasterLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (!disasters || disasters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl p-6 text-center ${className}`}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">All Clear</h3>
        <p className="text-gray-600 text-sm">No active disasters in your area</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Active Disasters</h2>
          <span className="text-sm text-gray-500">{disasters.length} active</span>
        </div>
        
        {disasters.map((disaster, index) => (
          <DisasterCard
            key={disaster._id}
            disaster={disaster}
            index={index}
            onSelect={setSelectedDisaster}
            userCoords={userCoords}
          />
        ))}
      </div>
      
      <DisasterModal
        disaster={selectedDisaster}
        onClose={() => setSelectedDisaster(null)}
      />
    </>
  );
};

export default DisastersList;
