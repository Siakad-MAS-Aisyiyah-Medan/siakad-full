import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import DaftarSekarangButton from '@/shared/ppdb/components/DaftarSekarangButton';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function HeroPPDBSection() {
  const { content, loading } = usePpdbContent();
  const { title, description, heroHighlights } = content;

  return (
    <section className="pp-hero" id="beranda">
      <div className="pp-hero__bg" aria-hidden="true">
        <div className="pp-hero__grid" />
      </div>

      <div className="pp-container pp-hero__layout">
        <div className={`pp-hero__content pp-reveal is-visible ${loading ? 'pp-hero--loading' : ''}`}>

          <h1 className="pp-hero__title">{title}</h1>
          <p className="pp-hero__subtitle">{description}</p>
          <div className="pp-hero__actions">
            <DaftarSekarangButton className="pp-btn pp-btn--primary pp-btn--lg" />
            {content.brosur && (
              <a
                href={content.brosur}
                target="_blank"
                rel="noreferrer"
                className="pp-btn pp-btn--outline pp-btn--lg"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Unduh Brosur
              </a>
            )}
          </div>
        </div>

        <aside
          className={`pp-hero__aside pp-reveal pp-reveal--delay is-visible ${loading ? 'pp-hero--loading' : ''}`}
        >
          <h2 className="pp-hero__aside-title">Informasi Penting</h2>
          <ul className="pp-highlight-list">
            {heroHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} className="pp-highlight-item">
                  <span className="pp-highlight-item__icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </section>
  );
}

