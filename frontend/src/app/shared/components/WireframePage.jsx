import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './wireframe-page.css';

export default function WireframePage({ title, subtitle, backTo, children, className = '' }) {
  const navigate = useNavigate();
  const goBack = () => backTo ? navigate(backTo) : navigate(-1);

  return (
    <main className={`wf-page ${className}`.trim()}>
      <header className="wf-page__header">
        <button type="button" onClick={goBack} className="wf-page__back" aria-label="Kembali">
          <ArrowLeft size={28} />
        </button>
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      <div className="wf-page__content">{children}</div>
    </main>
  );
}
