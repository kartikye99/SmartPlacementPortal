import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  const variants = {
    neutral:
      'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-400/20 dark:border-zinc-700/60',
    primary:
      'bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-900/20 dark:border-white/20 font-bold',
    success:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    warning:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    danger:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    coral:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    info:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
    violet:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25 dark:border-zinc-600/30',
    cyan:
      'bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-400/25',
    purple:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25',
    magenta:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25',
    emerald:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    amber:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    rose:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    jobs:
      'bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-400/25',
    ai:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25',
    resume:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25',
    interview:
      'bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 border-zinc-400/25',
    progress:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    deadline:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
  };

  const dotColors = {
    neutral: 'bg-zinc-400',
    primary: 'bg-zinc-900 dark:bg-white',
    success: 'bg-emerald-500 animate-pulse',
    warning: 'bg-amber-500 animate-pulse',
    danger: 'bg-rose-500 animate-pulse',
    coral: 'bg-rose-500 animate-pulse',
    info: 'bg-blue-500 animate-pulse',
    violet: 'bg-zinc-400',
    cyan: 'bg-slate-400',
    purple: 'bg-zinc-400',
    magenta: 'bg-zinc-400',
    emerald: 'bg-emerald-500 animate-pulse',
    amber: 'bg-amber-500 animate-pulse',
    rose: 'bg-rose-500 animate-pulse',
    jobs: 'bg-slate-400',
    ai: 'bg-zinc-400',
    resume: 'bg-zinc-400',
    interview: 'bg-zinc-400',
    progress: 'bg-emerald-500 animate-pulse',
    deadline: 'bg-rose-500 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-colors ${
        variants[variant] || variants.neutral
      } ${sizes[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[variant] || dotColors.neutral
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
