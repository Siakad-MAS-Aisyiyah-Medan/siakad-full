import { inputClass, labelClass } from './formStyles';

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  disabled,
  required,
  placeholder,
  className = '',
  error,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder || ''}
        aria-invalid={error ? 'true' : undefined}
        className={`${inputClass}${error ? ' border-red-500 ring-[4px] ring-red-500/15' : ''}`}
      />
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
