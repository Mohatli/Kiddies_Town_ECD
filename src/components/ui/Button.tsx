import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon, 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  
  const baseClasses = "relative overflow-hidden group flex items-center justify-center gap-2 rounded-xl font-black transition-all active:scale-[0.98] select-none outline-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-sm",
    danger: "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/25 border border-rose-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600"
  };

  const sizes = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-2.5 px-4",
    lg: "text-base py-3.5 px-6"
  };

  const isDisabled = disabled || loading;
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-70 cursor-not-allowed active:scale-100' : 'cursor-pointer'} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {(variant === 'primary' || variant === 'danger') && !isDisabled && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <span className={`w-4 h-4 border-2 rounded-full animate-spin ${variant === 'primary' || variant === 'danger' ? 'border-white/30 border-t-white' : 'border-indigo-600/30 border-t-indigo-600'}`} />
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
          </>
        )}
        <span>{children}</span>
      </span>
    </button>
  );
};

export { Button };
export default Button;
