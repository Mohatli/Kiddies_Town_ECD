import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  className?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  colorScheme = 'indigo',
  className = ''
}: StatCardProps) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20 text-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20 text-emerald-600',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20 text-amber-600',
    rose: 'from-rose-500 to-rose-600 shadow-rose-500/20 text-rose-600',
    violet: 'from-violet-500 to-violet-600 shadow-violet-500/20 text-violet-600',
    slate: 'from-slate-500 to-slate-600 shadow-slate-500/20 text-slate-600',
  };

  const bgGradient = colors[colorScheme].split(' text-')[0];

  return (
    <GlassCard hover padding="md" className={className}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${bgGradient} text-white shadow-lg`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            trend === 'up' ? 'text-emerald-700 bg-emerald-100/80' : 
            trend === 'down' ? 'text-rose-700 bg-rose-100/80' : 
            'text-slate-700 bg-slate-100/80'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-500 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-slate-800 tracking-tight"
          >
            {value}
          </motion.span>
          {subtitle && (
            <span className="text-xs font-semibold text-slate-400">{subtitle}</span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export { StatCard };
export default StatCard;
