import React from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className={`w-full text-left text-sm text-slate-300 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-slate-800/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800 tracking-wider ${className}`}>
      {children}
    </thead>
  );
};

export const TableRow = ({ children, className = '', hover = true, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-slate-800/50 transition-colors ${
        hover ? 'hover:bg-slate-800/40' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return <th scope="col" className={`px-5 py-3.5 font-semibold ${className}`}>{children}</th>;
};

export const TableBody = ({ children, className = '' }) => {
  return <tbody className={`divide-y divide-slate-800/40 ${className}`}>{children}</tbody>;
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-5 py-4 align-middle whitespace-nowrap text-sm ${className}`}>{children}</td>;
};

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
      {icon && <div className="p-3 bg-slate-800/80 rounded-2xl text-slate-400 mb-3">{icon}</div>}
      <h4 className="text-base font-semibold text-white">{title}</h4>
      {description && <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
