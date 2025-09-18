import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { Mail, Phone, MapPin, Shield, Activity } from "lucide-react";

const UserProfile = ({ user }) => {
  if (!user) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="w-16 h-16 ring-4 ring-blue-100">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800">
                {user.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Disaster Management User
              </CardDescription>
              <div className="mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-sm text-gray-800">{user.email}</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-sm text-gray-800">{user.phone || "Not provided"}</p>
            </div>
          </motion.div>

          {user.location && (
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-sm text-gray-800">
                  {user.location.coordinates 
                    ? `${user.location.coordinates[1].toFixed(4)}, ${user.location.coordinates[0].toFixed(4)}`
                    : "Not available"
                  }
                </p>
              </div>
            </motion.div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Account Status</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
