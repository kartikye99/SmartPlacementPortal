import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, description, children, footer, maxWidth = 'max-w-lg', size }) => {
  const titleId = useId();
  const descriptionId = useId();
  const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };
  const resolvedWidth = sizeMap[size] || maxWidth;

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="fixed inset-0 bg-slate-950/60" onClick={onClose} aria-label="Close dialog" />
      <div
        className={`relative z-10 w-full ${resolvedWidth} max-h-[90vh] overflow-y-auto glass-dropdown rounded-lg p-5`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
          <div>
            {title && <h3 id={titleId} className="text-[17px] font-semibold tracking-tight">{title}</h3>}
            {description && <p id={descriptionId} className="text-[12px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--theme-surface-hover)]" style={{ color: 'var(--theme-text-muted)' }} aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-4 text-[13px]">{children}</div>
        {footer && <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--theme-border)' }}>{footer}</div>}
      </div>
    </div>
  );
};
