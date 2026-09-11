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
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-sm shadow-emerald-500/15',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-sm shadow-amber-500/15',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-sm shadow-rose-500/15',
    coral: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-sm shadow-rose-500/15',
    info: 'bg-violet-500/15 text-violet-300 border-violet-500/35 shadow-sm shadow-violet-500/15',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/35 shadow-sm shadow-violet-500/15',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35 shadow-sm shadow-cyan-500/15',
    purple: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/35 shadow-sm shadow-fuchsia-500/15',
    magenta: 'bg-pink-500/15 text-pink-300 border-pink-500/35 shadow-sm shadow-pink-500/15',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-sm shadow-emerald-500/15',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-sm shadow-amber-500/15',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-sm shadow-rose-500/15',
    // Product Area Mappings
    jobs: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35 shadow-sm shadow-indigo-500/15',
    ai: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/35 shadow-sm shadow-fuchsia-500/15',
    resume: 'bg-orange-500/15 text-orange-300 border-orange-500/35 shadow-sm shadow-orange-500/15',
    interview: 'bg-pink-500/15 text-pink-300 border-pink-500/35 shadow-sm shadow-pink-500/15',
    progress: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 shadow-sm shadow-emerald-500/15',
    deadline: 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-sm shadow-rose-500/15',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    success: 'bg-emerald-400 animate-pulse',
    warning: 'bg-amber-400 animate-pulse',
    danger: 'bg-rose-400 animate-pulse',
    coral: 'bg-rose-400 animate-pulse',
    info: 'bg-violet-400 animate-pulse',
    violet: 'bg-violet-400 animate-pulse',
    cyan: 'bg-cyan-400 animate-pulse',
    purple: 'bg-fuchsia-400 animate-pulse',
    magenta: 'bg-pink-400 animate-pulse',
    emerald: 'bg-emerald-400 animate-pulse',
    amber: 'bg-amber-400 animate-pulse',
    rose: 'bg-rose-400 animate-pulse',
    jobs: 'bg-indigo-400 animate-pulse',
    ai: 'bg-fuchsia-400 animate-pulse',
    resume: 'bg-orange-400 animate-pulse',
    interview: 'bg-pink-400 animate-pulse',
    progress: 'bg-emerald-400 animate-pulse',
    deadline: 'bg-rose-400 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${
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
