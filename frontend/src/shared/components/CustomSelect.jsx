import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, style, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0] || { label: 'Pilih...', value: '' };

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative', width: '100%', minWidth: '120px', zIndex: isOpen ? 50 : 1, ...style }}>
      <style>
        {`
          @keyframes dropdownSmooth {
            from { opacity: 0; transform: translateY(-10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem', background: disabled ? '#f8fafc' : '#fff', border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
          borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500, color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-dark)', cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen ? '0 0 0 3px var(--color-primary-soft)' : '0 2px 5px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease', outline: 'none'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedOption.label}</span>
        <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '100%',
          background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, padding: '0.4rem',
          animation: 'dropdownSmooth 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transformOrigin: 'top center',
          maxHeight: '250px', overflowY: 'auto'
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0.8rem', background: String(value) === String(option.value) ? 'var(--color-primary-soft)' : 'transparent',
                border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: String(value) === String(option.value) ? 600 : 500,
                color: String(value) === String(option.value) ? 'var(--color-primary-dark)' : 'var(--color-text-dark)',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s ease'
              }}
              onMouseOver={(e) => { if (String(value) !== String(option.value)) e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseOut={(e) => { if (String(value) !== String(option.value)) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{option.label}</span>
              {String(value) === String(option.value) && <Check size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
