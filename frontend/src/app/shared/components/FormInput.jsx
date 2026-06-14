import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FormInput({
  label,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  inputState = 'default', // 'default' | 'error' | 'success'
  options = [], // For select type: [{ value: '...', label: '...' }]
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isSelect = type === 'select';
  const isPassword = type === 'password';
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  // Determine border styles based on inputState
  let borderClasses = 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10';
  if (inputState === 'error') borderClasses = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';
  if (inputState === 'success') borderClasses = 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10';

  // Base classes for the input field
  // NOTE: !pl-12 and !pr-12 are used with !important to prevent Tailwind forms plugin 
  // from overriding the padding with [type="text"] specificity.
  const inputClasses = `relative z-0 w-full h-12 bg-custom-F8FAFC border ${borderClasses} rounded-xl focus:ring-4 focus:bg-white outline-none transition-all text-slate-800 text-[15px] placeholder-custom-94A3B8 ${Icon ? 'imp-pl-12' : 'imp-pl-4'} ${isPassword || isSelect ? 'imp-pr-12' : 'imp-pr-4'} ${isSelect ? 'appearance-none' : ''} ${className}`;

  return (
    <div>
      {label && <label className="block text-[15px] font-semibold text-slate-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
        )}
        
        {isSelect ? (
          <>
            <select
              className={inputClasses}
              value={value}
              onChange={onChange}
              required={required}
              {...props}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </>
        ) : (
          <input
            type={inputType}
            className={inputClasses}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            minLength={minLength}
            {...props}
          />
        )}

        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10 flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
