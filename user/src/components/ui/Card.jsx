import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Animated Card for mobile interactions - using motion.div wrapper instead
const AnimatedCard = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm backdrop-blur-sm",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
));
AnimatedCard.displayName = "AnimatedCard";

// Modern Glass Card
const GlassCard = React.forwardRef(({ className, hover = true, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "glass border-white/20 shadow-xl",
      hover && "card-hover touch-feedback",
      className
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

// Status Card with colored border
const StatusCard = React.forwardRef(({ status = "default", className, ...props }, ref) => {
  const statusClasses = {
    default: "border-gray-200",
    success: "border-l-4 border-l-green-500 bg-green-50/50",
    warning: "border-l-4 border-l-yellow-500 bg-yellow-50/50", 
    danger: "border-l-4 border-l-red-500 bg-red-50/50",
    info: "border-l-4 border-l-blue-500 bg-blue-50/50"
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-200",
        statusClasses[status],
        className
      )}
      {...props}
    />
  );
});
StatusCard.displayName = "StatusCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  AnimatedCard,
  GlassCard,
  StatusCard,
};