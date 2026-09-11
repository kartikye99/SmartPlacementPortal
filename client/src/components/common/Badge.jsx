import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', dot = false, className = '' }) => {
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  };
  const aliases = {
    violet: 'neutral', cyan: 'neutral', purple: 'neutral', magenta: 'neutral',
    jobs: 'info', ai: 'neutral', resume: 'neutral', interview: 'neutral',
    progress: 'success', deadline: 'danger', coral: 'danger', emerald: 'success',
    amber: 'warning', rose: 'danger', indigo: 'info', primary: 'primary',
  };
  const resolved = aliases[variant] || variant;
  const styles = {
    neutral: { background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)', borderColor: 'var(--theme-badge-border)' },
    primary: { background: 'var(--theme-accent-soft)', color: 'var(--theme-accent)', borderColor: 'var(--theme-accent-border)' },
    success: { background: 'var(--success-soft)', color: 'var(--success)', borderColor: 'color-mix(in srgb, var(--success) 28%, transparent)' },
    warning: { background: 'var(--warning-soft)', color: 'var(--warning)', borderColor: 'color-mix(in srgb, var(--warning) 28%, transparent)' },
    danger: { background: 'var(--danger-soft)', color: 'var(--danger)', borderColor: 'color-mix(in srgb, var(--danger) 28%, transparent)' },
    info: { background: 'var(--info-soft)', color: 'var(--info)', borderColor: 'color-mix(in srgb, var(--info) 28%, transparent)' },
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-medium ${sizes[size] || sizes.md} ${className}`} style={styles[resolved] || styles.neutral}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
