import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'indigo',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const gradientColors = {
    indigo: 'from-indigo-500 via-violet-500 to-purple-600',
    emerald: 'from-emerald-400 via-teal-500 to-cyan-500',
    amber: 'from-amber-400 via-orange-500 to-rose-500',
    purple: 'from-purple-500 via-fuchsia-500 to-pink-500',
    ai: 'from-purple-500 via-fuchsia-500 to-pink-500',
    progress: 'from-emerald-400 via-teal-500 to-cyan-500',
    coral: 'from-orange-400 via-rose-500 to-pink-600',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          {label && <span className="text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-400">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5 ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientColors[color] || gradientColors.indigo} rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 110,
  strokeWidth = 10,
  label = 'Readiness',
  gradient = 'aurora', // 'aurora' | 'ai' | 'progress' | 'coral'
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = React.useId().replace(/:/g, '');

  const gradientStops = {
    aurora: { start: '#8b5cf6', mid: '#ec4899', end: '#06b6d4' },
    ai: { start: '#9333ea', mid: '#c026d3', end: '#f43f5e' },
    progress: { start: '#10b981', mid: '#06b6d4', end: '#3b82f6' },
    coral: { start: '#f97316', mid: '#f43f5e', end: '#a855f7' },
  };

  const stops = gradientStops[gradient] || gradientStops.aurora;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg] drop-shadow-lg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops.start} />
            <stop offset="50%" stopColor={stops.mid} />
            <stop offset="100%" stopColor={stops.end} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-white tracking-tight">{percentage}%</span>
        {label && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>}
      </div>
    </div>
  );
};
