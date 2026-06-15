import { ChevronDown } from 'lucide-react';
import { labelClass, selectClass } from './formStyles';

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  options = [],
  disabled,
  required,
  placeholder = 'Pilih...',
  className = '',
  error,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(id, e.target.value)}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`${selectClass}${error ? ' border-red-500 ring-[4px] ring-red-500/15' : ''}`}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
