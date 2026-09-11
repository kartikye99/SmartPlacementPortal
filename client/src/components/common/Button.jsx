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
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  const variants = {
    primary:
      'btn-vibrant-primary focus:ring-zinc-400',
    cyan:
      'btn-vibrant-primary focus:ring-zinc-400',
    ai:
      'btn-vibrant-primary focus:ring-zinc-400',
    jobs:
      'btn-vibrant-primary focus:ring-zinc-400',
    resume:
      'btn-vibrant-primary focus:ring-zinc-400',
    interview:
      'btn-vibrant-primary focus:ring-zinc-400',
    progress:
      'btn-vibrant-primary focus:ring-zinc-400',
    secondary:
      'btn-secondary focus:ring-zinc-400',
    outline:
      'border border-[var(--theme-border)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)] focus:ring-zinc-400 shadow-sm',
    ghost:
      'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)] focus:ring-zinc-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500',
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
