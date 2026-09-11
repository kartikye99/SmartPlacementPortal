import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto rounded-md border" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
    <table className={`w-full text-left text-[13px] ${className}`} style={{ color: 'var(--theme-text)' }}>{children}</table>
  </div>
);

export const TableHeader = ({ children, className = '' }) => (
  <thead className={`text-[11px] uppercase font-semibold tracking-wider border-b ${className}`} style={{ background: 'var(--theme-background-secondary)', color: 'var(--theme-text-muted)', borderColor: 'var(--theme-border)' }}>{children}</thead>
);

export const TableRow = ({ children, className = '', hover = true, onClick }) => (
  <tr onClick={onClick} className={`border-b last:border-b-0 ${hover ? 'hover:bg-[var(--theme-surface-hover)]' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`} style={{ borderColor: 'var(--theme-border-subtle)' }}>{children}</tr>
);

export const TableHead = ({ children, className = '' }) => <th scope="col" className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
export const TableBody = ({ children, className = '' }) => <tbody className={className}>{children}</tbody>;
export const TableCell = ({ children, className = '' }) => <td className={`px-4 py-3 align-middle whitespace-nowrap ${className}`}>{children}</td>;

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center px-4">
    {icon && <div className="p-2.5 rounded-md mb-3" style={{ background: 'var(--theme-background-secondary)', color: 'var(--theme-text-muted)' }}>{icon}</div>}
    <h4 className="text-[14px] font-semibold">{title}</h4>
    {description && <p className="text-[12px] max-w-sm mt-1 mb-4" style={{ color: 'var(--theme-text-muted)' }}>{description}</p>}
    {action && <div>{action}</div>}
  </div>
);
