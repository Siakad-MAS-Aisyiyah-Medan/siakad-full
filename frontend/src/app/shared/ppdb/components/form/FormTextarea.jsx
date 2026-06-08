import { labelClass, textareaClass } from './formStyles';

export default function FormTextarea({
  label,
  id,
  value,
  onChange,
  disabled,
  required,
  placeholder,
  className = '',
  rows = 4,
  error,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder || ''}
        aria-invalid={error ? 'true' : undefined}
        className={`${textareaClass}${error ? ' border-red-500 ring-[4px] ring-red-500/15' : ''}`}
      />
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
