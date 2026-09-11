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
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const sizes = {
    sm: 'text-[12px] px-3 py-1.5 gap-1.5 min-h-8',
    md: 'text-[13px] px-4 py-2 gap-2 min-h-9',
    lg: 'text-[14px] px-5 py-2.5 gap-2 min-h-10',
  };
  const variants = {
    primary: 'btn-vibrant-primary',
    cyan: 'btn-vibrant-primary',
    ai: 'btn-vibrant-primary',
    jobs: 'btn-vibrant-primary',
    resume: 'btn-vibrant-primary',
    interview: 'btn-vibrant-primary',
    progress: 'btn-vibrant-primary',
    secondary: 'btn-secondary',
    outline: 'border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]',
    ghost: 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)]',
    danger: 'bg-[var(--danger)] hover:brightness-95 text-white border border-transparent',
    success: 'bg-[var(--success)] hover:brightness-95 text-white border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
