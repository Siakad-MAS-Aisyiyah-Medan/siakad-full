import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { getPublicNewsDetail } from '@app/shared/services/publicNews.service';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import { resolveStorageUrl } from '@app/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';
import '@app/pages/public/landing-page/landing.css';

export default function PublicNewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getPublicNewsDetail(id);
        setNews(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

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
    <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--color-surface)' }}>
      <LandingNavbar activeSection="berita" onScrollToSection={() => navigate('/home')} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 40px' }}>
        <button
          type="button"
          onClick={() => navigate('/pengumuman')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            padding: '12px 24px', borderRadius: '12px',
            border: '1px solid var(--color-border)', background: '#fff',
            color: 'var(--color-text-dark)', cursor: 'pointer',
            fontSize: '1.1rem', fontWeight: 500, marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={20} />
          Kembali ke Pengumuman
        </button>

        <section style={{
          background: '#fff', borderRadius: '18px', border: '1px solid var(--color-border)',
          padding: '40px 48px', minHeight: '60vh',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
              Memuat isi pengumuman...
            </div>
          ) : (
            <>
              {news?.thumbnail && (
                <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '400px', display: 'flex', justifyContent: 'center', background: 'var(--color-surface)' }}>
                  <img src={resolveStorageUrl(news.thumbnail, apiConfig)} alt={news.judul} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: '0 0 1rem' }}>
                  {news?.judul || 'Judul Pengumuman'}
                </h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                  <CalendarDays size={20} />
                  {formatDate(news?.tanggal_publikasi)}
                </div>
              </div>
              <div style={{
                marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--color-border)'
              }}>
                {news?.isi ? (
                  <div className="quill-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-dark)' }} dangerouslySetInnerHTML={{ __html: news.isi }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Isi pengumuman tidak tersedia.
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
