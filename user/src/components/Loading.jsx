import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`inline-block ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-full h-full border-2 border-blue-200 border-t-blue-600 rounded-full"></div>
    </motion.div>
  );
};

const PulseLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <Shield className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SafeZone
        </h2>
        <PulseLoader size="medium" className="mx-auto" />
        <p className="text-gray-600 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

export const ErrorBoundary = ({ error, retry, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-red-50 border border-red-200 rounded-xl p-4 text-center ${className}`}
  >
    <div className="text-red-600 text-4xl mb-2">⚠️</div>
    <h3 className="text-red-800 font-semibold mb-2">Something went wrong</h3>
    <p className="text-red-600 text-sm mb-4">{error}</p>
    {retry && (
      <button
        onClick={retry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12 px-4"
  >
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
    {action}
  </motion.div>
);

export default LoadingSpinner;
