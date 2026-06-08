import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getPublicNewsDetail } from '@app/shared/services/publicNews.service';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';
import '@app/pages/public/landing-page/landing.css';

export default function PublicNewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchDetail();
    // Scroll ke atas halaman saat detail dibuka
    window.scrollTo(0, 0);
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      // Mengambil detail berita dari public API backend
      const response = await getPublicNewsDetail(id);
      setNews(response.data);
    } catch (err) {
      console.error('Gagal mengambil detail berita:', err);
      setError('Berita tidak ditemukan atau terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToSection = (sectionId) => {
    setMenuOpen(false);
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <LandingNavbar 
        activeSection="berita" 
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onCloseMenu={() => setMenuOpen(false)}
        onScrollToSection={handleScrollToSection}
        scrolled={true}
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: '#f8fafc', paddingBottom: '4rem' }}>
        <div className="lp-container" style={{ maxWidth: '800px' }}>
          
          {/* Tombol Kembali */}
          <button 
            onClick={() => navigate('/berita')}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1rem', 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginBottom: '2rem',
              fontWeight: '600',
              color: '#334155',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          {/* Menampilkan pesan loading atau error */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: '#fff', borderRadius: '16px' }}>
              <p>Memuat isi berita...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444', background: '#fff', borderRadius: '16px' }}>
              <p>{error}</p>
            </div>
          )}

          {/* Konten Berita Utama */}
          {news && !loading && !error && (
            <article style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              
              <span className="lp-tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                {news.kategori || 'Berita'}
              </span>
              
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', lineHeight: '1.3' }}>
                {news.judul}
              </h1>
              
              {/* Meta Informasi (Tanggal) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#64748b', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  <span>{news.tanggal_publikasi}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} />
                  <span>08:00</span>
                </div>
              </div>

              {/* Isi Teks Pengumuman */}
              <div 
                style={{ 
                  color: '#334155', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.8', 
                  whiteSpace: 'pre-wrap' 
                }}
              >
                {news.isi}
              </div>

            </article>
          )}

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

