import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const helpId = inputId ? `${inputId}-help` : undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-semibold" style={{ color: 'var(--theme-text)' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--theme-text-muted)' }}>{leftIcon}</div>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={(error || helperText) ? helpId : undefined}
          className={`w-full rounded-md border text-[13px] px-3.5 py-2.5 focus:outline-none focus:ring-2 disabled:opacity-60 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          style={{
            background: 'var(--theme-input-bg)',
            borderColor: error ? 'var(--danger)' : 'var(--theme-input-border)',
            color: 'var(--theme-text)',
            '--tw-ring-color': error ? 'color-mix(in srgb, var(--danger) 18%, transparent)' : 'color-mix(in srgb, var(--theme-accent) 18%, transparent)',
          }}
          {...props}
        />
        {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightIcon}</div>}
      </div>
      {error ? (
        <p id={helpId} className="text-[11px] font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
      ) : helperText ? (
        <p id={helpId} className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{helperText}</p>
      ) : null}
    </div>
  );
};
