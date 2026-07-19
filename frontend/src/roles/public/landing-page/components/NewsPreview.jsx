import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react';
import { getPublicNews } from '@/shared/services/publicNews.service';
import { resolveStorageUrl } from '@/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';

const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export default function NewsPreview() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getPublicNews();
        setNews(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <section id="berita" className="lp-section lp-section--soft">
      <div className="lp-container">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Informasi Terbaru</h2>
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
                  {item.thumbnail ? (
                    <img 
                      src={resolveStorageUrl(item.thumbnail, apiConfig)} 
                      alt={item.judul} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <Newspaper size={40} />
                  )}
                </div>
                <div className="lp-news-card__body">
                  <div className="lp-news-card__meta">
                    <span className="lp-tag">Pengumuman</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CalendarDays size={13} />
                      {formatDate(item.tanggal_publikasi)}
                    </span>
                  </div>
                  <h3>{item.judul}</h3>
                  <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{stripHtml(item.isi)}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/pengumuman/${item.id}`, {
                      state: {
                        source: 'home',
                        returnScrollY: window.scrollY,
                      },
                    })}
                    className="lp-link-btn"
                  >
                    Baca Selengkapnya <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="lp-empty-state" style={{ 
              gridColumn: '1 / -1', 
              padding: '5rem 2rem', 
              background: 'white', 
              borderRadius: 'var(--lp-radius-lg)', 
              boxShadow: 'var(--lp-shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              border: '1.5px dashed rgba(15, 92, 58, 0.2)'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--lp-primary-light)',
                color: 'var(--lp-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(15, 92, 58, 0.1)'
              }}>
                <Newspaper size={32} />
              </div>
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--lp-primary-dark)', marginBottom: '0.5rem' }}>Belum Ada Informasi</h3>
                <p style={{ color: 'var(--lp-text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>Saat ini belum ada pengumuman atau informasi terbaru yang dipublikasikan oleh sekolah.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
