import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react';
import { getPublicNews } from '@app/shared/services/publicNews.service';

export default function NewsPreview() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getPublicNews();
        setNews((response.data || []).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="berita" className="lp-section lp-section--soft">
      <div className="lp-container">
        <div className="lp-section-header">
          <span className="lp-eyebrow">Pengumuman</span>
          <h2 className="lp-section-title">Berita & Informasi</h2>
          <p className="lp-section-subtitle">Informasi terbaru dari MAS Aisyiyah Medan</p>
        </div>

        <div className="lp-news-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <div className="animate-pulse">Memuat pengumuman terbaru...</div>
            </div>
          ) : news.length ? (
            news.map((item) => (
              <article key={item.id} className="lp-card lp-news-card">
                <div className="lp-news-card__thumb">
                  <Newspaper size={40} />
                </div>
                <div className="lp-news-card__body">
                  <div className="lp-news-card__meta">
                    <span className="lp-tag">Pengumuman</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CalendarDays size={13} />
                      {item.tanggal_publikasi || '-'}
                    </span>
                  </div>
                  <h3>{item.judul}</h3>
                  <p>{item.ringkasan || item.konten?.slice(0, 100) || 'Klik untuk membaca selengkapnya.'}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/pengumuman/${item.id}`)}
                    className="lp-link-btn"
                  >
                    Baca Selengkapnya <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="lp-empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>Belum ada pengumuman terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
