import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { getPublicNews } from '@/shared/services/publicNews.service';
import LandingNavbar from '@/roles/public/landing-page/components/LandingNavbar';
import { resolveStorageUrl } from '@/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';
import '@/roles/public/landing-page/landing.css';

export default function PublicNewsList() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    window.scrollTo(0, 0);
  }, []);

  const filteredNews = news.filter((item) =>
    item.judul?.toLowerCase().includes(search.toLowerCase()) ||
    item.isi?.toLowerCase().includes(search.toLowerCase())
  );

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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 60px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>Pengumuman</h1>
          <p style={{ marginTop: '1rem', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Informasi terbaru dari MAS Aisyiyah Medan</p>
        </div>

        <div style={{ position: 'relative', margin: '40px auto 0', maxWidth: '800px', borderRadius: '16px', border: '1px solid var(--color-border)', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', width: '24px', height: '24px' }} />
          <input
            type="text"
            placeholder="Cari pengumuman berdasarkan judul..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: '100%', borderRadius: '16px', background: 'transparent', padding: '20px 24px 20px 64px', fontSize: '1.1rem', color: 'var(--color-text-dark)', outline: 'none', border: 'none' }}
          />
        </div>

        <div style={{ marginTop: '60px', display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat pengumuman terbaru...</div>
          ) : filteredNews.length > 0 ? (
            filteredNews.slice(0, 8).map((item) => (
              <article key={item.id} style={{ borderRadius: '18px', border: '1px solid var(--color-border)', background: '#fff', padding: '20px', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', height: '180px', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', background: 'var(--color-surface)', borderRadius: '10px', overflow: 'hidden' }}>
                  {item.thumbnail ? (
                     <img src={resolveStorageUrl(item.thumbnail, apiConfig)} alt={item.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                     <span style={{ fontSize: '3rem' }}>📢</span>
                  )}
                </div>
                <h2 style={{ marginTop: '24px', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-dark)', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.judul}</h2>
                <div style={{ marginTop: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  <CalendarDays size={16} />
                  {formatDate(item.tanggal_publikasi)}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/pengumuman/${item.id}`)}
                    style={{ marginTop: '20px', display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '12px 20px', fontSize: '1rem', color: 'var(--color-text-dark)', background: '#fff', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-soft)'; e.currentTarget.style.color = 'var(--color-primary-dark)'; e.currentTarget.style.borderColor = 'var(--color-primary-light)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-text-dark)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  >
                    Baca Selengkapnya
                    <ArrowRight size={20} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', borderRadius: '18px', border: '1px solid var(--color-border)', background: '#fff', padding: '64px 32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Tidak ada pengumuman saat ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
