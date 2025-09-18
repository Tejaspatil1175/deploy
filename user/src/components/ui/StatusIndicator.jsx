import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const StatusIndicator = ({ status, className = "" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'tracking...':
        return {
          color: 'bg-green-500',
          pulseColor: 'bg-green-400',
          text: 'Tracking',
          icon: '🟢'
        };
      case 'stopped':
        return {
          color: 'bg-yellow-500',
          pulseColor: 'bg-yellow-400',
          text: 'Stopped',
          icon: '🟡'
        };
      case 'idle':
        return {
          color: 'bg-gray-400',
          pulseColor: 'bg-gray-300',
          text: 'Idle',
          icon: '⚪'
        };
      default:
        if (status.includes('denied') || status.includes('failed')) {
          return {
            color: 'bg-red-500',
            pulseColor: 'bg-red-400',
            text: 'Error',
            icon: '🔴'
          };
        }
        return {
          color: 'bg-blue-500',
          pulseColor: 'bg-blue-400',
          text: status,
          icon: '🔵'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative">
        <motion.div
          className={cn("w-3 h-3 rounded-full", config.color)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={cn("absolute inset-0 w-3 h-3 rounded-full", config.pulseColor)}
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.7, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </div>
      <motion.span
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium text-gray-700 capitalize"
      >
        {config.text}
      </motion.span>
    </motion.div>
  );
};

export default StatusIndicator;
