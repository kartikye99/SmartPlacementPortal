import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
};

const borderColors = {
  success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100',
  error: 'border-rose-500/30 bg-rose-950/40 text-rose-100',
  warning: 'border-amber-500/30 bg-amber-950/40 text-amber-100',
  info: 'border-indigo-500/30 bg-indigo-950/40 text-indigo-100',
};

export const ToastItem = ({ id, type = 'info', message, onDismiss }) => {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl shadow-black/40 min-w-[320px] max-w-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
        borderColors[type] || borderColors.info
      }`}
      role="alert"
    >
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, dismissToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
