import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  elevated = false,
  accent = false,
  area = 'default', // 'jobs' | 'ai' | 'resume' | 'interview' | 'progress' | 'deadline' | 'admin' | 'default'
  ...props
}) => {
  const surfaceClass = accent 
    ? 'glass-panel-accent' 
    : elevated 
      ? 'glass-panel-elevated' 
      : 'glass-panel';

  const areaClassMap = {
    jobs: 'card-area-jobs',
    ai: 'card-area-ai',
    resume: 'card-area-resume',
    interview: 'card-area-interview',
    progress: 'card-area-progress',
    deadline: 'card-area-deadline',
    admin: 'card-area-admin',
    default: '',
  };

  const areaClass = areaClassMap[area] || '';
  const hoverClass = hover ? 'card-interactive cursor-pointer' : '';

  return (
    <div
      className={`${surfaceClass} ${areaClass} rounded-2xl p-6 ${hoverClass} ${className}`}
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
  return <h3 className={`text-lg font-bold text-white tracking-tight ${className}`}>{children}</h3>;
};

export const CardDescription = ({ children, className = '' }) => {
  return <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between ${className}`}>{children}</div>;
};
