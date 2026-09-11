import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  elevated = false,
  area: _area,
  hover3d: _hover3d,
  ...props
}) => {
  const surfaceClass = elevated ? 'glass-panel-elevated' : 'glass-panel';
  return (
    <div
      className={`${surfaceClass} rounded-lg p-5 ${hover ? 'card-3d-hover cursor-pointer' : ''} ${className}`}
      style={{ color: 'var(--theme-text)' }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 flex items-start justify-between gap-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-[16px] font-semibold tracking-tight ${className}`} style={{ color: 'var(--theme-text)' }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-[12px] mt-1 leading-relaxed ${className}`} style={{ color: 'var(--theme-text-muted)' }}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => <div className={className}>{children}</div>;

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-5 pt-4 flex items-center justify-between ${className}`} style={{ borderTop: '1px solid var(--theme-border)' }}>
    {children}
  </div>
);
