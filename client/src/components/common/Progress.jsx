import React from 'react';

export const ProgressBar = ({ value = 0, max = 100, label, showValue = true, color = 'primary', size = 'md', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const sizeClasses = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colors = {
    primary: 'var(--theme-progress-fill)', indigo: 'var(--theme-progress-fill)', ai: 'var(--theme-progress-fill)',
    purple: 'var(--theme-progress-fill)', progress: 'var(--success)', emerald: 'var(--success)',
    amber: 'var(--warning)', coral: 'var(--danger)',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-[11px] font-medium">
          {label && <span style={{ color: 'var(--theme-text)' }}>{label}</span>}
          {showValue && <span style={{ color: 'var(--theme-text-muted)' }}>{percentage}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`} style={{ background: 'var(--theme-progress-bg)' }}>
        <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: colors[color] || colors.primary }} />
      </div>
    </div>
  );
};

export const CircularProgress = ({ value = 0, max = 100, size = 110, strokeWidth = 8, label = 'Readiness' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--theme-progress-bg)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--theme-progress-fill)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-semibold tracking-tight">{percentage}%</span>
        {label && <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>}
      </div>
    </div>
  );
};
