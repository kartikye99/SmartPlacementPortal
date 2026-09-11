import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070a12] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  const variants = {
    primary:
      'btn-vibrant-primary focus:ring-violet-500',
    cyan:
      'btn-vibrant-cyan focus:ring-cyan-500',
    ai:
      'btn-ai-prep focus:ring-fuchsia-500',
    jobs:
      'btn-jobs focus:ring-indigo-500',
    resume:
      'btn-resume focus:ring-orange-500',
    interview:
      'btn-interview focus:ring-pink-500',
    progress:
      'btn-progress focus:ring-emerald-500',
    secondary:
      'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 hover:border-white/25 shadow-sm backdrop-blur-md active:scale-[0.98] focus:ring-white/40',
    outline:
      'border border-white/20 text-slate-100 hover:bg-white/10 hover:border-white/35 shadow-sm active:scale-[0.98] focus:ring-white/30',
    ghost:
      'text-slate-200 hover:bg-white/10 hover:text-white active:scale-[0.98] focus:ring-white/20',
    danger:
      'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 active:scale-[0.98] focus:ring-rose-500',
    success:
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98] focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
