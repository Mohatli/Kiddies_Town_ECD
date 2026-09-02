import React, { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const Badge = ({ variant = 'neutral', children, size = 'md', dot = false, className = '' }: BadgeProps) => {
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const dotStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-indigo-500',
    neutral: 'bg-slate-500'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />
      )}
      {children}
    </span>
  );
};

export { Badge };
export default Badge;
