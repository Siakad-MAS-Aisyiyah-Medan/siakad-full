import DaftarSekarangButton from '@/shared/ppdb/components/DaftarSekarangButton';
import { usePpdbContent } from '../context/PpdbContentContext';
import { downloadBrosurPpdb } from '@/shared/ppdb/utils/downloadBrosur';

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
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await downloadBrosurPpdb();
                } catch (error) {
                  console.error('Download error:', error);
                  alert('Gagal mengunduh brosur. Silakan coba lagi nanti.');
                }
              }}
              className="pp-btn pp-btn--outline pp-btn--lg"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'transparent' }}
            >
              Unduh Brosur
            </button>
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

