import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

const TabNav = ({ tabs, activeTab, onTabChange, variant = 'underline', className = '' }: TabNavProps) => {
  return (
    <div className={`relative flex gap-2 ${variant === 'underline' ? 'border-b border-slate-200' : 'p-1.5 bg-slate-100/80 rounded-2xl backdrop-blur-sm inline-flex'} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-bold transition-colors flex items-center gap-2 outline-hidden ${
              isActive 
                ? (variant === 'pills' ? 'text-indigo-700' : 'text-indigo-600') 
                : 'text-slate-500 hover:text-slate-700'
            } ${variant === 'pills' ? 'rounded-xl' : ''}`}
          >
            {isActive && variant === 'pills' && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-white shadow-sm rounded-xl border border-slate-200/50 z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && (
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </span>
            
            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export { TabNav };
export default TabNav;
