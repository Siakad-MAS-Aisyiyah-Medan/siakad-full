import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, Calendar } from 'lucide-react';
import { getPublicNews } from '@app/shared/services/publicNews.service';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';
import '@app/pages/public/landing-page/landing.css';

export default function PublicNewsList() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State untuk drawer mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Panggil API saat pertama kali halaman dibuka
  useEffect(() => {
    fetchNews();
    window.scrollTo(0, 0);
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Kita memanggil fungsi dari service yang mengambil data dari public API backend
      const response = await getPublicNews();
      setNews(response.data);
    } catch (error) {
      console.error('Gagal mengambil berita:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memfilter berita berdasarkan kata kunci pencarian
  const filteredNews = news.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase()) ||
    item.isi.toLowerCase().includes(search.toLowerCase())
  );

  // Jika klik menu di navbar, karena kita di halaman berita, kita kembali ke home
  const handleScrollToSection = (id) => {
    setMenuOpen(false);
    navigate(`/home`);
  };

  return (
    <div className="landing-page">
      {/* Kita gunakan Navbar yang sama dengan Landing Page */}
      <LandingNavbar 
        activeSection="berita" 
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onCloseMenu={() => setMenuOpen(false)}
        onScrollToSection={handleScrollToSection}
        scrolled={true}
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: '#f8fafc' }}>
        <div className="lp-container">
          
          {/* Header seperti referensi Mikroskil */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Cari dan Baca <span style={{ color: 'var(--color-primary)' }}>Berita</span> di bawah ini.
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Ayo luangkan waktu membaca Berita untuk mengetahui kabar lebih lanjut.
            </p>
          </div>

          {/* Kotak Pencarian */}
          <div className="lp-search" style={{ maxWidth: '600px', margin: '0 auto 4rem', backgroundColor: '#fff' }}>
            <Search size={20} color="#64748b" />
            <input
              type="text"
              placeholder="Tuliskan yang ingin kamu cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
            />
          </div>

          {/* Menampilkan status loading jika sedang memuat data */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p>Memuat berita terbaru...</p>
            </div>
          ) : (
            <>
              {/* Grid Berita */}
              <div className="lp-news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredNews.map((item) => (
                  <article key={item.id} className="lp-card lp-news-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/berita/${item.id}`)}>
                    {/* Bagian Atas Kartu (Gambar/Ilustrasi) */}
                    <div className="lp-news-card__thumb" style={{ height: '160px', background: 'linear-gradient(135deg, var(--color-primary-soft), #e2e8f0)' }}>
                      <BookOpen size={48} color="var(--color-primary)" opacity={0.5} />
                    </div>
                    
                    {/* Bagian Bawah Kartu (Konten) */}
                    <div className="lp-news-card__body" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span className="lp-tag" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
                        {item.kategori || 'Berita'}
                      </span>
                      
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {item.judul}
                      </h3>
                      
                      <div className="lp-news-card__meta" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-start', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} />
                          <span>{item.tanggal_publikasi}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} />
                          <span>08:00</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Tampilan jika tidak ada berita */}
              {!loading && filteredNews.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: '#fff', borderRadius: '16px', marginTop: '2rem' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Tidak ada berita atau pengumuman saat ini.</p>
                  <p style={{ marginTop: '0.5rem' }}>Coba ubah kata kunci pencarian Anda.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

