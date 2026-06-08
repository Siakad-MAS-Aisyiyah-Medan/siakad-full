import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, BookOpen } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { getPublicNews } from '@app/shared/services/publicNews.service';

export default function NewsPreview() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getPublicNews();
      // Hanya ambil 3 terbaru untuk preview di landing page
      setNews(response.data.slice(0, 3));
    } catch (error) {
      console.error('Gagal mengambil berita:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="berita" className="lp-section lp-section--soft">
      <div className="lp-container">
        <SectionHeader
          eyebrow="Berita & Pengumuman"
          title="Kabar Terbaru dari Sekolah"
          subtitle="Informasi kegiatan dan pengumuman resmi madrasah."
        />

        <div className="lp-news-grid">
          {loading ? (
             <p className="lp-empty-state">Memuat berita terbaru...</p>
          ) : (
            news.map((item) => {
              return (
                <article key={item.id} className="lp-card lp-news-card lp-reveal">
                  <div className="lp-news-card__thumb">
                    <BookOpen size={48} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div className="lp-news-card__body">
                    <div className="lp-news-card__meta">
                      <span className="lp-tag">{item.kategori || 'Berita'}</span>
                      <time dateTime={item.tanggal_publikasi}>{item.tanggal_publikasi}</time>
                    </div>
                    <h3>{item.judul}</h3>
                    <p style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>{item.isi}</p>
                    <button
                      type="button"
                      className="lp-link-btn"
                      onClick={() => navigate(`/berita/${item.id}`)}
                    >
                      Baca Selengkapnya
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {!loading && news.length === 0 && (
          <p className="lp-empty-state">Belum ada berita atau pengumuman saat ini.</p>
        )}

        {/* Tombol Lihat Semua */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="lp-btn lp-btn--outline" 
            onClick={() => navigate('/berita')}
            style={{ fontWeight: 'bold' }}
          >
            Lihat Semua Berita <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

