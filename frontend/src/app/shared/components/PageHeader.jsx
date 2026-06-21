import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, actions, backTo, onBack, children }) {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  const titlePortal = document.getElementById('global-header-title');
  const actionsPortal = document.getElementById('global-header-actions');

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <>
      {titlePortal && createPortal(
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {(backTo || onBack !== undefined || backTo === '') && (
            <button 
              onClick={handleBack}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-dark)', transition: 'all 0.2s', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-background)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '0.25rem' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>,
        titlePortal
      )}
      
      {actionsPortal && createPortal(
        <>{actions || children}</>,
        actionsPortal
      )}
    </>
  );
}
