import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  hover3d = true,
  elevated = false,
  ...props
}) => {
  const surfaceClass = elevated ? 'glass-panel-elevated' : 'glass-panel';
  const hoverClass = hover
    ? hover3d
      ? 'card-3d-hover cursor-pointer'
      : 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`${surfaceClass} rounded-2xl p-6 ${hoverClass} ${className}`}
      style={{
        color: 'var(--theme-text)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3
      className={`text-lg font-bold tracking-tight font-display ${className}`}
      style={{ color: 'var(--theme-text)' }}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p
      className={`text-xs mt-1 leading-relaxed ${className}`}
      style={{ color: 'var(--theme-text-muted)' }}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div
      className={`mt-6 pt-4 flex items-center justify-between ${className}`}
      style={{ borderTop: '1px solid var(--theme-border)' }}
    >
      {children}
    </div>
  );
};
