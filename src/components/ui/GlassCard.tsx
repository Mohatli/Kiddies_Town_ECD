import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  className?: string;
  children: ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const GlassCard = ({ className = '', children, hover = false, padding = 'md' }: GlassCardProps) => {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-slate-200/50 ${paddingMap[padding]} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${baseClasses} transition-shadow hover:shadow-2xl hover:shadow-indigo-500/10`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export { GlassCard };
export default GlassCard;
