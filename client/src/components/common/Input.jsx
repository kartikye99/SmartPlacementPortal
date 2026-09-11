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

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl bg-slate-900/90 border ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          } text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:bg-slate-950 ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 font-medium tracking-wide">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
};
