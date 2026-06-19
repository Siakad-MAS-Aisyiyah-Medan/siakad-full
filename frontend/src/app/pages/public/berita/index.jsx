import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getPublicNews } from '@app/shared/services/publicNews.service';
import LandingNavbar from '@app/pages/public/landing-page/components/LandingNavbar';
import LandingFooter from '@app/pages/public/landing-page/components/LandingFooter';

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
    item.judul.toLowerCase().includes(search.toLowerCase()) ||
    item.isi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar activeSection="berita" onScrollToSection={() => navigate('/home')} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-slate-900">Pengumuman</h1>
          <p className="mt-4 text-2xl text-slate-500">Informasi terbaru dari MAS Aisyiyah Medan</p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-300 bg-white">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengumuman berdasarkan judul..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl bg-transparent py-5 pl-16 pr-6 text-2xl text-slate-900 outline-none"
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button type="button" className="rounded-xl border border-slate-300 p-4 text-slate-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-xl border border-slate-300 bg-slate-300 px-5 py-4 text-xl text-slate-700">1</button>
          <button type="button" className="rounded-xl border border-slate-300 px-5 py-4 text-xl text-slate-700">2</button>
          <button type="button" className="rounded-xl border border-slate-300 px-5 py-4 text-xl text-slate-700">3</button>
          <button type="button" className="rounded-xl border border-slate-300 px-5 py-4 text-xl text-slate-700">4</button>
          <button type="button" className="rounded-xl border border-slate-300 px-5 py-4 text-xl text-slate-700">5</button>
          <span className="text-2xl text-slate-700">...</span>
          <button type="button" className="rounded-xl border border-slate-300 p-4 text-slate-700">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500">Memuat pengumuman terbaru...</div>
          ) : filteredNews.length > 0 ? (
            filteredNews.slice(0, 8).map((item) => (
              <article key={item.id} className="rounded-[18px] border border-slate-300 bg-white p-5">
                <div className="flex h-[220px] items-center justify-center border border-slate-300 bg-slate-50" />
                <h2 className="mt-6 text-3xl font-semibold text-slate-900">{item.judul}</h2>
                <div className="mt-4 space-y-3">
                  <div className="h-2 rounded-full bg-slate-300" />
                  <div className="h-2 w-5/6 rounded-full bg-slate-300" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-300" />
                </div>
                <div className="mt-5 flex items-center gap-3 text-lg text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  {item.tanggal_publikasi || '08 Mei 2024'}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/pengumuman/${item.id}`)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-5 py-4 text-2xl text-slate-700"
                >
                  Baca Selengkapnya
                  <ArrowRight className="h-5 w-5" />
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-[18px] border border-slate-300 bg-white px-8 py-16 text-center text-slate-500">
              Tidak ada pengumuman saat ini.
            </div>
          )}
        </div>
      </main>

      <LandingFooter onScrollToSection={() => navigate('/home')} />
    </div>
  );
}
