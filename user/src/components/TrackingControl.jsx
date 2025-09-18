import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import StatusIndicator from "./ui/StatusIndicator";
import { Play, Square, MapPin, Activity } from "lucide-react";

const TrackingControl = ({ status, onStartTracking, onStopTracking }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-green-600" />
            Location Tracking
          </CardTitle>
          <CardDescription>
            Monitor your location for emergency response
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Display */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Current Status</h4>
                <p className="text-sm text-gray-600">Location tracking status</p>
              </div>
            </div>
            <StatusIndicator status={status} />
          </motion.div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onStartTracking}
                disabled={status === 'tracking...'}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Tracking
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onStopTracking}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Privacy Note:</strong> Your location is only shared during active tracking and is used solely for emergency response purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrackingControl;
